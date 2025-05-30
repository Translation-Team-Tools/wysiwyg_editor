import { useState, useEffect } from 'react';
import { formatHtml } from '../utils/htmlFormatter';

const cleanHtmlForDisplay = (html: string): string => {
  return html.replace(/\s*data-section-type="[^"]*"/g, '');
};

export const useEditorContent = (initialContent: string = '<section id="prologue" data-toc-title="Prologue" data-section-type="chapter"><section id="prologue_intro" data-toc-title="Intro" data-section-type="part"><p></p></section></section>') => {
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