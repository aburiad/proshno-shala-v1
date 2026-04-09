import React from 'react';
import { motion } from 'framer-motion';
import SquareProof from './SquareProof';
import QuizEngine from './QuizEngine';
import ZeroMonster from './ZeroMonster';
import RomanMummy from './RomanMummy';
import FishThief from './FishThief';

const LESSONS_CONFIG = {
  fish6: {
    mascot: '🐟', 
    title: 'মাছ চুরির রহস্য!',
    sub: 'ট্যালি ও মায়া প্রতীক চেনা',
    type: 'custom',
    component: FishThief
  },
  ancient6: {
    mascot: '⚰️', 
    title: 'প্রাচীন গণনা — মমির সিন্দুক!',
    sub: 'রোমান সংখ্যা চিনে সিন্দুক খোলো',
    type: 'custom',
    component: RomanMummy
  },
  numeration6: {
    mascot: '🪄', 
    title: 'অঙ্কপাতন — শূন্যের জাদু!',
    sub: 'স্থানিক মান থেকে শূন্য গায়েব',
    type: 'custom',
    component: ZeroMonster
  },
  ab2: {
    mascot: '🟦', 
    title: '(a+b)² সূত্র — ভিজ্যুয়াল প্রমাণ!',
    sub: 'স্কোয়ার টুকরো টুকরো করে দেখাই',
    type: 'visual_slider',
    component: SquareProof
  },
  trig: {
    mascot: '📐', 
    title: 'ত্রিকোণমিতি — SOHCAHTOA!',
    sub: 'triangle-এর মধ্যে কী লুকিয়ে আছে দেখো',
    type: 'quiz',
    component: QuizEngine
  },
  integer: {
    mascot: '❄️', 
    title: 'পূর্ণসংখ্যা — Number Line-এ উঠি!',
    sub: 'ধনাত্মক আর ঋণাত্মক মিলিয়ে মিশিয়ে',
    type: 'quiz',
    component: QuizEngine
  },
  challenge: {
    mascot: '🎯', 
    title: 'আজকের চ্যালেঞ্জ!',
    sub: '(a+b)² দিয়ে শুরু করো',
    type: 'quiz',
    component: QuizEngine
  }
};

export default function InteractiveLessonModal({ lessonId, onClose, showToast }) {
  const config = LESSONS_CONFIG[lessonId];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {!config ? (
          <div className="text-center">
            <div className="modal-mascot">🚀</div>
            <div className="modal-title">এই টপিক শীঘ্রই আসছে!</div>
            <div className="modal-sub">ডেভেলপার ভাই রাত জেগে বানাচ্ছেন... ☕</div>
            <button 
              className="action-btn btn-primary" 
              style={{ marginTop: '20px' }} 
              onClick={onClose}
            >
              ঠিকাছে, অপেক্ষা করি!
            </button>
          </div>
        ) : (
          <div className="lesson-content">
            {config.type === 'custom' ? (
              <config.component 
                config={config} 
                onClose={onClose} 
                showToast={showToast} 
              />
            ) : config.type === 'visual_slider' ? (
              <SquareProof 
                config={config} 
                onClose={onClose} 
                showToast={showToast} 
              />
            ) : (
              <QuizEngine 
                config={config} 
                lessonId={lessonId}
                onClose={onClose} 
                showToast={showToast} 
              />
            )}
          </div>
        ) }
      </motion.div>
    </motion.div>
  );
}
