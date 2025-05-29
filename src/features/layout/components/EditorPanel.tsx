// src/features/layout/components/EditorPanel.tsx
import React from 'react';
import BaseEditor from '../../editor';
import styles from './EditorPanel.module.css';

export interface EditorPanelProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onChange }) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
    console.log('Content updated:', newContent);
  };

  return (
    <div className={styles.editorPanel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Editor</h1>
      </div>
      <div className={styles.editorContent}>
        <BaseEditor content={content} onChange={handleChange} />
      </div>
    </div>
  );
};

export default EditorPanel;