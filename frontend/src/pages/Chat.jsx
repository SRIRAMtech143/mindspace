import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useTheme } from '../ThemeContext';

const riskKeywords = ['suicide', 'kill myself', 'end my life', 'self harm', 'self-harm', "can't go on", 'want to die'];
const GREETING = { sender: 'bot', text: "Hi 👋 I'm here to listen. How are you feeling today? You can share anything — this is a safe space." };

function Chat() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const endRef = useRef(null);
  const { dark } = useTheme();

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    userBubble: dark ? '#333333' : '#111111',
    userText: '#ffffff',
    botBubble: dark ? '#222222' : '#f0f0f0',
    botText: dark ? '#e2e8f0' : '#111111',
  };

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setHistoryLoaded(true); return; }
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'asc')
      );
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const saved = snapshot.docs.map((doc) => doc.data());
        if (saved.length > 0) {
          setMessages([GREETING, ...saved.map((m) => ({ sender: m.sender, text: m.text, risk: m.risk || false }))]);
        }
        setHistoryLoaded(true);
      });
    });
    return () => { unsubscribeAuth(); unsubscribeSnapshot(); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function saveMessage(sender, text, risk = false) {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'chats'), {
        userId: auth.currentUser.uid, sender, text, risk, createdAt: serverTimestamp(),
      });
    } catch (err) { console.error(err); }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { sender: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    saveMessage('user', text);

    const isRisk = riskKeywords.some((k) => text.toLowerCase().includes(k));
    if (isRisk) {
      setTimeout(() => {
        const riskText = "I'm really concerned about what you shared. Your life matters. Please contact iCall: 9152987821 or talk to someone you trust immediately.";
        setMessages((prev) => [...prev, { sender: 'bot', text: riskText, risk: true }]);
        saveMessage('bot', riskText, true);
      }, 500);
      return;
    }

    setLoading(true);
    try {
      const apiMessages = newMessages.filter((m) => m !== GREETING).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant', content: m.text,
      }));
      const response = await fetch('https://mindspace-jjgj.onrender.com/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        saveMessage('bot', data.reply);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: "I couldn't connect right now. Please make sure the backend server is running." }]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text }}>AI Support</h1>
        <p style={{ fontSize: '13px', color: t.sub, marginTop: '2px' }}>A safe space to talk — available 24/7</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
        {!historyLoaded && <p style={{ fontSize: '13px', color: t.sub, textAlign: 'center', padding: '16px' }}>Loading...</p>}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px', borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              fontSize: '13px', lineHeight: 1.5,
              background: m.risk ? (dark ? '#2a1a1a' : '#fff0f0') : m.sender === 'user' ? t.userBubble : t.botBubble,
              color: m.risk ? '#ff6b6b' : m.sender === 'user' ? t.userText : t.botText,
              border: m.risk ? '1px solid #ff6b6b' : 'none',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ background: t.botBubble, color: t.sub, padding: '10px 14px', borderRadius: '16px 16px 16px 4px', fontSize: '13px' }}>Typing...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{ flex: 1, background: t.input, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '10px 16px', fontSize: '13px', color: t.text, outline: 'none' }} />
        <button onClick={handleSend} disabled={loading}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: dark ? '#333333' : '#111111', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '16px', opacity: loading ? 0.5 : 1 }}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;