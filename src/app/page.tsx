import Link from 'next/link';
import { BookOpen, Award, MonitorPlay, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container hero-content">
          <div className="grid-2-col">
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--primary)' }}>
                ยกระดับความรู้สู่<br />
                <span style={{ color: 'var(--secondary)' }}>ความเป็นมืออาชีพ</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
                แพลตฟอร์มการอบรมออนไลน์ที่ออกแบบมาเพื่อการเรียนรู้ที่มีประสิทธิภาพ รับประกาศนียบัตรทันทีหลังเรียนจบและผ่านการทดสอบ
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                  เข้าสู่ระบบ / เริ่มเรียน
                </Link>
                <Link href="#courses" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                  ดูหลักสูตร
                </Link>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Illustration placeholder */}
              <div style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1', background: 'var(--panel-bg)', borderRadius: '50%', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '8px solid white', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px dashed var(--secondary)' }}></div>
                <BookOpen size={120} color="var(--primary)" opacity={0.8} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">ทำไมต้องเรียนกับเรา?</h2>
          <div className="grid-3-col" style={{ marginTop: '3rem' }}>
            <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><MonitorPlay className="feature-icon" /></div>
              <h3>เรียนออนไลน์ 24 ชม.</h3>
              <p style={{ color: 'var(--text-secondary)' }}>เข้าถึงเนื้อหาการอบรมได้ทุกที่ ทุกเวลา ตามความสะดวกของคุณ</p>
            </div>
            <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><FileText className="feature-icon" /></div>
              <h3>ประเมินผลความรู้</h3>
              <p style={{ color: 'var(--text-secondary)' }}>มีระบบแบบทดสอบท้ายบทเรียนเพื่อทบทวนและวัดความเข้าใจ</p>
            </div>
            <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><Award className="feature-icon" /></div>
              <h3>รับเกียรติบัตรทันที</h3>
              <p style={{ color: 'var(--text-secondary)' }}>เมื่อเรียนจบและสอบผ่าน สามารถดาวน์โหลด e-Certificate ได้ทันที</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="section-title">ข่าวประชาสัมพันธ์</h2>
          <div className="grid-3-col" style={{ marginTop: '3rem' }}>
            <div className="panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'var(--border)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ภาพประกอบข่าว</span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>10 ตุลาคม 2026</p>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>เปิดรับสมัครอบรมรอบใหม่</h3>
                <p style={{ color: 'var(--text-secondary)' }}>หลักสูตรใหม่เปิดรับสมัครแล้ววันนี้ รีบลงทะเบียนก่อนเต็ม!</p>
              </div>
            </div>
            
            <div className="panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'var(--border)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ภาพประกอบข่าว</span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>5 ตุลาคม 2026</p>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>อัปเดตระบบแบบทดสอบ</h3>
                <p style={{ color: 'var(--text-secondary)' }}>เพิ่มระบบแบบทดสอบก่อนรับเกียรติบัตร เพื่อประเมินความรู้ผู้เข้าอบรม</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
