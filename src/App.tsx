import React from 'react';
import BaseEditor from './features/editor';
import { useEditorContent } from './shared/hooks/useEditorContent.ts';
import styles from './App.module.css';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();

  return (
    <div className={`container ${styles.appContainer}`}>
      <h1 className={styles.title}>Editor</h1>
      
      <BaseEditor 
        content={content} 
        onChange={(newContent) => {
          setContent(newContent);
          console.log('Content updated:', newContent);
        }} 
      />
      
      <div className={styles.htmlOutput}>
        <h2 className={styles.htmlOutputTitle}>HTML Output:</h2>
        <pre className={styles.htmlOutputCode}>
          {formattedHtml}
        </pre>
      </div>
    </div>
  );
};

export default App;