import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { progressSeconds, isCompleted } = await req.json();
    const courseId = params.id;

    const progress = await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      update: {
        progressSeconds: progressSeconds,
        isCompleted: isCompleted,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
      create: {
        userId: session.user.id,
        courseId: courseId,
        progressSeconds: progressSeconds,
        isCompleted: isCompleted || false,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
