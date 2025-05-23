import React from 'react';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from './components/EditorToolBar.tsx';
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
    <div className="border rounded-md">
      <EditorToolbar editor={editor} />
      <div className="p-4">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default BaseEditor;