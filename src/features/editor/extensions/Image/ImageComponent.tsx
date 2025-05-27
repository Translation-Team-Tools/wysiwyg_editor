import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X, RotateCcw, Edit3 } from 'lucide-react';
import styles from './ImageComponent.module.css';

interface ImageComponentProps extends NodeViewProps {
  // Additional props if needed
}

export const ImageComponent: React.FC<ImageComponentProps> = ({
  node,
  updateAttributes,
  selected,
  deleteNode,
  editor,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editUrl, setEditUrl] = useState(node.attrs.src || '');
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleDelete = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    // Force reload by updating src attribute
    if (imageRef.current) {
      imageRef.current.src = node.attrs.src;
    }
  }, [node.attrs.src]);

  const handleEditUrl = useCallback(() => {
    setShowEditInput(true);
    setEditUrl(node.attrs.src || '');
  }, [node.attrs.src]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editUrl.trim()) {
      updateAttributes({ src: editUrl.trim() });
      setShowEditInput(false);
      setIsLoading(true);
      setHasError(false);
    }
  }, [editUrl, updateAttributes]);

  const handleUrlCancel = useCallback(() => {
    setShowEditInput(false);
    setEditUrl(node.attrs.src || '');
  }, [node.attrs.src]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && !showEditInput) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          handleDelete();
        }
      }
    };

    if (selected) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selected, showEditInput, handleDelete]);

  const imageStyles: React.CSSProperties = {
    width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
    height: node.attrs.height ? `${node.attrs.height}px` : 'auto',
    maxWidth: '100%',
    display: isLoading ? 'none' : 'block',
  };

  return (
    <NodeViewWrapper 
      className={`${styles.imageWrapper} ${selected ? styles.selected : ''}`}
      ref={containerRef}
    >
      <div className={styles.imageContainer}>
        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.skeleton}>
              <div className={styles.loadingSpinner} />
              <span>Loading image...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
              <span className={styles.errorText}>Failed to load image</span>
              <div className={styles.errorActions}>
                <button onClick={handleRetry} className={styles.retryButton}>
                  <RotateCcw size={14} />
                  Retry
                </button>
                <button onClick={handleEditUrl} className={styles.editButton}>
                  <Edit3 size={14} />
                  Edit URL
                </button>
                <button onClick={handleDelete} className={styles.deleteButton}>
                  <X size={14} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* URL Edit Input */}
        {showEditInput && (
          <div className={styles.editContainer}>
            <form onSubmit={handleUrlSubmit} className={styles.editForm}>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="Enter image URL..."
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.editActions}>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
                <button type="button" onClick={handleUrlCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Image */}
        {!hasError && (
          <img
            ref={imageRef}
            src={node.attrs.src}
            alt={node.attrs.alt || ''}
            title={node.attrs.title || ''}
            style={imageStyles}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={styles.image}
            draggable={false}
          />
        )}

        {/* Selection Toolbar */}
        {selected && !isLoading && !hasError && !showEditInput && (
          <div className={styles.toolbar}>
            <button onClick={handleEditUrl} className={styles.toolbarButton} title="Edit URL">
              <Edit3 size={14} />
            </button>
            <button onClick={handleDelete} className={styles.toolbarButton} title="Delete">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};