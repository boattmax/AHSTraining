import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, PlayCircle, ShieldCheck } from "lucide-react";
import EnrollButton from "./EnrollButton";

export default async function CourseLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const course = await prisma.course.findUnique({
    where: { id }
  });

  if (!course) {
    return notFound();
  }

  // Check if user is already enrolled
  let isEnrolled = false;
  if (session?.user?.id) {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: id
        }
      }
    });
    if (progress) {
      isEnrolled = true;
    }
  }

  return (
    <div>
      {/* Course Header */}
      <section style={{ 
        padding: '4rem 2rem', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        color: 'white'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-block' }}>
            ← กลับหน้าสารบัญหลักสูตร
          </Link>
          <div className="grid-2-col" style={{ alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ color: 'white', borderBottom: 'none', fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '2rem' }}>
                {course.description || 'ไม่มีคำอธิบายหลักสูตร'}
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} />
                  <span>เรียนตามอัธยาศัย (Self-paced)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} />
                  <span>วิดีโอและแบบทดสอบ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} />
                  <span>ได้ใบประกาศนียบัตร</span>
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="panel" style={{ background: 'white', color: 'var(--text)', padding: '2rem', position: 'sticky', top: '6rem' }}>
              <div style={{ background: 'var(--border)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <PlayCircle size={64} opacity={0.3} />
              </div>
              
              {isEnrolled ? (
                <Link href={`/training/${course.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                  เข้าสู่ห้องเรียน (คุณลงทะเบียนแล้ว)
                </Link>
              ) : (
                <EnrollButton courseId={course.id} isLoggedIn={!!session?.user} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>วัตถุประสงค์ของหลักสูตร</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            เพื่อให้ผู้เรียนมีความรู้ ความเข้าใจ ในหลักการและแนวทางปฏิบัติที่เกี่ยวข้องกับเนื้อหาหลักสูตร
            และสามารถนำไปประยุกต์ใช้ในการปฏิบัติงานได้อย่างมีประสิทธิภาพ
          </p>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>โครงสร้างเนื้อหา (Syllabus)</h2>
          <div className="panel" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '50%' }}>
              <PlayCircle size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>บทเรียนออนไลน์ (Video Lecture)</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>เรียนรู้ผ่านวิดีโอสื่อการสอน</p>
            </div>
          </div>
          <div className="panel" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '50%' }}>
              <BookOpen size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>แบบทดสอบประเมินผล (Quiz)</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>ทำแบบทดสอบเพื่อวัดความรู้ความเข้าใจ เกณฑ์ผ่าน 70%</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
