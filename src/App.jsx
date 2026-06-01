import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Parser from './components/Parser';
import UsageTracker from './components/UsageTracker';
import CancelAssistant from './components/CancelAssistant';
import Login from './components/Login';
import { User, Bell, HelpCircle, Palette, Check, X } from 'lucide-react';

const THEMES = {
  crimson: {
    label: 'CRIMSON',
    primary: '#ff2a44',
    primaryHover: '#ff475f',
    primaryGlow: 'rgba(255, 42, 68, 0.35)',
    primaryBorder: 'rgba(255, 42, 68, 0.25)',
  },
  violet: {
    label: 'NEON VIOLET',
    primary: '#a855f7',
    primaryHover: '#c084fc',
    primaryGlow: 'rgba(168, 85, 247, 0.35)',
    primaryBorder: 'rgba(168, 85, 247, 0.25)',
  },
  cyan: {
    label: 'CYBER CYAN',
    primary: '#06b6d4',
    primaryHover: '#22d3ee',
    primaryGlow: 'rgba(6, 182, 212, 0.35)',
    primaryBorder: 'rgba(6, 182, 212, 0.25)',
  },
  emerald: {
    label: 'EMERALD',
    primary: '#10b981',
    primaryHover: '#34d399',
    primaryGlow: 'rgba(16, 185, 129, 0.35)',
    primaryBorder: 'rgba(16, 185, 129, 0.25)',
  },
  gold: {
    label: 'SOLAR GOLD',
    primary: '#f59e0b',
    primaryHover: '#fbbf24',
    primaryGlow: 'rgba(245, 158, 11, 0.35)',
    primaryBorder: 'rgba(245, 158, 11, 0.25)',
  },
  phantom: {
    label: 'PHANTOM BLUE',
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryGlow: 'rgba(59, 130, 246, 0.35)',
    primaryBorder: 'rgba(59, 130, 246, 0.25)',
  },
};

