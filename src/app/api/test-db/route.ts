import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test_vercel_db_" + Date.now() + "@example.com",
        name: "Vercel Test User",
      }
    });

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "1234567890_" + Date.now(),
      }
    });

    await prisma.account.delete({ where: { id: account.id } });
    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ success: true, message: "Database connected and inserted successfully via adapter-pg" });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      name: error.name
    });
  }
}
