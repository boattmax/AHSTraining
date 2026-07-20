import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = await params;
    const body = await req.json();
    const { answers } = body as { answers: Record<string, string> };

    // Fetch all questions for this course with their correct answers
    const questions = await prisma.question.findMany({
      where: { courseId },
      include: {
        options: {
          where: { isCorrect: true }
        }
      }
    });

    if (questions.length === 0) {
      return NextResponse.json({ message: 'No questions found' }, { status: 400 });
    }

    let correctCount = 0;

    questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options[0]; // there should be exactly one correct option per question
      if (correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      }
    });

    const score = (correctCount / questions.length) * 100;
    const passed = score >= 70;

    // Record the attempt
    await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        courseId,
        score,
        passed,
      }
    });

    // Update progress if passed
    if (passed) {
      await prisma.progress.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          }
        },
        data: {
          hasPassedQuiz: true,
        }
      });
    }

    return NextResponse.json({ score, passed });
  } catch (error) {
    console.error('Failed to submit quiz', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
