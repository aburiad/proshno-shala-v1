import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RobotChairsGame.css';

export default function NumberCrusherPlayground() {
  const [crushInput, setCrushInput] = useState("");
  const [crushResult, setCrushResult] = useState(null);

  const handleCrush = () => {
    if (!crushInput) {
      alert("আগে একটা সংখ্যা তো লেখো!");
      return;
    }
    const digits = crushInput.toString().split('');
    
    const localUnits = ['একক', 'দশক', 'শতক', 'সহস্র (হাজার)', 'অযুত', 'লক্ষ', 'নিযুত', 'কোটি'];
    const localData = digits.slice().reverse().map((d, i) => ({
      digit: d,
      unit: localUnits[i] || 'অজানা'
    }));

    const intlUnits = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands', 'Hundred Thousands', 'Millions'];
    const intlData = digits.slice().reverse().map((d, i) => ({
      digit: d,
      unit: intlUnits[i] || 'Unknown'
    }));

    setCrushResult({ digits, localData, intlData });
  };

  return (
    <div className="playground-area">
      <div className="crusher-header">
        <h3>স্থানীয় মানের ম্যাজিক! ✨</h3>
        <p>যেকোনো সংখ্যা লেখো, আর দেখো সেটা কীভাবে ভেঙে যায়!</p>
      </div>

      <div className="input-zone">
        <input 
          type="number" 
          value={crushInput}
          onChange={(e) => setCrushInput(e.target.value)}
          placeholder="যেমন: ৫২৭" 
          max="9999999" 
        />
        <button onClick={handleCrush} className="btn">ক্রাশ করো! 💥</button>
      </div>

      <AnimatePresence>
        {crushResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="crush-results-container"
          >
            <div className="number-row">
              {crushResult.digits.map((d, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  className="digit-box"
                >
                  {d}
                </motion.div>
              ))}
            </div>

            <div className="results-grid">
              <div className="system-box">
                <h4>🇧🇩 দেশীয় পদ্ধতি</h4>
                <ul className="result-list">
                  {crushResult.localData.map((item, i) => (
                    <li key={i}><b>{item.digit}</b> এর মান: {item.unit}</li>
                  ))}
                </ul>
              </div>
              <div className="system-box">
                <h4>🌐 আন্তর্জাতিক পদ্ধতি</h4>
                <ul className="result-list">
                  {crushResult.intlData.map((item, i) => (
                    <li key={i}><b>{item.digit}</b> is in: {item.unit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
