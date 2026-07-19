import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, name, dob, idCard, address, phone, email } = body;

    if (!idCard || !dob || !name) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    // Check if ID card or email is already in use by someone else
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { idCard },
          ...(email ? [{ email }] : [])
        ],
        NOT: {
          id: session.user.id
        }
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'หมายเลขบัตรประชาชนหรืออีเมลนี้ถูกใช้งานแล้ว' }, { status: 409 });
    }

    // Update the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        title,
        name,
        dob: new Date(dob),
        idCard,
        address,
        phone,
        email: email || null,
      }
    });

    return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จ' }, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
}
