import { Editor } from '@tiptap/react';

export const useTextFormatting = (editor: Editor) => {
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const clearTextFormatting = () => editor.chain().focus().unsetAllMarks().run();
  const toggleParagraph = () => editor.chain().focus().setParagraph().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

  const isAnyHeadingActive = editor.isActive('heading', { level: 1 }) || 
                          editor.isActive('heading', { level: 2 }) || 
                          editor.isActive('heading', { level: 3 });

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    clearTextFormatting,
    toggleParagraph,
    toggleHeading,
    isAnyHeadingActive,
  };
};