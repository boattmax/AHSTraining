import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import QuizTaker from '@/components/QuizTaker';

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/login');
  }

  // 1. Verify user completed the video
  const progress = await prisma.progress.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      }
    }
  });

  if (!progress || !progress.isCompleted) {
    redirect(`/training/${courseId}`);
  }

  // 2. If already passed, go back to training page to download cert
  if (progress.hasPassedQuiz) {
    redirect(`/training/${courseId}`);
  }

  // 3. Fetch questions (without correct answers)
  const questions = await prisma.question.findMany({
    where: { courseId },
    include: {
      options: {
        select: {
          id: true,
          text: true,
        }
      }
    }
  });

  if (questions.length === 0) {
    return (
      <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <div className="panel" style={{ padding: '3rem' }}>
          <h2>ยังไม่มีแบบทดสอบสำหรับหลักสูตรนี้</h2>
          <a href={`/training/${courseId}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>กลับหน้าบทเรียน</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem', maxWidth: '800px' }}>
      <div className="panel" style={{ padding: '2rem' }}>
        <h1 className="text-gradient" style={{ marginBottom: '1.5rem' }}>แบบทดสอบประเมินผล</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          กรุณาทำแบบทดสอบให้ผ่านเกณฑ์ (70%) เพื่อรับใบประกาศนียบัตร
        </p>

        <QuizTaker courseId={courseId} questions={questions} />
      </div>
    </div>
  );
}
