import { Editor } from '@tiptap/react';
import { imageService } from '../../../shared/database/database';

export const useMediaActions = (editor: Editor, currentDocumentId?: number) => {
  const insertImageFromFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imageId = await imageService.create({
              blob: file,
              documentId: currentDocumentId
            });
          
          editor.chain().focus().setImage({ 
            src: `db:${imageId}`,
            alt: file.name.split('.')[0]
          }).run();
        } catch (error) {
          console.error('Failed to save image:', error);
          alert('Failed to save image');
        }
      }
    };
    input.click();
  };

  const insertImageFromUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      try {
        new URL(url);
        editor.chain().focus().setImage({ src: url.trim() }).run();
      } catch {
        alert('Please enter a valid URL');
      }
    }
  };

  return {
    insertImageFromFile,
    insertImageFromUrl,
  };
};