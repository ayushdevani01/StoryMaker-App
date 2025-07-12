// src/utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";

const genAI = new GoogleGenerativeAI(config.API_KEY);

interface StoryParams {
    childName: string;
    childAge: number;
    storyTheme: string;
    customStoryTheme?: string;
    desiredMoral?: string;
    storyLength: string;
    customStoryLength?: string;
    language: string; 
    imageUrl?: string;
    gender: string;
}

export async function generateStory(params: StoryParams) {
    const {
        childName,
        childAge,
        storyTheme,
        customStoryTheme,
        desiredMoral,
        storyLength,
        customStoryLength,
        language,
        imageUrl,
        gender
    } = params;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let theme = storyTheme === 'Custom Story Idea...' ? customStoryTheme : storyTheme;
    let length;
    if (storyLength === 'Bedtime Story') {
        length = '4 paragraphs';
    } else if (storyLength === 'Medium Story') {
        length = '8 paragraphs';
    } else if (storyLength === 'Long Story') {
        length = '12 paragraphs';
    } else {
        length = customStoryLength;
    }

const prompt = `Write a ${length} children's story for a ${childAge}-year-old ${gender} named ${childName}.
The story is about "${theme}".
${desiredMoral ? `The story should teach this moral: "${desiredMoral}".` : ''}
The story must be in ${language}.

Rules:
- Always call the main character "${childName}" in every paragraph.
- You can freely create the character's gender, appearance, clothes, and style for this story.
- Use only very simple, easy words a ${childAge}-year-old can understand.
- Do not use any hard or long words.
- Make all sentences short, clear, and complete.
- Do not cut sentences in the middle. Each sentence must end properly.
- Each paragraph must be between 190 and 230 characters long, including spaces.
- If a paragraph is too long, remove words or sentences to fit.
- If a paragraph is too short, add more short sentences to reach the limit.
- Make the story as interesting as possible while using simple words.

Output format:
First line: [STORY TITLE]
Next lines:
[Paragraph 1]
[Paragraph 2]
...
[Last Paragraph]

After the last paragraph, on a new line, write ONE SINGLE short sentence describing how the main character looks.

This sentence must:
- Clearly describe the child's gender, hair color, hair length and style, eye color, skin tone, face shape, and clothes.
- Clearly say no other humans or characters should appear in any image.
- If an image URL is provided to you, say to use that image as the reference for appearance instead of generating your own description.
- This sentence must not be part of the story.`;

    const parts: any[] = [{ text: prompt }];

    if (imageUrl) {
        const [meta, base64Data] = imageUrl.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1];

        if (mimeType && base64Data) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                },
            });
        }
    }

    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    const text = result.response.text();

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const storyTitle = lines[0].replace('[STORY TITLE]', '').trim();
    const storyParagraphs = lines.slice(1, -1);
    const imageDescription = lines[lines.length - 1].trim();

    const fullStory = [storyTitle, ...storyParagraphs];

    return { story: fullStory, imageDescription };
}