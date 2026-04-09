import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSONS, CHAPTER_1_ORDER } from '../../data/lessonContent';
import { curriculum } from '../../data/curriculumData';
import RobotChairsGame from './RobotChairsGame';
import NumberCrusherPlayground from './NumberCrusherPlayground';
import SystemRelationGame from './SystemRelationGame';
import './LessonPage.css';

/* ─── SOUND ENGINE ─────────────────────────────────────── */
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const sounds = {
      correct: { freqs: [523, 659, 784], dur: 0.14, wave: 'sine' },
      wrong: { freqs: [300, 250, 200], dur: 0.18, wave: 'sawtooth' },
      pop: { freqs: [700, 400], dur: 0.07, wave: 'square' },
      whoosh: { freqs: [200, 600], dur: 0.28, wave: 'sine' },
      tada: { freqs: [523, 659, 784, 1047], dur: 0.11, wave: 'sine' },
      next: { freqs: [440, 550], dur: 0.1, wave: 'sine' },
    };
    const s = sounds[type] || sounds.pop;
    osc.type = s.wave;
    s.freqs.forEach((f, i) => osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * s.dur));
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + s.dur * s.freqs.length);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + s.dur * s.freqs.length + 0.1);
  } catch (e) { }
}

/* ─── VOICE ENGINE ─────────────────────────────────────── */
function speak(text, lang = 'bn-BD', rate = 0.88, pitch = 1.1) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate; u.pitch = pitch;
  window.speechSynthesis.speak(u);
}
function stopSpeak() { window.speechSynthesis?.cancel(); }

/* ─── PHASE CONSTANTS ──────────────────────────────────── */
const PHASE = { TEACH: 'teach', PRACTICE: 'practice', COMPLETE: 'complete' };

