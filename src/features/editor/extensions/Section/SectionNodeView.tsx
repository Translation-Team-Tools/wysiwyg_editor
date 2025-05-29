import React, { useState, useRef, useMemo } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { X, ArrowDownLeft } from 'lucide-react';
import styles from './SectionNodeView.module.css';

interface SectionNodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
  editor: any;
}

export const SectionNodeView: React.FC<SectionNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef<HTMLSpanElement>(null);

  // Determine section level and type based on title
  const sectionInfo = useMemo(() => {
    const title = (node.attrs.title || 'Untitled').toLowerCase();
    
    if (title.startsWith('chapter')) {
      return { level: 1, type: 'chapter', color: '#8cc8ff', canExit: false };
    } else if (title.startsWith('part')) {
      return { level: 2, type: 'part', color: '#8ce99a', canExit: false };
    } else if (title.startsWith('container')) {
      return { level: 3, type: 'container', color: '#ffe066', canExit: true };
    } else if (title.startsWith('section')) {
      return { level: 4, type: 'section', color: '#ffb3d9', canExit: true };
    } else {
      // Default for custom sections
      return { level: 1, type: 'custom', color: '#8cc8ff', canExit: true };
    }
  }, [node.attrs.title]);

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(titleRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  const handleIdDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingId(true);
    setTimeout(() => {
      if (idRef.current) {
        idRef.current.focus();
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Delete this ${sectionInfo.type}?`)) {
      deleteNode();
    }
  };

  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the custom exitSection command
    if (editor?.commands?.exitSection) {
      editor.commands.exitSection();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleTitleDoubleClick();
  };

  return (
    <NodeViewWrapper 
      className={styles.sectionWrapper}
      data-level={sectionInfo.level}
      data-type={sectionInfo.type}
      style={{
        '--section-color': sectionInfo.color
      } as React.CSSProperties}
    >
      <div 
        className={styles.sectionHeader}
        contentEditable={false}
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
            onMouseDown={(e) => isEditingTitle && e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
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
              onMouseDown={(e) => isEditingId && e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            >
              #{node.attrs.id}
            </span>
          )}
          {sectionInfo.canExit && (
            <span className={styles.exitHint}>
              {sectionInfo.type === 'container' ? 'Shift+Enter or ↵↵ to exit' : '↵↵ to exit'}
            </span>
          )}
        </div>
        
        <div className={styles.actionButtons}>
          {sectionInfo.canExit && (
            <button 
              onClick={handleExit} 
              className={styles.exitButton}
              title={`Exit ${sectionInfo.type} and continue writing outside`}
              onMouseDown={(e) => e.stopPropagation()}
              type="button"
            >
              <ArrowDownLeft size={14} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            className={styles.deleteButton}
            title={`Delete ${sectionInfo.type}`}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className={styles.sectionContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};