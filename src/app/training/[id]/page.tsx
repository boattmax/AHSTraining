import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import TrainingPlayer from '@/components/TrainingPlayer';
import Link from 'next/link';

export default async function TrainingRoom({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/login');
  }

  // Fetch course and user progress
  const course = await prisma.course.findUnique({
    where: { id: params.id },
  });

  if (!course) {
    return (
      <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--danger)' }}>ไม่พบหลักสูตรนี้</h1>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const progress = await prisma.progress.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      }
    }
  });

  const initialProgress = progress?.progressSeconds || 0;

  return (
    <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <Link href="/dashboard" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--accent)', textDecoration: 'none' }}>
        ← กลับไปหน้ารายการหลักสูตร
      </Link>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>{course.title}</h1>
        {course.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{course.description}</p>}

        <TrainingPlayer 
          courseId={course.id} 
          videoUrl={course.videoUrl} 
          initialProgress={initialProgress} 
        />
      </div>
    </div>
  );
}
