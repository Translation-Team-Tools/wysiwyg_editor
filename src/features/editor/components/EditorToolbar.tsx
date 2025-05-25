import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, BookOpen, FileText, Box, Square, Type, RemoveFormatting } from 'lucide-react';
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

  // Unified counting function
  const getElementCount = (pattern: RegExp): number => {
    const html = editor.getHTML();
    return (html.match(pattern) || []).length;
  };

  // Unified HTML generation
  const createElementHtml = (tag: string, id: string, title: string, content: string): string => {
    return `<${tag} id="${id}" data-title="${title}"><p>${content}</p></${tag}>`;
  };

  // Generic insertion helper
  const insertAt = (html: string, position?: number) => {
    const chain = editor.chain().focus();
    position !== undefined ? chain.insertContentAt(position, html) : chain.insertContent(html);
    chain.run();
  };

  // Helper to find element context at depth
  const getElementAt = (depth: number, tagName?: string): 
    | { found: false }
    | { found: true; start: number; size: number } => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      if (node.type.name === 'section' && i === depth && (!tagName || node.attrs.tagName === tagName)) {
        const start = state.selection.$from.start(i) - 1;
        return { found: true, start, size: node.nodeSize };
      }
    }
    return { found: false };
  };

  // Helper to find end position of element at depth
  const findEndAt = (depth: number, tagName?: string): number | undefined => {
    const element = getElementAt(depth, tagName);
    return element.found ? element.start + element.size : undefined;
  };

  // Context checkers
  const isInChapter = () => getElementAt(1).found;
  const isInPart = () => getElementAt(2).found;
  const isInContainer = () => getElementAt(2, 'div').found || getElementAt(3, 'div').found || getElementAt(4, 'div').found;

  // Insert Chapter
  const insertChapter = () => {
    const count = getElementCount(/<section[^>]*data-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('section', `chapter${count}`, `Chapter ${count}`, 'Chapter content goes here...');
    
    const chapter = getElementAt(1);
    const insertPos = chapter.found ? chapter.start + chapter.size : editor.state.doc.content.size;
    insertAt(html, insertPos);
  };

  // Insert Part
  const insertPart = () => {
    if (!isInChapter()) {
      alert('Parts can only be added inside chapters. Please position your cursor inside a chapter first.');
      return;
    }
    
    const count = getElementCount(/<section[^>]*data-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('section', `part${count}`, `Part ${count}`, 'Part content goes here...');
    
    const insertPos = isInPart() ? findEndAt(2) : undefined;
    insertAt(html, insertPos);
  };

  // Insert Container (sibling)
  const insertContainer = () => {
    if (!isInPart() && !isInContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount(/<div[^>]*data-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('div', `container${count}`, `Container ${count}`, 'Container content goes here...');
    
    let insertPos: number | undefined = undefined;
    if (isInContainer()) {
      // Find deepest container and insert after it
      for (let depth = 2; depth <= 5; depth++) {
        const pos = findEndAt(depth, 'div');
        if (pos !== undefined) { 
          insertPos = pos; 
          break; 
        }
      }
    }
    insertAt(html, insertPos);
  };

  // Insert Nested Container
  const insertNestedContainer = () => {
    if (!isInPart() && !isInContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount(/<div[^>]*data-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('div', `container${count}`, `Container ${count}`, 'Container content goes here...');
    insertAt(html);
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
        title="Add Container (as sibling)"
      >
        <Box size={18} />
      </ToolbarButton>

      <ToolbarButton 
        onClick={insertNestedContainer}
        title="Add Nested Container (inside current)"
      >
        <Square size={18} />
      </ToolbarButton>
    </div>
  );
};