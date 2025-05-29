import { Editor } from '@tiptap/react';

export const useMediaActions = (editor: Editor) => {
  const insertImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          localStorage.setItem(`image_${file.name}`, base64Data);
          editor.chain().focus().setImage({ 
            src: `local:${file.name}`,
            alt: file.name.split('.')[0]
          }).run();
        };
        reader.readAsDataURL(file);
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