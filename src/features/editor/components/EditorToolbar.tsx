import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, BookOpen, FileText, Box, Type, RemoveFormatting } from 'lucide-react';
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

  // Helper function to get the current chapter count for naming
  const getChapterCount = () => {
    const html = editor.getHTML();
    const sections = html.match(/<section[^>]*data-title="[^"]*"[^>]*>/g) || [];
    return sections.length;
  };

  // Helper function to get the current part count for naming
  const getPartCount = () => {
    const html = editor.getHTML();
    const sections = html.match(/<section[^>]*data-title="[^"]*"[^>]*>/g) || [];
    return sections.length;
  };

  // Helper function to get the current container count for naming
  const getContainerCount = () => {
    const html = editor.getHTML();
    const divs = html.match(/<div[^>]*data-title="[^"]*"[^>]*>/g) || [];
    return divs.length;
  };

  // Helper function to check if cursor is inside a chapter and get chapter info
  const getChapterContext = (): 
    | { isInChapter: false }
    | { isInChapter: true; chapterStart: number; chapterEnd: number; chapterSize: number } => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      if (node.type.name === 'section' && i === 1) {
        // We're inside a root-level section (chapter)
        const chapterStart = state.selection.$from.start(i);
        const chapterEnd = state.selection.$from.end(i);
        return { 
          isInChapter: true, 
          chapterStart: chapterStart - 1, // Adjust for node position
          chapterEnd: chapterEnd - 1,
          chapterSize: node.nodeSize 
        };
      }
    }
    return { isInChapter: false };
  };

  // Helper function to check if cursor is inside a part
  const isInsidePart = () => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      if (node.type.name === 'section' && i === 2) {
        return true; // We're inside a nested section (part)
      }
    }
    return false;
  };

  // Add Chapter - inserts after current chapter if inside one, otherwise at document end
  const insertChapter = () => {
    const chapterCount = getChapterCount() + 1;
    const chapterHtml = `<section id="chapter${chapterCount}" data-title="Chapter ${chapterCount}"><p>Chapter content goes here...</p></section>`;
    
    const chapterContext = getChapterContext();
    
    if (chapterContext.isInChapter) {
      // We're inside a chapter - insert after the current chapter
      const insertPos = chapterContext.chapterStart + chapterContext.chapterSize;
      
      editor.chain()
        .focus()
        .insertContentAt(insertPos, chapterHtml)
        .run();
    } else {
      // We're not inside any chapter - insert at document end
      const { state } = editor;
      const endPos = state.doc.content.size;
      
      editor.chain()
        .focus()
        .insertContentAt(endPos, chapterHtml)
        .run();
    }
  };
  
  // Add Part - only inserts inside chapters, never nested in other parts
  const insertPart = () => {
    const chapterContext = getChapterContext();
    
    if (!chapterContext.isInChapter) {
      alert('Parts can only be added inside chapters. Please position your cursor inside a chapter first.');
      return;
    }
    
    const partCount = getPartCount() + 1;
    const partHtml = `<section id="part${partCount}" data-title="Part ${partCount}"><p>Part content goes here...</p></section>`;
    
    if (isInsidePart()) {
      // We're inside a part - find the end of current part and insert after it
      const { state } = editor;
      let insertPos = state.selection.from;
      
      // Walk up to find the part we're in and get its end position
      for (let i = state.selection.$from.depth; i > 0; i--) {
        const node = state.selection.$from.node(i);
        if (node.type.name === 'section' && i === 2) {
          // Found the part we're in
          const partStart = state.selection.$from.start(i);
          const partSize = node.nodeSize;
          insertPos = partStart + partSize - 1; // Insert after this part
          break;
        }
      }
      
      editor.chain()
        .focus()
        .insertContentAt(insertPos, partHtml)
        .run();
    } else {
      // We're in a chapter but not in a part - insert at current position
      editor.chain()
        .focus()
        .insertContent(partHtml)
        .run();
    }
  };

  // Add Special Container - inserts a div element
  const insertContainer = () => {
    const containerCount = getContainerCount() + 1;
    editor.chain().focus().setSection({ 
      id: `container${containerCount}`,
      title: `Container ${containerCount}`,
      tagName: 'div'
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
        title="Add Chapter (root level)"
      >
        <BookOpen size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={insertPart}
        title="Add Part (section)"
      >
        <FileText size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={insertContainer}
        title="Add Special Container (div)"
      >
        <Box size={18} />
      </ToolbarButton>
    </div>
  );
};