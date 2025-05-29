// src/features/layout/components/CodePreview.tsx
import React from 'react';
import styles from './CodePreview.module.css';

export interface CodePreviewProps {
  code: string;
  language?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code, language = 'html' }) => {
  return (
    <pre className={styles.codePreview} data-language={language}>
      <code>{code}</code>
    </pre>
  );
};

export default CodePreview;