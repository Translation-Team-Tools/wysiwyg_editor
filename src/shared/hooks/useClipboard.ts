// src/shared/hooks/useClipboard.ts
import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 1000);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 1000);
    }
  }, []);

  return {
    copyToClipboard,
    showCopiedMessage
  };
};