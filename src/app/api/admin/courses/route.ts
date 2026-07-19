import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, videoUrl, duration } = await req.json();

    if (!title || !videoUrl) {
      return NextResponse.json({ message: 'Title and Video URL are required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        videoUrl,
        duration: duration ? parseInt(duration) : null,
      }
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
