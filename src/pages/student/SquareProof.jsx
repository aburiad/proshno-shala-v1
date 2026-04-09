import React, { useState } from 'react';
import useStudentStore from '@/store/studentStore';

export default function SquareProof({ config, onClose, showToast }) {
  const { addXP, completeTopic } = useStudentStore();
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);

  const total = a + b;
  const maxPx = 180;
  const scale = maxPx / total;
  const aPx = a * scale;
  const bPx = b * scale;
  const offset = 20;

  const handleComplete = () => {
    completeTopic('ab2');
    addXP(120);
    showToast('+120 XP পেয়ে গেছ! দারুণ! 🎉');
    onClose();
  };

  return (
    <div className="square-proof-lesson">
      <div className="modal-mascot">{config.mascot}</div>
      <div className="modal-title">{config.title}</div>
      <div className="modal-sub">{config.sub}</div>

      <div className="concept-box">
        <div className="concept-label">সূত্র</div>
        <div className="formula">(a + b)² = a² + 2ab + b²</div>
      </div>

      <div className="slider-row">
        <div className="slider-label">a</div>
        <input 
          type="range" 
          className="fun-slider" 
          min="1" max="8" 
          value={a} 
          onChange={(e) => setA(parseInt(e.target.value))} 
        />
        <div className="slider-val">{a}</div>
      </div>

      <div className="slider-row">
        <div className="slider-label">b</div>
        <input 
          type="range" 
          className="fun-slider" 
          min="1" max="8" 
          value={b} 
          onChange={(e) => setB(parseInt(e.target.value))} 
        />
        <div className="slider-val">{b}</div>
      </div>

      <div className="proof-area">
        <svg className="proof-svg" viewBox="0 0 240 230" style={{ maxWidth: '240px' }}>
          {/* a² block */}
          <rect 
            x={offset} y={offset} width={aPx} height={aPx} 
            fill="rgba(128,0,255,0.4)" stroke="#a064ff" strokeWidth="1.5" rx="4"
          />
          <text 
            x={offset + aPx/2} y={offset + aPx/2 + 5} 
            textAnchor="middle" fill="#c8a0ff" fontSize="13" fontWeight="700" 
            style={{ fontFamily: 'Baloo Da 2' }}
          >
            a²={a*a}
          </text>

          {/* ab block top-right */}
          <rect 
            x={offset + aPx} y={offset} width={bPx} height={aPx} 
            fill="rgba(255,107,157,0.35)" stroke="#ff6b9d" strokeWidth="1.5" rx="4"
          />
          <text 
            x={offset + aPx + bPx/2} y={offset + aPx/2 + 5} 
            textAnchor="middle" fill="#ff9dc7" fontSize="11" fontWeight="700" 
            style={{ fontFamily: 'Baloo Da 2' }}
          >
            ab={a*b}
          </text>

          {/* ab block bottom-left */}
          <rect 
            x={offset} y={offset + aPx} width={aPx} height={bPx} 
            fill="rgba(255,107,157,0.35)" stroke="#ff6b9d" strokeWidth="1.5" rx="4"
          />
          <text 
            x={offset + aPx/2} y={offset + aPx + bPx/2 + 5} 
            textAnchor="middle" fill="#ff9dc7" fontSize="11" fontWeight="700" 
            style={{ fontFamily: 'Baloo Da 2' }}
          >
            ab={a*b}
          </text>

          {/* b² block */}
          <rect 
            x={offset + aPx} y={offset + aPx} width={bPx} height={bPx} 
            fill="rgba(255,215,0,0.3)" stroke="#ffd700" strokeWidth="1.5" rx="4"
          />
          <text 
            x={offset + aPx + bPx/2} y={offset + aPx + bPx/2 + 5} 
            textAnchor="middle" fill="#ffd700" fontSize="11" fontWeight="700" 
            style={{ fontFamily: 'Baloo Da 2' }}
          >
            b²={b*b}
          </text>

          {/* Labels */}
          <text x={offset + aPx/2} y="12" textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="12" style={{ fontFamily: 'Baloo Da 2' }}>a={a}</text>
          <text x={offset + aPx + bPx/2} y="12" textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="12" style={{ fontFamily: 'Baloo Da 2' }}>b={b}</text>
          <text x="10" y={offset + aPx/2 + 4} textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="12" style={{ fontFamily: 'Baloo Da 2' }}>a</text>
          <text x="10" y={offset + aPx + bPx/2 + 4} textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="12" style={{ fontFamily: 'Baloo Da 2' }}>b</text>

          {/* Total */}
          <text 
            x="120" y="220" textAnchor="middle" fill="#ffd700" fontSize="13" fontWeight="700" 
            style={{ fontFamily: 'Baloo Da 2' }}
          >
            মোট = {(a+b)**2} বর্গ একক
          </text>
        </svg>
      </div>

      <div className="concept-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>যাচাই করো:</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffd700' }}>
          ({a}+{b})² = {(a + b) ** 2}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', marginTop: '6px' }}>
          {a}² + 2×{a}×{b} + {b}² = {a*a} + {2*a*b} + {b*b} = <span style={{ color: '#ffd700' }}>{a*a + 2*a*b + b*b}</span>
        </div>
      </div>

      <button className="action-btn btn-primary" onClick={handleComplete}>
        বুঝেছি! XP নাও 🎉
      </button>
    </div>
  );
}
