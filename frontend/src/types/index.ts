
export interface FormData {
  childName: string;
  childAge: string;
  storyTheme: string; 
  customStoryTheme: string;
  desiredMoral: string;
  storyLength: string;
  customStoryLength: number;
  language: string;
  imageUrl: string | null; // Now holds a Data URL (Base64 string) if an image file is uploaded
  gender: string; 
}

//responce type of calling story generation api
export interface StoryResult {
  story: string[]; 
  imageDescription: string;
}

//responce type of image genearation api
export interface StartImageResponse {
  imageUrl: string;
}

/**
 * Represents the state of an image associated with a paragraph.
 */
export type ImageState = {
  paragraph: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
};