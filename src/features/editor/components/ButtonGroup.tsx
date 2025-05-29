import React from 'react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from './ToolbarButton';
import { ButtonConfig } from '../config/toolbarConfig';

interface ButtonGroupProps {
  buttons: ButtonConfig[];
  editor: Editor;
  actions: Record<string, (data?: any) => void>;
  activeStates: Record<string, boolean>;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, editor, actions, activeStates }) => {
  return (
    <>
      {buttons.map(({ id, icon: Icon, title, action, data }) => (
        <ToolbarButton
          key={id}
          onClick={() => actions[action]?.(data)}
          isActive={activeStates[id] || false}
          title={title}
        >
          <Icon size={18} />
        </ToolbarButton>
      ))}
    </>
  );
};