import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Edit3, Save, X, BookOpen } from 'lucide-react';
import styles from './ChapterNodeView.module.css';

interface ChapterNodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}

export const ChapterNodeView: React.FC<ChapterNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(node.attrs.title || 'Chapter');
  const [tempId, setTempId] = useState(node.attrs.id || '');

  const handleSave = () => {
    const finalId = tempId || `ch${Date.now()}`;
    updateAttributes({
      title: tempTitle,
      id: finalId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(node.attrs.title || 'Chapter');
    setTempId(node.attrs.id || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      deleteNode();
    }
  };

  return (
    <NodeViewWrapper className={styles.chapterWrapper}>
      <div className={styles.chapterHeader}>
        <div className={styles.chapterInfo}>
          <BookOpen size={20} className={styles.chapterIcon} />
          {isEditing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Chapter Title"
                className={styles.titleInput}
                autoFocus
              />
              <input
                type="text"
                value={tempId}
                onChange={(e) => setTempId(e.target.value)}
                placeholder="Chapter ID (e.g., ch1)"
                className={styles.idInput}
              />
            </div>
          ) : (
            <div className={styles.chapterTitle}>
              <h2>{node.attrs.title || 'Chapter'}</h2>
              {node.attrs.id && (
                <span className={styles.chapterId}>#{node.attrs.id}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.chapterActions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.actionButton} title="Save">
                <Save size={16} />
              </button>
              <button onClick={handleCancel} className={styles.actionButton} title="Cancel">
                <X size={16} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className={styles.actionButton}
              title="Edit Chapter"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete Chapter"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className={styles.chapterContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};
