// src/features/layout/ResizableLayout.tsx
import React from 'react';
import { useResizablePanels } from './hooks/useResizablePanels';
import NavigationPanel from './components/NavigationPanel';
import EditorPanel from './components/EditorPanel';
import OutputPanel from './components/OutputPanel';
import ResizeHandle from './components/ResizeHandle';
import styles from './ResizableLayout.module.css';

interface ResizableLayoutProps {
  content: string;
  setContent: (content: string) => void;
  formattedHtml: string;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  content,
  setContent,
  formattedHtml
}) => {
  const {
    leftPanelWidth,
    rightPanelWidth,
    containerRef,
    handleLeftMouseDown,
    handleRightMouseDown
  } = useResizablePanels();

  return (
    <div className={styles.layoutContainer} ref={containerRef}>
      <NavigationPanel width={leftPanelWidth} />
      
      <ResizeHandle onMouseDown={handleLeftMouseDown} />
      
      <EditorPanel 
        content={content}
        onChange={setContent}
      />
      
      <ResizeHandle onMouseDown={handleRightMouseDown} />
      
      <OutputPanel 
        width={rightPanelWidth}
        formattedHtml={formattedHtml}
      />
    </div>
  );
};

export default ResizableLayout;