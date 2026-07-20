import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = await params;

    // Check if progress already exists
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    });

    if (existingProgress) {
      return NextResponse.json({ success: true, progress: existingProgress });
    }

    // Create new progress record with 0 seconds
    const newProgress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        courseId,
        progressSeconds: 0,
        isCompleted: false,
        hasPassedQuiz: false
      }
    });

    return NextResponse.json({ success: true, progress: newProgress });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
