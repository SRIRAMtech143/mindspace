import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure",
  "Trouble concentrating on things such as reading or watching TV",
  "Moving or speaking so slowly that other people could have noticed",
  "Thoughts that you would be better off dead or of hurting yourself",
];

const options = [
  { label: 'Not at all', score: 0 },
  { label: 'Several days', score: 1 },
  { label: 'More than half the days', score: 2 },
  { label: 'Nearly every day', score: 3 },
];

function getResult(score) {
  if (score <= 4) return {
    level: 'Minimal or No Depression',
    emoji: '😊',
    color: '#4ade80',
    message: 'You are doing well! Keep maintaining healthy habits like regular sleep, exercise, and social connections.',
    advice: 'Continue logging your mood daily and journaling to maintain your mental wellness.',
    action: null,
  };
  if (score <= 9) return {
    level: 'Mild Depression',
    emoji: '🙂',
    color: '#fbbf24',
    message: 'You may be experiencing some mild symptoms. This is common and manageable with self-care.',
    advice: 'Try the breathing exercises, maintain a regular sleep schedule, and consider talking to a trusted friend or counsellor.',
    action: 'Consider speaking with a counsellor if symptoms persist for more than 2 weeks.',
  };
  if (score <= 14) return {
    level: 'Moderate Depression',
    emoji: '😔',
    color: '#f97316',
    message: 'Your responses suggest moderate depression. It is important to take this seriously.',
    advice: 'We strongly recommend speaking with a mental health professional. You can also use the breathing exercises and AI support available in this app.',
    action: 'Please reach out to a counsellor or call iCall: 9152987821.',
  };
  if (score <= 19) return {
    level: 'Moderately Severe Depression',
    emoji: '😟',
    color: '#ef4444',
    message: 'Your responses indicate moderately severe depression. Please do not go through this alone.',
    advice: 'It is important to speak with a mental health professional as soon as possible.',
    action: 'Please contact iCall: 9152987821 or visit your campus counsellor immediately.',
  };
  return {
    level: 'Severe Depression',
    emoji: '🆘',
    color: '#dc2626',
    message: 'Your responses suggest severe depression. Please seek professional help immediately.',
    advice: 'This is serious and requires immediate professional attention. You are not alone and help is available.',
    action: 'Call iCall NOW: 9152987821 or go to your nearest mental health center immediately.',
  };
}

