import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Chat from './pages/Chat';
import Resources from './pages/Resources';
import Breathing from './pages/Breathing';
import Assessment from './pages/Assessment';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Login />
      ) : (
        <div className="flex h-screen">
          <Sidebar onLogout={() => signOut(auth)} userEmail={user.email} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/breathing" element={<Breathing />} />
              <Route path="/assessment" element={<Assessment />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;