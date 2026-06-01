import React from 'react';
import { LayoutDashboard, FileScan, Activity, ShieldAlert, ToggleLeft } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, subCount, alertCount }) {
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'parser', name: 'AI Parser', icon: FileScan, badge: null },
    { id: 'usage', name: 'Usage & Anomalies', icon: Activity, badge: alertCount > 0 ? alertCount : null },
    { id: 'cancel', name: 'Cancel Assistant', icon: ShieldAlert, badge: subCount > 0 ? subCount : null },
  ];

  return (
    <aside className="glass-panel-neon sidebar-container">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="pulse-dot pulse-dot-red"></div>
          <span>SUB<span className="glow-text-red">SENTRY</span></span>
        </div>
        <div className="brand-sub font-cyber">AI DETECTOR v1.4</div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`nav-icon ${isActive ? 'glow-text-red' : ''}`} size={18} />
              <span className="nav-name">{item.name}</span>
              {item.badge !== null && (
                <span className={`nav-badge font-cyber ${item.id === 'usage' ? 'badge-red' : 'badge-gold'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer glass-panel">
        <div className="footer-status">
          <div className="status-indicator">
            <span className={`status-dot ${alertCount > 0 ? 'alert' : 'secure'}`}></span>
            <span className="status-text font-cyber">
              {alertCount > 0 ? 'ATTENTION REQUIRED' : 'SECURE SCAN'}
            </span>
          </div>
          <div className="footer-desc">
            {alertCount > 0 
              ? `${alertCount} active threats/idle spend` 
              : 'Subscriptions monitored'
            }
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 260px;
          height: calc(100vh - 40px);
          position: sticky;
          top: 20px;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          margin-right: 24px;
        }

        .sidebar-brand {
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-cyber);
          font-weight: 900;
          font-size: 20px;
          letter-spacing: 0.05em;
        }

        .brand-sub {
          font-size: 9px;
          color: var(--text-muted);
          margin-top: 4px;
          margin-left: 20px;
          letter-spacing: 0.15em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 14px;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          background: rgba(255, 42, 68, 0.08);
          border-color: var(--primary-red-border);
          color: #fff;
          box-shadow: inset 0 0 10px rgba(255, 42, 68, 0.03);
        }

        .nav-icon {
          margin-right: 12px;
          transition: var(--transition-smooth);
        }

        .nav-name {
          flex: 1;
        }

        .nav-badge {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 14px;
          background: rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.03);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.secure {
          background: var(--accent-green);
          box-shadow: 0 0 8px var(--accent-green-glow);
        }

        .status-dot.alert {
          background: var(--primary-red);
          box-shadow: 0 0 8px var(--primary-red-glow);
        }

        .status-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .footer-desc {
          font-size: 11px;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .sidebar-container {
            width: 100%;
            height: auto;
            position: relative;
            top: 0;
            margin-right: 0;
            margin-bottom: 20px;
            padding: 16px;
          }
          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
          }
          .nav-item {
            flex: 1;
            min-width: 130px;
            justify-content: center;
          }
          .sidebar-footer {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
