import React from 'react';
import { genderOptions } from '../../constants/storyConstants';

interface Props {
  selectedGender: string;
  setGender: (gender: string) => void;
  isDisabled: boolean;
}

export const GenderSelector: React.FC<Props> = ({ selectedGender, setGender, isDisabled }) => (
  <div className="form-group">
    <label>Child's Gender</label>
    <div className="button-grid gender-grid">
      {genderOptions.map(gender => {
        const display = {
          Male: { label: 'Boy', emoji: '👦' },
          Female: { label: 'Girl', emoji: '👧' },
        }[gender] || { label: gender, emoji: '😊' };
        return (
          <button
            key={gender}
            type="button"
            onClick={() => setGender(gender)}
            className={`choice-button ${selectedGender === gender ? 'active' : ''}`}
            disabled={isDisabled}
          >
            <span className="emoji">{display.emoji}</span>
            {display.label}
          </button>
        );
      })}
    </div>
  </div>
);
