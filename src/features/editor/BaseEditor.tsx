// src/components/editor/BaseEditor.tsx
import React, { useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3 } from 'lucide-react';

// Define styles for toolbar buttons
const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
      type="button"
    >
      {children}
    </button>
  );
};

// Define props for the editor component
interface BaseEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

const BaseEditor: React.FC<BaseEditorProps> = ({ 
  content = '', 
  onChange = () => {} 
}) => {
  // Initialize the editor with TipTap extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Toggle formatting controls
  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="border rounded-md">
      <div className="flex gap-1 p-2 border-b">
        {/* Bold button */}
        <ToolbarButton 
          onClick={toggleBold}
          isActive={editor.isActive('bold')}
        >
          <Bold size={18} />
        </ToolbarButton>

        {/* Italic button */}
        <ToolbarButton 
          onClick={toggleItalic}
          isActive={editor.isActive('italic')}
        >
          <Italic size={18} />
        </ToolbarButton>

        {/* Underline button */}
        <ToolbarButton 
          onClick={toggleUnderline}
          isActive={editor.isActive('underline')}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

        {/* Heading buttons */}
        <ToolbarButton 
          onClick={() => toggleHeading(1)}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => toggleHeading(2)}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => toggleHeading(3)}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </div>

      <div className="p-4">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default BaseEditor;