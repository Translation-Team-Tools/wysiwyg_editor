import React from 'react';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from './components/EditorToolbar.tsx';
import { useBaseEditor } from './hooks/useBaseEditor.ts';
import { BaseEditorProps } from './types';
import styles from './BaseEditor.module.css';

const BaseEditor: React.FC<BaseEditorProps> = ({ 
  content = '', 
  onChange = () => {} 
}) => {
  const editor = useBaseEditor({ content, onChange });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      <EditorToolbar editor={editor} />
      <div className={styles.content}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BaseEditor;