import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, BookOpen, FileText } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import styles from './EditorToolbar.module.css'

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();
  
  const insertChapter = () => {
    const chapterCount = editor.getHTML().match(/data-type="chapter"/g)?.length || 0;
    const chapterId = `ch${chapterCount + 1}`;
    
    editor.chain().focus().setChapter({ 
      id: chapterId, 
      title: `Chapter ${chapterCount + 1}` 
    }).run();
  };
  
  const insertPart = () => {
    const partCount = editor.getHTML().match(/data-type="part"/g)?.length || 0;
    const partId = `pt${partCount + 1}`;
    
    editor.chain().focus().setPart({ 
      id: partId, 
      title: `Part ${partCount + 1}` 
    }).run();
  };

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

      <div className={styles.divider}></div>

      <ToolbarButton 
        onClick={insertChapter}
        isActive={editor.isActive('chapter')}
        title="Insert Chapter"
      >
        <BookOpen size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={insertPart}
        isActive={editor.isActive('part')}
        title="Insert Part"
      >
        <FileText size={18} />
      </ToolbarButton>
    </div>
  );
};