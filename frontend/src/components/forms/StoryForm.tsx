import React, { useRef } from 'react';
import { FormData } from '../../types';
import { storyLanguageOptions} from '../../constants/storyConstants';

import { GenderSelector } from './GenderSelector.tsx';
import { ThemeSelector } from './ThemeSelector.tsx';
import { LengthSelector } from './LengthSelector.tsx';
import { ImageUploader } from './ImageUploader.tsx';
import { FormStyles } from './FormStyles.tsx';

interface StoryFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  isGenerating,
}) => {
  const submitTimeoutRef = useRef<number | null>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';
    setFormData(prev => ({
      ...prev,
      [name]: isNumberInput ? parseInt(value, 10) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 2000) return;

    lastSubmitTimeRef.current = now;

    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);

    submitTimeoutRef.current = window.setTimeout(() => {
      handleSubmit(e);
      submitTimeoutRef.current = null;
    }, 100);
  };

  return (
    <>
      <form className="story-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="childName">Child's Name</label>
          <input
            type="text"
            id="childName"
            name="childName"
            value={formData.childName}
            onChange={handleInputChange}
            placeholder="e.g., Leo"
            required
            disabled={isGenerating}
          />
        </div>

        <GenderSelector
          selectedGender={formData.gender}
          setGender={gender => setFormData(prev => ({ ...prev, gender }))}
          isDisabled={isGenerating}
        />

        <div className="form-group">
          <label htmlFor="childAge">Child's Age</label>
          <input
            type="number"
            id="childAge"
            name="childAge"
            value={formData.childAge}
            onChange={handleInputChange}
            placeholder="e.g., 5"
            required
            min="1"
            max="12"
            disabled={isGenerating}
          />
        </div>

        <ThemeSelector
          selectedTheme={formData.storyTheme}
          setTheme={theme => setFormData(prev => ({ ...prev, storyTheme: theme }))}
          isDisabled={isGenerating}
        />

        {formData.storyTheme === 'Custom Story Idea...' && (
          <div className="form-group">
            <label htmlFor="customStoryTheme">Custom Theme Idea</label>
            <input
              type="text"
              id="customStoryTheme"
              name="customStoryTheme"
              value={formData.customStoryTheme}
              onChange={handleInputChange}
              placeholder="e.g., A robot who learns to dance"
              required
              disabled={isGenerating}
            />
          </div>
        )}

        <ImageUploader
          imageUrl={formData.imageUrl}
          setImageUrl={url => setFormData(prev => ({ ...prev, imageUrl: url }))}
          isDisabled={isGenerating}
        />

        <div className="form-group">
          <label htmlFor="desiredMoral">Desired Moral/Lesson (Optional)</label>
          <textarea
            id="desiredMoral"
            name="desiredMoral"
            value={formData.desiredMoral}
            onChange={handleInputChange}
            placeholder="e.g., The importance of sharing"
            rows={3}
            disabled={isGenerating}
          ></textarea>
        </div>

        <LengthSelector
          selectedLength={formData.storyLength}
          customLength={formData.customStoryLength}
          setLength={length => setFormData(prev => ({ ...prev, storyLength: length }))}
          setCustomLength={value =>
            setFormData(prev => ({ ...prev, customStoryLength: value }))
          }
          isDisabled={isGenerating}
        />

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            disabled={isGenerating}
          >
            {storyLanguageOptions.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isGenerating}
          style={{
            opacity: isGenerating ? 0.6 : 1,
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? 'Generating Your Story...' : '✨ Generate My Story!'}
        </button>

        {isGenerating && (
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Please wait, this may take a moment...
          </p>
        )}
      </form>
      <FormStyles />
    </>
  );
};
