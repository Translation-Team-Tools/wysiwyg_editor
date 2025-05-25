import React from 'react';
import styles from './ToolbarButton.module.css'

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
      className={`${styles.button} ${isActive ? styles.active : ''}`}
      type="button"
    >
      {children}
    </button>
  );
};