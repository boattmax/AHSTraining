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

        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.navLink}>หน้าแรก</Link></li>
          <li><Link href="/#courses" className={styles.navLink}>สำรวจหลักสูตร</Link></li>
          {session ? (
            <>
              <li><Link href="/dashboard" className={styles.navLink}>ห้องเรียนของฉัน</Link></li>
              {session.user?.role === 'ADMIN' && (
                <li><Link href="/admin" className={styles.navLink}>ผู้ดูแลระบบ</Link></li>
              )}
              <li><Link href="/api/auth/signout" className="btn btn-secondary">ออกจากระบบ</Link></li>
            </>
          ) : (
            <li><Link href="/login" className="btn btn-primary">เข้าสู่ระบบ</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
