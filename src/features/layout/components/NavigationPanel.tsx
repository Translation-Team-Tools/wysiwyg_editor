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
            <a href="#prologue" className={styles.navLink}>Prologue</a>
          </li>
          <li className={styles.navItem}>
            <a href="#chapter1" className={styles.navLink}>Chapter 1</a>
          </li>
          <li className={styles.navItem}>
            <a href="#chapter2" className={styles.navLink}>Chapter 2</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationPanel;