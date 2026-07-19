"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Course = {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration?: number | null;
};

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Course>({
    title: course?.title || '',
    description: course?.description || '',
    videoUrl: course?.videoUrl || '',
    duration: course?.duration || undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadFile = async (file: File): Promise<string> => {
    setUploadStatus('กำลังเตรียมการอัปโหลด...');
    
    // 1. ขอ Signed URL จาก API ของเรา
    const urlRes = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name })
    });
    
    if (!urlRes.ok) {
      throw new Error('ไม่สามารถขอสิทธิ์อัปโหลดได้ (กรุณาเช็คการตั้งค่า Supabase)');
    }
    
    const { signedUrl, publicUrl } = await urlRes.json();
    
    // 2. อัปโหลดไฟล์ตรงเข้า Supabase โดยใช้ XMLHttpRequest เพื่อทำ Progress bar
    setUploadStatus('กำลังอัปโหลดวิดีโอ...');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
          setUploadStatus(`กำลังอัปโหลดวิดีโอ... ${percentComplete}%`);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error occurred during upload'));
      
      xhr.open('PUT', signedUrl, true);
      // Supabase storage requires the correct content type
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalVideoUrl = formData.videoUrl;
      
      // ถ้ามีการเลือกไฟล์ใหม่ ให้อัปโหลดก่อน
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        finalVideoUrl = await uploadFile(file);
        setUploadStatus('อัปโหลดสำเร็จ! กำลังบันทึกข้อมูลหลักสูตร...');
      } else if (!finalVideoUrl) {
        throw new Error('กรุณาอัปโหลดไฟล์วิดีโอ หรือกรอกลิงก์วิดีโอ');
      }

      // บันทึกข้อมูลคอร์ส
      const url = course?.id ? `/api/admin/courses/${course.id}` : '/api/admin/courses';
      const method = course?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, videoUrl: finalVideoUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to save course');
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="form-label">ชื่อหลักสูตร (Title) *</label>
        <input 
          type="text" 
          name="title" 
          className="form-input" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <label className="form-label">รายละเอียดหลักสูตร (Description)</label>
        <textarea 
          name="description" 
          className="form-input" 
          rows={3}
          value={formData.description} 
          onChange={handleChange} 
        />
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
        <label className="form-label">วิดีโอหลักสูตร * (อัปโหลด หรือใส่ลิงก์ตรง)</label>
        
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="file" 
            accept="video/mp4,video/webm,video/ogg"
            ref={fileInputRef}
            className="form-input"
            style={{ padding: '0.5rem' }}
          />
          <small style={{ color: 'var(--text-secondary)' }}>อัปโหลดไฟล์วิดีโอโดยตรง (รองรับ mp4, webm) - <b>แนะนำ</b></small>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>- หรือ -</div>
        
        <div>
          <input 
            type="url" 
            name="videoUrl" 
            className="form-input" 
            value={formData.videoUrl} 
            onChange={handleChange} 
            placeholder="https://.../video.mp4 (ใส่ลิงก์ MP4 กรณีมีไฟล์อยู่แล้ว)"
          />
        </div>
      </div>

      {isSubmitting && uploadStatus && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,123,255,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(0,123,255,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--accent)' }}>{uploadStatus}</p>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังทำงาน...' : 'บันทึกข้อมูล'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
