import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useTheme } from '../ThemeContext';

function formatDate(timestamp) {
  if (!timestamp) return 'Just now';
  return timestamp.toDate().toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [newTag, setNewTag] = useState('Good');
  const [saving, setSaving] = useState(false);
  const { dark } = useTheme();

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    btn: dark ? '#333333' : '#111111',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px' };

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setEntries([]); setLoading(false); return; }
      const q = query(
        collection(db, 'journals'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    });
    return () => { unsubscribeAuth(); unsubscribeSnapshot(); };
  }, []);

  async function handleSave() {
    if (!newEntry.trim()) { alert('Please write something first!'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'journals'), {
        userId: auth.currentUser.uid, text: newEntry, tag: newTag,
        createdAt: serverTimestamp(),
      });
      setNewEntry(''); setWriting(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally { setSaving(false); }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text }}>Journal</h1>
          <p style={{ fontSize: '13px', color: t.sub, marginTop: '2px' }}>Your private, secure diary</p>
        </div>
        <button onClick={() => setWriting(true)}
          style={{ background: t.btn, color: '#ffffff', fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New Entry
        </button>
      </div>

      {writing && (
        <div style={{ ...card, marginBottom: '14px', borderColor: t.text }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: t.text, marginBottom: '8px' }}>Write your thoughts</p>
          <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            autoFocus
            style={{ width: '100%', height: '100px', background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px', fontSize: '13px', color: t.text, resize: 'none', outline: 'none', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select value={newTag} onChange={(e) => setNewTag(e.target.value)}
              style={{ fontSize: '13px', background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '7px 10px', color: t.text, outline: 'none' }}>
              <option>Good</option>
              <option>Calm</option>
              <option>Anxious</option>
              <option>Sad</option>
              <option>Angry</option>
            </select>
            <button onClick={handleSave} disabled={saving}
              style={{ background: t.btn, color: '#fff', fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
            <button onClick={() => setWriting(false)}
              style={{ background: 'transparent', color: t.sub, fontSize: '13px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading && <p style={{ fontSize: '13px', color: t.sub, textAlign: 'center', padding: '24px' }}>Loading...</p>}
        {!loading && entries.length === 0 && (
          <p style={{ fontSize: '13px', color: t.sub, textAlign: 'center', padding: '24px' }}>No journal entries yet. Click "+ New Entry" to write your first one!</p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} style={card}>
            <p style={{ fontSize: '11px', color: t.sub, marginBottom: '4px' }}>{formatDate(entry.createdAt)}</p>
            <p style={{ fontSize: '13px', color: t.text }}>{entry.text}</p>
            <span style={{ display: 'inline-block', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', marginTop: '8px', background: dark ? '#2a2a2a' : '#f0f0f0', color: t.sub, border: `1px solid ${t.border}` }}>
              {entry.tag}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: dark ? '#1a1a1a' : '#f5f5f5', borderRadius: '10px', border: `1px solid ${t.border}` }}>
        <p style={{ fontSize: '11px', color: t.sub, textAlign: 'center' }}>🔒 All entries are private and stored securely.</p>
      </div>
    </div>
  );
}

export default Journal;