export default function LessonPage() {
  const { subId } = useParams();
  const navigate = useNavigate();

  const lesson = LESSONS[subId];

  const [phase, setPhase] = useState(PHASE.TEACH);
  const [stepIdx, setStepIdx] = useState(0);
  const [popup, setPopup] = useState(null);       // { text, emoji, color }
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState(null);       // chosen option index
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mascotAnim, setMascotAnim] = useState('idle');
  const [voiceOn, setVoiceOn] = useState(true);
  const [showPermission, setShowPermission] = useState(false); // gate between teach → practice
  const [showNextLesson, setShowNextLesson] = useState(false);
  const popupTimerRef = useRef(null);

  /* ─── NEXT LESSON COMPUTATION ─── */
  const nextSubId = (() => {
    const idx = CHAPTER_1_ORDER.indexOf(subId);
    return idx >= 0 && idx < CHAPTER_1_ORDER.length - 1 ? CHAPTER_1_ORDER[idx + 1] : null;
  })();
  const nextLessonExists = nextSubId && LESSONS[nextSubId];

  /* ─── FIND META FROM CURRICULUM ─── */
  const chapterMeta = (() => {
    const mathChapters = curriculum["6"]?.subjects?.math?.chapters || [];
    for (const ch of mathChapters) {
      const sub = ch.subchapters?.find(s => s.id === subId);
      if (sub) return { chapter: ch, sub };
    }
    return null;
  })();

  /* ─── SHOW POPUP ─── */
  const showPopup = useCallback((text, emoji = '✨', color = '#f39c12') => {
    clearTimeout(popupTimerRef.current);
    setPopup({ text, emoji, color });
    popupTimerRef.current = setTimeout(() => setPopup(null), 2600);
  }, []);

  /* ─── MASCOT REACT ─── */
  const mascotReact = useCallback((type) => {
    setMascotAnim(type);
    setTimeout(() => setMascotAnim('idle'), 1500);
  }, []);

  /* ─── SPEAK ON STEP CHANGE ─── */
  useEffect(() => {
    if (!lesson || phase !== PHASE.TEACH) return;
    const step = lesson.steps[stepIdx];
    if (!step) return;
    if (voiceOn) setTimeout(() => speak(step.voice || step.heading), 300);
    // popup guidance
    if (stepIdx === 0) {
      setTimeout(() => showPopup('চলো শুরু করি! 🚀', '🎉', '#27ae60'), 500);
    }
  }, [stepIdx, phase, lesson, voiceOn, showPopup]);

  /* ─── FIRST LOAD ─── */
  useEffect(() => {
    if (!lesson) return;
    playSound('whoosh');
    if (voiceOn) setTimeout(() => speak(lesson.intro), 400);
    showPopup(lesson.intro, lesson.mascot, lesson.color);
  }, [lesson]);  // eslint-disable-line

  if (!lesson) {
    return (
      <div className="lesson-page">
        <div className="lesson-coming-soon">
          <div className="coming-mascot">🚀</div>
          <div className="coming-title">এই পাঠ শীঘ্রই আসছে!</div>
          <div className="coming-sub">ডেভেলপার ভাই রাত জেগে বানাচ্ছেন... ☕</div>
          <button className="lesson-btn primary" onClick={() => navigate(-1)}>← ফিরে যাই</button>
        </div>
      </div>
    );
  }

  const currentStep = lesson.steps[stepIdx];
  const currentQuiz = lesson.practice[quizIdx];
  const totalSteps = lesson.steps.length;
  const totalPractice = lesson.practice.length;

  /* ─── NAVIGATE STEPS ─── */
  const goNext = () => {
    playSound('next');
    stopSpeak();
    if (stepIdx < totalSteps - 1) {
      setStepIdx(s => s + 1);
      mascotReact('happy');
      showPopup('দারুণ! পরের ধাপে চলো →', '⭐', '#3498db');
    } else {
      // End of teach — show permission gate before practice
      setShowPermission(true);
      playSound('tada');
      mascotReact('dance');
      if (voiceOn) speak('শাবাশ! পড়া শেষ! এখন কি একটু অনুশীলন করবে?');
      showPopup('পড়া শেষ! অনুশীলন করার জন্য প্রস্তুত? 💪', '🏆', '#f39c12');
    }
  };

  const goPrev = () => {
    if (stepIdx > 0) {
      playSound('pop');
      stopSpeak();
      setStepIdx(s => s - 1);
    }
  };

  /* ─── ENTER PRACTICE ─── */
  const startPractice = () => {
    playSound('whoosh');
    setShowPermission(false);
    setPhase(PHASE.PRACTICE);
    setQuizIdx(0); setSelected(null); setAnswered(false);
    mascotReact('dance');
    if (voiceOn) setTimeout(() => speak('চলো অনুশীলন করি! মনোযোগ দিয়ে উত্তর দাও।'), 300);
    showPopup('অনুশীলন শুরু! সাহস রাখো 💪', '🎮', '#9b59b6');
  };

  /* ─── ANSWER QUIZ ─── */
  const handleAnswer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const isCorrect = i === currentQuiz.answer;
    playSound(isCorrect ? 'correct' : 'wrong');
    if (voiceOn) {
      setTimeout(() => speak(isCorrect
        ? 'অসাধারণ! একদম ঠিক বলেছ!'
        : currentQuiz.explanation || 'আবার চেষ্টা করো!'), 300);
    }
    if (isCorrect) {
      setScore(s => s + 1);
      mascotReact('happy');
      showPopup('একদম ঠিক! শাবাশ! 🌟', '⭐', '#27ae60');
    } else {
      mascotReact('sad');
      showPopup('ভুল হয়েছে, কিন্তু শেখা হচ্ছে! 💪', '💡', '#e74c3c');
    }
  };

  /* ─── NEXT QUIZ ─── */
  const nextQuiz = () => {
    playSound('pop');
    stopSpeak();
    if (quizIdx < totalPractice - 1) {
      setQuizIdx(q => q + 1);
      setSelected(null);
      setAnswered(false);
      showPopup('পরের প্রশ্ন! মনোযোগ দাও 🎯', '➡️', '#3498db');
    } else {
      // All practice done
      setPhase(PHASE.COMPLETE);
      playSound('tada');
      mascotReact('dance');
      if (voiceOn) speak(`অভিনন্দন! তুমি ${totalPractice} টি প্রশ্নের মধ্যে ${score + (selected === currentQuiz?.answer ? 1 : 0)} টি সঠিক উত্তর দিয়েছ!`);
    }
  };

  /* ─── PROGRESS % ─── */
  const teachProgress = Math.round(((stepIdx + 1) / totalSteps) * 100);
  const practiceProgress = Math.round(((quizIdx + 1) / totalPractice) * 100);

  return (
    <div className="lesson-page" style={{ '--lesson-color': lesson.color }}>
      {/* Animated BG */}
      <div className="lesson-bg">
        <div className="lesson-bg-orb orb1"></div>
        <div className="lesson-bg-orb orb2"></div>
        <div className="lesson-bg-orb orb3"></div>
      </div>

      {/* TOP NAV */}
      <div className="lesson-topnav">
        <button className="back-btn" onClick={() => { stopSpeak(); navigate(-1); }}>
          ← ফিরে যাই
        </button>
        <div className="lesson-nav-info">
          <span className="lesson-id-badge">{lesson.id}</span>
          <span className="lesson-nav-title">{lesson.title}</span>
        </div>
        <button
          className={`voice-btn ${voiceOn ? 'on' : 'off'}`}
          onClick={() => { setVoiceOn(v => !v); stopSpeak(); playSound('pop'); }}
          title="ভয়েস অন/অফ"
        >
          {voiceOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="lesson-progress-wrap">
        <div className="lesson-progress-track">
          <motion.div
            className="lesson-progress-fill"
            animate={{ width: phase === PHASE.TEACH ? `${teachProgress}%` : phase === PHASE.PRACTICE ? `${practiceProgress}%` : '100%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="lesson-phase-label">
          {phase === PHASE.TEACH ? `পাঠ ${stepIdx + 1}/${totalSteps}` :
            phase === PHASE.PRACTICE ? `অনুশীলন ${quizIdx + 1}/${totalPractice}` : 'সম্পন্ন ✅'}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="lesson-body">

        {/* MASCOT */}
        <motion.div
          className="lesson-mascot"
          animate={
            mascotAnim === 'happy' ? { rotate: [0, 15, -15, 10, 0], scale: [1, 1.3, 1.2, 1] } :
              mascotAnim === 'sad' ? { x: [0, 10, -10, 8, -8, 0] } :
                mascotAnim === 'dance' ? { rotate: [0, 360], scale: [1, 1.4, 1] } :
                  { y: [0, -8, 0] }
          }
          transition={
            mascotAnim === 'idle' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } :
              { duration: 0.6 }
          }
        >
          {lesson.mascot}
        </motion.div>

        {/* TEACH PHASE */}
        <AnimatePresence mode="wait">
          {phase === PHASE.TEACH && currentStep && (
            <motion.div
              key={`step-${stepIdx}`}
              className="lesson-card"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            >
              {/* Step type badge */}
              <div className="step-type-badge">
                {currentStep.type === 'interactive' ? '🎮 গেম' :
                  currentStep.type === 'intro' ? '📖 ভূমিকা' :
                  currentStep.type === 'explain' ? '💡 ব্যাখ্যা' :
                    currentStep.type === 'visual' ? '🗺️ চিত্র' :
                      currentStep.type === 'example' ? '🔍 উদাহরণ' : '✏️ শিক্ষা'}
              </div>

              {/* Interactive Widget Rendering */}
              {currentStep.type === 'interactive' && currentStep.component === 'RobotChairsGame' && (
                <div style={{ margin: '20px 0' }}>
                  <RobotChairsGame />
                </div>
              )}
              {currentStep.type === 'interactive' && currentStep.component === 'NumberCrusherPlayground' && (
                <div style={{ margin: '20px 0' }}>
                  <NumberCrusherPlayground />
                </div>
              )}
              {currentStep.type === 'interactive' && currentStep.component === 'SystemRelationGame' && (
                <div style={{ margin: '20px 0' }}>
                  <SystemRelationGame />
                </div>
              )}

              {currentStep.type !== 'interactive' && (
                <>
                  <div className="step-emoji">{currentStep.emoji}</div>
                  <h2 className="step-heading">{currentStep.heading}</h2>
                  <p className="step-content">{currentStep.content}</p>
                </>
              )}

              {/* Highlight box */}
              {currentStep.highlight && (
                <motion.div
                  className="step-highlight"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentStep.highlight}
                </motion.div>
              )}

              {/* Place value table */}
              {currentStep.placeTable && (
                <div className="place-table">
                  {currentStep.placeTable.map((row, i) => (
                    <motion.div
                      key={i}
                      className={`place-row ${i === 0 ? 'header-row' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <span className="place-col col-bn">{row.place}</span>
                      <span className="place-col col-en">{row.en}</span>
                      <span className="place-col col-val">{row.value}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Digit breakdown */}
              {currentStep.breakdown && (
                <div className="digit-breakdown">
                  {currentStep.breakdown.map((item, i) => (
                    <motion.div
                      key={i}
                      className="digit-card"
                      style={{ borderColor: item.color, background: `${item.color}18` }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      <div className="digit-num" style={{ color: item.color }}>{item.digit}</div>
                      <div className="digit-place">{item.place}</div>
                      <div className="digit-val" style={{ color: item.color }}>{item.value}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Formula */}
              {currentStep.formula && (
                <motion.div
                  className="step-formula"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  {currentStep.formula}
                </motion.div>
              )}

              {/* Note */}
              {currentStep.note && (
                <div className="step-note">{currentStep.note}</div>
              )}

              {/* Nav buttons */}
              <div className="step-nav">
                <button className="lesson-btn secondary" onClick={goPrev} disabled={stepIdx === 0}>
                  ← আগে
                </button>
                <button
                  className="lesson-btn primary"
                  onClick={() => { playSound('pop'); if (voiceOn) speak(currentStep.voice || currentStep.heading); }}
                >
                  🔊 আবার শুনি
                </button>
                <button className="lesson-btn primary" onClick={goNext}>
                  {stepIdx < totalSteps - 1 ? 'পরের ধাপ →' : 'পড়া শেষ! 🎉'}
                </button>
              </div>
            </motion.div>
          )}

          {/* PRACTICE PHASE */}
          {phase === PHASE.PRACTICE && currentQuiz && (
            <motion.div
              key={`quiz-${quizIdx}`}
              className="lesson-card quiz-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 22 }}
            >
              <div className="quiz-header">
                <div className="quiz-number">প্রশ্ন {quizIdx + 1}/{totalPractice}</div>
                <div className="quiz-score-badge">✅ {score} সঠিক</div>
              </div>

              <div className="quiz-emoji">{currentQuiz.emoji}</div>
              <h2 className="quiz-question">{currentQuiz.question}</h2>

              <div className="options-list">
                {currentQuiz.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    className={`option-btn
                      ${answered && i === currentQuiz.answer ? 'correct' : ''}
                      ${answered && selected === i && i !== currentQuiz.answer ? 'wrong' : ''}
                      ${!answered ? 'unanswered' : ''}
                    `}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!answered ? { x: 8, scale: 1.02 } : {}}
                  >
                    <span className="option-letter">{['ক', 'খ', 'গ', 'ঘ'][i]}</span>
                    <span className="option-text">{opt}</span>
                    {answered && i === currentQuiz.answer && <span className="option-icon">✅</span>}
                    {answered && selected === i && i !== currentQuiz.answer && <span className="option-icon">❌</span>}
                  </motion.button>
                ))}
              </div>

              {/* Explanation after answer */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    className={`explanation-box ${selected === currentQuiz.answer ? 'correct-exp' : 'wrong-exp'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="exp-title">
                      {selected === currentQuiz.answer ? '🌟 দারুণ! সঠিক উত্তর!' : '💡 ব্যাখ্যা:'}
                    </div>
                    <div className="exp-text">{currentQuiz.explanation}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {answered && (
                <motion.button
                  className="lesson-btn primary"
                  onClick={nextQuiz}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {quizIdx < totalPractice - 1 ? 'পরের প্রশ্ন →' : 'সব শেষ! 🎊'}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === PHASE.COMPLETE && (
            <motion.div
              key="complete"
              className="lesson-card complete-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 150 }}
            >
              <div className="complete-fireworks">🎆🎇✨🌟💥</div>
              <motion.div
                className="complete-trophy"
                animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🏆
              </motion.div>
              <h2 className="complete-title">অভিনন্দন! 🎉</h2>
              <p className="complete-subtitle">
                তুমি <strong>{lesson.title}</strong> সম্পন্ন করেছ!
              </p>

              <div className="score-display">
                <div className="score-circle">
                  <div className="score-num">{score}/{totalPractice}</div>
                  <div className="score-label">সঠিক উত্তর</div>
                </div>
                <div className="xp-earned">
                  +{score * 20 + 50} XP
                </div>
              </div>

              <div className="complete-message">
                {score === totalPractice
                  ? '🌟 পারফেক্ট স্কোর! তুমি সত্যিই দারুণ!'
                  : score >= totalPractice / 2
                    ? '💪 ভালো করেছ! আরও একটু চর্চা করো!'
                    : '📖 আবার পড়লে আরও ভালো করবে!'}
              </div>

              <div className="complete-actions">
                <button className="lesson-btn secondary" onClick={() => { setPhase(PHASE.TEACH); setStepIdx(0); setScore(0); setQuizIdx(0); setSelected(null); setAnswered(false); playSound('whoosh'); stopSpeak(); }}>
                  🔄 আবার পড়ি
                </button>
                {nextLessonExists && (
                  <motion.button
                    className="lesson-btn primary next-lesson-btn"
                    onClick={() => { stopSpeak(); navigate(`/student/lesson/${nextSubId}`); }}
                    animate={{ boxShadow: ['0 0 0 0 rgba(52,152,219,0)', '0 0 0 12px rgba(52,152,219,0.3)', '0 0 0 0 rgba(52,152,219,0)'] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    পরের পাঠ: {LESSONS[nextSubId]?.title} →
                  </motion.button>
                )}
                <button className="lesson-btn secondary" onClick={() => { stopSpeak(); navigate('/student/math-hub'); }}>
                  ← চ্যাপ্টার লিস্টে ফিরি
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PERMISSION GATE MODAL */}
      <AnimatePresence>
        {showPermission && (
          <motion.div
            className="permission-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="permission-modal"
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 40 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="perm-mascot">{lesson.mascot}</div>
              <h3 className="perm-title">পড়া শেষ! 📖</h3>
              <p className="perm-msg">
                <strong>{lesson.title}</strong> পড়া হয়ে গেছে!<br />
                এখন কি অনুশীলন করতে চাও? <br />
                <span className="perm-sub">({totalPractice}টি প্রশ্ন আছে)</span>
              </p>
              <div className="perm-actions">
                <motion.button
                  className="lesson-btn primary perm-yes"
                  onClick={startPractice}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  হ্যাঁ! অনুশীলন করি 💪
                </motion.button>
                <button className="lesson-btn secondary" onClick={() => { setShowPermission(false); setStepIdx(0); playSound('pop'); }}>
                  আরেকবার পড়ি 🔄
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING POPUP */}
      <AnimatePresence>
        {popup && (
          <motion.div
            className="floating-popup"
            style={{ background: popup.color }}
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}
          >
            <span className="popup-emoji">{popup.emoji}</span>
            <span className="popup-text">{popup.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
