import { Editor } from '@tiptap/react';

export const useListActions = (editor: Editor) => {
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const sinkListItem = () => editor.chain().focus().sinkListItem('listItem').run();
  const liftListItem = () => editor.chain().focus().liftListItem('listItem').run();

  return {
    toggleBulletList,
    toggleOrderedList,
    sinkListItem,
    liftListItem,
  };
};