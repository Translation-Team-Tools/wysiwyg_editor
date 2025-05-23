import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Edit3, Save, X, FileText } from 'lucide-react';
import styles from './PartNodeView.module.css';

interface PartNodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}

export const PartNodeView: React.FC<PartNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(node.attrs.title || 'Part');
  const [tempId, setTempId] = useState(node.attrs.id || '');

  const handleSave = () => {
    const finalId = tempId || `pt${Date.now()}`;
    updateAttributes({
      title: tempTitle,
      id: finalId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(node.attrs.title || 'Part');
    setTempId(node.attrs.id || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      deleteNode();
    }
  };

  return (
    <NodeViewWrapper className={styles.partWrapper}>
      <div className={styles.partHeader}>
        <div className={styles.partInfo}>
          <FileText size={18} className={styles.partIcon} />
          {isEditing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Part Title"
                className={styles.titleInput}
                autoFocus
              />
              <input
                type="text"
                value={tempId}
                onChange={(e) => setTempId(e.target.value)}
                placeholder="Part ID (e.g., pt1)"
                className={styles.idInput}
              />
            </div>
          ) : (
            <div className={styles.partTitle}>
              <h3>{node.attrs.title || 'Part'}</h3>
              {node.attrs.id && (
                <span className={styles.partId}>#{node.attrs.id}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.partActions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.actionButton} title="Save">
                <Save size={14} />
              </button>
              <button onClick={handleCancel} className={styles.actionButton} title="Cancel">
                <X size={14} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className={styles.actionButton}
              title="Edit Part"
            >
              <Edit3 size={14} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete Part"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className={styles.partContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};