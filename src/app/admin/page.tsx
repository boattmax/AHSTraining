import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const courseCount = await prisma.course.count();
  const newsCount = await prisma.news.count();

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>ภาพรวมระบบ (Dashboard)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>ผู้ใช้งานทั้งหมด</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>{userCount}</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>หลักสูตรทั้งหมด</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>{courseCount}</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>ข่าวสารประชาสัมพันธ์</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>{newsCount}</p>
        </div>

      </div>
    </div>
  );
}
