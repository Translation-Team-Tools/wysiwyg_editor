// src/features/layout/components/CodePreview.tsx
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml'; // xml includes HTML
import 'highlight.js/styles/github-dark-dimmed.css'; // You can choose different themes
import styles from './CodePreview.module.css';

// Register languages
hljs.registerLanguage('html', html);
hljs.registerLanguage('xml', html);

export interface CodePreviewProps {
  code: string;
  language?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code, language = 'html' }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Clear any existing highlighting
      codeRef.current.removeAttribute('data-highlighted');
      codeRef.current.className = '';
      
      // Apply syntax highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <pre className={styles.codePreview} data-language={language}>
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodePreview;