import { Editor } from '@tiptap/react';
import { useTextFormatting } from './useTextFormatting';
import { useListActions } from './useListActions';
import { useMediaActions } from './useMediaActions';
import { useDocumentStructure } from './useDocumentStructure';
import { documentService } from '../../../shared/database/database';
import { DEFAULT_EDITOR_CONTENT } from '../../../shared/constants/defaultContent';


export const useEditorActions = (
    editor: Editor, 
    currentDocumentId?: number, 
    setCurrentDocumentId?: (id: number | undefined) => void
  ) => {
  const textActions = useTextFormatting(editor);
  const listActions = useListActions(editor);
  const mediaActions = useMediaActions(editor);
  const structureActions = useDocumentStructure(editor);

  const deleteCurrentDocument = async () => {
    try {
      if (currentDocumentId) {
        await documentService.delete(currentDocumentId);
      }
      setCurrentDocumentId?.(undefined);
      editor?.commands.setContent(DEFAULT_EDITOR_CONTENT);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  // Centralized action dispatcher
  const actions = {
    toggleFormat: (format: string) => {
      const formatActions = {
        bold: textActions.toggleBold,
        italic: textActions.toggleItalic,
        underline: textActions.toggleUnderline,
      };
      formatActions[format as keyof typeof formatActions]?.();
    },
    clearFormatting: textActions.clearTextFormatting,
    toggleParagraph: textActions.toggleParagraph,
    toggleHeading: (level: number) => textActions.toggleHeading(level as 1 | 2 | 3),
    toggleBulletList: listActions.toggleBulletList,
    toggleOrderedList: listActions.toggleOrderedList,
    insertImageFromUrl: mediaActions.insertImageFromUrl,
    insertImageFromFile: mediaActions.insertImageFromFile,
    insertChapter: structureActions.insertChapter,
    insertPart: structureActions.insertPart,
    insertContainer: structureActions.insertContainer,
    insertNestedContainer: structureActions.insertNestedContainer,
    deleteCurrentDocument,
  };

  // Centralized active state checker
  const getActiveStates = () => ({
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
    paragraph: !textActions.isAnyHeadingActive && editor.isActive('paragraph'),
    h1: editor.isActive('heading', { level: 1 }),
    h2: editor.isActive('heading', { level: 2 }),
    h3: editor.isActive('heading', { level: 3 }),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
  });

  return { actions, getActiveStates };
};