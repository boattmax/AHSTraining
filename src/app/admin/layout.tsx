import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', margin: '2rem auto' }}>
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '6rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>เมนูผู้ดูแลระบบ</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/admin" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>ภาพรวม</Link>
            <Link href="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>จัดการผู้ใช้งาน</Link>
            <Link href="/admin/courses" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>จัดการหลักสูตร</Link>
            <Link href="/admin/news" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>จัดการข่าวสาร</Link>
          </nav>
        </div>
      </aside>
      
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
