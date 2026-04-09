import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStudentStore from '@/store/studentStore';
import './MathHub.css';

const SUBJECTS = [
  {
    id: 'math',
    title: 'গণিত (Math)',
    mascot: '📐',
    sub: 'গণিত এখন হাতের মোয়ায়! 🍿',
    colorText: 'সুপার ফানি ম্যাথ গেম',
    theme: 't-purple',
    route: '/student/math-hub',
    xpBonus: '+2,400 XP Available'
  },
  {
    id: 'english',
    title: 'ইংরেজি (English)',
    mascot: '📚',
    sub: 'Grammar-কে বলো টা-টা! 👋',
    colorText: 'মজার ইংরেজি গল্প ও কুইজ',
    theme: 't-teal',
    route: '#',
    xpBonus: 'Coming Soon! 🚀'
  }
];

export default function SubjectSelection() {
  const navigate = useNavigate();
  const selectedClass = useStudentStore((s) => s.selectedClass);
  const [toast, setToast] = useState({ show: false, message: '' });

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

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2800);
  };

  const handleSubjectSelect = (sub) => {
    if (sub.route === '#') {
      showToast('ইংরেজি হাব শীঘ্রই আসছে! ডেভেলপার ভাই কফি খাচ্ছেন... ☕');
    } else {
      navigate(sub.route);
    }
  };

  return (
    <div className="math-hub-container flex flex-col items-center py-10 px-4 md:justify-center">
      {/* Stars BG */}
      <div className="bg-stars" id="stars-bg"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-12"
      >
        <div className="logo text-4xl mb-4">লার্নিং<span>হাব</span> ✦</div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Baloo Da 2' }}>
          তোমার পছন্দের বিষয় বেছে নাও (ক্লাস {selectedClass})
        </h1>
        <p className="text-white/50 text-sm">পড়াশোনাকে বানাও আরও মজার!</p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-2">
        {SUBJECTS.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSubjectSelect(sub)}
            className={`topic-card ${sub.theme} unlocked flex flex-col items-center p-6 text-center cursor-pointer`}
            style={{ borderRadius: '24px' }}
          >
            <div className="text-5xl mb-4">{sub.mascot}</div>
            <div className="card-title text-xl mb-1">{sub.title}</div>
            <div className="card-sub text-sm text-white/60 mb-4">{sub.sub}</div>
            
            <div className="mt-auto px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
              {sub.xpBonus}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/student/class-selection')}
        className="relative z-10 mt-12 text-white/40 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors"
      >
        ← অন্য ক্লাস সিলেক্ট করবা?
      </motion.button>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
