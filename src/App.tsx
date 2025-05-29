import React, { useState, useCallback, useRef } from 'react';
import BaseEditor from './features/editor';
import { useEditorContent } from './shared/hooks/useEditorContent.ts';
import styles from './App.module.css';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();
  
  // Panel widths state
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  
  // Refs for tracking drag state
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle left panel resize
  const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingLeft.current = true;
    e.preventDefault();
  }, []);

  // Handle right panel resize
  const handleRightMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRight.current = true;
    e.preventDefault();
  }, []);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    if (isDraggingLeft.current) {
      const newLeftWidth = e.clientX - containerRect.left;
      const minWidth = 200;
      const maxWidth = containerWidth - rightPanelWidth - 400; // Leave space for middle and right panels
      
      setLeftPanelWidth(Math.max(minWidth, Math.min(maxWidth, newLeftWidth)));
    }
    
    if (isDraggingRight.current) {
      const newRightWidth = containerRect.right - e.clientX;
      const minWidth = 300;
      const maxWidth = containerWidth - leftPanelWidth - 400; // Leave space for left and middle panels
      
      setRightPanelWidth(Math.max(minWidth, Math.min(maxWidth, newRightWidth)));
    }
  }, [leftPanelWidth, rightPanelWidth]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    isDraggingLeft.current = false;
    isDraggingRight.current = false;
  }, []);

  // Add event listeners for mouse events
  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.appContainer} ref={containerRef}>
      {/* Left Panel - Navigation Sidebar */}
      <div 
        className={styles.leftPanel} 
        style={{ width: `${leftPanelWidth}px` }}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Navigation</h2>
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

      {/* Left Resize Handle */}
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleLeftMouseDown}
      />

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

      {/* Right Resize Handle */}
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleRightMouseDown}
      />

      {/* Right Panel - HTML Output */}
      <div 
        className={styles.rightPanel}
        style={{ width: `${rightPanelWidth}px` }}
      >
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