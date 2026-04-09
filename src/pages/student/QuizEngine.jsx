import React, { useState } from 'react';
import useStudentStore from '@/store/studentStore';

const QUIZ_DATA = {
  trig: [
    { q:'sin 30° = কত?', opts:['1/2 ✓', '√3/2', '1', '0'], ans:0, explain:'sin 30° = 1/2 — মুখস্থের দরকার নেই, unit circle দেখলেই বুঝবে!' },
    { q:'cos 90° = কত?', opts:['1', '0 ✓', '-1', '1/√2'], ans:1, explain:'cos 90° = 0 — ঠিক 90°-এ x-axis zero হয়!' },
    { q:'tan 45° = কত?', opts:['0', '1/√2', '1 ✓', '√3'], ans:2, explain:'tan 45° = 1 — 45°-এ opposite = adjacent, তাই ratio = 1!' },
  ],
  integer: [
    { q:'(-5) + (+8) = ?', opts:['-3', '+3 ✓', '+13', '-13'], ans:1, explain:'-5 থেকে 8 ডানদিকে গেলে = +3! Number line-এ হাঁটো!' },
    { q:'(-3) × (-4) = ?', opts:['-12', '+7', '+12 ✓', '-7'], ans:2, explain:'ঋণ × ঋণ = ধনাত্মক! দুটো "না" মিলে "হ্যাঁ" হয়!' },
    { q:'কোনটা সবচেয়ে ছোট?', opts:['-1', '0', '+2', '-5 ✓'], ans:3, explain:'-5 সবচেয়ে বাঁয়ে — number line-এ বাঁয়ে = ছোট!' },
  ],
  challenge: [
    { q:'(3+2)² = ?', opts:['10', '25 ✓', '13', '34'], ans:1, explain:'(3+2)² = 5² = 25। সরল করে তারপর বর্গ!' },
    { q:'(a+b)² = ?', opts:['a²+b²', 'a²+2ab+b² ✓', '2a+2b', 'a²-b²'], ans:1, explain:'(a+b)² = a² + 2ab + b² — মাঝের 2ab ভুললে চলবে না!' },
    { q:'(5+3)² তে 2ab কত?', opts:['15', '30 ✓', '64', '25'], ans:1, explain:'2ab = 2×5×3 = 30! আর (5+3)² = 64 = 25+30+9 ✓' },
  ],
};

export default function QuizEngine({ config, lessonId, onClose, showToast }) {
  const { addXP, completeTopic } = useStudentStore();
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const questions = QUIZ_DATA[lessonId] || QUIZ_DATA['challenge'];
  const currentQ = questions[qi];

  const handlePick = (idx) => {
    if (answeredIndex !== null) return;
    setAnsweredIndex(idx);
    if (idx === currentQ.ans) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (qi < questions.length - 1) {
      setQi(qi + 1);
      setAnsweredIndex(null);
    } else {
      setIsFinished(true);
      const finalScore = score + (answeredIndex === currentQ.ans ? 1 : 0);
      completeTopic(lessonId);
      addXP(finalScore * 40);
    }
  };

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    const msg = pct === 100 ? 'পারফেক্ট! তুমি গিনিয়াস! 🤩' : pct >= 66 ? 'ভালো হয়েছে! আরেকটু চর্চা করো 💪' : 'ঠিকাছে! আবার চেষ্টা করো 🔄';
    const mascot = pct === 100 ? '🏆' : pct >= 66 ? '🎉' : '💪';

    return (
      <div className="quiz-result text-center">
        <div className="modal-mascot">{mascot}</div>
        <div className="modal-title">{msg}</div>
        <div className="modal-sub">{questions.length}টার মধ্যে {score}টা সঠিক = {pct}%</div>
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <div style={{ fontSize: '40px', fontWeight: '800', color: '#ffd700' }}>+{score * 40} XP</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.45)', marginTop: '4px' }}>তোমার মোট XP-তে যোগ হলো!</div>
        </div>
        <button className="action-btn btn-primary" onClick={() => { showToast(`+${score * 40} XP পেলে! ব্রাভো 🎊`); onClose(); }}>
          হাবে ফিরে যাই!
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-engine">
      <div className="modal-mascot">{config.mascot}</div>
      <div className="modal-title">{config.title}</div>
      <div className="modal-sub">প্রশ্ন {qi + 1} / {questions.length}</div>

      <div className="concept-box" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: 'Baloo Da 2' }}>{currentQ.q}</div>
      </div>

      <div className="quiz-options">
        {currentQ.opts.map((opt, idx) => {
          let extraClass = '';
          if (answeredIndex !== null) {
            if (idx === currentQ.ans) extraClass = 'correct';
            else if (idx === answeredIndex) extraClass = 'wrong';
          }
          return (
            <button 
              key={idx}
              className={`quiz-opt ${extraClass}`}
              onClick={() => handlePick(idx)}
              disabled={answeredIndex !== null}
            >
              {opt.replace(' ✓', '')}
            </button>
          );
        })}
      </div>

      {answeredIndex !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'rgba(50,200,100,0.1)', 
            border: '1px solid rgba(50,200,100,0.3)', 
            borderRadius: '14px', 
            padding: '14px', 
            marginBottom: '16px', 
            fontSize: '14px', 
            color: 'rgba(255,255,255,.8)' 
          }}
        >
          {answeredIndex === currentQ.ans ? '✅ ' : '❌ '} {currentQ.explain}
        </motion.div>
      )}

      {answeredIndex !== null && (
        <button className="action-btn btn-primary" onClick={handleNext}>
          {qi < questions.length - 1 ? 'পরের প্রশ্ন →' : 'ফলাফল দেখো →'}
        </button>
      )}
    </div>
  );
}
