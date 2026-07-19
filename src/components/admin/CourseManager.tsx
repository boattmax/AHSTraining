"use client";

import React, { useState } from 'react';
import CourseForm from '@/components/admin/CourseForm';
import { useRouter } from 'next/navigation';

export default function CourseManager({ initialCourses }: { initialCourses: any[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบหลักสูตรนี้ใช่หรือไม่?')) return;
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>จัดการหลักสูตร</h1>
        {!isAdding && !editingCourse && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + เพิ่มหลักสูตรใหม่
          </button>
        )}
      </div>

      {(isAdding || editingCourse) ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{isAdding ? 'เพิ่มหลักสูตรใหม่' : 'แก้ไขหลักสูตร'}</h2>
          <CourseForm 
            course={editingCourse || undefined} 
            onSuccess={() => { setIsAdding(false); setEditingCourse(null); }} 
            onCancel={() => { setIsAdding(false); setEditingCourse(null); }} 
          />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>ชื่อหลักสูตร</th>
                <th style={{ padding: '1rem' }}>วิดีโอ URL</th>
                <th style={{ padding: '1rem', width: '150px' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {initialCourses.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    ยังไม่มีข้อมูลหลักสูตร
                  </td>
                </tr>
              ) : (
                initialCourses.map(course => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>{course.title}</td>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={course.videoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                        {course.videoUrl}
                      </a>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setEditingCourse(course)}>
                        แก้ไข
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(course.id)}>
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
