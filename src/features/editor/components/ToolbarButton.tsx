import React from 'react';
import styles from './css/ToolbatButton.module.css'

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive = false, 
  children,
  title 
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={styles.button}
      type="button"
    >
      {children}
    </button>
  );
};