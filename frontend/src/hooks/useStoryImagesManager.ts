// src/hooks/useStoryImagesManager.ts
import { useState, useEffect, useRef } from 'react';
import { startImageGenerationAPI } from '../services/imageApi';
import { ImageState } from '../types';

const MAX_RETRIES = 2;
const IMAGE_REQUEST_DELAY_MS = 0; // Set to 0 to remove delay between image requests

export const useStoryImagesManager = (paragraphs: string[], description: string) => {
  const [imageStates, setImageStates] = useState<ImageState[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const initialStates = paragraphs.map((p) => ({
      paragraph: p,
      imageUrl: null,
      isLoading: false,
      error: null,
    }));

    setImageStates(initialStates);
    setOverallProgress(0);
    setIsGeneratingImages(false);
    isProcessingRef.current = false;

    const processImages = async () => {
      if (isProcessingRef.current || paragraphs.length === 0) return;

      isProcessingRef.current = true;
      setIsGeneratingImages(true);

      const controller = abortControllerRef.current;
      if (!controller) {
        setIsGeneratingImages(false);
        isProcessingRef.current = false;
        return;
      }

      for (let i = 0; i < paragraphs.length; i++) {
        if (controller.signal.aborted) {
          console.log('Image generation aborted during processing loop.');
          isProcessingRef.current = false;
          setIsGeneratingImages(false);
          return;
        }

        const success = await processImageWithRetry(i, paragraphs[i], description, controller);
        if (!success) {
          console.error(`Failed to generate image for paragraph ${i} after retries.`);
        }

        setOverallProgress(Math.round(((i + 1) / paragraphs.length) * 100));

        if (IMAGE_REQUEST_DELAY_MS > 0 && i < paragraphs.length - 1) {
          await delay(IMAGE_REQUEST_DELAY_MS);
        }
      }

      isProcessingRef.current = false;
      setIsGeneratingImages(false);
      console.log('All image generations attempted.');
    };

    if (paragraphs.length > 0) {
      processImages();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [paragraphs, description]); // Re-run effect if description changes

  const processImageWithRetry = async (
    index: number,
    paragraph: string,
    description: string,
    controller: AbortController
  ): Promise<boolean> => {
    setImageStates((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isLoading: true, error: null } : s))
    );

const prompt = `Create a highly detailed, magical, vibrant children's storybook illustration.
about "${paragraph}"
Details: ${description}
Art Style:
Classic fairytale illustration with warm, soft colors and painterly textures. Dreamy lighting and a comforting, magical feeling.
Composition:
If the child is included, focus on the child interacting with the scene. If the child is not included, show only the environment and objects. No other figures.
Important:
Never show any other humans or animals. ***Never change the child's gender given to you***. Never change the child's face or clothes. Never add text, captions, or labels.
`;


    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      if (controller.signal.aborted) return false;

      try {
        console.log(`Generating image for paragraph ${index} (Attempt ${attempt})...`);
        const { imageUrl } = await startImageGenerationAPI(prompt);

        if (!imageUrl) {
          throw new Error('No image URL received from API.');
        }

        // Assuming http://localhost:5000 is your backend URL
        const fullImageUrl = `http://localhost:5000${imageUrl}`;

        setImageStates((prev) =>
          prev.map((s, idx) =>
            idx === index ? { ...s, isLoading: false, imageUrl: fullImageUrl, error: null } : s
          )
        );
        return true;

      } catch (error: any) {
        if (controller.signal.aborted) return false;

        console.error(`Attempt ${attempt} failed for paragraph ${index}:`, error);
        if (attempt === MAX_RETRIES + 1) {
          setImageStates((prev) =>
            prev.map((s, idx) =>
              idx === index
                ? {
                    ...s,
                    isLoading: false,
                    error: `Image failed after ${MAX_RETRIES + 1} attempts.`,
                  }
                : s
            )
          );
        }

        // Delay before retrying
        await delay(2000);
      }
    }
    return false; // All retries failed
  };

  const retryFailedImage = async (index: number) => {
    const controller = abortControllerRef.current;
    if (isProcessingRef.current || !controller || controller.signal.aborted) return;

    const paragraph = paragraphs[index];
    if (!paragraph) return;

    await processImageWithRetry(index, paragraph, description, controller);
  };

  // Function to regenerate a specific image
  const regenerateImage = async (index: number) => {
    const controller = abortControllerRef.current;
    if (!controller || controller.signal.aborted) return;

    const paragraph = paragraphs[index];
    if (!paragraph) return;

    console.log(`Regenerating image for paragraph ${index}`);
    
    // Clear the current image and show loading
    setImageStates((prev) =>
      prev.map((s, idx) =>
        idx === index ? { ...s, imageUrl: null, isLoading: true, error: null } : s
      )
    );

    await processImageWithRetry(index, paragraph, description, controller);
  };

  // Function to regenerate all images
  const regenerateAllImages = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    if (isProcessingRef.current || paragraphs.length === 0) return;

    isProcessingRef.current = true;
    setIsGeneratingImages(true);

    console.log('Regenerating all images');

    // Clear all images and show loading
    setImageStates((prev) =>
      prev.map((s) => ({ ...s, imageUrl: null, isLoading: true, error: null }))
    );

    const controller = abortControllerRef.current;
    if (!controller) {
      setIsGeneratingImages(false);
      isProcessingRef.current = false;
      return;
    }

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      if (controller.signal.aborted) {
        console.log('Image regeneration aborted');
        setIsGeneratingImages(false);
        isProcessingRef.current = false;
        break;
      }

      const success = await processImageWithRetry(i, paragraph, description, controller);
      if (controller.signal.aborted) break;

      // Update progress
      setOverallProgress(((i + 1) / paragraphs.length) * 100);

      if (success && i < paragraphs.length - 1) {
        await delay(IMAGE_REQUEST_DELAY_MS);
      }
    }

    setIsGeneratingImages(false);
    isProcessingRef.current = false;
    setOverallProgress(100);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return {
    imageStates,
    overallProgress,
    isGeneratingImages,
    retryFailedImage,
    regenerateImage,
    regenerateAllImages,
  };
};