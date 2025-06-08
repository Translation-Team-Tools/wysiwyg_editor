import { useEditor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { SectionExtension } from '../extensions';
import { ImageExtension } from '../extensions';
import { documentService } from '../../../shared/database/database';

interface UseBaseEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const useBaseEditor = ({ content, onChange }: UseBaseEditorProps) => {
  const [currentDocumentId, setCurrentDocumentId] = useState<number | undefined>();
  const autoSaveTimeoutRef = useRef<number | undefined>(undefined);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      SectionExtension,
      ImageExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      // Keep existing functionality for other parts of your app
      onChange(editor.getHTML());
      
      // Database auto-save
      clearTimeout(autoSaveTimeoutRef.current);
      
      autoSaveTimeoutRef.current = setTimeout(async () => {
        const content = editor.getJSON();
        const title = 'Untitled';
        
        if (currentDocumentId) {
          await documentService.update(currentDocumentId, { title, content });
        } else {
          const newId = await documentService.create({ title, content });
          setCurrentDocumentId(newId);
        }
      }, 1000);
    },
    editorProps: {
      handleKeyDown: (view, event): boolean => {
        if (!editor) return false;
        
        if (event.key === 'Tab') {
          if (editor.isActive('listItem')) {
            if (event.shiftKey) {
              return editor.chain().focus().liftListItem('listItem').run();
            } else {
              return editor.chain().focus().sinkListItem('listItem').run();
            }
          }
        }
        return false;
      },
    },
  });

  const loadDocument = async (documentId?: number) => {
    try {
      let documentToLoad;
      
      if (documentId) {
        // Load specific document
        documentToLoad = await documentService.getById(documentId);
      } else {
        // Load first/most recent document
        const allDocuments = await documentService.getAll();
        documentToLoad = allDocuments[0];
      }
      
      if (documentToLoad && editor) {
        setCurrentDocumentId(documentToLoad.id);
        editor.commands.setContent(documentToLoad.content);
        // Don't trigger onChange here to avoid auto-save loop
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  };

  useEffect(() => {
    if (editor) {
      loadDocument(); // Load first document on startup
    }
  }, [editor]);

  return editor;
};