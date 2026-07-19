import { prisma } from "@/lib/prisma";
import UserRow from "./UserRow";

export default async function ManageUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>จัดการผู้ใช้งาน</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>อีเมล</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>บทบาท</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRow key={user.id} user={user} />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>ไม่มีข้อมูลผู้ใช้งาน</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
