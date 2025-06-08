import React, { useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from './components/EditorToolbar.tsx';
import { useBaseEditor } from './hooks/useBaseEditor.ts';
import { BaseEditorProps } from './types';
import styles from './BaseEditor.module.css';

const BaseEditor: React.FC<BaseEditorProps> = ({ 
  content = '', 
  onChange = () => {} 
}) => {
  const { editor, currentDocumentId, setCurrentDocumentId } = useBaseEditor({ content, onChange });

  useEffect(() => {
    if (!editor) return;

    const handleAllContentChanges = () => {
      const currentHtml = editor.getHTML();
      onChange(currentHtml);
    };

    // Listen to ALL content changes (user typing + programmatic)
    editor.on('transaction', handleAllContentChanges);
    
    return () => {
      editor.off('transaction', handleAllContentChanges);
    };
  }, [editor, onChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      <EditorToolbar 
        editor={editor} 
        currentDocumentId={currentDocumentId}
        setCurrentDocumentId={setCurrentDocumentId}
      />
      <div className={styles.content}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BaseEditor;