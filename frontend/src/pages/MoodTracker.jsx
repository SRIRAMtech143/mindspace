import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useTheme } from '../ThemeContext';

const moods = [
  { emoji: '😄', label: 'Great', score: 10 },
  { emoji: '🙂', label: 'Good', score: 7 },
  { emoji: '😐', label: 'Okay', score: 5 },
  { emoji: '😔', label: 'Low', score: 3 },
  { emoji: '😟', label: 'Anxious', score: 3 },
  { emoji: '😢', label: 'Sad', score: 2 },
];

function MoodTracker() {
  const [selected, setSelected] = useState(null);
  const [slider, setSlider] = useState(5);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const { dark } = useTheme();

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    inputBorder: dark ? '#333333' : '#e0e0e0',
    btn: dark ? '#333333' : '#111111',
    btnText: '#ffffff',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px' };

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  async function handleSave() {
    if (!selected) { alert('Please select a mood first!'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'moods'), {
        userId: auth.currentUser.uid,
        mood: selected, score: slider, note,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setNote(''); setSelected(null);
    } catch (err) {
      alert('Error saving mood: ' + err.message);
    } finally { setSaving(false); }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>Mood Tracker</h1>
      <p style={{ fontSize: '13px', color: t.sub, marginBottom: '20px' }}>How are you feeling right now?</p>

      <div style={{ ...card, marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: t.text, marginBottom: '12px' }}>Select your mood</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {moods.map((m) => (
            <button key={m.label} onClick={() => setSelected(m.label)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', borderRadius: '10px', border: selected === m.label ? `2px solid ${t.text}` : `1px solid ${t.border}`, background: selected === m.label ? (dark ? '#2a2a2a' : '#f0f0f0') : 'transparent', cursor: 'pointer' }}>
              <span style={{ fontSize: '28px', marginBottom: '4px' }}>{m.emoji}</span>
              <span style={{ fontSize: '12px', color: t.sub }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...card, marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: t.text }}>Rate on a scale of 1–10</p>
          <span style={{ fontSize: '22px', fontWeight: 700, color: t.text }}>{slider}</span>
        </div>
        <input type="range" min="1" max="10" value={slider}
          onChange={(e) => setSlider(Number(e.target.value))}
          style={{ width: '100%', accentColor: dark ? '#ffffff' : '#111111' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: t.sub, marginTop: '4px' }}>
          <span>1 - Very low</span><span>10 - Excellent</span>
        </div>
      </div>

      <div style={{ ...card, marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: t.text, marginBottom: '8px' }}>Add a note (optional)</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind today?"
          style={{ width: '100%', height: '90px', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '10px', fontSize: '13px', color: t.text, resize: 'none', outline: 'none' }} />
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', background: t.btn, color: t.btnText, fontWeight: 600, fontSize: '14px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving...' : 'Save Mood Log'}
      </button>

      {saved && (
        <div style={{ marginTop: '12px', background: dark ? '#1a1a1a' : '#f0f0f0', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '10px', textAlign: 'center', fontSize: '13px', color: t.text }}>
          ✓ Mood logged successfully!
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: t.text, marginBottom: '10px' }}>Your recent logs</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.slice(0, 5).map((h) => (
              <div key={h.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', color: t.text }}>{h.mood}</span>
                  {h.note && <p style={{ fontSize: '11px', color: t.sub, marginTop: '2px' }}>{h.note}</p>}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>{h.score}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;