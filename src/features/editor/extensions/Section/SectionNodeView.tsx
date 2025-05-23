import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Edit3, Save, X, BookOpen, FileText, Hash } from 'lucide-react';
import styles from './SectionNodeView.module.css';

interface SectionNodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}

const getSectionConfig = (sectionType: string) => {
  switch (sectionType) {
    case 'chapter':
      return {
        icon: BookOpen,
        defaultTitle: 'Chapter',
        className: 'chapterWrapper',
        headerClass: 'chapterHeader',
        titleTag: 'h2'
      };
    case 'part':
      return {
        icon: FileText,
        defaultTitle: 'Part', 
        className: 'partWrapper',
        headerClass: 'partHeader',
        titleTag: 'h3'
      };
    default:
      return {
        icon: Hash,
        defaultTitle: 'Section',
        className: 'sectionWrapper', 
        headerClass: 'sectionHeader',
        titleTag: 'h4'
      };
  }
};

export const SectionNodeView: React.FC<SectionNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(node.attrs.title || 'Section');
  const [tempId, setTempId] = useState(node.attrs.id || '');
  const [tempSectionType, setTempSectionType] = useState(node.attrs.sectionType || 'chapter');
  
  const config = getSectionConfig(node.attrs.sectionType || 'chapter');
  const IconComponent = config.icon;

  const handleSave = () => {
    const finalId = tempId || `${tempSectionType}${Date.now()}`;
    updateAttributes({
      title: tempTitle,
      id: finalId,
      sectionType: tempSectionType,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(node.attrs.title || config.defaultTitle);
    setTempId(node.attrs.id || '');
    setTempSectionType(node.attrs.sectionType || 'chapter');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${node.attrs.sectionType || 'section'}?`)) {
      deleteNode();
    }
  };

  const TitleTag = config.titleTag as keyof JSX.IntrinsicElements;

  return (
    <NodeViewWrapper className={`${styles.sectionWrapper} ${styles[config.className]}`}>
      <div className={`${styles.sectionHeader} ${styles[config.headerClass]}`}>
        <div className={styles.sectionInfo}>
          <IconComponent size={18} className={styles.sectionIcon} />
          {isEditing ? (
            <div className={styles.editForm}>
              <select
                value={tempSectionType}
                onChange={(e) => setTempSectionType(e.target.value)}
                className={styles.typeSelect}
              >
                <option value="chapter">Chapter</option>
                <option value="part">Part</option>
                <option value="section">Section</option>
              </select>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Title"
                className={styles.titleInput}
                autoFocus
              />
              <input
                type="text"
                value={tempId}
                onChange={(e) => setTempId(e.target.value)}
                placeholder="ID (optional)"
                className={styles.idInput}
              />
            </div>
          ) : (
            <div className={styles.sectionTitle}>
              <TitleTag>{node.attrs.title || config.defaultTitle}</TitleTag>
              {node.attrs.id && (
                <span className={styles.sectionId}>#{node.attrs.id}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.sectionActions}>
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
              title="Edit Section"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete Section"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className={styles.sectionContent}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};
