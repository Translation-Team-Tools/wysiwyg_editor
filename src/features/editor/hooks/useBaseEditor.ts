import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { SectionExtension } from '../extensions';
import { ImageExtension } from '../extensions';

interface UseBaseEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const useBaseEditor = ({ content, onChange }: UseBaseEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      SectionExtension,
      ImageExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event): boolean => {
        if (!editor) return false;
        
        if (event.key === 'Tab') {
          if (editor.isActive('listItem')) {
            if (event.shiftKey) {
              return editor.chain().focus().liftListItem('listItem').run();
            } else {
              return editor.chain().focus().sinkListItem('listItem').run();
            }
          }
        }
        return false;
      },
    },
  });

  return editor;
};