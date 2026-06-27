import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

const sleepChecklist = [
  'Avoid screens 1 hour before bed',
  'Keep a consistent sleep schedule',
  'Keep your room cool and dark',
  'Avoid caffeine after 2 PM',
  'Do a 5 minute breathing exercise before sleep',
  'Write down tomorrow\'s tasks to clear your mind',
  'Avoid heavy meals within 2 hours of bedtime',
];

const helplines = [
  { name: 'iCall', number: '9152987821', desc: 'Free counselling by TISS Mumbai', available: 'Mon–Sat, 8AM–10PM' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health helpline', available: '24/7' },
  { name: 'SNEHI', number: '044-24640050', desc: 'Emotional support helpline', available: 'Mon–Sat, 8AM–10PM' },
  { name: 'iCall WhatsApp', number: '9152987821', desc: 'Chat support via WhatsApp', available: 'Mon–Sat, 8AM–10PM' },
  { name: 'Fortis Stress Helpline', number: '8376804102', desc: 'Mental health support', available: '24/7' },
];

const communities = [
  { name: 'Reddit r/mentalhealth', desc: 'Large supportive community for mental health discussions', url: 'https://reddit.com/r/mentalhealth' },
  { name: 'Reddit r/anxiety', desc: 'Community for people dealing with anxiety', url: 'https://reddit.com/r/anxiety' },
  { name: 'Reddit r/depression', desc: 'Supportive space for people experiencing depression', url: 'https://reddit.com/r/depression' },
  { name: 'iCall Online Community', desc: 'Indian mental health peer support community', url: 'https://icallhelpline.org' },
];

const cbtSteps = [
  { step: 'Identify the thought', placeholder: 'What negative thought are you having? e.g. "I am a failure"' },
  { step: 'Challenge it', placeholder: 'What evidence supports or contradicts this thought?' },
  { step: 'Reframe it', placeholder: 'Write a more balanced version of this thought...' },
];

function Resources() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [cbtAnswers, setCbtAnswers] = useState(['', '', '']);

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    btn: dark ? '#333333' : '#111111',
    hover: dark ? '#222222' : '#f5f5f5',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px', marginBottom: '12px' };

  function toggleExpand(key) {
    setExpanded(expanded === key ? null : key);
  }

  function toggleCheck(item) {
    setCheckedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>Resources</h1>
      <p style={{ fontSize: '13px', color: t.sub, marginBottom: '20px' }}>Wellness tools and professional support</p>

      {/* Crisis Banner */}
      <div style={{ ...card, borderColor: '#dc2626', background: dark ? '#1a1a1a' : '#fff5f5', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>🆘 In crisis right now?</p>
        <p style={{ fontSize: '13px', color: t.text, marginTop: '4px' }}>Call iCall immediately: <strong>9152987821</strong> or use the Emergency Help button in the sidebar.</p>
      </div>

      {/* 1 — Breathing Exercises */}
      <div style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/breathing')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🫁</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>Breathing Exercises</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>Guided 4-7-8, box breathing and more</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>→</span>
        </div>
        <div style={{ marginTop: '10px', padding: '8px 12px', background: t.hover, borderRadius: '8px', fontSize: '12px', color: t.sub }}>
          Click to open the interactive breathing exercise →
        </div>
      </div>

      {/* 2 — CBT Techniques */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand('cbt')}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧠</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>CBT Thought Reframing</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>Challenge and reframe negative thoughts</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>{expanded === 'cbt' ? '▲' : '▼'}</span>
        </div>
        {expanded === 'cbt' && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: t.sub, marginBottom: '14px' }}>Follow these 3 steps to challenge a negative thought:</p>
            {cbtSteps.map((s, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '6px' }}>{i + 1}. {s.step}</p>
                <textarea
                  value={cbtAnswers[i]}
                  onChange={(e) => {
                    const updated = [...cbtAnswers];
                    updated[i] = e.target.value;
                    setCbtAnswers(updated);
                  }}
                  placeholder={s.placeholder}
                  style={{ width: '100%', height: '70px', background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: t.text, resize: 'none', outline: 'none' }}
                />
              </div>
            ))}
            {cbtAnswers[2] && (
              <div style={{ padding: '12px', background: dark ? '#222' : '#f0fff4', borderRadius: '8px', border: `1px solid ${dark ? '#333' : '#86efac'}` }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: dark ? '#4ade80' : '#15803d' }}>✓ Your reframed thought:</p>
                <p style={{ fontSize: '13px', color: t.text, marginTop: '4px' }}>{cbtAnswers[2]}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 — Sleep Hygiene */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand('sleep')}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌙</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>Sleep Hygiene Checklist</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>{checkedItems.length}/7 habits completed tonight</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>{expanded === 'sleep' ? '▲' : '▼'}</span>
        </div>
        {expanded === 'sleep' && (
          <div style={{ marginTop: '14px' }}>
            {sleepChecklist.map((item, i) => (
              <div key={i} onClick={() => toggleCheck(item)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '6px', background: checkedItems.includes(item) ? (dark ? '#222' : '#f0fff4') : 'transparent' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${checkedItems.includes(item) ? '#4ade80' : t.border}`, background: checkedItems.includes(item) ? '#4ade80' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {checkedItems.includes(item) && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                </div>
                <p style={{ fontSize: '13px', color: checkedItems.includes(item) ? (dark ? '#4ade80' : '#15803d') : t.text, textDecoration: checkedItems.includes(item) ? 'line-through' : 'none' }}>{item}</p>
              </div>
            ))}
            {checkedItems.length === 7 && (
              <div style={{ padding: '10px', background: dark ? '#222' : '#f0fff4', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: dark ? '#4ade80' : '#15803d', fontWeight: 600, marginTop: '8px' }}>
                🎉 Perfect sleep hygiene tonight! Great job!
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4 — Find a Counsellor */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand('helplines')}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧑‍⚕️</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>Find a Counsellor</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>Indian helplines with click-to-call</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>{expanded === 'helplines' ? '▲' : '▼'}</span>
        </div>
        {expanded === 'helplines' && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {helplines.map((h) => (
              <div key={h.name} style={{ padding: '12px', background: t.hover, borderRadius: '10px', border: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>{h.name}</p>
                  <p style={{ fontSize: '11px', color: t.sub, marginTop: '2px' }}>{h.desc}</p>
                  <p style={{ fontSize: '11px', color: t.sub }}>{h.available}</p>
                </div>
                <a href={`tel:${h.number}`}
                  style={{ padding: '8px 14px', background: t.btn, color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  📞 {h.number}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5 — Peer Support Groups */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand('communities')}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤝</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>Peer Support Groups</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>Real online communities you can join</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>{expanded === 'communities' ? '▲' : '▼'}</span>
        </div>
        {expanded === 'communities' && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {communities.map((c) => (
              <div key={c.name} style={{ padding: '12px', background: t.hover, borderRadius: '10px', border: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>{c.name}</p>
                  <p style={{ fontSize: '11px', color: t.sub, marginTop: '2px' }}>{c.desc}</p>
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '8px 14px', background: t.btn, color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Visit →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6 — Stress Self-Assessment */}
      <div style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/assessment')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📋</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>Stress Self-Assessment</p>
              <p style={{ fontSize: '12px', color: t.sub, marginTop: '2px' }}>Take the PHQ-9 validated assessment</p>
            </div>
          </div>
          <span style={{ fontSize: '18px', color: t.sub }}>→</span>
        </div>
        <div style={{ marginTop: '10px', padding: '8px 12px', background: t.hover, borderRadius: '8px', fontSize: '12px', color: t.sub }}>
          Click to take the depression screening test →
        </div>
      </div>

    </div>
  );
}

export default Resources;