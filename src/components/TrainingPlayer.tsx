"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPlayer from 'react-player';

interface TrainingPlayerProps {
  courseId: string;
  videoUrl: string;
  initialProgress: number;
  initialIsCompleted?: boolean;
  initialHasPassedQuiz?: boolean;
}

export default function TrainingPlayer({ courseId, videoUrl, initialProgress, initialIsCompleted = false, initialHasPassedQuiz = false }: TrainingPlayerProps) {
  const playerRef = useRef<any>(null);
  const [maxAllowedTime, setMaxAllowedTime] = useState(initialProgress);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [hasPassedQuiz, setHasPassedQuiz] = useState(initialHasPassedQuiz);
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Anti-cheat: No Tab Switching (Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && playing) {
        setPlaying(false);
        setIsWarningVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [playing]);

  // Sync progress to server every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && playerRef.current) {
        saveProgress(playerRef.current.getCurrentTime(), false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [playing, courseId]);

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

  const handleProgress = (state: { playedSeconds: number }) => {
    const currentTime = state.playedSeconds;
    
    // Anti-cheat: No Seeking Forward
    // Allow 3 seconds buffer for normal playback drift
    if (currentTime > maxAllowedTime + 3) {
      if (playerRef.current) {
        playerRef.current.seekTo(maxAllowedTime, 'seconds');
      }
    } else {
      setMaxAllowedTime(Math.max(maxAllowedTime, currentTime));
    }
  };

  const handleEnded = () => {
    if (playerRef.current) {
      saveProgress(playerRef.current.getCurrentTime(), true);
      setIsCompleted(true);
      setPlaying(false);
    }
  };

  const handleReady = () => {
    if (!isReady && initialProgress > 0 && !isCompleted) {
      playerRef.current?.seekTo(initialProgress, 'seconds');
    }
    setIsReady(true);
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
            onClick={() => {
              setIsWarningVisible(false);
              setPlaying(true);
            }}
          >
            ฉันเข้าใจแล้ว (รับชมต่อ)
          </button>
        </div>
      )}

      <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '1rem', overflow: 'hidden', background: 'black' }}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          controls={true}
          onReady={handleReady}
          onProgress={handleProgress as any}
          onEnded={handleEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: {
              playerVars: { 
                disablekb: 1, // Disable keyboard shortcuts to prevent skipping
                modestbranding: 1
              }
            }
          }}
        />
      </div>
      
      {isCompleted && !hasPassedQuiz && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1rem', border: '1px solid var(--primary)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🎉 คุณรับชมวิดีโอจบแล้ว!</h3>
          <p style={{ marginBottom: '1.5rem' }}>กรุณาทำแบบทดสอบเพื่อรับเกียรติบัตร</p>
          <Link href={`/training/${courseId}/quiz`} className="btn btn-primary" style={{ display: 'inline-block', fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            📝 ทำแบบทดสอบ
          </Link>
        </div>
      )}

      {isCompleted && hasPassedQuiz && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '1rem', border: '1px solid var(--success)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>✅ คุณสอบผ่านแล้ว!</h3>
          <p style={{ marginBottom: '1.5rem' }}>คุณสามารถดาวน์โหลดใบประกาศนียบัตรได้ทันที</p>
          <a href={`/api/certificates/${courseId}`} target="_blank" className="btn btn-primary" style={{ display: 'inline-block', fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            📜 ดาวน์โหลดเกียรติบัตร (PDF)
          </a>
        </div>
      )}
      
      {!isCompleted && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i>หมายเหตุ: ระบบจะบันทึกความคืบหน้าอัตโนมัติ ห้ามข้ามวิดีโอหรือสลับหน้าต่าง</i>
        </div>
      )}
    </div>
  );
}
