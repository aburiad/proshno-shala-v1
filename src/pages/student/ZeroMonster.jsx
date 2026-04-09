import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ZeroMonster.css';
import useStudentStore from '@/store/studentStore';

export default function ZeroMonster({ config, onClose, showToast }) {
  const [zeroCount, setZeroCount] = useState(2);
  const [dialogue, setDialogue] = useState("আমি জিরো খাই! খিদে পেয়েছে!");
  const [btnText, setBtnText] = useState("শূন্য খেয়ে ফেলো! 🌪️");
  const [btnOpacity, setBtnOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const monsterRef = useRef(null);
  const zero1Ref = useRef(null);
  const zero2Ref = useRef(null);
  const { addXP } = useStudentStore();

  const handleEat = () => {
    if (isAnimating) return;
    
    if (zeroCount > 0) {
      setIsAnimating(true);
      const targetZero = zeroCount === 2 ? zero2Ref.current : zero1Ref.current;
      const monster = monsterRef.current;
      
      let targetRect = targetZero.getBoundingClientRect();
      let monsterRect = monster.getBoundingClientRect();
      
      gsap.to(targetZero, {
        x: (monsterRect.left - targetRect.left) + 20,
        y: (monsterRect.top - targetRect.top) + 20,
        scale: 0.1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          targetZero.style.display = "none";
          
          gsap.fromTo(monster, 
            { scale: 0.8 }, 
            { scale: 1.3, duration: 0.3, yoyo: true, repeat: 1, ease: "bounce.out" }
          );
          
          setZeroCount(prev => {
            const newVal = prev - 1;
            if (newVal === 1) {
              setDialogue("ইয়াম্মি! ১০০ এখন শুধু ১০ হয়ে গেলো! 😋");
            } else {
              setDialogue("বাপরে! এখন তো এটা শুধু ১ হয়ে গেলো! 😱");
              setBtnText("আর শূন্য নেই!");
              setBtnOpacity(0.5);
              showToast('+৫০ XP পয়েন্ট অর্জিত!');
              addXP(50);
            }
            setIsAnimating(false);
            return newVal;
          });
        }
      });
    } else {
      setDialogue("আর শূন্য নাই! আমি কান্দুম! 😭");
      gsap.to(monsterRef.current, { x: 10, yoyo: true, repeat: 5, duration: 0.1 });
    }
  };

  const handleReset = () => {
    if (isAnimating) return;
    
    setZeroCount(2);
    setBtnText("শূন্য খেয়ে ফেলো! 🌪️");
    setBtnOpacity(1);
    setDialogue("আমি জিরো খাই! খিদে পেয়েছে!");
    
    const zeroes = [zero1Ref.current, zero2Ref.current];
    zeroes.forEach(zero => {
      zero.style.display = "inline-block";
      gsap.set(zero, { clearProps: "all" }); 
      gsap.from(zero, { scale: 0, rotation: 180, duration: 0.5, ease: "back.out(1.7)" });
    });
  };

  return (
    <div className="zero-monster-wrapper">
      <div className="playground-zm">
        <div className="header-zm">
          <h1>{config?.title || 'শূন্যের জাদু! 🪄'}</h1>
          <p>জিরো-খেকো মনস্টারকে শূন্য খেতে দাও, আর দেখো সংখ্যা কীভাবে ছোট হয়ে যায়!</p>
        </div>

        <div className="monster-zone-zm">
          <div ref={monsterRef} className="monster-zm">👾</div>
          <div className="dialogue-zm">{dialogue}</div>
        </div>

        <div className="number-zone-zm">
          <span className="digit-zm">1</span>
          <span ref={zero1Ref} className="digit-zm zero-zm">0</span>
          <span ref={zero2Ref} className="digit-zm zero-zm">0</span>
        </div>

        <div className="controls-zm">
          <button 
            onClick={handleEat} 
            className="btn-zm"
            style={{ opacity: btnOpacity }}
          >
            {btnText}
          </button>
          <button 
            onClick={handleReset} 
            className="btn-zm outline-zm"
          >
            আবার শুরু 🔄
          </button>
        </div>
        
        <button 
          onClick={onClose} 
          className="btn-press" 
          style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '15px', fontWeight: 800 }}
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}
