import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, name, dob, idCard, address, phone, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { idCard }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'อีเมลหรือหมายเลขบัตรประชาชนนี้มีในระบบแล้ว' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        title,
        name,
        dob: dob ? new Date(dob) : null,
        idCard,
        address,
        phone,
        email,
        password: hashedPassword,
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
