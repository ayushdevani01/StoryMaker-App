import React from 'react';
import { storyLengthOptions } from '../../constants/storyConstants';

interface Props {
  selectedLength: string;
  customLength: number;
  setLength: (length: string) => void;
  setCustomLength: (length: number) => void;
  isDisabled: boolean;
}

export const LengthSelector: React.FC<Props> = ({
  selectedLength,
  customLength,
  setLength,
  setCustomLength,
  isDisabled,
}) => (
  <div className="form-group">
    <label>Story Length</label>
    <div className="button-grid length-grid">
      {storyLengthOptions.map(length => (
        <button
          key={length}
          type="button"
          onClick={() => setLength(length)}
          className={`choice-button ${selectedLength === length ? 'active' : ''}`}
          disabled={isDisabled}
        >
          {length}
        </button>
      ))}
    </div>
    <div className="story-length-description">
      <p>
        <strong>Story Length Guide:</strong> Short (4 pages), Medium (8), Long (12), Custom (2-20 paragraphs).
      </p>
    </div>
    {selectedLength === 'Custom' && (
      <div className="custom-length-container">
        <label htmlFor="customStoryLength" className="slider-label">
          Number of Paragraphs: <span className="slider-value">{customLength}</span>
        </label>
        <input
          type="range"
          id="customStoryLength"
          name="customStoryLength"
          value={customLength}
          onChange={e => setCustomLength(parseInt(e.target.value, 10))}
          required
          min="2"
          max="20"
          className="range-slider"
          disabled={isDisabled}
        />
      </div>
    )}
  </div>
);
