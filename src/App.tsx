import React from 'react';
import BaseEditor from './features/editor';
import { useEditorContent } from './shared/hooks/useEditorContent.ts';
import styles from './App.module.css';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();

  return (
    <div className={styles.appContainer}>
      {/* Left Panel - Navigation Sidebar */}
      <div className={styles.leftPanel}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Navigation (placeholder)</h2>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#editor" className={styles.navLink}>file1 </a>
            </li>
            <li className={styles.navItem}>
              <a href="#output" className={styles.navLink}>file 2</a>
            </li>
            <li className={styles.navItem}>
              <a href="#settings" className={styles.navLink}>file 3</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Middle Panel - Editor */}
      <div className={styles.middlePanel}>
        <div className={styles.editorHeader}>
          <h1 className={styles.title}>Editor</h1>
        </div>
        <div className={styles.editorContent}>
          <BaseEditor 
            content={content} 
            onChange={(newContent) => {
              setContent(newContent);
              console.log('Content updated:', newContent);
            }} 
          />
        </div>
      </div>

      {/* Right Panel - HTML Output */}
      <div className={styles.rightPanel}>
        <div className={styles.outputHeader}>
          <h2 className={styles.htmlOutputTitle}>HTML Output</h2>
        </div>
        <div className={styles.outputContent}>
          <pre className={styles.htmlOutputCode}>
            {formattedHtml}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;