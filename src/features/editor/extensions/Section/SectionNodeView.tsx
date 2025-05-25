import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { X } from 'lucide-react';
import styles from './SectionNodeView.module.css';

interface SectionNodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}

export const SectionNodeView: React.FC<SectionNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(node.attrs.title || '');
  const [tempId, setTempId] = useState(node.attrs.id || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateAttributes({
      title: tempTitle || 'Untitled',
      id: tempId || `section${Date.now()}`,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(node.attrs.title || '');
    setTempId(node.attrs.id || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this section?')) {
      deleteNode();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <NodeViewWrapper className={styles.sectionWrapper}>
      <div 
        className={styles.sectionHeader}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {isEditing ? (
          <div className={styles.editMode}>
            <input
              ref={titleInputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="Title"
              className={styles.titleInput}
            />
            <input
              ref={idInputRef}
              type="text"
              value={tempId}
              onChange={(e) => setTempId(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="ID"
              className={styles.idInput}
            />
          </div>
        ) : (
          <div className={styles.displayMode}>
            <span className={styles.title}>
              {node.attrs.title || 'Untitled'}
            </span>
            {node.attrs.id && (
              <span className={styles.id}>#{node.attrs.id}</span>
            )}
          </div>
        )}
        
        <button 
          onClick={handleDelete} 
          className={styles.deleteButton}
          title="Delete"
        >
          <X size={14} />
        </button>
      </div>
      
      <div className={styles.sectionContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};