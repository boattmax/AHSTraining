"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../login/page.module.css'; 

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  
  const [formData, setFormData] = useState({
    title: 'นาย',
    dob: '',
    idCard: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If session is still loading, return a loader
  if (session === undefined) return <div style={{ padding: '2rem', textAlign: 'center' }}>กำลังตรวจสอบข้อมูล...</div>;

  // If not logged in, they shouldn't be here (middleware should block this anyway)
  if (session === null) {
    router.push('/login');
    return null;
  }

  // If already completed
  if ((session.user as any)?.hasCompletedProfile) {
    router.push('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Update the session to reflect the completed profile
        await update({ hasCompletedProfile: true });
        router.push('/dashboard');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`} style={{ maxWidth: '600px' }}>
        <h1 className={styles.title} style={{ fontSize: '1.5rem' }}>กรุณากรอกข้อมูลให้ครบถ้วน</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          เพื่อสิทธิประโยชน์ในการรับเกียรติบัตร กรุณากรอกข้อมูลส่วนตัวของคุณ
        </p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label htmlFor="title">คำนำหน้า</label>
              <select name="title" id="title" value={formData.title} onChange={handleChange} required>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">ชื่อ-นามสกุล (ดึงจาก Google)</label>
              <input type="text" value={session.user?.name || ''} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label htmlFor="dob">วันเดือนปีเกิด</label>
              <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="idCard">หมายเลขบัตรประชาชน</label>
              <input type="text" name="idCard" id="idCard" maxLength={13} value={formData.idCard} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">ที่อยู่</label>
            <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลและเข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
