import { Editor } from '@tiptap/react';

export const useDocumentStructure = (editor: Editor) => {
  // Unified counting function
  const getElementCount = (pattern: RegExp): number => {
    const html = editor.getHTML();
    return (html.match(pattern) || []).length;
  };

  // Unified HTML generation
  const createElementHtml = (tag: string, id: string, title: string, content: string): string => {
    return `<${tag} id="${id}" data-toc-title="${title}"><p>${content}</p></${tag}>`;
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

  // Helper to find the deepest container depth
  const getDeepestContainerDepth = (): number | undefined => {
    const { state } = editor;
    for (let i = state.selection.$from.depth; i > 0; i--) {
      const node = state.selection.$from.node(i);
      if (node.type.name === 'section' && node.attrs.tagName === 'div') {
        return i;
      }
    }
    return undefined;
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

  // Structure insertion functions
  const insertChapter = () => {
    const count = getElementCount(/<section[^>]*data-toc-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('section', `chapter${count}`, `Chapter ${count}`, 'Chapter content goes here...');
    
    const chapter = getElementAt(1);
    const insertPos = chapter.found ? chapter.start + chapter.size : editor.state.doc.content.size;
    insertAt(html, insertPos);
  };

  const insertPart = () => {
    if (!isInChapter()) {
      alert('Parts can only be added inside chapters. Please position your cursor inside a chapter first.');
      return;
    }
    
    const count = getElementCount(/<section[^>]*data-toc-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('section', `part${count}`, `Part ${count}`, 'Part content goes here...');
    
    const insertPos = isInPart() ? findEndAt(2) : undefined;
    insertAt(html, insertPos);
  };

  const insertContainer = () => {
    if (!isInPart() && !isInContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount(/<div[^>]*data-toc-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('div', `container${count}`, `Container ${count}`, 'Container content goes here...');
    
    let insertPos: number | undefined = undefined;
    if (isInContainer()) {
      const deepestDepth = getDeepestContainerDepth();
      if (deepestDepth !== undefined) {
        insertPos = findEndAt(deepestDepth, 'div');
      }
    }
    insertAt(html, insertPos);
  };

  const insertNestedContainer = () => {
    if (!isInPart() && !isInContainer()) {
      alert('Special containers can only be added inside parts or other containers. Please position your cursor inside a part or container first.');
      return;
    }

    const count = getElementCount(/<div[^>]*data-toc-title="[^"]*"[^>]*>/g) + 1;
    const html = createElementHtml('div', `container${count}`, `Container ${count}`, 'Container content goes here...');
    insertAt(html);
  };

  return {
    insertChapter,
    insertPart,
    insertContainer,
    insertNestedContainer,
  };
};