// src/App.tsx
import React, {useEffect} from 'react';
import { imageService } from './shared/database/';
import ResizableLayout from './features/layout/ResizableLayout.tsx';
import { useEditorContent } from './shared/hooks/useEditorContent';
import styles from './App.module.css';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Give database time to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        // Clean up any existing orphaned images on startup
        const deletedCount = await imageService.cleanupOrphaned();
        if (deletedCount > 0) {
          console.log(`Cleaned up ${deletedCount} orphaned images on startup`);
        }
      } catch (error) {
        console.error('Startup cleanup failed:', error);
      }
    };
    
    initApp();
  }, []);

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