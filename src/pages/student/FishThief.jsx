import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './FishThief.css';
import useStudentStore from '@/store/studentStore';

export default function FishThief({ config, onClose, showToast }) {
  const [dialogue, setDialogue] = useState("আমি ৫টা মাছ খাইছি! ধরো দেহি! 😼");
  const [targetSign, setTargetSign] = useState("IIII");
  const [showOptions, setShowOptions] = useState(true);
  
  const catRef = useRef(null);
  const targetSignRef = useRef(null);
  const idleAnimRef = useRef(null);
  const { addXP } = useStudentStore();

  const playSound = (type) => {
    try {
      let url = "";
      if (type === "meow") url = "https://actions.google.com/sounds/v1/animals/cat_meow_short.ogg";
      if (type === "success") url = "https://actions.google.com/sounds/v1/cartoon/pop_and_boing.ogg";
      if (url) {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play();
      }
    } catch (e) {
      console.log('Audio playback failed', e);
    }
  };

  useEffect(() => {
    idleAnimRef.current = gsap.to(catRef.current, { 
      x: 20, 
      rotation: 5, 
      duration: 2, 
      yoyo: true, 
      repeat: -1, 
      ease: "sine.inOut" 
    });
    
    return () => {
      if (idleAnimRef.current) idleAnimRef.current.kill();
    };
  }, []);

  const handleSuccess = () => {
    playSound('success');
    gsap.fromTo(targetSignRef.current, { scale: 0.5 }, { scale: 1.2, duration: 0.5, ease: "back.out" });
    
    gsap.to(catRef.current, { x: 200, opacity: 0, duration: 1, ease: "power2.in" });
    
    setTimeout(() => {
      setShowOptions(false);
      showToast('+৬০ XP পয়েন্ট অর্জিত!');
      addXP(60);
    }, 1000);
  };

  const checkAnswer = (type) => {
    if (type === 'TallyCorrect') {
      setTargetSign("卌 (ট্যালি ৫)");
      setDialogue("আরে! তুমি তো ট্যালি চিনে গেছো! 🙀");
      handleSuccess();
    } else if (type === 'MayaCorrect') {
      setTargetSign("— (মায়া ৫)");
      setDialogue("মায়ানরা ১টা টান দিলেই ৫ বুঝতো! ওরে বাবা! 🧙‍♂️");
      handleSuccess();
    } else {
      playSound('meow');
      setDialogue("ভুল হইছে! বিলাই হাসতাছে হাহাহা! 😹");
      gsap.fromTo(catRef.current, { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 3 });
    }
  };

  const resetGame = () => {
    setDialogue("আমি ৫টা মাছ খাইছি! ধরো দেহি! 😼");
    setTargetSign("IIII");
    setShowOptions(true);
    
    gsap.killTweensOf(catRef.current);
    gsap.killTweensOf(targetSignRef.current);
    gsap.set(catRef.current, { clearProps: "all" });
    gsap.set(targetSignRef.current, { clearProps: "all" });
    
    idleAnimRef.current = gsap.to(catRef.current, { 
      x: 20, 
      rotation: 5, 
      duration: 2, 
      yoyo: true, 
      repeat: -1, 
      ease: "sine.inOut" 
    });
  };

  return (
    <div className="fish-thief-wrapper">
      <div className="playground-ft">
        <div className="header-ft">
          <h1>{config?.title || 'প্রাচীন গণনা: মাছ চুরির রহস্য! 🐟'}</h1>
          <p>বিলাই ৫টা মাছ চুরি করেছে! প্রাচীন চিহ্ন দেখে মালিকে উদ্ধার করো।</p>
        </div>

        <div className="game-area-ft">
          <div className="cat-zone-ft">
            <div ref={catRef} className="character-ft">🐈‍⬛</div>
            <div className="dialogue-ft">{dialogue}</div>
          </div>

          <div className="ancient-display-ft">
            <div ref={targetSignRef} className="sign-ft">{targetSign}</div>
            <small>(এটি কোন পদ্ধতি এবং কত সংখ্যা?)</small>
          </div>
        </div>

        {showOptions ? (
          <div className="controls-ft" id="options">
            <div className="option-group-ft">
              <span>ট্যালি ৫ কোনটা?</span>
              <button className="btn-ft ans-btn-ft" onClick={() => checkAnswer('TallyCorrect')}>卌</button>
              <button className="btn-ft ans-btn-ft" onClick={() => checkAnswer('Wrong')}>IIII</button>
            </div>
            
            <div className="option-group-ft">
              <span>মায়া ৫ কোনটা? (Maya)</span>
              <button className="btn-ft ans-btn-ft" onClick={() => checkAnswer('Wrong')}>●●●●●</button>
              <button className="btn-ft ans-btn-ft" onClick={() => checkAnswer('MayaCorrect')}>—</button>
            </div>
          </div>
        ) : (
          <button className="btn-ft outline-ft outline-ft-game" onClick={resetGame}>আবার খেলো 🔄</button>
        )}
        
        <button 
          onClick={onClose} 
          className="btn-press" 
          style={{ width: '100%', marginTop: '30px', padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '15px', fontWeight: 800 }}
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}
