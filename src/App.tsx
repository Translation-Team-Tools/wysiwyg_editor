// src/App.tsx
import React from 'react';
import ResizableLayout from './features/layout/ResizableLayout.tsx';
import { useEditorContent } from './shared/hooks/useEditorContent';
import styles from './App.module.css';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();

  return (
    <div className={styles.appContainer}>
      <ResizableLayout 
        content={content}
        setContent={setContent}
        formattedHtml={formattedHtml}
      />
    </div>
  );
};

export default App;