import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    // Fetch user and course progress
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        progresses: {
          where: { courseId, isCompleted: true, hasPassedQuiz: true },
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.progresses || user.progresses.length === 0) {
      return NextResponse.json({ message: 'Course not completed or quiz not passed yet' }, { status: 403 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    const completedAt = user.progresses[0].completedAt || new Date();
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(completedAt);

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Add a blank A4 Landscape page
    // A4 size is 210 x 297 mm -> 595.28 x 841.89 points
    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();

    const baseUrl = new URL(req.url).origin;
    
    // Load fonts using fetch to ensure it works on Vercel serverless environment
    const regularFontRes = await fetch(`${baseUrl}/fonts/Sarabun-Regular.ttf`);
    const regularFontBytes = await regularFontRes.arrayBuffer();
    
    const boldFontRes = await fetch(`${baseUrl}/fonts/Sarabun-Bold.ttf`);
    const boldFontBytes = await boldFontRes.arrayBuffer();
    
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);

    // Draw borders
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.1, 0.3, 0.6),
      borderWidth: 10,
    });
    
    page.drawRectangle({
      x: 45,
      y: 45,
      width: width - 90,
      height: height - 90,
      borderColor: rgb(0.8, 0.6, 0.2), // Goldish color
      borderWidth: 2,
    });

    // Draw Texts
    // Title
    const title = 'ประกาศนียบัตร';
    const titleSize = 48;
    const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 150,
      size: titleSize,
      font: boldFont,
      color: rgb(0.1, 0.3, 0.6),
    });

    const subtitle = 'มอบให้เพื่อแสดงว่า';
    const subtitleSize = 24;
    const subtitleWidth = regularFont.widthOfTextAtSize(subtitle, subtitleSize);
    page.drawText(subtitle, {
      x: (width - subtitleWidth) / 2,
      y: height - 220,
      size: subtitleSize,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // User Name
    const name = `${user.title || ''}${user.name || 'ผู้เข้าอบรม'}`;
    const nameSize = 40;
    const nameWidth = boldFont.widthOfTextAtSize(name, nameSize);
    page.drawText(name, {
      x: (width - nameWidth) / 2,
      y: height - 290,
      size: nameSize,
      font: boldFont,
      color: rgb(0.8, 0.3, 0.1),
    });

    // Course completion text
    const text1 = 'ได้ผ่านการอบรมในหลักสูตร';
    const text1Size = 24;
    const text1Width = regularFont.widthOfTextAtSize(text1, text1Size);
    page.drawText(text1, {
      x: (width - text1Width) / 2,
      y: height - 360,
      size: text1Size,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Course Name
    const courseName = course.title;
    const courseNameSize = 32;
    const courseNameWidth = boldFont.widthOfTextAtSize(courseName, courseNameSize);
    page.drawText(courseName, {
      x: (width - courseNameWidth) / 2,
      y: height - 420,
      size: courseNameSize,
      font: boldFont,
      color: rgb(0.1, 0.3, 0.6),
    });

    // Date
    const dateText = `ให้ไว้ ณ วันที่ ${formattedDate}`;
    const dateSize = 20;
    const dateWidth = regularFont.widthOfTextAtSize(dateText, dateSize);
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: height - 500,
      size: dateSize,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Signature (Placeholder)
    const sigLineY = 70;
    page.drawLine({
      start: { x: width - 250, y: sigLineY },
      end: { x: width - 80, y: sigLineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    const sigText = 'ผู้บริหาร / ผู้อำนวยการ';
    const sigTextSize = 16;
    const sigTextWidth = regularFont.widthOfTextAtSize(sigText, sigTextSize);
    page.drawText(sigText, {
      x: width - 250 + (170 - sigTextWidth) / 2,
      y: sigLineY - 25,
      size: sigTextSize,
      font: regularFont,
      color: rgb(0, 0, 0),
    });


    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes) as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${course.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
