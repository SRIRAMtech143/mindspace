import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

const exercises = [
  { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, desc: 'Great for anxiety and sleep' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, desc: 'Used by Navy SEALs for focus' },
  { name: 'Deep Breathing', inhale: 5, hold: 2, exhale: 6, desc: 'Simple everyday relaxation' },
];

function Breathing() {
  const { dark } = useTheme();
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  const ex = exercises[selected];

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    bg: dark ? '#111111' : '#f5f5f5',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px' };

  useEffect(() => {
    if (!running) return;
    const phases = [
      { name: 'inhale', duration: ex.inhale },
      { name: 'hold', duration: ex.hold },
      { name: 'exhale', duration: ex.exhale },
    ];
    let phaseIndex = phases.findIndex(p => p.name === phase);
    let currentCount = count;

    const interval = setInterval(() => {
      currentCount--;
      setCount(currentCount);
      if (currentCount <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) setCycles(c => c + 1);
        setPhase(phases[phaseIndex].name);
        currentCount = phases[phaseIndex].duration;
        setCount(currentCount);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);
  

  function startStop() {
    if (!running) {
      setPhase('inhale');
      setCount(ex.inhale);
      setCycles(0);
    }
    setRunning(!running);
  }

  const circleSize = phase === 'inhale' ? 180 : phase === 'hold' ? 180 : 120;
  const phaseColor = phase === 'inhale' ? '#4ade80' : phase === 'hold' ? '#60a5fa' : '#f472b6';
  const phaseLabel = phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale';

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>Breathing Exercises</h1>
      <p style={{ fontSize: '13px', color: t.sub, marginBottom: '20px' }}>Follow the circle to calm your mind</p>

      {/* Exercise Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {exercises.map((e, i) => (
          <button key={e.name} onClick={() => { setSelected(i); setRunning(false); setPhase('inhale'); setCount(0); }}
            style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${selected === i ? t.text : t.border}`, background: selected === i ? (dark ? '#333' : '#111') : 'transparent', color: selected === i ? '#fff' : t.sub, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            {e.name}
          </button>
        ))}
      </div>

      {/* Animated Circle */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', marginBottom: '16px' }}>
        <div style={{
          width: `${circleSize}px`, height: `${circleSize}px`,
          borderRadius: '50%',
          background: running ? phaseColor : (dark ? '#333' : '#e0e0e0'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          transition: 'all 1s ease',
          boxShadow: running ? `0 0 40px ${phaseColor}55` : 'none',
          marginBottom: '24px',
        }}>
          {running ? (
            <>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{count}</span>
              <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{phaseLabel}</span>
            </>
          ) : (
            <span style={{ fontSize: '14px', color: t.sub, textAlign: 'center', padding: '0 16px' }}>Press start to begin</span>
          )}
        </div>

        {running && (
          <p style={{ fontSize: '13px', color: t.sub, marginBottom: '16px' }}>Cycles completed: <strong style={{ color: t.text }}>{cycles}</strong></p>
        )}

        <button onClick={startStop}
          style={{ padding: '12px 32px', borderRadius: '24px', border: 'none', background: running ? (dark ? '#333' : '#555') : (dark ? '#ffffff' : '#111111'), color: running ? '#fff' : (dark ? '#111' : '#fff'), fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          {running ? 'Stop' : 'Start'}
        </button>
      </div>

      {/* Exercise Info */}
      <div style={card}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '8px' }}>{ex.name}</p>
        <p style={{ fontSize: '12px', color: t.sub, marginBottom: '12px' }}>{ex.desc}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[{ label: 'Inhale', val: ex.inhale }, { label: 'Hold', val: ex.hold }, { label: 'Exhale', val: ex.exhale }].map(s => (
            <div key={s.label} style={{ flex: 1, background: dark ? '#222' : '#f5f5f5', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: t.text }}>{s.val}s</p>
              <p style={{ fontSize: '11px', color: t.sub }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Breathing;