import React from 'react';
import styles from './EditorToolbar.module.css';

interface ToolbarSectionProps {
  children: React.ReactNode;
  showDivider?: boolean;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({ children, showDivider = true }) => (
  <>
    {children}
    {showDivider && <div className={styles.divider} />}
  </>
);