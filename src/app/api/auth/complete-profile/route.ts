import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, dob, idCard, address, phone } = body;

    if (!idCard || !phone || !dob) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    // Check if ID card is already in use by someone else
    const existingUserWithIdCard = await prisma.user.findFirst({
      where: {
        idCard,
        NOT: {
          email: session.user.email
        }
      }
    });

    if (existingUserWithIdCard) {
      return NextResponse.json({ message: 'หมายเลขบัตรประชาชนนี้ถูกใช้งานแล้ว' }, { status: 409 });
    }

    // Update the user
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        title,
        dob: new Date(dob),
        idCard,
        address,
        phone,
      }
    });

    return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จ' }, { status: 200 });

  } catch (error) {
    console.error('Complete profile error:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
}
