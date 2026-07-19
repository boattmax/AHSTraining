import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, name, dob, idCard, address, phone, email } = body;

    if (!idCard || !dob || !name) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (รหัสบัตรประชาชน, วันเกิด, ชื่อ)' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email ? email : undefined },
          { idCard }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'อีเมลหรือหมายเลขบัตรประชาชนนี้มีในระบบแล้ว' }, { status: 409 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        title,
        name,
        dob: new Date(dob),
        idCard,
        address,
        phone,
        email: email || null,
        // The first registered user could be made ADMIN automatically, 
        // but for safety we'll make everyone a USER by default.
      }
    });

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ', user: { id: user.id, email: user.email } }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการสร้างบัญชี' }, { status: 500 });
  }
}
