import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { to: '/mood', label: 'Mood Tracker', icon: 'ti-mood-smile' },
  { to: '/journal', label: 'Journal', icon: 'ti-notebook' },
  { to: '/breathing', label: 'Breathing', icon: 'ti-wind' },
  { to: '/chat', label: 'AI Support', icon: 'ti-message-circle' },
  { to: '/resources', label: 'Resources', icon: 'ti-books' },
  { to: '/assessment', label: 'Assessment', icon: 'ti-clipboard-check' },
];

function Sidebar({ onLogout, userEmail }) {
  const { dark, setDark } = useTheme();
  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="sidebar w-56 flex-shrink-0 flex flex-col h-screen">
      <div className="sidebar-header px-5 py-5">
        <h1 className="text-lg font-bold sidebar-logo">MindSpace</h1>
        <p className="text-[10px] mt-1 tracking-wide sidebar-sub">MENTAL WELLNESS</p>
      </div>
      <nav className="flex-1 p-3">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors nav-item"
            style={({ isActive }) => ({
              background: isActive ? (dark ? '#1d3a6e' : '#dbeafe') : 'transparent',
              color: isActive ? (dark ? '#60a5fa' : '#1d4ed8') : '',
            })}
          >
            <i className={`ti ${link.icon} text-base`}></i>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Emergency SOS */}
<div className="px-4 pb-2">
  <button
    onClick={() => {
      alert('🆘 CRISIS HELPLINES\n\niCall (India): 9152987821\niCall WhatsApp: 9152987821\nVandrevala Foundation: 1860-2662-345\nSNEHI: 044-24640050\n\nPlease reach out — you are not alone.');
    }}
    style={{
      width: '100%',
      background: '#dc2626',
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: 700,
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      letterSpacing: '0.3px',
    }}
  >
    🆘 Emergency Help
  </button>
</div>

      {/* Theme Toggle */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all theme-toggle"
        >
          <span className="text-sm font-medium">{dark ? '☀️ Light mode' : '🌙 Dark mode'}</span>
          <div
            className="w-10 h-5 rounded-full relative transition-all"
            style={{ background: dark ? '#3b82f6' : '#d1d5db' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow"
              style={{ left: dark ? '22px' : '2px' }}
            ></div>
          </div>
        </button>
      </div>

      <div className="p-4 sidebar-footer">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#3b82f6' }}>
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate sidebar-user">{userEmail}</p>
            <p className="text-xs sidebar-sub">Student</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full text-xs rounded-lg py-2 transition-colors logout-btn">
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;