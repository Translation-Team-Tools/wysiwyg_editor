// src/features/layout/components/OutputPanel.tsx
import React, { useState } from 'react';
import CopyButton from './CopyButton';
import CodePreview from './CodePreview';
import styles from './OutputPanel.module.css';

export interface OutputPanelProps {
  width: number;
  formattedHtml: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ width, formattedHtml }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={styles.outputPanel}
      style={{ width: `${width}px` }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>HTML Output</h2>
      </div>
      <div className={styles.content}>
        <div 
          className={styles.outputContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.codeContainer}>
            <CopyButton text={formattedHtml} isVisible={isHovered} />
            <CodePreview code={formattedHtml} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;