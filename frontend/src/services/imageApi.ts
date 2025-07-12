// src/services/imageApi.ts
import apiClient from './apiClient';
import { StartImageResponse } from '../types';

/**
 * Sends a request to the backend to generate an image for a prompt.
 * The backend now directly returns the image URL.
 * @param prompt The text prompt for the image.
 * @returns A promise that resolves to an object containing the imageUrl.
 */
export const startImageGenerationAPI = async (prompt: string): Promise<StartImageResponse> => {
  const response = await apiClient.post<StartImageResponse>('/image', { prompt});
  return response.data;
};