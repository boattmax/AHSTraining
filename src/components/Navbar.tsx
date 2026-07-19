import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from './Navbar.module.css';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className="text-gradient">AHS</span>Training
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>หน้าหลัก</Link>
          
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className={styles.navLink}>จัดการระบบ</Link>
              )}
              <Link href="/dashboard" className={styles.navLink}>ห้องอบรม</Link>
              <Link href="/profile" className={styles.navLink}>ข้อมูลส่วนตัว</Link>
              <a href="/api/auth/signout" className="btn btn-secondary">ออกจากระบบ</a>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">เข้าสู่ระบบ</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
