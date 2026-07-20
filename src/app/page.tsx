import Link from "next/link";
import { BookOpen, Users, Award, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch available courses
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, var(--background) 0%, rgba(59, 130, 246, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.05) 2px, transparent 0)',
          backgroundSize: '40px 40px',
          zIndex: 0
        }} />

        <div className="container grid-2-col" style={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '3.5rem', lineHeight: 1.2, borderBottom: 'none', marginBottom: 0, color: 'var(--primary)' }}>
              เรียนรู้ไร้ขีดจำกัดกับ <br />
              <span className="text-gradient">AHS Training</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '500px' }}>
              แพลตฟอร์มการเรียนรู้ออนไลน์แบบเปิด (MOOC) สำหรับพัฒนาทักษะวิชาชีพ 
              เรียนรู้ได้ทุกที่ ทุกเวลา พร้อมรับใบประกาศนียบัตรเมื่อผ่านเกณฑ์
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link href="#courses" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                สำรวจหลักสูตร
              </Link>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '8px solid white' }}>
              <BookOpen size={160} color="var(--primary)" opacity={0.8} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <PlayCircle size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3>เรียนออนไลน์ 24 ชม.</h3>
            <p style={{ color: 'var(--text-secondary)' }}>เนื้อหาวิดีโอคุณภาพสูง เรียนได้ทุกที่ ทุกเวลา</p>
          </div>
          <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Users size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3>วัดผลความรู้</h3>
            <p style={{ color: 'var(--text-secondary)' }}>มีแบบทดสอบเพื่อประเมินผลความเข้าใจ</p>
          </div>
          <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Award size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3>ใบประกาศนียบัตร</h3>
            <p style={{ color: 'var(--text-secondary)' }}>รับเกียรติบัตรทันทีเมื่อเรียนจบและสอบผ่านเกณฑ์</p>
          </div>
        </div>
      </section>

      {/* Public Course Catalog */}
      <section id="courses" style={{ padding: '5rem 2rem', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>หลักสูตรที่เปิดสอน (Course Catalog)</h2>
          </div>
          
          {courses.length === 0 ? (
            <div className="panel" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <BookOpen size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.2rem' }}>กำลังเตรียมความพร้อมหลักสูตรเร็วๆ นี้</p>
            </div>
          ) : (
            <div className="grid-3-col">
              {courses.map(course => (
                <div key={course.id} className="panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                  {/* Course Thumbnail */}
                  <div style={{ background: 'var(--border)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', position: 'relative' }}>
                    <PlayCircle size={48} opacity={0.3} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      เปิดรับสมัคร
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', lineHeight: 1.4, border: 'none' }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {course.description?.substring(0, 100) || 'หลักสูตรนี้ไม่มีคำอธิบาย'}
                      {course.description && course.description.length > 100 && '...'}
                    </p>
                    
                    <Link href={`/courses/${course.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.75rem' }}>
                      รายละเอียดเพิ่มเติม
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
