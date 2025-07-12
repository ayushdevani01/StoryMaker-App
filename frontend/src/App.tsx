import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { StoryForm } from './components/forms/StoryForm';
import { StoryBook } from './components/story/StoryBook';
import { useStoryGeneration } from './hooks/useStoryGeneration';
import { FormData } from './types';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { ErrorMessage } from './components/common/ErrorMessage';
import { genderOptions } from './constants/storyConstants';

const initialFormData: FormData = {
  childName: '',
  childAge: '5',
  storyTheme: 'A Magical Garden',
  customStoryTheme: '',
  desiredMoral: '',
  storyLength: 'Bedtime Story',
  customStoryLength: 8,
  language: 'English',
  imageUrl: null,
  gender: genderOptions[0],
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const {
    storyPages,
    description,
    isGenerating,
    error,
    generateStory,
    resetStory,
  } = useStoryGeneration();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    await generateStory(formData);
  };

  const handleReset = () => {
    resetStory();
    setFormData(initialFormData);
  };

  return (
    <div className="container">
      <Header />
      <main>
        {isGenerating && <LoadingOverlay message="Generating your adventure..." />}

        {error && !isGenerating && (
          <ErrorMessage message={error} onRetry={handleReset} />
        )}

        {!storyPages && !isGenerating && !error && (
          <StoryForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleFormSubmit}
            isGenerating={isGenerating}
          />
        )}

        {storyPages && description !== null && (
          <StoryBook
            pages={storyPages}
            description={description}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;
