import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../ThemeContext';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dark } = useTheme();

  const t = {
    bg: dark ? '#111111' : '#f5f5f5',
    card: dark ? '#1a1a1a' : '#ffffff',
    border: dark ? '#2a2a2a' : '#e0e0e0',
    text: dark ? '#ffffff' : '#111111',
    sub: dark ? '#888888' : '#666666',
    input: dark ? '#222222' : '#f9f9f9',
    btn: dark ? '#333333' : '#111111',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, textAlign: 'center' }}>MindSpace</h1>
        <p style={{ fontSize: '13px', color: t.sub, textAlign: 'center', marginTop: '4px', marginBottom: '24px' }}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: t.text, outline: 'none' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: t.text, outline: 'none' }} />

          {error && (
            <p style={{ fontSize: '12px', color: '#ff6b6b', background: dark ? '#2a1a1a' : '#fff0f0', border: '1px solid #ff6b6b', borderRadius: '8px', padding: '8px 12px' }}>{error}</p>
          )}

          <button type="submit" disabled={loading}
            style={{ background: t.btn, color: '#ffffff', fontWeight: 600, fontSize: '14px', padding: '11px', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: '4px' }}>
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: t.sub, textAlign: 'center', marginTop: '20px' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }}
            style={{ background: 'none', border: 'none', color: t.text, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;