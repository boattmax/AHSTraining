"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = React.use(params);
  const router = useRouter();

  type OptionData = { text: string; isCorrect: boolean };
  type QuestionData = { text: string; options: OptionData[] };

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}/quiz`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.length > 0 ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [courseId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions, 
      { text: '', options: [ { text: '', isCorrect: true }, { text: '', isCorrect: false } ] }
    ]);
  };

  const handleQuestionChange = (qIndex: number, text: string) => {
    const newQs = [...questions];
    newQs[qIndex].text = text;
    setQuestions(newQs);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const newQs = [...questions];
    newQs.splice(qIndex, 1);
    setQuestions(newQs);
  };

  const handleAddOption = (qIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQs);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const newQs = [...questions];
    newQs[qIndex].options[oIndex].text = text;
    setQuestions(newQs);
  };

  const handleOptionCorrectChange = (qIndex: number, oIndex: number) => {
    const newQs = [...questions];
    // Reset all options to false
    newQs[qIndex].options.forEach(opt => opt.isCorrect = false);
    // Set selected to true
    newQs[qIndex].options[oIndex].isCorrect = true;
    setQuestions(newQs);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options.splice(oIndex, 1);
    setQuestions(newQs);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
      });
      if (res.ok) {
        alert('บันทึกข้อสอบสำเร็จ');
        router.push('/admin/courses');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div>
      <h1 className="text-gradient">จัดการแบบทดสอบ (Quiz)</h1>
      <p style={{ marginBottom: '2rem' }}>เพิ่มคำถามและตัวเลือกสำหรับใช้ประเมินผลก่อนรับเกียรติบัตร</p>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>ข้อที่ {qIndex + 1}</h3>
            <button onClick={() => handleRemoveQuestion(qIndex)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
              ลบข้อนี้
            </button>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>คำถาม</label>
            <textarea 
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              style={{ width: '100%', minHeight: '80px' }}
              placeholder="พิมพ์คำถามที่นี่..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>ตัวเลือก (เลือกข้อที่ถูกเพียง 1 ข้อ)</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input 
                  type="radio" 
                  name={`correct-${qIndex}`} 
                  checked={opt.isCorrect} 
                  onChange={() => handleOptionCorrectChange(qIndex, oIndex)}
                  style={{ width: '20px', height: '20px' }}
                />
                <input 
                  type="text" 
                  value={opt.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  style={{ flex: 1 }}
                  placeholder={`ตัวเลือกที่ ${oIndex + 1}`}
                />
                <button onClick={() => handleRemoveOption(qIndex, oIndex)} type="button" style={{ color: 'var(--danger)', padding: '0.5rem' }}>
                  ✕
                </button>
              </div>
            ))}
            <button onClick={() => handleAddOption(qIndex)} className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              + เพิ่มตัวเลือก
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={handleAddQuestion} className="btn btn-secondary" style={{ flex: 1 }}>
          + เพิ่มคำถาม
        </button>
        <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกแบบทดสอบ'}
        </button>
      </div>
    </div>
  );
}
