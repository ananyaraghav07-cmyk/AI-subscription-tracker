import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, RefreshCcw, Eye, Search } from 'lucide-react';

export default function UsageTracker({ subscriptions, setSubscriptions, setActiveTab, setSelectedSubToCancel }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedSubId, setExpandedSubId] = useState(null);

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'anomalies') return matchesSearch && sub.anomaly;
    if (filter === 'idle') return matchesSearch && sub.usageScore < 30 && !sub.anomaly;
    if (filter === 'active') return matchesSearch && sub.usageScore >= 30 && !sub.anomaly;
    return matchesSearch;
  });

  const getUsageColor = (score) => {
    if (score >= 70) return 'var(--accent-green)';
    if (score >= 30) return 'var(--accent-gold)';
    return 'var(--primary-red)';
  };

  const handleResolveAnomaly = (subId, action) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subId) {
        if (action === 'accept') {
          // Accept the rate hike or price, clearing anomaly
          return { ...sub, anomaly: null, price: sub.price };
        } else if (action === 'refund') {
          // Mock refund disputing
          alert("Dispute request compiled. Standard cancellation notice generated.");
          return { ...sub, anomaly: null };
        }
      }
      return sub;
    }));
  };

  const handleCancelClick = (sub) => {
    setSelectedSubToCancel(sub);
    setActiveTab('cancel');
  };

  return (
    <div className="usage-container">
      <div className="cyber-grid-title font-cyber">
        <span>ANOMALY SCANNER & USAGE MATRIX</span>
        <span className="badge badge-gold">ACTIVE TELEMETRY</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar glass-panel">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Query subscription matrix..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          {['all', 'anomalies', 'idle', 'active'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn font-cyber ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of monitored services */}
      <div className="grid-list">
        {filteredSubs.length === 0 ? (
          <div className="glass-panel empty-list">
            <AlertTriangle size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <p>No subscriptions match the active query filter.</p>
          </div>
        ) : (
          filteredSubs.map((sub) => {
            const isExpanded = expandedSubId === sub.id;
            return (
              <div 
                key={sub.id} 
                className={`glass-panel sub-card ${sub.anomaly ? 'anomaly-border' : ''} ${sub.usageScore < 30 ? 'idle-border' : ''}`}
              >
                <div className="card-main" onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}>
                  <div className="sub-logo-area font-cyber">
                    <span className="logo-placeholder">{sub.name.charAt(0)}</span>
                    <div className="sub-info">
                      <span className="sub-name">{sub.name}</span>
                      <span className="sub-category">{sub.category}</span>
                    </div>
                  </div>

                  <div className="sub-cost font-cyber">
                    <span>₹{sub.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="period">/{sub.billingInterval}</span>
                  </div>

                  <div className="sub-usage">
                    <div className="usage-label-row">
                      <span className="label">Usage Score</span>
                      <span className="value font-cyber" style={{ color: getUsageColor(sub.usageScore) }}>
                        {sub.usageScore}%
                      </span>
                    </div>
                    <div className="progress-bg">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${sub.usageScore}%`, 
                          backgroundColor: getUsageColor(sub.usageScore),
                          boxShadow: `0 0 6px ${getUsageColor(sub.usageScore)}`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="sub-status-col">
                    {sub.anomaly ? (
                      <span className="badge badge-red font-cyber">
                        <ShieldAlert size={12} /> ANOMALY
                      </span>
                    ) : sub.usageScore < 30 ? (
                      <span className="badge badge-gold font-cyber">
                        IDLE WASTE
                      </span>
                    ) : (
                      <span className="badge badge-green font-cyber">
                        <CheckCircle size={12} /> SAFE
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="card-details-expanded">
                    {sub.anomaly && (
                      <div className="anomaly-alert-box glass-panel-neon">
                        <div className="alert-header glow-text-red font-cyber">
                          <ShieldAlert size={16} /> THREAT REPORT DETECTED
                        </div>
                        <p className="alert-desc">{sub.anomaly.desc}</p>
                        <div className="alert-actions">
                          <button className="btn-cyber font-cyber" onClick={() => handleResolveAnomaly(sub.id, 'refund')}>
                            Dispute Charge
                          </button>
                          <button className="btn-cyber-secondary font-cyber" onClick={() => handleResolveAnomaly(sub.id, 'accept')}>
                            Acknowledge Rate
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="telemetry-info">
                      <h4 className="font-cyber">TELEMETRY ANALYTICS</h4>
                      <div className="tel-grid">
                        <div className="tel-item">
                          <span className="lbl">Next Billing Date:</span>
                          <span className="val font-cyber">{sub.nextBillingDate}</span>
                        </div>
                        <div className="tel-item">
                          <span className="lbl">Telemetry Interval:</span>
                          <span className="val">Daily Scan</span>
                        </div>
                        <div className="tel-item">
                          <span className="lbl">Last Detected Activity:</span>
                          <span className="val">
                            {sub.usageScore < 30 ? 'Over 30 days ago' : 'Active today'}
                          </span>
                        </div>
                        <div className="tel-item">
                          <span className="lbl">Payment Source:</span>
                          <span className="val font-cyber">Visa *4321</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions-row">
                      {sub.usageScore < 30 && (
                        <button className="btn-cyber font-cyber" onClick={() => handleCancelClick(sub)}>
                          Suggest Cancellation
                        </button>
                      )}
                      <button className="btn-cyber-secondary font-cyber" onClick={() => setExpandedSubId(null)}>
                        Collapse Diagnostics
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .usage-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 700px) {
          .toolbar {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 12px;
          flex: 1;
          max-width: 360px;
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 8px;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 13px;
          width: 100%;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-btn:hover, .filter-btn.active {
          border-color: var(--primary-red-border);
          color: var(--primary-red);
          background: rgba(255, 42, 68, 0.04);
        }

        /* Subscription Cards */
        .grid-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-list {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }

        .sub-card {
          border-color: var(--border-color);
          transition: var(--transition-smooth);
          overflow: hidden;
        }

        .sub-card.anomaly-border {
          border-color: rgba(255, 42, 68, 0.4);
          box-shadow: 0 0 10px rgba(255, 42, 68, 0.05);
        }

        .sub-card.idle-border {
          border-color: rgba(245, 166, 35, 0.3);
        }

        .card-main {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr 1fr;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
        }

        @media (max-width: 800px) {
          .card-main {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }

        .sub-logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-placeholder {
          width: 36px;
          height: 36px;
          background: rgba(255, 42, 68, 0.08);
          border: 1px solid var(--primary-red-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-red);
        }

        .sub-info {
          display: flex;
          flex-direction: column;
        }

        .sub-name {
          font-size: 14px;
          font-weight: 600;
        }

        .sub-category {
          font-size: 11px;
          color: var(--text-muted);
        }

        .sub-cost {
          font-size: 16px;
          font-weight: 700;
        }

        .sub-cost .period {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .sub-usage {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 20px;
        }

        .usage-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .usage-label-row .label {
          color: var(--text-secondary);
        }

        .usage-label-row .value {
          font-weight: 700;
        }

        .progress-bg {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
        }

        .sub-status-col {
          display: flex;
          justify-content: flex-end;
        }

        /* Expanded Panel */
        .card-details-expanded {
          padding: 20px;
          background: rgba(0, 0, 0, 0.15);
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideDown 0.25s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anomaly-alert-box {
          border-color: rgba(255, 42, 68, 0.3);
          background: rgba(255, 42, 68, 0.02);
          padding: 16px;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .alert-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .alert-actions {
          display: flex;
          gap: 10px;
        }

        .telemetry-info h4 {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }

        .tel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 500px) {
          .tel-grid {
            grid-template-columns: 1fr;
          }
        }

        .tel-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 4px 0;
          border-bottom: 1px dashed rgba(255,255,255,0.03);
        }

        .tel-item .lbl {
          color: var(--text-secondary);
        }

        .tel-item .val {
          color: var(--text-primary);
          font-weight: 500;
        }

        .card-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
