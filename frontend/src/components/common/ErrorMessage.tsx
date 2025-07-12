import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="error-container">
    <p className="error-message">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="submit-button reset-button">
        Try Again
      </button>
    )}
  </div>
);
