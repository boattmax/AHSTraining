"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css'; // Reusing login styles for consistency

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: 'นาย',
    name: '',
    dob: '',
    idCard: '',
    address: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
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
        <h1 className={styles.title}>สมัครสมาชิก</h1>
        
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
              <label htmlFor="name">ชื่อ-นามสกุล</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">เบอร์โทรศัพท์</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">อีเมล</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'กำลังบันทึกข้อมูล...' : 'สมัครสมาชิก'}
          </button>
        </form>
        
        <p className={styles.footerText}>
          มีบัญชีอยู่แล้ว? <Link href="/login" className={styles.link}>เข้าสู่ระบบเลย</Link>
        </p>
      </div>
    </div>
  );
}
