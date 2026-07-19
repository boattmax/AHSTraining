import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <section style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>ยินดีต้อนรับสู่ AHSTraining</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          แพลตฟอร์มการอบรมออนไลน์ที่คุณสามารถเรียนรู้และรับเกียรติบัตรออนไลน์ได้ทันทีเมื่อผ่านเกณฑ์การอบรม
        </p>
        <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          เริ่มต้นการอบรม
        </Link>
      </section>

      <section style={{ margin: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>ข่าวประชาสัมพันธ์</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* ข่าวตัวอย่าง - ในอนาคตจะดึงจากฐานข้อมูล */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ background: 'var(--border)', height: '150px', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              ภาพประกอบ
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>เปิดรับสมัครอบรมรอบใหม่</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>วันที่ 10 ตุลาคม 2026</p>
            <p>หลักสูตรใหม่เปิดรับสมัครแล้ววันนี้ รีบลงทะเบียนก่อนเต็ม!</p>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ background: 'var(--border)', height: '150px', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              ภาพประกอบ
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>อัปเดตระบบการรับเกียรติบัตร</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>วันที่ 5 ตุลาคม 2026</p>
            <p>ตอนนี้ผู้เข้าอบรมสามารถดาวน์โหลดเกียรติบัตรเป็นไฟล์ PDF ได้ทันทีหลังจบวิดีโอ</p>
          </div>
        </div>
      </section>
    </div>
  );
}
