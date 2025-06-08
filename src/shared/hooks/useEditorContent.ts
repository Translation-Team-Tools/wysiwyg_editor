import { useState, useEffect } from 'react';
import { formatHtml } from '../utils/htmlFormatter';
import { DEFAULT_EDITOR_CONTENT } from '../../shared/constants/defaultContent';


const cleanHtmlForDisplay = (html: string): string => {
  return html.replace(/\s*data-section-type="[^"]*"/g, '');
};

export const useEditorContent = (initialContent: string = DEFAULT_EDITOR_CONTENT) => {
  const [content, setContent] = useState(initialContent);
  const [formattedHtml, setFormattedHtml] = useState('');

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