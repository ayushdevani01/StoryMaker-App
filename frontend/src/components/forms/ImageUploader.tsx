import React from 'react';

interface Props {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  isDisabled: boolean;
}

export const ImageUploader: React.FC<Props> = ({ imageUrl, setImageUrl, isDisabled }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return setImageUrl(null);

    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.onerror = e => {
      console.error('Error reading file:', e);
      setImageUrl(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group">
      <label htmlFor="imageUrl">Upload Reference Image (Optional)</label>
      <input
        type="file"
        id="imageUrl"
        name="imageUrl"
        accept="image/*"
        onChange={handleChange}
        disabled={isDisabled}
      />
      {imageUrl && (
        <div style={{ marginTop: '0.5rem' }}>
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              maxWidth: '100px',
              maxHeight: '100px',
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              color: 'red',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      )}
      <small className="form-help-text">Upload an image to influence the story's visual style.</small>
    </div>
  );
};
