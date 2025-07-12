import React from "react";

export const FormStyles: React.FC = () => (
  <style>{`
    .button-grid {
      display: grid;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .gender-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    .theme-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .length-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 640px) {
      .theme-grid,
      .length-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .choice-button {
      padding: 1rem 0.5rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      background-color: #f9fafb;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .choice-button .emoji {
      display: block;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .choice-button:hover {
      border-color: #9ca3af;
      transform: translateY(-2px);
    }
    .choice-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .choice-button.active {
      background-color: #3b82f6;
      border-color: #2563eb;
      color: white;
      font-weight: bold;
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
    }
    .story-length-description {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background-color: #f8fafc;
      border-radius: 0.375rem;
      border: 1px solid #e2e8f0;
      font-size: 0.875rem;
      color: #64748b;
    }
    .custom-length-container {
      margin-top: 1.5rem;
      padding: 1rem;
      border: 1px dashed #d1d5db;
      border-radius: 0.5rem;
    }
    .slider-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      display: block;
      margin-bottom: 0.75rem;
    }
    .slider-value {
      display: inline-block;
      min-width: 2ch;
      text-align: center;
      font-weight: bold;
      color: #3b82f6;
    }
    .range-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 5px;
      outline: none;
      opacity: 0.7;
      transition: opacity .2s;
    }
    .range-slider:hover {
      opacity: 1;
    }
    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 4px solid white;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
    }
    .range-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 4px solid white;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
    }
  `}</style>
);
