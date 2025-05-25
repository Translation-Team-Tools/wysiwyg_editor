import React, { useState, useRef } from 'react';
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef<HTMLSpanElement>(null);

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(titleRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  const handleIdDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent title editing
    setIsEditingId(true);
    setTimeout(() => {
      if (idRef.current) {
        idRef.current.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(idRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitleChanges();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelTitleEdit();
    }
  };

  const handleIdKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveIdChanges();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelIdEdit();
    }
  };

  const saveTitleChanges = () => {
    const newTitle = titleRef.current?.textContent?.trim() || 'Untitled';
    updateAttributes({
      title: newTitle,
    });
    setIsEditingTitle(false);
  };

  const saveIdChanges = () => {
    let newId = idRef.current?.textContent?.trim() || '';
    // Remove # if user included it
    newId = newId.startsWith('#') ? newId.slice(1) : newId;
    updateAttributes({
      id: newId || `section${Date.now()}`,
    });
    setIsEditingId(false);
  };

  const cancelTitleEdit = () => {
    if (titleRef.current) {
      titleRef.current.textContent = node.attrs.title || 'Untitled';
    }
    setIsEditingTitle(false);
  };

  const cancelIdEdit = () => {
    if (idRef.current) {
      idRef.current.textContent = node.attrs.id || '';
    }
    setIsEditingId(false);
  };

  const handleTitleBlur = () => {
    saveTitleChanges();
  };

  const handleIdBlur = () => {
    saveIdChanges();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this section?')) {
      deleteNode();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleTitleDoubleClick();
  };

  return (
    <NodeViewWrapper className={styles.sectionWrapper}>
      <div 
        className={styles.sectionHeader}
        contentEditable={false} // Prevent TipTap from interfering
        onContextMenu={handleContextMenu}
      >
        <div className={styles.displayMode}>
          <span 
            ref={titleRef}
            className={`${styles.title} ${isEditingTitle ? styles.titleEditing : ''}`}
            contentEditable={isEditingTitle}
            onDoubleClick={handleTitleDoubleClick}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleBlur}
            suppressContentEditableWarning={true}
            onMouseDown={(e) => isEditingTitle && e.stopPropagation()} // Prevent TipTap interference
            onFocus={(e) => e.stopPropagation()} // Prevent TipTap interference
          >
            {node.attrs.title || 'Untitled'}
          </span>
          {node.attrs.id && (
            <span 
              ref={idRef}
              className={`${styles.id} ${isEditingId ? styles.idEditing : ''}`}
              contentEditable={isEditingId}
              onDoubleClick={handleIdDoubleClick}
              onKeyDown={handleIdKeyDown}
              onBlur={handleIdBlur}
              suppressContentEditableWarning={true}
              onMouseDown={(e) => isEditingId && e.stopPropagation()} // Prevent TipTap interference
              onFocus={(e) => e.stopPropagation()} // Prevent TipTap interference
            >
              #{node.attrs.id}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleDelete} 
          className={styles.deleteButton}
          title="Delete"
          onMouseDown={(e) => e.stopPropagation()} // Prevent TipTap interference
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