import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Fetch all questions for a course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const questions = await prisma.question.findMany({
      where: { courseId: id },
      include: { options: true },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch quiz', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update all questions for a course (Overwrite)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { questions } = body as { questions: { text: string, options: { text: string, isCorrect: boolean }[] }[] };

    // Transaction to delete old and create new
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing questions for this course
      await tx.question.deleteMany({
        where: { courseId: id }
      });

      // 2. Create new questions
      for (const q of questions) {
        await tx.question.create({
          data: {
            courseId: id,
            text: q.text,
            options: {
              create: q.options.map(opt => ({
                text: opt.text,
                isCorrect: opt.isCorrect
              }))
            }
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update quiz', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
