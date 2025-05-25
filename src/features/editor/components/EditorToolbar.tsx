import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, BookOpen, FileText, Box, Square, Type, RemoveFormatting } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import styles from './EditorToolbar.module.css'

interface EditorToolbarProps {
  editor: Editor;
}

type ElementType = 'chapter' | 'part' | 'container';
type TagName = 'section' | 'div';

interface ElementConfig {
  tagName: TagName;
  idPrefix: string;
  titlePrefix: string;
  htmlPattern: RegExp;
  contentPlaceholder: string;
}

const ELEMENT_CONFIGS: Record<ElementType, ElementConfig> = {
  chapter: {
    tagName: 'section',
    idPrefix: 'chapter',
    titlePrefix: 'Chapter',
    htmlPattern: /<section[^>]*data-title="[^"]*"[^>]*>/g,
    contentPlaceholder: 'Chapter content goes here...'
  },
  part: {
    tagName: 'section',
    idPrefix: 'part',
    titlePrefix: 'Part',
    htmlPattern: /<section[^>]*data-title="[^"]*"[^>]*>/g,
    contentPlaceholder: 'Part content goes here...'
  },
  container: {
    tagName: 'div',
    idPrefix: 'container',
    titlePrefix: 'Container',
    htmlPattern: /<div[^>]*data-title="[^"]*"[^>]*>/g,
    contentPlaceholder: 'Container content goes here...'
  }
};

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

  // Generic function to count elements by type
  const getElementCount = (type: ElementType): number => {
    const html = editor.getHTML();
    const matches = html.match(ELEMENT_CONFIGS[type].htmlPattern) || [];
    return matches.length;
  };

  // Generic function to generate HTML for any element
  const generateElementHtml = (type: ElementType, count: number): string => {
    const config = ELEMENT_CONFIGS[type];
    const id = `${config.idPrefix}${count}`;
    const title = `${config.titlePrefix} ${count}`;
    return `<${config.tagName} id="${id}" data-title="${title}"><p>${config.contentPlaceholder}</p></${config.tagName}>`;
  };

  // Generic function to find element context at specific depth
  const getElementContext = (depth: number, tagName?: TagName): 
    | { found: false }
    | { found: true; start: number; end: number; size: number } => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      const isMatch = node.type.name === 'section' && 
                      i === depth && 
                      (!tagName || node.attrs.tagName === tagName);
      
      if (isMatch) {
        const start = state.selection.$from.start(i);
        const end = state.selection.$from.end(i);
        return {
          found: true,
          start: start - 1,
          end: end - 1,
          size: node.nodeSize
        };
      }
    }
    return { found: false };
  };

  // Generic function to find end position of current element at depth
  const findElementEndPosition = (depth: number, tagName?: TagName): number | null => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      const isMatch = node.type.name === 'section' && 
                      i === depth && 
                      (!tagName || node.attrs.tagName === tagName);
      
      if (isMatch) {
        const start = state.selection.$from.start(i);
        return start + node.nodeSize - 1;
      }
    }
    return null;
  };

  // Generic insertion helper
  const insertElement = (html: string, position?: number) => {
    const chain = editor.chain().focus();
    if (position !== undefined) {
      chain.insertContentAt(position, html);
    } else {
      chain.insertContent(html);
    }
    chain.run();
  };

  // Context checkers using generic helper
  const getChapterContext = () => getElementContext(1);
  const isInsidePart = () => getElementContext(2).found;
  const isInsideContainer = () => getElementContext(2, 'div').found || getElementContext(3, 'div').found || getElementContext(4, 'div').found;
  const canInsertContainer = () => isInsidePart() || isInsideContainer();

  // Insert Chapter - smart positioning
  const insertChapter = () => {
    const count = getElementCount('chapter') + 1;
    const html = generateElementHtml('chapter', count);
    const chapterContext = getChapterContext();
    
    if (chapterContext.found) {
      // Insert after current chapter
      const insertPos = chapterContext.start + chapterContext.size;
      insertElement(html, insertPos);
    } else {
      // Insert at document end
      const { state } = editor;
      const endPos = state.doc.content.size;
      insertElement(html, endPos);
    }
  };

  // Insert Part - smart positioning within chapters
  const insertPart = () => {
    const chapterContext = getChapterContext();
    
    if (!chapterContext.found) {
      alert('Parts can only be added inside chapters. Please position your cursor inside a chapter first.');
      return;
    }
    
    const count = getElementCount('part') + 1;
    const html = generateElementHtml('part', count);
    
    if (isInsidePart()) {
      // Insert after current part
      const insertPos = findElementEndPosition(2);
      if (insertPos) {
        insertElement(html, insertPos);
      } else {
        insertElement(html);
      }
    } else {
      // Insert at current position within chapter
      insertElement(html);
    }
  };

  // Insert Container - smart sibling positioning
  const insertContainer = () => {
    if (!canInsertContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount('container') + 1;
    const html = generateElementHtml('container', count);
    
    if (isInsideContainer()) {
      // Find the deepest container and insert after it
      let insertPos = null;
      for (let depth = 2; depth <= 6; depth++) { // Check reasonable depths
        const pos = findElementEndPosition(depth, 'div');
        if (pos) {
          insertPos = pos;
          break;
        }
      }
      
      if (insertPos) {
        insertElement(html, insertPos);
      } else {
        insertElement(html);
      }
    } else {
      // Insert at current position within part
      insertElement(html);
    }
  };

  // Insert Nested Container - always nest at cursor
  const insertNestedContainer = () => {
    if (!canInsertContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount('container') + 1;
    const html = generateElementHtml('container', count);
    insertElement(html);
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