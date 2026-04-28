import React from 'react';
import styles from './Header.module.css';
import logo from '../assets/logo.png'; // Ensure path to your logo is correct

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          {/* Logo added here */}
          <img src={logo} alt="Company Logo" className={styles.logo} />
          
          <div className={styles.textWrapper}>
            <h1 className={styles.title}>
              QCC & QIT <span>Attendance</span>
            </h1>
            <p className={styles.subtitle}>Judge & Employee Registry</p>
          </div>
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
