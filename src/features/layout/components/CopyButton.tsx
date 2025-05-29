// src/features/layout/components/CopyButton.tsx
import React from 'react';
import { Copy } from 'lucide-react';
import { useClipboard } from '../../../shared/hooks/useClipboard';
import styles from './CopyButton.module.css';

export interface CopyButtonProps {
  text: string;
  isVisible?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, isVisible = true }) => {
  const { copyToClipboard, showCopiedMessage } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(text);
  };

  return (
    <>
      <button 
        className={`${styles.copyButton} ${isVisible ? styles.visible : styles.hidden}`}
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        <Copy size={16} />
      </button>
      {showCopiedMessage && (
        <div className={styles.copiedMessage}>
          Copied!
        </div>
      )}
    </>
  );
};

export default CopyButton;