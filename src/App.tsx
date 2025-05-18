import React, { useState } from 'react';
import BaseEditor from './features/editor/BaseEditor';

const App: React.FC = () => {
  const [content, setContent] = useState('<p>Hello World! This is a TipTap editor.</p>');

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">WYSIWYG Editor</h1>
      
      <BaseEditor 
        content={content} 
        onChange={(newContent) => {
          setContent(newContent);
          console.log('Content updated:', newContent);
        }} 
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-2">HTML Output:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default App;