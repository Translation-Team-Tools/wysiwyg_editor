import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { formatHtml } from '../utils/htmlFormatter';
import { DEFAULT_EDITOR_CONTENT } from '../../shared/constants/defaultContent';


const cleanHtmlForDisplay = (html: string): string => {
  return html.replace(/\s*data-section-type="[^"]*"/g, '');
};

export const useEditorContent = (initialContent: string = DEFAULT_EDITOR_CONTENT, editor?: Editor) => {
  const [content, setContent] = useState(initialContent);
  const [formattedHtml, setFormattedHtml] = useState('');

  useEffect(() => {
    if (!editor) return;

    const updateContent = () => {
      const html = editor.getHTML();
      setContent(html);
    };

    // Listen to all editor updates
    editor.on('update', updateContent);
    editor.on('transaction', updateContent); // Catches programmatic changes

    // Initial update
    updateContent();

    return () => {
      editor.off('update', updateContent);
      editor.off('transaction', updateContent);
    };
  }, [editor]);

  useEffect(() => {
    const cleanedHtml = cleanHtmlForDisplay(content);
    setFormattedHtml(formatHtml(cleanedHtml));
  }, [content]);

  return {
    content,
    setContent,
    formattedHtml
  };
};