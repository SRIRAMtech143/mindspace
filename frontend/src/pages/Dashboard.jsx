import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../ThemeContext';

function formatDay(timestamp) {
  if (!timestamp) return '...';
  return timestamp.toDate().toLocaleDateString('en-US', { weekday: 'short' });
}

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  const t = {
    bg: dark ? '#111111' : '#f5f5f5',
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    accent: dark ? '#ffffff' : '#111111',
    bar: dark ? '#555555' : '#333333',
    barLow: dark ? '#333333' : '#bbbbbb',
  };
  const quotes = [
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", author: "Lori Deschene" },
  { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer" },
  { text: "You are not your illness. You have an individual story to tell.", author: "Julian Seifter" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "You are enough just as you are.", author: "Meghan Markle" },
];

const todayQuote = quotes[new Date().getDay() % quotes.length];
const getBadges = (logs, streak) => {
  const badges = [];
  if (logs.length >= 1) badges.push({ emoji: '🌱', label: 'First Step', desc: 'Logged your first mood' });
  if (logs.length >= 5) badges.push({ emoji: '⭐', label: 'Getting Started', desc: '5 mood logs' });
  if (logs.length >= 10) badges.push({ emoji: '🔥', label: 'On Fire', desc: '10 mood logs' });
  if (logs.length >= 20) badges.push({ emoji: '💎', label: 'Dedicated', desc: '20 mood logs' });
  if (streak >= 3) badges.push({ emoji: '📅', label: '3 Day Streak', desc: 'Logged 3 days in a row' });
  if (streak >= 7) badges.push({ emoji: '🏆', label: 'Week Warrior', desc: '7 day streak' });
  return badges;
};

const getStreak = (logs) => {
  if (logs.length === 0) return 0;
  let streak = 1;
  for (let i = 0; i < logs.length - 1; i++) {
    if (!logs[i].createdAt || !logs[i + 1].createdAt) break;
    const diff = logs[i].createdAt.toDate() - logs[i + 1].createdAt.toDate();
    if (diff < 86400000 * 2) { streak++; } else { break; }
  }
  return streak;
};

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setLoading(false); return; }
      const q = query(
        collection(db, 'moods'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        setLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    });
    return () => { unsubscribeAuth(); unsubscribeSnapshot(); };
  }, []);

  const last7 = [...logs].slice(0, 7).reverse();
  const currentMood = logs[0]?.score ?? '--';
  const weeklyAvg = last7.length ? (last7.reduce((s, l) => s + l.score, 0) / last7.length).toFixed(1) : '--';
  const recentLow = logs.slice(0, 3);
  const streak = getStreak(logs);
  const badges = getBadges(logs, streak);
  const showRiskAlert = recentLow.length >= 3 && recentLow.every((l) => l.score <= 4);

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px' };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {showRiskAlert && (
        <div style={{ ...card, marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <p style={{ color: t.text, fontWeight: 600, fontSize: '14px' }}>Elevated stress detected</p>
            <p style={{ color: t.sub, fontSize: '12px', marginTop: '4px' }}>Your mood has been low for 3+ check-ins. Consider speaking with a counsellor.</p>
            <a href="/resources" style={{ color: t.text, fontSize: '12px', fontWeight: 500, textDecoration: 'underline', display: 'inline-block', marginTop: '6px' }}>Find support →</a>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Current Mood', value: currentMood !== '--' ? `${currentMood}/10` : '--', sub: logs.length > 0 ? 'Latest check-in' : 'No logs yet' },
          { label: 'Total Check-ins', value: logs.length, sub: 'All time' },
          { label: 'Recent Avg', value: weeklyAvg, sub: `Last ${last7.length} logs` },
          { label: 'Status', value: loading ? '...' : 'Live', sub: 'Synced to cloud' },
        ].map((m) => (
          <div key={m.label} style={card}>
            <p style={{ fontSize: '11px', color: t.sub, marginBottom: '6px' }}>{m.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: t.text }}>{m.value}</p>
            <p style={{ fontSize: '11px', color: t.sub, marginTop: '4px' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Mood Chart */}
      <div style={{ ...card, marginBottom: '20px', padding: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '16px' }}>Mood — recent check-ins</p>
        {last7.length === 0 ? (
          <p style={{ fontSize: '13px', color: t.sub, textAlign: 'center', padding: '24px 0' }}>No mood logs yet. Head to Mood Tracker to log your first one!</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
            {last7.map((log) => (
              <div key={log.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: t.sub }}>{log.score}</span>
                <div style={{ width: '100%', height: `${log.score * 10}px`, background: log.score >= 5 ? t.bar : t.barLow, borderRadius: '4px 4px 2px 2px' }}></div>
                <span style={{ fontSize: '10px', color: t.sub }}>{formatDay(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* Streak & Badges */}
{badges.length > 0 && (
  <div style={{ ...card, marginBottom: '20px', padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>Your Achievements</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: dark ? '#222' : '#f0f0f0', padding: '4px 12px', borderRadius: '20px' }}>
        <span style={{ fontSize: '14px' }}>🔥</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: t.text }}>{streak} day streak</span>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {badges.map((b) => (
        <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: dark ? '#222' : '#f5f5f5', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px 16px', minWidth: '80px' }}>
          <span style={{ fontSize: '28px', marginBottom: '4px' }}>{b.emoji}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: t.text, textAlign: 'center' }}>{b.label}</span>
          <span style={{ fontSize: '10px', color: t.sub, textAlign: 'center', marginTop: '2px' }}>{b.desc}</span>
        </div>
      ))}
      {/* Locked badges */}
      {logs.length < 20 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: dark ? '#1a1a1a' : '#f0f0f0', border: `1px dashed ${t.border}`, borderRadius: '10px', padding: '12px 16px', minWidth: '80px', opacity: 0.4 }}>
          <span style={{ fontSize: '28px', marginBottom: '4px' }}>🔒</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: t.sub, textAlign: 'center' }}>More to unlock</span>
          <span style={{ fontSize: '10px', color: t.sub, textAlign: 'center', marginTop: '2px' }}>Keep logging!</span>
        </div>
      )}
    </div>
  </div>
)}
      {/* Daily Quote */}
<div style={{ ...card, marginBottom: '20px', padding: '20px' }}>
  <p style={{ fontSize: '11px', color: t.sub, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Wellness Quote</p>
  <p style={{ fontSize: '15px', color: t.text, lineHeight: 1.6, fontStyle: 'italic', marginBottom: '8px' }}>"{todayQuote.text}"</p>
  <p style={{ fontSize: '12px', color: t.sub }}>— {todayQuote.author}</p>
</div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { href: '/mood', icon: '😊', title: 'Log Today\'s Mood', sub: 'Track how you\'re feeling' },
          { href: '/journal', icon: '📓', title: 'Write in Journal', sub: 'Express your thoughts' },
          { href: '/chat', icon: '💬', title: 'Talk to AI Support', sub: 'Chat with MindSpace AI' },
        ].map((a) => (
          <a key={a.href} href={a.href} style={{ ...card, textDecoration: 'none', display: 'block' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>{a.icon}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: t.text }}>{a.title}</p>
            <p style={{ fontSize: '12px', color: t.sub, marginTop: '3px' }}>{a.sub}</p>
          </a>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;