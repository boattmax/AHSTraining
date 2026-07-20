"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({ courseId, isLoggedIn }: { courseId: string, isLoggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      });
      if (res.ok) {
        router.push(`/training/${courseId}`);
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการลงทะเบียน");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลงทะเบียน");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnroll} 
      disabled={loading}
      className="btn btn-primary" 
      style={{ width: '100%', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
    >
      {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียนเรียนฟรี"}
    </button>
  );
}
