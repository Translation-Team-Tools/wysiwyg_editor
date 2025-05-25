import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, BookOpen, FileText, Type, RemoveFormatting } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import styles from './EditorToolbar.module.css'

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const clearTextFormatting = () => editor.chain().focus().unsetAllMarks().run();
  const toggleParagraph = () => editor.chain().focus().setParagraph().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

  const isAnyHeadingActive = editor.isActive('heading', { level: 1 }) || 
                          editor.isActive('heading', { level: 2 }) || 
                          editor.isActive('heading', { level: 3 });
  const hasTextFormatting = editor.isActive('bold') || 
                          editor.isActive('italic') || 
                          editor.isActive('underline');
  
  const insertChapter = () => {
    const chapterCount = editor.getHTML().match(/data-type="chapter"/g)?.length || 0;
    editor.chain().focus().setSection({ 
      id: `ch${chapterCount + 1}`,
      title: `Chapter ${chapterCount + 1}`,
      sectionType: 'chapter'
    }).run();
  };
  
  const insertPart = () => {
    const partCount = editor.getHTML().match(/data-type="part"/g)?.length || 0;
    editor.chain().focus().setSection({ 
      id: `pt${partCount + 1}`,
      title: `Part ${partCount + 1}`,
      sectionType: 'part'
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
      onClick={clearTextFormatting}
      title='Reset formatting'
      >
      <RemoveFormatting size={18} />
    </ToolbarButton>

    <div className={styles.divider}></div>

    <ToolbarButton 
      onClick={toggleParagraph}
      isActive={!isAnyHeadingActive && editor.isActive('paragraph')}
      title="Normal Text"
    >
      <Type size={18} />
    </ToolbarButton>

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
        isActive={editor.isActive('section', { sectionType: 'chapter' })}
        title="Insert Chapter"
      >
        <BookOpen size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={insertPart}
        isActive={editor.isActive('section', { sectionType: 'part' })}
        title="Insert Part"
      >
        <FileText size={18} />
      </ToolbarButton>
    </div>
  );
};