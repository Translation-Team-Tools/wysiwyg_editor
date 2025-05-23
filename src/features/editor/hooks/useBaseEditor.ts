import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { SectionExtension } from '../extensions';

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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return editor;
};