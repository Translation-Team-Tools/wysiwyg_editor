import React from 'react';
import { Editor } from '@tiptap/react';
import { ButtonGroup } from './ButtonGroup';
import { ToolbarSection } from './ToolbarSection';
import { useEditorActions } from '../hooks/useEditorActions';
import { TOOLBAR_CONFIG } from '../config/toolbarConfig';
import styles from './EditorToolbar.module.css';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const { actions, getActiveStates } = useEditorActions(editor);
  const activeStates = getActiveStates();

  return (
    <div className={styles.toolbar}>
      <ToolbarSection>
        <ButtonGroup buttons={TOOLBAR_CONFIG.formatting} editor={editor} actions={actions} activeStates={activeStates} />
      </ToolbarSection>

      <ToolbarSection>
        <ButtonGroup buttons={TOOLBAR_CONFIG.headings} editor={editor} actions={actions} activeStates={activeStates} />
      </ToolbarSection>

      <ToolbarSection>
        <ButtonGroup buttons={TOOLBAR_CONFIG.lists} editor={editor} actions={actions} activeStates={activeStates} />
      </ToolbarSection>

      {/* <ToolbarSection>
        <ButtonGroup buttons={TOOLBAR_CONFIG.media} editor={editor} actions={actions} activeStates={activeStates} />
      </ToolbarSection> */}

      <ToolbarSection showDivider={false}>
        <ButtonGroup buttons={TOOLBAR_CONFIG.structure} editor={editor} actions={actions} activeStates={activeStates} />
      </ToolbarSection>
    </div>
  );
};
