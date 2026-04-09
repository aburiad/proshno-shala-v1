import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RobotChairsGame.css';

export default function RobotChairsGame() {
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [chairs, setChairs] = useState({ ones: null, tens: null, hundreds: null });
  const [message, setMessage] = useState("হাই বন্ধু! আমি রোবট ফ্যাক্টরির ম্যানেজার। যেকোনো রোবট বেছে নিয়ে জাদুর চেয়ারে বসাও!");

  const handleRobotClick = (digit) => {
    setSelectedDigit(digit);
    setMessage(`আমি ${digit}! আমাকে কোথায় বসাবে?`);
  };

  const handleChairClick = (place) => {
    if (selectedDigit === null) return;

    const newChairs = { ...chairs };
    newChairs[place] = selectedDigit;

    // Zero Trick: If placed in Hundreds but Ones/Tens are empty
    if (place === 'hundreds') {
      if (newChairs.tens === null) newChairs.tens = 0;
      if (newChairs.ones === null) newChairs.ones = 0;
      setMessage(`সাবধান! আমি এখন ${selectedDigit}০০! আমি এককের চেয়ে ১০০ গুণ বেশি শক্তিশালী! শূন্যরা এসে খালি জায়গা পূরণ করেছে!`);
    } else if (place === 'tens') {
      if (newChairs.ones === null) newChairs.ones = 0;
      setMessage(`ওহ হো! আমি আর এখন পুঁচকে ${selectedDigit} নই! আমি এখন ${selectedDigit}০! দশ গুণ শক্তি বেড়ে গেছে!`);
    } else {
      setMessage(`বাহ! ${selectedDigit} এখন এককের ঘরে। এর মান কিন্তু ${selectedDigit}-ই থাকলো।`);
    }

    setChairs(newChairs);
    setSelectedDigit(null);
  };

  const resetGame = () => {
    setChairs({ ones: null, tens: null, hundreds: null });
    setSelectedDigit(null);
    setMessage("চেয়ার খালি! আবার নতুন রোবট বসাও!");
  };

  return (
    <div className="game-area">
      <h2 className="game-title">অঙ্ক রোবট ও জাদুর চেয়ার 🪑✨</h2>
      
      <div className="robot-message">
        <AnimatePresence mode="wait">
          <motion.span
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="chairs-container">
        <div 
          className={`magic-chair ${selectedDigit !== null ? 'active' : ''}`}
          onClick={() => handleChairClick('hundreds')}
        >
          <div className="chair-label">শতক</div>
          <AnimatePresence>
            {chairs.hundreds !== null && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="seated-robot hundreds"
              >
                {chairs.hundreds * 100}
                <div className="original-val">স্বকীয়: {chairs.hundreds}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div 
          className={`magic-chair ${selectedDigit !== null ? 'active' : ''}`}
          onClick={() => handleChairClick('tens')}
        >
          <div className="chair-label">দশক</div>
          <AnimatePresence>
            {chairs.tens !== null && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="seated-robot tens"
              >
                {chairs.tens * 10}
                <div className="original-val">স্বকীয়: {chairs.tens}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div 
          className={`magic-chair ${selectedDigit !== null ? 'active' : ''}`}
          onClick={() => handleChairClick('ones')}
        >
          <div className="chair-label">একক</div>
          <AnimatePresence>
            {chairs.ones !== null && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="seated-robot ones"
              >
                {chairs.ones}
                <div className="original-val">স্বকীয়: {chairs.ones}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="robots-belt">
        {[1,2,3,4,5,6,7,8,9,0].map(num => (
          <div 
            key={num}
            className={`robot-item ${selectedDigit === num ? 'selected' : ''}`}
            onClick={() => handleRobotClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      <button className="reset-game-btn" onClick={resetGame}>রিসেট করো 🔄</button>
    </div>
  );
}
