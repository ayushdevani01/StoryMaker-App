import React from 'react';
import { storyThemeOptions } from '../../constants/storyConstants';

const themeIcons: { [key: string]: string } = {
  'A Magical Garden': '🌿',
  'Space Adventure': '🚀',
  'Underwater Mystery': '🌊',
  'The Brave Little Knight': '🏰',
  'A Talking Animal Trio': '🐾',
  'The Mystery of the Missing Toy': '🧸',
  'First Day at a Magical School': '🧙',
  'A Friendly Dinosaur': '🦖',
  'Custom Story Idea...': '✍️',
};

interface Props {
  selectedTheme: string;
  setTheme: (theme: string) => void;
  isDisabled: boolean;
}

export const ThemeSelector: React.FC<Props> = ({ selectedTheme, setTheme, isDisabled }) => (
  <div className="form-group">
    <label>Story Theme</label>
    <div className="button-grid theme-grid">
      {storyThemeOptions.map(theme => (
        <button
          key={theme}
          type="button"
          onClick={() => setTheme(theme)}
          className={`choice-button ${selectedTheme === theme ? 'active' : ''}`}
          disabled={isDisabled}
        >
          <span className="emoji">{themeIcons[theme] || '✨'}</span>
          {theme}
        </button>
      ))}
    </div>
  </div>
);
