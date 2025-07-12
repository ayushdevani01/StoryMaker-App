import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => (
  <div className="loading-overlay">
    <div className="loader big"></div>
    <p>{message}</p>
  </div>
);
