"use client";

import React, { useRef, useState, useEffect } from 'react';

interface TrainingPlayerProps {
  courseId: string;
  videoUrl: string;
  initialProgress: number;
}

export default function TrainingPlayer({ courseId, videoUrl, initialProgress }: TrainingPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maxAllowedTime, setMaxAllowedTime] = useState(initialProgress);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  // Initialize video to the last watched position
  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress]);

  // Anti-cheat: No Tab Switching (Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsWarningVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sync progress to server every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        saveProgress(videoRef.current.currentTime, false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [courseId]);

  const saveProgress = async (currentSeconds: number, completed: boolean) => {
    try {
      await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressSeconds: Math.floor(currentSeconds),
          isCompleted: completed
        })
      });
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    
    // Anti-cheat: No Seeking Forward
    // Allow 2 seconds buffer for normal playback drift
    if (currentTime > maxAllowedTime + 2) {
      videoRef.current.currentTime = maxAllowedTime;
    } else {
      setMaxAllowedTime(Math.max(maxAllowedTime, currentTime));
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      saveProgress(videoRef.current.currentTime, true);
      alert('ยินดีด้วย! คุณเรียนจบหลักสูตรนี้แล้ว');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {isWarningVisible && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', borderRadius: '1rem'
        }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>⚠️ ระบบตรวจพบการสลับหน้าจอ</h2>
          <p>กรุณาโฟกัสที่การอบรม หากออกจากหน้าจอวิดีโอจะหยุดอัตโนมัติ</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={() => setIsWarningVisible(false)}
          >
            ฉันเข้าใจแล้ว (รับชมต่อ)
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        controls
        controlsList="nodownload"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{ width: '100%', borderRadius: '1rem', background: 'black' }}
      />
      
      <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <i>หมายเหตุ: ระบบจะบันทึกความคืบหน้าอัตโนมัติ ห้ามข้ามวิดีโอหรือสลับหน้าต่าง</i>
      </div>
    </div>
  );
}
