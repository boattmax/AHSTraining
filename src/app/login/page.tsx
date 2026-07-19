"use client";

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import styles from './page.module.css';

function LoginContent() {
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');
  
  // Show error from URL if present
  let initialError = '';
  if (authError === 'OAuthAccountNotLinked') {
    initialError = 'อีเมลนี้ถูกใช้งานแล้ว';
  } else if (authError) {
    initialError = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google (' + authError + ')';
  }
  
  const [error] = useState(initialError);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h1 className={styles.title}>เข้าสู่ระบบ</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          เข้าสู่ระบบเพื่อเข้าเรียนและรับเกียรติบัตรออนไลน์
        </p>
        
        <button onClick={handleGoogleLogin} className={`btn btn-secondary ${styles.googleBtn}`}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          เข้าสู่ระบบด้วย Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