const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    name: 'Netflix',
    category: 'Streaming',
    price: 649.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-29',
    usageScore: 88,
    status: 'active',
  },
  {
    id: 2,
    name: 'Spotify',
    category: 'Music',
    price: 119.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-15',
    usageScore: 92,
    status: 'active',
  },
  {
    id: 3,
    name: 'Adobe Creative Cloud',
    category: 'Creative',
    price: 4299.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-24',
    usageScore: 15,
    status: 'active',
    anomaly: {
      type: 'price_hike',
      desc: 'Unannounced price increase! Price raised from ₹4099.00 to ₹4299.00 (+4.8%) without notification.'
    }
  },
  {
    id: 4,
    name: 'Google One',
    category: 'Cloud',
    price: 130.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-22',
    usageScore: 85,
    status: 'active',
  },
  {
    id: 5,
    name: 'Dropbox',
    category: 'Cloud',
    price: 899.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-18',
    usageScore: 8,
    status: 'active',
  },
  {
    id: 6,
    name: 'Unknown *998',
    category: 'Anomaly',
    price: 799.00,
    billingInterval: 'monthly',
    nextBillingDate: '2026-06-03',
    usageScore: 0,
    status: 'active',
    anomaly: {
      type: 'double_billing',
      desc: 'Double billing threat! Two charges matching this description were detected within 3 days (May 26 and May 29).'
    }
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubToCancel, setSelectedSubToCancel] = useState(null);
  const [profile, setProfile] = useState({
    name: 'NOOR',
    status: 'SECURE',
    budgetLimit: 8000,
    email: 'noor@sentry.ai'
  });
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [activeTheme, setActiveTheme] = useState('crimson');
  const profileRef = useRef(null);

  // Apply theme CSS variables
  useEffect(() => {
    const theme = THEMES[activeTheme];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary-red', theme.primary);
    root.style.setProperty('--primary-red-hover', theme.primaryHover);
    root.style.setProperty('--primary-red-glow', theme.primaryGlow);
    root.style.setProperty('--primary-red-border', theme.primaryBorder);
  }, [activeTheme]);

  // Click-outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileEditor(false);
      }
    };
    if (showProfileEditor) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileEditor]);

  const handleLogin = (userData) => {
    setProfile({
      name: userData.name,
      status: userData.role === 'ADMINISTRATOR' ? 'SECURE (ADMIN)' : 'SECURE',
      budgetLimit: userData.budgetLimit,
      email: userData.email
    });
    setIsAuthenticated(true);
  };

  const activeSubs = subscriptions.filter(sub => sub.status === 'active');
  const totalSpend = activeSubs.reduce((acc, sub) => acc + sub.price, 0);

  // Statistics
  const activeCount = subscriptions.filter(sub => sub.status === 'active').length;
  const alertCount = subscriptions.filter(sub => sub.status === 'active' && (sub.anomaly || sub.usageScore < 30)).length;

  const handleAddSubscription = (newSub) => {
    setSubscriptions(prev => [newSub, ...prev]);
  };

  const handleCancelSubscription = (subId) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subId) {
        return { ...sub, status: 'cancelled' };
      }
      return sub;
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            subscriptions={subscriptions} 
            activeTab={activeTab}
            setActiveTab={setActiveTab} 
          />
        );
      case 'parser':
        return (
          <Parser 
            onAddSubscription={handleAddSubscription} 
          />
        );
      case 'usage':
        return (
          <UsageTracker 
            subscriptions={subscriptions} 
            setSubscriptions={setSubscriptions} 
            setActiveTab={setActiveTab}
            setSelectedSubToCancel={setSelectedSubToCancel}
          />
        );
      case 'cancel':
        return (
          <CancelAssistant 
            subscriptions={subscriptions} 
            onCancelSubscription={handleCancelSubscription}
            selectedSub={selectedSubToCancel}
            setSelectedSub={setSelectedSubToCancel}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        subCount={subscriptions.filter(sub => sub.status === 'active' && sub.usageScore < 30).length} 
        alertCount={alertCount}
      />

      {/* Main Panel */}
      <main className="main-content-wrapper">
        {/* Top bar header */}
        <header className="main-header glass-panel">
          <div className="header-breadcrumbs">
            <span className="root font-cyber">SUBSENTRY_OS</span>
            <span className="separator">/</span>
            <span className="current font-cyber">{activeTab.toUpperCase()}</span>
          </div>

          <div className="header-controls">
            <button className="control-btn glass-panel" title="Notifications">
              <Bell size={16} />
              {alertCount > 0 && <span className="btn-badge font-cyber">{alertCount}</span>}
            </button>
            <button className="control-btn glass-panel" title="System Settings">
              <HelpCircle size={16} />
            </button>
            <div className="profile-container" ref={profileRef}>
              <div 
                className="user-profile glass-panel" 
                onClick={() => setShowProfileEditor(!showProfileEditor)}
              >
                <User size={16} className="glow-text-red" />
                <span className="username font-cyber">
                  {profile.name} // {totalSpend > profile.budgetLimit ? 'OVER BUDGET' : alertCount > 0 ? 'ATTENTION' : 'SECURE'}
                </span>
              </div>

              {showProfileEditor && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setShowProfileEditor(false)} />
                  <div className="profile-editor-dropdown glass-panel-neon">
                    <div className="editor-header">
                      <div className="editor-title font-cyber glow-text-red">SECURITY PARAMETERS</div>
                      <button className="close-dropdown-btn" onClick={() => setShowProfileEditor(false)}>
                        <X size={14} />
                      </button>
                    </div>
                    <div className="editor-form">
                      <div className="form-group">
                        <label className="font-cyber">ALIAS</label>
                        <input 
                          type="text" 
                          value={profile.name} 
                          onChange={(e) => setProfile({ ...profile, name: e.target.value.toUpperCase() })}
                          className="editor-input"
                          placeholder="Enter your alias..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="font-cyber">SECURITY EMAIL</label>
                        <input 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="editor-input"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="form-group">
                        <label className="font-cyber">BUDGET LIMIT (₹)</label>
                        <input 
                          type="number" 
                          value={profile.budgetLimit} 
                          onChange={(e) => setProfile({ ...profile, budgetLimit: parseFloat(e.target.value) || 0 })}
                          className="editor-input"
                          placeholder="8000"
                        />
                      </div>

                      {/* Theme Selector */}
                      <div className="form-group">
                        <label className="font-cyber" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Palette size={10} /> COLOR THEME
                        </label>
                        <div className="theme-grid">
                          {Object.entries(THEMES).map(([key, theme]) => (
                            <button
                              key={key}
                              className={`theme-swatch ${activeTheme === key ? 'active' : ''}`}
                              style={{ '--swatch-color': theme.primary }}
                              onClick={() => setActiveTheme(key)}
                              title={theme.label}
                            >
                              <span className="swatch-fill" style={{ background: theme.primary }} />
                              {activeTheme === key && <Check size={12} className="swatch-check" />}
                              <span className="swatch-label font-cyber">{theme.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="editor-actions">
                        <button 
                          className="btn-cyber font-cyber" 
                          onClick={() => setShowProfileEditor(false)}
                          style={{ padding: '8px 16px', fontSize: '10px', width: '100%' }}
                        >
                          ✓ LOCK STATE
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View render */}
        <div className="view-canvas">
          {renderTabContent()}
        </div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .main-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        /* CRITICAL: header must be positioned and have high z-index
           so the dropdown floats above the dashboard content */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: rgba(16, 16, 22, 0.4);
          border-color: var(--border-color);
          position: relative;
          z-index: 1000;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .header-breadcrumbs .root {
          color: var(--text-muted);
          font-weight: 500;
        }

        .header-breadcrumbs .separator {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .header-breadcrumbs .current {
          color: var(--primary-red);
          font-weight: 700;
          text-shadow: 0 0 8px var(--primary-red-glow);
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--text-secondary);
          border-color: var(--border-color);
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
        }

        .control-btn:hover {
          color: var(--primary-red);
          border-color: var(--primary-red-border);
        }

        .control-btn .btn-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--primary-red);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 6px var(--primary-red);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: transparent;
          border-color: var(--border-color);
          border-radius: 6px;
          user-select: none;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .user-profile:hover {
          border-color: var(--primary-red-border);
          background: rgba(255, 255, 255, 0.03);
        }

        .user-profile .username {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* Profile Container — stacking context anchor */
        .profile-container {
          position: relative;
        }

        /* Semi-transparent backdrop behind dropdown */
        .dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          animation: fadeIn 0.15s ease-out;
        }

        /* Profile Editor Dropdown — FIXED z-index */
        .profile-editor-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 320px;
          padding: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(12, 12, 16, 0.98);
          border: 1px solid var(--primary-red-border);
          animation: dropdownSlide 0.2s ease-out;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .close-dropdown-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .close-dropdown-btn:hover {
          color: var(--primary-red);
          border-color: var(--primary-red-border);
        }

        .editor-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .editor-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .editor-form label {
          font-size: 9px;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .editor-input {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-family: var(--font-body);
          outline: none;
          transition: var(--transition-smooth);
        }

        .editor-input:focus {
          border-color: var(--primary-red-border);
          box-shadow: 0 0 8px var(--primary-red-glow);
        }

        .editor-input::placeholder {
          color: var(--text-muted);
          font-style: italic;
        }

        /* Theme Selector Grid */
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .theme-swatch {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 10px 4px 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .theme-swatch:hover {
          border-color: var(--swatch-color);
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .theme-swatch.active {
          border-color: var(--swatch-color);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 12px color-mix(in srgb, var(--swatch-color) 30%, transparent);
        }

        .swatch-fill {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          box-shadow: 0 0 8px color-mix(in srgb, var(--swatch-color) 50%, transparent);
          transition: var(--transition-smooth);
        }

        .theme-swatch:hover .swatch-fill {
          transform: scale(1.15);
          box-shadow: 0 0 14px color-mix(in srgb, var(--swatch-color) 60%, transparent);
        }

        .swatch-check {
          position: absolute;
          top: 6px;
          right: 6px;
          color: var(--swatch-color);
          filter: drop-shadow(0 0 4px var(--swatch-color));
        }

        .swatch-label {
          font-size: 7px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          text-align: center;
          line-height: 1.2;
        }

        .theme-swatch.active .swatch-label {
          color: var(--swatch-color);
        }

        .editor-actions {
          display: flex;
          justify-content: center;
          padding-top: 4px;
        }

        .view-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 900px) {
          .app-layout {
            flex-direction: column;
            padding: 10px;
          }
          .profile-editor-dropdown {
            width: 280px;
            right: -20px;
          }
        }
      `}</style>
    </div>
  );
}
