// src/features/layout/components/NavigationPanel.tsx
import React from 'react';
import styles from './NavigationPanel.module.css';

export interface NavigationPanelProps {
  width: number;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ width }) => {
  return (
    <div 
      className={styles.navigationPanel} 
      style={{ width: `${width}px` }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Navigation</h2>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="#editor" className={styles.navLink}>file1</a>
          </li>
          <li className={styles.navItem}>
            <a href="#output" className={styles.navLink}>file 2</a>
          </li>
          <li className={styles.navItem}>
            <a href="#settings" className={styles.navLink}>file 3</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationPanel;