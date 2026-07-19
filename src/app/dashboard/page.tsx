import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Fetch available courses
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Fetch user's progress
  const userProgress = await prisma.progress.findMany({
    where: { userId: session.user.id }
  });

  return (
    <div className="container" style={{ margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 className="text-gradient">หน้าหลัก (Dashboard)</h1>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>ยินดีต้อนรับคุณ {session.user?.name}</p>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>หลักสูตรการอบรม (Training Courses)</h2>
      
      {courses.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
          <p>ยังไม่มีหลักสูตรการอบรมในขณะนี้</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {courses.map(course => {
            const progress = userProgress.find(p => p.courseId === course.id);
            const isCompleted = progress?.isCompleted || false;
            
            return (
              <div key={course.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, fontSize: '0.9rem' }}>
                  {course.description?.substring(0, 100) || 'ไม่มีรายละเอียด'}
                  {course.description && course.description.length > 100 && '...'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem',
                    background: isCompleted ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                    color: isCompleted ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {isCompleted ? '✓ เรียนจบแล้ว' : progress ? 'กำลังเรียน' : 'ยังไม่ได้เริ่ม'}
                  </span>
                  
                  <Link href={`/training/${course.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    {isCompleted ? 'ดูทบทวน' : progress ? 'เรียนต่อ' : 'เริ่มเรียน'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
