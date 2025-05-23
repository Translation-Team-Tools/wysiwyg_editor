import React from 'react';
import BaseEditor from './features/editor/BaseEditor';
import { useEditorContent } from './shared/hooks/useEditorContent.ts';

const App: React.FC = () => {
  const { content, setContent, formattedHtml } = useEditorContent();

  return (
    <div className="editor-container container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Editor</h1>
      
      <BaseEditor 
        content={content} 
        onChange={(newContent) => {
          setContent(newContent);
          console.log('Content updated:', newContent);
        }} 
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-2">HTML Output:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 text-sm font-mono">
          {formattedHtml}
        </pre>
      </div>
    </div>
  );
};

export default App;