import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, 
         Type, RemoveFormatting, List, ListOrdered, Image, Upload, BookOpen, FileText, Box, Square, Trash2 } from 'lucide-react';

export interface ButtonConfig {
  id: string;
  icon: React.ComponentType<{ size: number }>;
  title: string;
  action: string;
  data?: any;
}

export const TOOLBAR_CONFIG = {
  formatting: [
    { id: 'bold', icon: Bold, title: 'Bold', action: 'toggleFormat', data: 'bold' },
    { id: 'italic', icon: Italic, title: 'Italic', action: 'toggleFormat', data: 'italic' },
    { id: 'underline', icon: UnderlineIcon, title: 'Underline', action: 'toggleFormat', data: 'underline' },
    { id: 'clear', icon: RemoveFormatting, title: 'Reset formatting', action: 'clearFormatting' },
  ],
  
  headings: [
    { id: 'paragraph', icon: Type, title: 'Normal Text', action: 'toggleParagraph' },
    { id: 'h1', icon: Heading1, title: 'Heading 1', action: 'toggleHeading', data: 1 },
    { id: 'h2', icon: Heading2, title: 'Heading 2', action: 'toggleHeading', data: 2 },
    { id: 'h3', icon: Heading3, title: 'Heading 3', action: 'toggleHeading', data: 3 },
  ],
  
  lists: [
    { id: 'bulletList', icon: List, title: 'Bullet List', action: 'toggleBulletList' },
    { id: 'orderedList', icon: ListOrdered, title: 'Numbered List', action: 'toggleOrderedList' },
  ],
  
  media: [
    { id: 'imageUrl', icon: Image, title: 'Insert Image from URL', action: 'insertImageFromUrl' },
    { id: 'imageFile', icon: Upload, title: 'Upload Image File', action: 'insertImageFromFile' },
  ],
  
  structure: [
    { id: 'chapter', icon: BookOpen, title: 'Add Chapter (root level)', action: 'insertChapter' },
    { id: 'part', icon: FileText, title: 'Add Part (section)', action: 'insertPart' },
    { id: 'container', icon: Box, title: 'Add Container (as sibling)', action: 'insertContainer' },
    { id: 'nestedContainer', icon: Square, title: 'Add Nested Container (inside current)', action: 'insertNestedContainer' },
  ],
  document: [
    { id: 'deleteAndNew', icon: Trash2, title: 'Delete Document & Create New', action: 'deleteCurrentDocument' },
  ],
};