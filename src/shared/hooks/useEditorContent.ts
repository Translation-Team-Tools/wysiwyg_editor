import { useState, useEffect } from 'react';
import { formatHtml } from '../utils/htmlFormatter';

export const useEditorContent = (initialContent: string = '<p>Hello World! This is a TipTap editor.</p>') => {
  const [content, setContent] = useState(initialContent);
  const [formattedHtml, setFormattedHtml] = useState('');

  useEffect(() => {
    setFormattedHtml(formatHtml(content));
  }, [content]);

  return {
    content,
    setContent,
    formattedHtml
  };
};