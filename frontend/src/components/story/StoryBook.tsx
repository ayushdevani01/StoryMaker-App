import React, { useMemo, useState } from 'react';
import { useStoryImagesManager } from '../../hooks/useStoryImagesManager';
import { downloadStoryAsPDF } from '../../utils/pdfGenerator';
import { StoryCard } from './StoryCard';
// At the top of your StoryBook.tsx
import './storybook.css';

interface StoryBookProps {
  pages: string[];
  description?: string;
  onReset: () => void;
  onStoryUpdate?: (updatedPages: string[]) => void;
}

// Function to group paragraphs into pages with more content
const groupParagraphsIntoPages = (paragraphs: string[], paragraphsPerPage: number = 3) => {
  const pages = [];
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    pages.push(paragraphs.slice(i, i + paragraphsPerPage));
  }
  return pages;
};

export const StoryBook: React.FC<StoryBookProps> = ({ 
  pages, 
  description = '', 
  onReset, 
  onStoryUpdate 
}) => {
  const [editablePages, setEditablePages] = useState<string[]>(pages);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingParagraph, setEditingParagraph] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [viewMode, setViewMode] = useState<'paginated' | 'cards'>('paginated');
  
  const title = editablePages[0] || 'My Amazing Story';
  const storyParagraphs = useMemo(() => editablePages.slice(1), [editablePages]);
  
  // Updated to destructure the correct properties and provide fallbacks
  const { 
    imageStates, 
    regenerateAllImages: hookRegenerateAllImages, 
    regenerateImage: hookRegenerateImage, 
    isGeneratingImages,
    overallProgress
  } = useStoryImagesManager(storyParagraphs, description);
  
  // Provide fallback functions if the hook doesn't return them
  const regenerateAllImages = hookRegenerateAllImages || (async () => {
    console.warn('regenerateAllImages function not available');
  });
  
  const regenerateImage = hookRegenerateImage || (async (index: number) => {
    console.warn('regenerateImage function not available for index:', index);
  });
  
  const [currentPage, setCurrentPage] = useState(0);
  
  // Group paragraphs into pages with 3 paragraphs each
  const storyPages = useMemo(() => groupParagraphsIntoPages(storyParagraphs, 3), [storyParagraphs]);

  const handleDownloadPDF = async () => {
    try {
      if (viewMode === 'paginated') {
        await downloadStoryAsPDF(title, storyPages, imageStates);
      } else {
        await downloadStoryAsPDF(title, [storyParagraphs], imageStates);
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
      onStoryUpdate?.(editablePages);
    }
    setIsEditMode(!isEditMode);
    setEditingParagraph(null);
  };

  const handleEditParagraph = (globalIndex: number) => {
    if (globalIndex === -1) {
      // Editing title
      setEditText(title);
      setEditingParagraph(-1);
    } else {
      setEditText(storyParagraphs[globalIndex]);
      setEditingParagraph(globalIndex);
    }
  };

  const handleSaveEdit = () => {
    if (editingParagraph === -1) {
      // Update title
      const newPages = [...editablePages];
      newPages[0] = editText;
      setEditablePages(newPages);
    } else if (editingParagraph !== null) {
      // Update paragraph
      const newPages = [...editablePages];
      newPages[editingParagraph + 1] = editText;
      setEditablePages(newPages);
    }
    setEditingParagraph(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingParagraph(null);
    setEditText('');
  };

  const handleRegenerateAllImages = async () => {
    if (window.confirm('Are you sure you want to regenerate all images? This will replace all current illustrations.')) {
      await regenerateAllImages();
    }
  };

  const handleRegenerateImage = async (index: number) => {
    if (window.confirm('Are you sure you want to regenerate this image?')) {
      await regenerateImage(index);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(storyPages.length - 1, prev + 1));
  };

  const handleViewModeToggle = () => {
    setViewMode(prev => prev === 'paginated' ? 'cards' : 'paginated');
    setCurrentPage(0);
    setEditingParagraph(null);
  };

  if (!pages || pages.length < 2) {
    return (
      <div className="storybook-container">
        <p>The story seems to be missing its pages. Please try again.</p>
        <button onClick={onReset} className="submit-button reset-button">Create Another Story</button>
      </div>
    );
  }

  const styles = {
    storybookWrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: 'Georgia, serif'
    },
    storybookContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    storybookHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center' as const,
      position: 'relative' as const
    },
    storybookTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: '0 0 1.5rem 0',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      cursor: isEditMode ? 'pointer' : 'default',
      border: isEditMode ? '2px dashed rgba(255, 255, 255, 0.5)' : 'none',
      padding: isEditMode ? '0.5rem' : '0',
      borderRadius: isEditMode ? '8px' : '0'
    },
    storybookActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const
    },
    actionButton: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    downloadButton: {
      background: 'rgba(255, 255, 255, 0.2)',
    },
    editButton: {
      background: isEditMode ? '#28a745' : 'rgba(255, 255, 255, 0.2)',
    },
    viewModeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
    },
    regenerateButton: {
      background: '#ff6b6b',
      opacity: isGeneratingImages ? 0.6 : 1,
    },
    resetButton: {
      background: '#4285f4',
      border: '2px solid #4285f4',
    },
    pageViewport: {
      padding: '3rem',
      minHeight: '500px',
      position: 'relative' as const
    },
    cardViewport: {
      overflowX: 'auto',
      width: '100%',
      padding: '2rem',
      paddingBottom: '1rem',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'thin',
      scrollbarColor: '#667eea #e0e0e0',
    },
    cardContent: {
      display: 'flex',
      gap: '1.5rem',
      padding: '0.5rem',
      minWidth: 'fit-content'
    },
    pageHeader: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    pageNumber: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'inline-block'
    },
    editModeIndicator: {
      background: '#28a745',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'inline-block',
      marginLeft: '1rem'
    },
    pageContent: {
      lineHeight: '1.8',
      fontSize: '1.1rem',
      color: '#333'
    },
    paragraphSection: {
      marginBottom: '2rem',
      padding: '1.5rem',
      background: '#f8f9fa',
      borderRadius: '15px',
      borderLeft: '4px solid #667eea',
      position: 'relative' as const
    },
    editableParagraph: {
      border: '2px dashed #667eea',
      cursor: 'pointer',
      background: '#fff',
    },
    paragraphActions: {
      position: 'absolute' as const,
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '0.5rem',
      opacity: 0.7
    },
    paragraphActionButton: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease'
    },
    paragraphImage: {
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      position: 'relative' as const
    },
    paragraphImageImg: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    imageRegenerateButton: {
      position: 'absolute' as const,
      top: '10px',
      right: '10px',
      background: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '0.8rem',
      opacity: 0.8,
      transition: 'all 0.3s ease'
    },
    paragraphImageLoading: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: '#666'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    },
    paragraphImageError: {
      textAlign: 'center' as const,
      padding: '1rem',
      background: '#fff3cd',
      borderRadius: '8px',
      color: '#856404',
      marginBottom: '1rem'
    },
    paragraphText: {
      textAlign: 'justify' as const
    },
    paragraphTextP: {
      margin: '0',
      textIndent: '1.5rem'
    },
    editTextarea: {
      width: '100%',
      minHeight: '100px',
      padding: '1rem',
      border: '2px solid #667eea',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      resize: 'vertical' as const
    },
    editActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '1rem'
    },
    editActionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: 'none',
      transition: 'all 0.3s ease'
    },
    saveButton: {
      background: '#28a745',
      color: 'white'
    },
    cancelButton: {
      background: '#dc3545',
      color: 'white'
    },
    pageFooter: {
      textAlign: 'center' as const,
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid #e9ecef'
    },
    pageDecoration: {
      color: '#667eea',
      fontSize: '1.5rem',
      opacity: 0.7
    },
    storybookNavigation: {
      background: '#f8f9fa',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #e9ecef'
    },
    navButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    navButtonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed'
    },
    pageIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontWeight: '600',
      color: '#495057'
    },
    pageDots: {
      display: 'flex',
      gap: '0.5rem'
    },
    pageDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#dee2e6',
      transition: 'all 0.3s ease'
    },
    pageDotActive: {
      background: '#667eea',
      transform: 'scale(1.2)'
    },
    storyStats: {
      fontSize: '0.9rem',
      color: '#6c757d',
      fontStyle: 'italic',
      textAlign: 'center' as const,
      padding: '1rem'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .storybook-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .loading-spinner {
            animation: spin 1s linear infinite;
          }
          
          .paragraph-action-button:hover {
            background: #5a67d8 !important;
          }
          
          .image-regenerate-button:hover {
            background: #e53e3e !important;
            opacity: 1 !important;
          }
          
          .editable-paragraph:hover {
            background: #f0f8ff !important;
          }
          
          @media (max-width: 768px) {
            .storybook-mobile-wrapper {
              padding: 1rem !important;
            }
            
            .storybook-mobile-title {
              font-size: 2rem !important;
            }
            
            .storybook-mobile-viewport {
              padding: 2rem !important;
            }
            
            .storybook-mobile-actions {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            .storybook-mobile-navigation {
              flex-direction: column !important;
              gap: 1rem !important;
            }
          }
        `}
      </style>
      <div style={styles.storybookWrapper} className="storybook-mobile-wrapper">
        <div style={styles.storybookContainer}>
          <div style={styles.storybookHeader}>
            {editingParagraph === -1 ? (
              <div>
                <textarea
                  style={styles.editTextarea}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit story title..."
                />
                <div style={styles.editActions}>
                  <button 
                    style={{...styles.editActionButton, ...styles.saveButton}}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button 
                    style={{...styles.editActionButton, ...styles.cancelButton}}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h2 
                style={styles.storybookTitle} 
                className="storybook-mobile-title"
                onClick={() => isEditMode && handleEditParagraph(-1)}
              >
                {title}
              </h2>
            )}
            
            <div style={styles.storybookActions} className="storybook-mobile-actions">
              <button 
                onClick={handleDownloadPDF} 
                style={{...styles.actionButton, ...styles.downloadButton}}
              >
                📖 Download Story
              </button>
              {onStoryUpdate && (
                <button 
                  onClick={handleEditToggle} 
                  style={{...styles.actionButton, ...styles.editButton}}
                >
                  {isEditMode ? '✅ Save Changes' : '✏️ Edit Story'}
                </button>
              )}
              <button 
                onClick={handleViewModeToggle} 
                style={{...styles.actionButton, ...styles.viewModeButton}}
              >
                {viewMode === 'paginated' ? '📑 Card View' : '📖 Page View'}
              </button>
              <button 
                onClick={handleRegenerateAllImages} 
                style={{...styles.actionButton, ...styles.regenerateButton}}
                disabled={isGeneratingImages}
              >
                {isGeneratingImages ? '🔄 Generating...' : '🎨 Regenerate All Images'}
              </button>
              <button 
                onClick={onReset} 
                style={{...styles.actionButton, ...styles.resetButton}}
              >
                Create Another Story
              </button>
            </div>
          </div>
          
          {viewMode === 'cards' ? (
            // Card View Mode
           <div className="storybook-mobile-viewport card-viewport">
              <div style={styles.cardContent}>
                {storyParagraphs.map((paragraph, index) => {
                  const imageState = imageStates[index];
                  return (
                    <StoryCard
                      key={index}
                      paragraph={paragraph}
                      imageUrl={imageState?.imageUrl || null}
                      isLoading={imageState?.isLoading || false}
                      error={imageState?.error || null}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            // Paginated View Mode
            <>
              <div style={styles.pageViewport} className="storybook-mobile-viewport">
                {storyPages.map((pageContent, pageIndex) => (
                  <div 
                    key={pageIndex} 
                    style={{ display: pageIndex === currentPage ? 'block' : 'none' }}
                    className="storybook-fade-in"
                  >
                    <div style={styles.pageHeader}>
                      <span style={styles.pageNumber}>Page {pageIndex + 1}</span>
                      {isEditMode && (
                        <span style={styles.editModeIndicator}>✏️ Edit Mode</span>
                      )}
                    </div>
                    
                    <div style={styles.pageContent}>
                      {pageContent.map((paragraph, paragraphIndex) => {
                        const globalIndex = pageIndex * 3 + paragraphIndex;
                        const imageState = imageStates[globalIndex];
                        
                        return (
                          <div 
                            key={paragraphIndex} 
                            style={{
                              ...styles.paragraphSection,
                              ...(isEditMode && editingParagraph !== globalIndex ? styles.editableParagraph : {})
                            }}
                            className={isEditMode ? 'editable-paragraph' : ''}
                          >
                            {isEditMode && editingParagraph !== globalIndex && (
                              <div style={styles.paragraphActions}>
                                <button 
                                  style={styles.paragraphActionButton}
                                  className="paragraph-action-button"
                                  onClick={() => handleEditParagraph(globalIndex)}
                                >
                                  ✏️ Edit
                                </button>
                              </div>
                            )}
                            
                            {imageState?.imageUrl && (
                              <div style={styles.paragraphImage}>
                                <img 
                                  src={imageState.imageUrl} 
                                  alt={`Story illustration ${globalIndex + 1}`}
                                  style={styles.paragraphImageImg}
                                />
                                {isEditMode && !imageState.isLoading && (
                                  <button 
                                    style={styles.imageRegenerateButton}
                                    className="image-regenerate-button"
                                    onClick={() => handleRegenerateImage(globalIndex)}
                                    title="Regenerate this image"
                                  >
                                    🔄
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {imageState?.isLoading && (
                              <div style={styles.paragraphImageLoading}>
                                <div style={styles.loadingSpinner} className="loading-spinner"></div>
                                <p>Creating illustration...</p>
                              </div>
                            )}
                            
                            {imageState?.error && (
                              <div style={styles.paragraphImageError}>
                                <span>🎨 Illustration coming soon...</span>
                              </div>
                            )}
                            
                            {editingParagraph === globalIndex ? (
                              <div>
                                <textarea
                                  style={styles.editTextarea}
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  placeholder="Edit paragraph..."
                                />
                                <div style={styles.editActions}>
                                  <button 
                                    style={{...styles.editActionButton, ...styles.saveButton}}
                                    onClick={handleSaveEdit}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    style={{...styles.editActionButton, ...styles.cancelButton}}
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={styles.paragraphText}>
                                <p style={styles.paragraphTextP}>{paragraph}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div style={styles.pageFooter}>
                      <div style={styles.pageDecoration}>✨ ✨ ✨</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={styles.storybookNavigation} className="storybook-mobile-navigation">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 0}
                  style={{
                    ...styles.navButton,
                    ...(currentPage === 0 ? styles.navButtonDisabled : {})
                  }}
                >
                  ← Previous
                </button>
                
                <div style={styles.pageIndicator}>
                  <span>Page {currentPage + 1} of {storyPages.length}</span>
                  <div style={styles.pageDots}>
                    {storyPages.map((_, index) => (
                      <div 
                        key={index}
                        style={{
                          ...styles.pageDot,
                          ...(index === currentPage ? styles.pageDotActive : {})
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === storyPages.length - 1}
                  style={{
                    ...styles.navButton,
                    ...(currentPage === storyPages.length - 1 ? styles.navButtonDisabled : {})
                  }}
                >
                  Next →
                </button>
              </div>
            </>
          )}
          
          <div style={styles.storyStats}>
            {viewMode === 'paginated' ? `${storyPages.length} pages • ` : ''}
            {storyParagraphs.length} paragraphs
            {isGeneratingImages && overallProgress !== undefined && (
              <span> • 🎨 Generating images: {overallProgress}%</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};