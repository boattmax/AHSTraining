"use client";

import React, { useState } from 'react';
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
  const [formData, setFormData] = useState<Course>({
    title: course?.title || '',
    description: course?.description || '',
    videoUrl: course?.videoUrl || '',
    duration: course?.duration || undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = course?.id ? `/api/admin/courses/${course.id}` : '/api/admin/courses';
      const method = course?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to save course');
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
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

      <div>
        <label className="form-label">ลิงก์วิดีโอ (Video URL) *</label>
        <input 
          type="url" 
          name="videoUrl" 
          className="form-input" 
          value={formData.videoUrl} 
          onChange={handleChange} 
          required 
          placeholder="https://.../video.mp4"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
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
