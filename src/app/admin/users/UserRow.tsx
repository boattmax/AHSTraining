"use client";

import { useTransition } from "react";
import { changeUserRole, deleteUser } from "./actions";

export default function UserRow({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = () => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    startTransition(() => {
      changeUserRole(user.id, newRole);
    });
  };

  const handleDelete = () => {
    if (confirm("คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?")) {
      startTransition(() => {
        deleteUser(user.id);
      });
    }
  };

  return (
    <tr style={{ borderBottom: '1px solid var(--border)', opacity: isPending ? 0.5 : 1 }}>
      <td style={{ padding: '1rem' }}>{user.title} {user.name}</td>
      <td style={{ padding: '1rem' }}>{user.email}</td>
      <td style={{ padding: '1rem' }}>
        <span style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: '999px', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          backgroundColor: user.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--success)'
        }}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: '1rem', textAlign: 'center' }}>
        <button 
          onClick={handleRoleChange} 
          disabled={isPending}
          className="btn btn-secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', marginRight: '0.5rem' }}
        >
          เปลี่ยนบทบาท
        </button>
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="btn" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: 'var(--danger)', color: 'white' }}
        >
          ลบ
        </button>
      </td>
    </tr>
  );
}
