import React from 'react';
import './StoryCard.css'; 

interface StoryCardProps {
  paragraph: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const StoryCard: React.FC<StoryCardProps> = ({ paragraph, imageUrl, isLoading, error }) => {
  return (
    <div className="story-card">
      <div className="story-card-image-container">
        {isLoading && <div className="story-card-loader"></div>}
        {error && <div className="story-card-error">😕<br/>Image failed</div>}
        {imageUrl && !isLoading && <img src={imageUrl} alt="Story illustration" className="story-card-image" />}
        {!isLoading && !error && !imageUrl && <div className="story-card-placeholder">No Image</div>}
      </div>
      <div className="story-card-text-container">
        <p className="story-card-paragraph">{paragraph}</p>
      </div>
    </div>
  );
};
