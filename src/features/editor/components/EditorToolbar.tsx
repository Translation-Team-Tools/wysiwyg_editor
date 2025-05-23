import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import styles from './css/EditorToolbar.module.css'

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

  return (
    <div className={styles.toolbar}>
      <ToolbarButton 
        onClick={toggleBold}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={toggleItalic}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={toggleUnderline}
        isActive={editor.isActive('underline')}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </ToolbarButton>

      <div className={styles.divider}></div>

      <ToolbarButton 
        onClick={() => toggleHeading(1)}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={() => toggleHeading(2)}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={() => toggleHeading(3)}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </ToolbarButton>
    </div>
  );
};