"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizTaker({ courseId, questions }: { courseId: string, questions: any[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ score: number, passed: boolean } | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('กรุณาตอบคำถามให้ครบทุกข้อ');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        if (data.passed) {
          alert('ยินดีด้วย! คุณสอบผ่านแล้ว');
          router.push(`/training/${courseId}`);
        }
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการส่งคำตอบ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setSubmitting(false);
    }
  };

  if (result && !result.passed) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>คุณสอบไม่ผ่านเกณฑ์</h2>
        <p style={{ marginBottom: '2rem' }}>คะแนนของคุณ: {result.score.toFixed(2)}% (ต้องได้ 70% ขึ้นไป)</p>
        <button 
          onClick={() => { setResult(null); setAnswers({}); }} 
          className="btn btn-primary"
        >
          🔄 ลองทำแบบทดสอบใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px' }}>{error}</div>}
      
      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{index + 1}. {q.text}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {q.options.map((opt: any) => (
              <label 
                key={opt.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '1rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: answers[q.id] === opt.id ? 'rgba(30, 58, 138, 0.05)' : 'transparent',
                  borderColor: answers[q.id] === opt.id ? 'var(--primary)' : 'var(--border)'
                }}
              >
                <input 
                  type="radio" 
                  name={`q-${q.id}`} 
                  value={opt.id} 
                  checked={answers[q.id] === opt.id}
                  onChange={() => handleSelect(q.id, opt.id)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '1rem' }}>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={submitting} 
        className="btn btn-primary"
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
      >
        {submitting ? 'กำลังส่งคำตอบ...' : 'ส่งคำตอบ'}
      </button>
    </div>
  );
}
