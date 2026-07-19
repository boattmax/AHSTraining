"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [idCard, setIdCard] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        idCard,
        dob,
        redirect: false,
      });

      if (res?.error) {
        setError('หมายเลขบัตรประชาชนหรือวันเกิดไม่ถูกต้อง');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h1 className={styles.title}>เข้าสู่ระบบ</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="idCard">หมายเลขบัตรประชาชน</label>
            <input 
              type="text" 
              id="idCard" 
              value={idCard} 
              maxLength={13}
              onChange={(e) => setIdCard(e.target.value)} 
              placeholder="ไม่ต้องเติมขีด"
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="dob">วัน/เดือน/ปีเกิด (พ.ศ.)</label>
            <input 
              type="text" 
              id="dob" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              placeholder="ตัวอย่าง 01/01/2510"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>หรือ</span>
        </div>
        
        <button onClick={handleGoogleLogin} className={`btn btn-secondary ${styles.googleBtn}`}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          เข้าสู่ระบบด้วย Google
        </button>
        
        <p className={styles.footerText}>
          ยังไม่มีบัญชีใช่ไหม? <Link href="/register" className={styles.link}>สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
}
