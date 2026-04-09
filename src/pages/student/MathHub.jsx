import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStudentStore from '@/store/studentStore';
import './MathHub.css';
import InteractiveLessonModal from './InteractiveLessonModal';
import { curriculum } from '../../data/curriculumData';
import { LESSONS } from '../../data/lessonContent';

export default function MathHub() {
  const { xp, streak, badges, masteredTopicsCount, selectedClass } = useStudentStore();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '' });
  const [activeLesson, setActiveLesson] = useState(null);
  
  // State for expanded chapters, default to chapter 1 open
  const [expandedChapters, setExpandedChapters] = useState({ 'ch-1': true });

  // ---- STARS BACKGROUND ----
  useEffect(() => {
    const container = document.getElementById('stars-bg');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 4}s;
        animation-duration: ${2 + Math.random() * 3}s;
      `;
      container.appendChild(star);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2800);
  }, []);

  const openSubchapter = (subId, title, status) => {
    if (status === 'locked') {
      showToast('আগের টপিক শেষ করো, তারপর এটা আনলক হবে! 🔒');
      return;
    }
    // Navigate to dedicated lesson page
    navigate(`/student/lesson/${subId}`);
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
        ...prev,
        [chapterId]: !prev[chapterId]
    }));
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'done': return '✅ সম্পন্ন';
      case 'progress': return '⏳ চলছে';
      case 'start': return '▶ শুরু করো';
      case 'locked': return '🔒 লক';
      default: return '';
    }
  };

  // Get data for selected class
  const classData = curriculum[selectedClass] || curriculum['6'];
  const mathSubject = classData?.subjects?.math;
  const chapters = mathSubject?.chapters || [];

  return (
    <div className="math-hub-container">
      {/* Stars BG */}
      <div className="bg-stars" id="stars-bg"></div>

      <div className="hub-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="logo">গণিত<span>হাব</span> ✦</div>
          <div className="xp-pod" onClick={() => showToast('৬৮% সম্পন্ন! আর একটু!')}>
            <div className="xp-avatar">🧑</div>
            <div className="xp-info">
              <div className="xp-name">রাফি ভাই</div>
              <div className="xp-level">Math Explorer · {xp?.toLocaleString()} XP</div>
              <div className="xp-bar-wrap">
                <div className="xp-bar-fill" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="stat-row">
          <motion.div 
            whileHover={{ y: -2 }}
            className="stat-chip" 
            onClick={() => showToast(`${streak} দিন একটানা! তুমি মেশিন! 🔥`)}
          >
            <div className="chip-icon">🔥</div>
            <div className="chip-text">
              <div className="chip-val">{streak}</div>
              <div className="chip-label">দিনের streak</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className="stat-chip" 
            onClick={() => showToast(`${badges}টা ব্যাজ! কলেকশন বাড়ছে ⭐`)}
          >
            <div className="chip-icon" style={{ animationDelay: '0.4s' }}>⭐</div>
            <div className="chip-text">
              <div className="chip-val">{badges}</div>
              <div className="chip-label">ব্যাজ আছে</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className="stat-chip" 
            onClick={() => showToast(`${masteredTopicsCount}টা টপিক মাস্টার! গর্বিত 🏆`)}
          >
            <div className="chip-icon" style={{ animationDelay: '0.8s' }}>🏆</div>
            <div className="chip-text">
              <div className="chip-val">{masteredTopicsCount}</div>
              <div className="chip-label">টপিক শেষ</div>
            </div>
          </motion.div>
        </div>

        {/* DAILY CHALLENGE */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="challenge-box" 
          onClick={() => setActiveLesson('challenge')}
        >
          <div className="challenge-mascot">🎯</div>
          <div className="challenge-content">
            <div className="challenge-tag">আজকের চ্যালেঞ্জ</div>
            <div className="challenge-title">৩ মিনিটে (a+b)² এর ৫টা প্রশ্ন সমাধান করো!</div>
            <div className="challenge-timer">
              <div className="timer-pill">⏱ ৩:০০</div>
              <span>সময় শেষ হওয়ার আগেই শেষ করো</span>
            </div>
          </div>
          <div className="xp-reward">
            <div className="xp-num">+200</div>
            <div className="xp-text">XP পাবে</div>
          </div>
        </motion.div>

        {/* CURRICULUM TREE */}
        <div className="section-title">টপিকগুলো ({classData?.label})</div>
        <div className="curriculum-tree">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="chapter-group">
                <div 
                  className="chapter-header" 
                  onClick={() => toggleChapter(chapter.id)}
                  style={{ 
                    '--subject-color': mathSubject.color, 
                    '--subject-color-light': `${mathSubject.color}15`, 
                    '--subject-color-light2': `${mathSubject.color}30` 
                  }}
                >
                    <span className="chapter-icon">{chapter.icon}</span>
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chevron" style={{ marginLeft: 'auto' }}>
                        {expandedChapters[chapter.id] ? '▼' : '▶'}
                    </span>
                </div>
                
                {/* Chapter Progress */}
                <div className="chapter-progress-bar">
                    <div className="chapter-progress-fill" style={{ width: `${chapter.progress}%`, background: mathSubject.color }}></div>
                </div>

                <AnimatePresence>
                    {expandedChapters[chapter.id] && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="subchapters-container"
                        >
                            {chapter.subchapters.map((sub, subIdx) => {
                                const hasLesson = !!LESSONS[sub.id];
                                return (
                                  <motion.div 
                                    key={sub.id} 
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIdx * 0.04 }}
                                    className={`subchapter-card ${sub.status} ${hasLesson && sub.status !== 'locked' ? 'has-lesson' : ''}`}
                                    onClick={() => openSubchapter(sub.id, sub.title, sub.status)}
                                    style={{ '--subject-color': mathSubject.color }}
                                  >
                                    <div className="subchapter-id">{sub.id}</div>
                                    <div className="subchapter-info">
                                        <div className="subchapter-title">
                                            {sub.title}
                                            {hasLesson && sub.status !== 'locked' && (
                                              <span className="lesson-live-dot" title="পাঠ পাওয়া গেছে!">●</span>
                                            )}
                                        </div>
                                        <div className="subchapter-title-en">{sub.titleEn}</div>
                                    </div>
                                    <div className="subchapter-duration">{sub.duration}</div>
                                    <div className={`status-badge ${sub.status}`}>
                                        {hasLesson && sub.status !== 'locked'
                                          ? '▶ পড়ি'
                                          : getStatusLabel(sub.status)}
                                    </div>
                                  </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {activeLesson && (
          <InteractiveLessonModal 
            lessonId={activeLesson} 
            onClose={() => setActiveLesson(null)} 
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