function Assessment() {
  const { dark } = useTheme();
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const t = {
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    btn: dark ? '#333333' : '#111111',
  };

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px', marginBottom: '14px' };

  function handleAnswer(qIndex, score) {
    const newAnswers = [...answers];
    newAnswers[qIndex] = score;
    setAnswers(newAnswers);
  }

  async function handleSubmit() {
    if (answers.includes(null)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    const total = answers.reduce((sum, a) => sum + a, 0);
    const res = getResult(total);
    setResult({ ...res, score: total });
    setSubmitted(true);

    setSaving(true);
    try {
      if (auth.currentUser) {
        await addDoc(collection(db, 'assessments'), {
          userId: auth.currentUser.uid,
          score: total,
          level: res.level,
          answers,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
    } finally { setSaving(false); }
  }

  function handleRetake() {
    setAnswers(Array(9).fill(null));
    setSubmitted(false);
    setResult(null);
  }

  const answered = answers.filter(a => a !== null).length;
  const progress = Math.round((answered / 9) * 100);

  return (
    <div style={{ padding: '24px', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>Depression Assessment</h1>
      <p style={{ fontSize: '13px', color: t.sub, marginBottom: '6px' }}>PHQ-9 — a clinically validated questionnaire used worldwide</p>
      <p style={{ fontSize: '12px', color: t.sub, marginBottom: '20px', padding: '10px 14px', background: dark ? '#1a1a1a' : '#f5f5f5', borderRadius: '8px', border: `1px solid ${t.border}` }}>
        ℹ️ This is a screening tool, not a diagnosis. Always consult a professional for medical advice.
      </p>

      {!submitted ? (
        <>
          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: t.sub }}>{answered} of 9 answered</span>
              <span style={{ fontSize: '12px', color: t.sub }}>{progress}%</span>
            </div>
            <div style={{ height: '6px', background: dark ? '#2a2a2a' : '#e0e0e0', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: dark ? '#ffffff' : '#111111', borderRadius: '3px', transition: 'width 0.3s' }}></div>
            </div>
          </div>

          {/* Questions */}
          <p style={{ fontSize: '13px', color: t.sub, marginBottom: '16px' }}>
            Over the <strong style={{ color: t.text }}>last 2 weeks</strong>, how often have you been bothered by the following?
          </p>

          {questions.map((q, i) => (
            <div key={i} style={card}>
              <p style={{ fontSize: '14px', color: t.text, fontWeight: 500, marginBottom: '14px' }}>
                <span style={{ color: t.sub, marginRight: '8px' }}>{i + 1}.</span>{q}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {options.map((opt) => (
                  <button key={opt.score} onClick={() => handleAnswer(i, opt.score)}
                    style={{
                      padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                      border: answers[i] === opt.score ? `2px solid ${t.text}` : `1px solid ${t.border}`,
                      background: answers[i] === opt.score ? (dark ? '#333' : '#f0f0f0') : 'transparent',
                      color: t.text, fontWeight: answers[i] === opt.score ? 600 : 400,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit}
            style={{ width: '100%', background: t.btn, color: '#fff', fontWeight: 600, fontSize: '14px', padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: answered < 9 ? 0.5 : 1 }}>
            {answered < 9 ? `Answer all questions (${9 - answered} remaining)` : 'See My Results'}
          </button>
        </>
      ) : (
        /* Results */
        <div>
          <div style={{ ...card, textAlign: 'center', padding: '32px 20px', border: `2px solid ${result.color}` }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>{result.emoji}</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: result.color, marginBottom: '8px' }}>{result.level}</h2>
            <div style={{ display: 'inline-block', fontSize: '28px', fontWeight: 700, color: result.color, background: dark ? '#222' : '#f5f5f5', padding: '8px 24px', borderRadius: '30px', marginBottom: '16px' }}>
              Score: {result.score} / 27
            </div>
            <p style={{ fontSize: '14px', color: t.text, lineHeight: 1.7, marginBottom: '12px' }}>{result.message}</p>
            <p style={{ fontSize: '13px', color: t.sub, lineHeight: 1.7 }}>{result.advice}</p>
          </div>

          {result.action && (
            <div style={{ ...card, border: `1px solid ${result.color}`, background: dark ? '#1a1a1a' : '#fff5f5' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: result.color, marginBottom: '4px' }}>⚠️ Important</p>
              <p style={{ fontSize: '13px', color: t.text }}>{result.action}</p>
            </div>
          )}

          {/* Score breakdown */}
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '12px' }}>Score Guide</p>
            {[
              { range: '0–4', label: 'Minimal or No Depression', color: '#4ade80' },
              { range: '5–9', label: 'Mild Depression', color: '#fbbf24' },
              { range: '10–14', label: 'Moderate Depression', color: '#f97316' },
              { range: '15–19', label: 'Moderately Severe Depression', color: '#ef4444' },
              { range: '20–27', label: 'Severe Depression', color: '#dc2626' },
            ].map((s) => (
              <div key={s.range} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }}></div>
                <span style={{ fontSize: '12px', color: t.sub, width: '40px' }}>{s.range}</span>
                <span style={{ fontSize: '12px', color: t.text }}>{s.label}</span>
                {result.score >= parseInt(s.range) && result.score <= parseInt(s.range.split('–')[1]) && (
                  <span style={{ fontSize: '11px', color: s.color, fontWeight: 600 }}>← You are here</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRetake}
              style={{ flex: 1, background: 'transparent', color: t.text, fontWeight: 600, fontSize: '14px', padding: '12px', borderRadius: '10px', border: `1px solid ${t.border}`, cursor: 'pointer' }}>
              Retake Assessment
            </button>
            <a href="/resources"
              style={{ flex: 1, background: t.btn, color: '#fff', fontWeight: 600, fontSize: '14px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Find Support →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessment;