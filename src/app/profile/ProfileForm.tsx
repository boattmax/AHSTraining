"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  
  const formatDateForInput = (dateString: Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: user.title || 'นาย',
    name: user.name || '',
    dob: formatDateForInput(user.dob),
    idCard: user.idCard || '',
    address: user.address || '',
    phone: user.phone || '',
    email: user.email || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('บันทึกข้อมูลเรียบร้อยแล้ว');
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

  const handleLinkGoogle = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>ข้อมูลส่วนตัว (Profile)</h1>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{success}</div>}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Profile Info Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="title">คำนำหน้า</label>
              <select name="title" id="title" value={formData.title} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name">ชื่อ-นามสกุล</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="dob">วันเดือนปีเกิด (ค.ศ.)</label>
              <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="idCard">หมายเลขบัตรประชาชน</label>
              <input type="text" name="idCard" id="idCard" maxLength={13} value={formData.idCard} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="address">ที่อยู่</label>
            <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="phone">เบอร์โทรศัพท์</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email">อีเมล</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '1rem', width: 'fit-content' }}>
            {isLoading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลส่วนตัว'}
          </button>
      </div>
    </div>
  );
}
