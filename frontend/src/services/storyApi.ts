import apiClient from './apiClient';
import { FormData, StoryResult } from '../types';
import axios from 'axios';
export const generateStoryAPI = async (
  formData: FormData,
  signal?: AbortSignal
): Promise<StoryResult> => {
  try {
    const response = await apiClient.post<StoryResult>(
      '/story',
      formData,
      {
        signal,
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isCancel(error) || error.name === 'AbortError') {
      throw error;
    }

    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to generate story');
  }
};
