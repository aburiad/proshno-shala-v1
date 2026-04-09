import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SystemRelationGame.css';

const INITIAL_PAIRS = [
  { id: 1, leftText: '১ মিলিয়ন', rightText: '১০ লক্ষ' },
  { id: 2, leftText: '১০ মিলিয়ন', rightText: '১ কোটি' },
  { id: 3, leftText: '১০০ হাজার', rightText: '১ লক্ষ' },
  { id: 4, leftText: '১ বিলিয়ন', rightText: '১০০ কোটি' }
];

// Fisher-Yates shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function SystemRelationGame() {
  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  
  const [mistake, setMistake] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const lefts = INITIAL_PAIRS.map(p => ({ uId: `L-${p.id}`, matchId: p.id, text: p.leftText }));
    const rights = INITIAL_PAIRS.map(p => ({ uId: `R-${p.id}`, matchId: p.id, text: p.rightText }));
    setLeftCards(shuffle(lefts));
    setRightCards(shuffle(rights));
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleLeftClick = (card) => {
    if (matchedIds.includes(card.matchId) || mistake) return;
    setSelectedLeft(card);
    checkMatch(card, selectedRight);
  };

  const handleRightClick = (card) => {
    if (matchedIds.includes(card.matchId) || mistake) return;
    setSelectedRight(card);
    checkMatch(selectedLeft, card);
  };

  const checkMatch = (left, right) => {
    if (left && right) {
      if (left.matchId === right.matchId) {
        // Correct match!
        setMatchedIds(prev => [...prev, left.matchId]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Incorrect match
        setMistake(true);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMistake(false);
        }, 800);
      }
    }
  };

  const isGameComplete = matchedIds.length === INITIAL_PAIRS.length;

  return (
    <div className="relation-game-container">
      <h2 className="rg-title">সম্পর্ক মেলাও! 🤝</h2>
      <p className="rg-sub">আন্তর্জাতিক পদ্ধতির সাথে দেশীয় পদ্ধতির সঠিক সম্পর্কটি খুঁজে নিয়ে মেলাও।</p>

      <div className="match-grid">
        <div className="match-col col-left">
          <div className="match-col-title">🌐 আন্তর্জাতিক</div>
          <AnimatePresence>
            {leftCards.map((card, i) => {
              const isMatched = matchedIds.includes(card.matchId);
              const isSelected = selectedLeft?.uId === card.uId;
              
              return (
                <motion.div
                  key={card.uId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: 1, x: 0,
                    x: (mistake && isSelected) ? [-5, 5, -5, 5, 0] : 0
                  }}
                  transition={{ delay: i * 0.1, duration: mistake ? 0.3 : 0.4 }}
                  className={`match-card left ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                  onClick={() => handleLeftClick(card)}
                >
                  {card.text}
                  {isMatched && <span style={{marginLeft: '10px'}}>✅</span>}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="match-col col-right">
          <div className="match-col-title">🇧🇩 দেশীয়</div>
          <AnimatePresence>
            {rightCards.map((card, i) => {
              const isMatched = matchedIds.includes(card.matchId);
              const isSelected = selectedRight?.uId === card.uId;

              return (
                <motion.div
                  key={card.uId}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ 
                    opacity: 1, x: 0,
                    x: (mistake && isSelected) ? [-5, 5, -5, 5, 0] : 0
                  }}
                  transition={{ delay: i * 0.1, duration: mistake ? 0.3 : 0.4 }}
                  className={`match-card right ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                  onClick={() => handleRightClick(card)}
                >
                  {isMatched && <span style={{marginRight: '10px'}}>✅</span>}
                  {card.text}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isGameComplete && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="win-message"
          >
            অসাধারণ! 🎉 তুমি সব সম্পর্ক ঠিকভাবে মিলিয়েছো! 
          </motion.div>
        )}
      </AnimatePresence>

      <button className="rg-btn" onClick={initializeGame}>
        {isGameComplete ? 'আবার খেলো 🔄' : 'রিসেট 🔄'}
      </button>
    </div>
  );
}
