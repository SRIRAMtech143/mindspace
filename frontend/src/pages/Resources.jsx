import React from 'react';
import { useTheme } from '../ThemeContext';

const resources = [
  { icon: '🫁', title: 'Breathing Exercises', desc: 'Guided 4-7-8, box breathing, and diaphragmatic techniques for instant calm.' },
  { icon: '🧠', title: 'CBT Techniques', desc: 'Simple cognitive reframing exercises to challenge negative thought patterns.' },
  { icon: '🌙', title: 'Sleep Hygiene Guide', desc: 'Evidence-based routines to improve sleep quality during stressful periods.' },
  { icon: '🧑‍⚕️', title: 'Find a Counsellor', desc: "Connect with licensed therapists or your university's counselling centre." },
  { icon: '🤝', title: 'Peer Support Groups', desc: 'Anonymous student communities for shared experiences and mutual support.' },
  { icon: '📋', title: 'Stress Self-Assessment', desc: 'Take a validated PHQ-9 / GAD-7 self-assessment and share with a professional.' },
];

function Resources() {
  const { dark } = useTheme();

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    iconBg: dark ? '#222222' : '#f0f0f0',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px', cursor: 'pointer' };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>Resources</h1>
      <p style={{ fontSize: '13px', color: t.sub, marginBottom: '16px' }}>Wellness tools and professional support</p>

      <div style={{ ...card, marginBottom: '20px', borderColor: dark ? '#444' : '#ccc' }}>
        <p style={{ fontSize: '13px', color: t.text }}>
          <strong>If you're in crisis right now</strong>, please contact iCall: <strong>9152987821</strong> (India) or your campus counsellor immediately.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {resources.map((r) => (
          <div key={r.title} style={card}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>
              {r.icon}
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>{r.title}</h3>
            <p style={{ fontSize: '12px', color: t.sub, marginTop: '4px', lineHeight: 1.5 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;