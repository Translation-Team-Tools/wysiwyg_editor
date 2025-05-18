import React, { useState, useEffect } from 'react';
import BaseEditor from './features/editor/BaseEditor';

const App: React.FC = () => {
  const [content, setContent] = useState('<p>Hello World! This is a TipTap editor.</p>');
  const [formattedHtml, setFormattedHtml] = useState('');

  // Format HTML function
  const formatHtml = (html: string) => {
    const tab = '  ';
    let result = '';
    let indent = 0;

    html.split(/>[\s\r\n]*</).forEach(element => {
      if (element.match(/^\/\w/)) {
        indent--;
      }

      result += tab.repeat(indent < 0 ? 0 : indent) + '<' + element + '>\n';

      if (element.match(/^<?\w[^>]*[^\/>]$/) && !element.startsWith('input') && !element.match(/br/i)) {
        indent++;
      }
    });

    return result.substring(1, result.length - 2);
  };

  // Update formatted HTML whenever content changes
  useEffect(() => {
    setFormattedHtml(formatHtml(content));
  }, [content]);

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
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 text-sm font-mono">
          {formattedHtml}
        </pre>
      </div>
    </div>
  );
};

export default App;