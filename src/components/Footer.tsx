import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <p>&copy; {new Date().getFullYear()} AHSTraining. สงวนลิขสิทธิ์</p>
      </div>
    </footer>
  );
}
