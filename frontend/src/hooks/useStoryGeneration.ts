import { useState, useRef, useCallback } from 'react';
import { generateStoryAPI } from '../services/storyApi';
import { FormData, StoryResult } from '../types';

export const useStoryGeneration = () => {
  const [storyPages, setStoryPages] = useState<string[] | null>(null);
  const [description, setDescription] = useState<string | null>(null); // image prompt
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestInProgressRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateStory = useCallback(async (formData: FormData) => {
    if (requestInProgressRef.current || isGenerating) {
      console.log('Story generation already in progress, ignoring request');
      return;
    }

    // Cancel previous request if still active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    requestInProgressRef.current = true;
    setIsGenerating(true);
    setError(null);
    setStoryPages(null);
    setDescription(null); // clear description before new request

    try {
      console.log('Starting story generation...');

      const result: StoryResult = await generateStoryAPI(formData, abortController.signal);

      // If aborted mid-request
      if (abortController.signal.aborted) {
        console.log('Story generation was aborted');
        return;
      }

      if (result && Array.isArray(result.story) && result.story.length > 1) {
        setStoryPages(result.story);
        setDescription(result.imageDescription || null);
        console.log('Story generation completed successfully');
      } else {
        throw new Error('The generated story was empty or invalid. Please try again.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || abortController.signal.aborted) {
        console.log('Story generation was cancelled');
        return;
      }

      console.error('useStoryGeneration Error:', err);

      if (err.message?.includes('wait') || err.message?.includes('generating')) {
        setError('Please wait before generating another story. Only one story can be generated at a time.');
      } else {
        setError(err.message || 'An unknown error occurred during story generation.');
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsGenerating(false);
        requestInProgressRef.current = false;
      }
    }
  }, [isGenerating]);

  const resetStory = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setStoryPages(null);
    setDescription(null);
    setError(null);
    setIsGenerating(false);
    requestInProgressRef.current = false;
    console.log('Story generation reset');
  }, []);

  return {
    storyPages,
    description,
    isGenerating,
    error,
    generateStory,
    resetStory
  };
};
