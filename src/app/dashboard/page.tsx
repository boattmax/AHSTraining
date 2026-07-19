import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container" style={{ margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h1 className="text-gradient">หน้าหลัก (Dashboard)</h1>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>ยินดีต้อนรับคุณ {session.user?.name}</p>
        
        {/* We will add enrolled courses and training room here in Phase 5 */}
        <div style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
          <p>ระบบเรียนรู้และเกียรติบัตรจะแสดงที่นี่ (อยู่ระหว่างการพัฒนา)</p>
        </div>
      </div>
    </div>
  );
}
