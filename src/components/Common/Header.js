import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <h1 className={styles.title}>QCC & QIT <span>Attendance</span></h1>
          <p className={styles.subtitle}>Judge & Employee Registry</p>
        </div>
        <div className={styles.statusBadge}>
          <div className={styles.dot}></div>
          Live Portal
        </div>
      </div>
    </header>
  );
};

export default Header;