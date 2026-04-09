import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './RomanMummy.css';
import useStudentStore from '@/store/studentStore';

export default function RomanMummy({ config, onClose, showToast }) {
  const [dialogue, setDialogue] = useState("আমার পাসওয়ার্ড ১০! কিন্তু রোমান ভাষায় ১০ কীভাবে লেখে ভাই? 🤕");
  const [showOptions, setShowOptions] = useState(true);
  const [chestContent, setChestContent] = useState("🧰");
  
  const mummyRef = useRef(null);
  const chestRef = useRef(null);
  const mummyIdleRef = useRef(null);
  
  const { addXP } = useStudentStore();

  useEffect(() => {
    // Start idle animation on mount
    mummyIdleRef.current = gsap.to(mummyRef.current, { 
      y: -10, 
      duration: 1, 
      yoyo: true, 
      repeat: -1, 
      ease: "sine.inOut" 
    });
    
    return () => {
      if (mummyIdleRef.current) mummyIdleRef.current.kill();
    };
  }, []);

  const checkAnswer = (answer, e) => {
    if (answer === 'X') {
      // Correct Answer!
      if (mummyIdleRef.current) mummyIdleRef.current.pause(); 
      
      gsap.to(chestRef.current, { 
        rotation: 15, 
        yoyo: true, 
        repeat: 3, 
        duration: 0.1, 
        onComplete: () => {
          setChestContent("💎👑✨"); 
          gsap.fromTo(chestRef.current, { scale: 0.5 }, { scale: 1.2, duration: 0.5, ease: "back.out(1.7)" });
          
          setDialogue("ইয়েস! আমার গুপ্তধন! তুমি তো জিনিয়াস! 🕺");
          gsap.to(mummyRef.current, { y: -30, rotation: 10, yoyo: true, repeat: -1, duration: 0.3, ease: "power1.inOut" });
          
          setShowOptions(false);
          showToast('+৫০ XP পয়েন্ট অর্জিত!');
          addXP(50);
        }
      });
    } else {
      // Wrong Answer!
      setDialogue("উফ! এটা না! আবার চেষ্টা করো! 😭");
      
      // Shake Mummy
      gsap.to(mummyRef.current, { x: 15, yoyo: true, repeat: 5, duration: 0.08 });
      
      // Shake Button
      const clickedBtn = e.target;
      gsap.to(clickedBtn, { 
        x: 5, 
        backgroundColor: "#e74c3c", 
        yoyo: true, 
        repeat: 3, 
        duration: 0.1, 
        onComplete: () => {
          gsap.to(clickedBtn, { backgroundColor: "#795548", duration: 0.2 }); 
          // Note: clearing props inline to allow CSS hover to work again
          setTimeout(() => gsap.set(clickedBtn, { clearProps: "backgroundColor,x" }), 200);
      }});
    }
  };

  const resetGame = () => {
    setChestContent("🧰");
    setDialogue("আমার পাসওয়ার্ড ১০! কিন্তু রোমান ভাষায় ১০ কীভাবে লেখে ভাই? 🤕");
    setShowOptions(true);
    
    gsap.killTweensOf(mummyRef.current);
    gsap.killTweensOf(chestRef.current);
    gsap.set(mummyRef.current, { clearProps: "all" });
    gsap.set(chestRef.current, { clearProps: "all" });
    
    mummyIdleRef.current = gsap.to(mummyRef.current, { 
      y: -10, 
      duration: 1, 
      yoyo: true, 
      repeat: -1, 
      ease: "sine.inOut" 
    });
  };

  return (
    <div className="roman-mummy-wrapper">
      <div className="playground-rm">
        <div className="header-rm">
          <h1>{config?.title || 'প্রাচীন গণনা: মমির সিন্দুক ⚰️'}</h1>
          <p>ভুলোমনা মমিকে রোমান সংখ্যা চিনে সিন্দুক খুলতে সাহায্য করো!</p>
        </div>

        <div className="game-area-rm">
          <div className="mummy-zone-rm">
            <div ref={mummyRef} className="character-rm">🧟‍♂️</div>
            <div className="dialogue-rm">{dialogue}</div>
          </div>

          <div className="chest-zone-rm">
            <div ref={chestRef} className="chest-rm">{chestContent}</div>
          </div>
        </div>

        {showOptions ? (
          <div className="controls-rm" id="options">
            <button className="btn-rm ans-btn-rm" onClick={(e) => checkAnswer('V', e)}>V</button>
            <button className="btn-rm ans-btn-rm" onClick={(e) => checkAnswer('X', e)}>X</button>
            <button className="btn-rm ans-btn-rm" onClick={(e) => checkAnswer('L', e)}>L</button>
          </div>
        ) : (
          <button className="btn-rm outline-rm outline-rm-game" onClick={resetGame}>আবার খেলো 🔄</button>
        )}
        
        <button 
          onClick={onClose} 
          className="btn-press" 
          style={{ width: '100%', marginTop: '30px', padding: '12px', background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '15px', fontWeight: 800 }}
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}
