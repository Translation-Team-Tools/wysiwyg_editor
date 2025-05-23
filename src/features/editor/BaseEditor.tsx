import React from 'react';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from './components/EditorToolbar.tsx';
import { useBaseEditor } from './hooks/useBaseEditor.ts';
import { BaseEditorProps } from './types';

const BaseEditor: React.FC<BaseEditorProps> = ({ 
  content = '', 
  onChange = () => {} 
}) => {
  const editor = useBaseEditor({ content, onChange });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md w-full max-w-full mx-auto">
      <EditorToolbar editor={editor} />
      <div className="p-4">
        <EditorContent editor={editor} className="min-h-32" />
      </div>
    </div>
  );
};

export default BaseEditor;