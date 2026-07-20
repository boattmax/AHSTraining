import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Award, Clock, MonitorPlay } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Fetch user's progress (which indicates enrollment)
  const userProgress = await prisma.progress.findMany({
    where: { userId: session.user.id },
    include: {
      course: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  const enrolledCourses = userProgress.map(p => p.course);

  const completedCount = userProgress.filter(p => p.hasPassedQuiz).length;
  const inProgressCount = userProgress.filter(p => !p.hasPassedQuiz).length;

  return (
    <div className="container" style={{ margin: '3rem auto', maxWidth: '1200px' }}>
      
      {/* Welcome Banner */}
      <div className="panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '12px' }}>
        <div>
          <h1 style={{ color: 'white', marginBottom: '0.5rem', borderBottom: 'none' }}>ยินดีต้อนรับคุณ {session.user?.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>สู่ระบบการอบรมพัฒนาบุคลากร (AHS Training)</p>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BookOpen size={32} color="var(--secondary)" />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>หลักสูตรที่ลงทะเบียน</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{enrolledCourses.length}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={32} color="var(--secondary)" />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>กำลังเรียน</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{inProgressCount}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={32} color="var(--secondary)" />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>เรียนจบและสอบผ่าน</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={28} /> หลักสูตรของฉัน (My Courses)
      </h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>คุณยังไม่ได้ลงทะเบียนเรียนหลักสูตรใดเลย</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            ไปเลือกดูหลักสูตร
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {enrolledCourses.map(course => {
            const progress = userProgress.find(p => p.courseId === course.id);
            const isCompleted = progress?.isCompleted || false;
            const hasPassedQuiz = progress?.hasPassedQuiz || false;
            
            return (
              <div key={course.id} className="panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Course Image Placeholder */}
                <div style={{ background: 'var(--border)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <MonitorPlay size={40} opacity={0.5} />
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', lineHeight: 1.4 }}>{course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1, fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {course.description?.substring(0, 100) || 'ไม่มีรายละเอียด'}
                    {course.description && course.description.length > 100 && '...'}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '1rem' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '4px',
                      fontWeight: 600,
                      background: hasPassedQuiz ? 'rgba(40, 167, 69, 0.1)' : (isCompleted ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 193, 7, 0.1)'),
                      color: hasPassedQuiz ? 'var(--success)' : (isCompleted ? 'var(--primary)' : 'var(--warning)'),
                      border: `1px solid ${hasPassedQuiz ? 'var(--success)' : (isCompleted ? 'var(--primary)' : 'var(--warning)')}`
                    }}>
                      {hasPassedQuiz ? '✓ สอบผ่านแล้ว' : (isCompleted ? 'รอกำสอบ' : (progress ? 'กำลังเรียน' : 'ยังไม่ได้เริ่ม'))}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                      {hasPassedQuiz ? (
                        <a href={`/api/certificates/${course.id}`} target="_blank" className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
                          📜 โหลดเกียรติบัตร
                        </a>
                      ) : (
                        isCompleted && (
                          <Link href={`/training/${course.id}/quiz`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                            📝 ทำแบบทดสอบ
                          </Link>
                        )
                      )}
                      
                      <Link href={`/training/${course.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {isCompleted ? 'ดูทบทวน' : progress ? 'เรียนต่อ' : 'เริ่มเรียน'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
