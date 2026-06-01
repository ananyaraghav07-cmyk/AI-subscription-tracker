import React, { useState } from 'react';
import { IndianRupee, ShieldAlert, CheckCircle, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';

export default function Overview({ subscriptions, activeTab, setActiveTab }) {
  const [activeTrendPoint, setActiveTrendPoint] = useState(null);
  const [activeCluster, setActiveCluster] = useState(null);

  // Calculate stats
  const activeSubs = subscriptions.filter(sub => sub.status === 'active');
  const totalSpend = activeSubs.reduce((acc, sub) => acc + sub.price, 0);
  const idleSubs = activeSubs.filter(sub => sub.usageScore < 30);
  const potentialSavings = idleSubs.reduce((acc, sub) => acc + sub.price, 0);

  // Monthly trend data
  const trendData = [
    { month: 'Jan', spend: 4100, activeCount: 6 },
    { month: 'Feb', spend: 4900, activeCount: 7 },
    { month: 'Mar', spend: 4900, activeCount: 7 },
    { month: 'Apr', spend: 5800, activeCount: 8 },
    { month: 'May', spend: 6900, activeCount: 10 },
    { month: 'Jun', spend: totalSpend, activeCount: activeSubs.length }
  ];

  // Dynamic path generation for SVG
  const points = trendData.map((d, i) => {
    const x = 60 + i * 80;
    const y = 200 - (d.spend / 8000) * 160;
    return { x, y };
  });
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x},200 L ${points[0].x},200 Z` : '';

  // Cluster data simulating recurring pattern clustering ML
  const clusters = [
    { id: 1, x: 80, y: 70, size: 24, name: 'Netflix', category: 'Streaming', type: 'active', desc: 'Monthly charge. Confirmed recurring.' },
    { id: 2, x: 120, y: 150, size: 18, name: 'Spotify', category: 'Music', type: 'active', desc: 'Monthly charge. Confirmed recurring.' },
    { id: 3, x: 280, y: 90, size: 30, name: 'Adobe CC', category: 'Creative', type: 'idle', desc: 'High spend, low usage detected.' },
    { id: 4, x: 190, y: 220, size: 14, name: 'Google One', category: 'Cloud', type: 'active', desc: 'Annual charge partitioned monthly.' },
    { id: 5, x: 340, y: 180, size: 12, name: 'Dropbox', category: 'Cloud', type: 'idle', desc: 'Unused for 45 days. Suggest Cancel.' },
    { id: 6, x: 220, y: 50, size: 16, name: 'Unknown *998', category: 'Anomaly', type: 'warning', desc: 'Irregular recurring pattern. Potential stealth fee.' },
    { id: 7, x: 380, y: 260, size: 10, name: 'AWS Trial', category: 'Hosting', type: 'trial', desc: 'Trial expiring in 2 days.' },
  ];

  const getClusterColor = (type) => {
    switch (type) {
      case 'active': return 'var(--accent-green)';
      case 'idle': return 'var(--accent-gold)';
      case 'warning': return 'var(--primary-red)';
      case 'trial': return 'var(--accent-purple)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="overview-container">
      {/* Top Banner */}
      <div className="overview-header glass-panel animated-pulse-panel">
        <div className="header-text">
          <h2 className="glow-text-red font-cyber">
            <Sparkles size={18} style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />
            SYSTEM DIAGNOSTICS: COMPLETED
          </h2>
          <p>AI models scanned 128 transaction logs. 3 inactive subscriptions and 1 billing anomaly detected.</p>
        </div>
        <button className="btn-cyber font-cyber" onClick={() => setActiveTab('parser')}>
          Run New Scan
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="stats-grid">
        <div className="glass-panel-neon stat-card">
          <div className="card-header">
            <span className="card-title font-cyber">MONTHLY COMMITTED SPEND</span>
            <IndianRupee className="card-icon glow-text-red" size={16} />
          </div>
          <div className="card-value font-cyber glow-text-red">
            ₹{totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="card-footer text-secondary">
            <TrendingUp size={12} className="glow-text-red" />
            <span>+14.5% from last month</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="card-header">
            <span className="card-title font-cyber">MONITORED SUBSCRIPTIONS</span>
            <CheckCircle className="card-icon glow-text-green" size={20} />
          </div>
          <div className="card-value font-cyber">
            {activeSubs.length} <span className="value-sub">active</span>
          </div>
          <div className="card-footer">
            <span className="glow-text-green">All classified via Sequence ML</span>
          </div>
        </div>

        <div className="glass-panel stat-card warning-card">
          <div className="card-header">
            <span className="card-title font-cyber">UNUSED/IDLE LEAKAGE</span>
            <ShieldAlert className="card-icon glow-text-gold" size={20} />
          </div>
          <div className="card-value font-cyber glow-text-gold">
            ₹{potentialSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="card-footer">
            <span className="glow-text-gold">{idleSubs.length} subscriptions with zero usage</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="card-header">
            <span className="card-title font-cyber">PROJECTED ANNUAL COST</span>
            <IndianRupee className="card-icon" size={16} />
          </div>
          <div className="card-value font-cyber">
            ₹{(totalSpend * 12).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="card-footer">
            <span>Potential savings: ₹{(potentialSavings * 12).toLocaleString('en-IN', { minimumFractionDigits: 2 })}/yr</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* SVG Spend Line Chart */}
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <div className="chart-title font-cyber">RECURRING SPEND TREND</div>
            <div className="chart-subtitle">6-Month historical billing graph</div>
          </div>
          <div className="chart-content">
            <svg viewBox="0 0 500 240" className="trend-svg">
              {/* Background grid lines */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="190" x2="480" y2="190" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* X and Y Axis lines */}
              <line x1="40" y1="20" x2="40" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="40" y1="200" x2="480" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Y Axis Labels */}
              <text x="30" y="45" textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-cyber)">₹8K</text>
              <text x="30" y="95" textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-cyber)">₹6K</text>
              <text x="30" y="145" textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-cyber)">₹4K</text>
              <text x="30" y="195" textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-cyber)">₹2K</text>
              
              {/* Gradient beneath line */}
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-red)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary-red)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d={areaPath} 
                fill="url(#area-grad)" 
              />

              {/* Spend line */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="var(--primary-red)" 
                strokeWidth="3"
                className="sparkline-path"
              />

              {/* Data points */}
              {trendData.map((d, i) => {
                // Approximate coordinate mapping
                const x = 60 + i * 80;
                const y = 200 - (d.spend / 8000) * 160;
                const isHovered = activeTrendPoint === i;
                return (
                  <g key={i} onMouseEnter={() => setActiveTrendPoint(i)} onMouseLeave={() => setActiveTrendPoint(null)}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered ? 6 : 4} 
                      fill={isHovered ? '#fff' : 'var(--bg-dark)'} 
                      stroke="var(--primary-red)" 
                      strokeWidth={isHovered ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'r 0.1s ease' }}
                    />
                    <text 
                      x={x} 
                      y="215" 
                      textAnchor="middle" 
                      fill="var(--text-secondary)" 
                      fontSize="10"
                      fontFamily="var(--font-heading)"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Tooltip Overlay */}
            <div className="chart-tooltip-area">
              {activeTrendPoint !== null ? (
                <div className="trend-tooltip glass-panel-neon">
                  <span className="font-cyber">{trendData[activeTrendPoint].month} Billing:</span>
                  <strong className="glow-text-red">₹{trendData[activeTrendPoint].spend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  <span className="count">({trendData[activeTrendPoint].activeCount} active subscriptions)</span>
                </div>
              ) : (
                <div className="trend-tooltip-empty">Hover over coordinates for details</div>
              )}
            </div>
          </div>
        </div>

        {/* Machine Learning Cluster Visualizer */}
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <div className="chart-title font-cyber">RECURRING PATTERN CLUSTER</div>
            <div className="chart-subtitle">ML transaction density grouping</div>
          </div>
          <div className="chart-content cluster-view">
            <div className="cluster-svg-wrapper">
              <svg viewBox="0 0 450 300" className="cluster-svg">
                {/* Cluster grid gridlines */}
                <line x1="20" y1="280" x2="430" y2="280" stroke="rgba(255,255,255,0.04)" />
                <line x1="20" y1="20" x2="20" y2="280" stroke="rgba(255,255,255,0.04)" />
                
                {/* X axis labels */}
                <text x="225" y="295" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-cyber)">BILLING INTERVAL FREQUENCY</text>
                <text x="15" y="150" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-cyber)" transform="rotate(-90 15 150)">TRANSACTION VOLUME / COST</text>

                {/* Grid guidelines */}
                <circle cx="225" cy="150" r="120" fill="none" stroke="rgba(255, 42, 68, 0.02)" strokeDasharray="4 4" />
                <circle cx="225" cy="150" r="60" fill="none" stroke="rgba(255, 42, 68, 0.02)" strokeDasharray="4 4" />

                {/* Cluster points */}
                {clusters.map((node) => {
                  const color = getClusterColor(node.type);
                  const isHovered = activeCluster?.id === node.id;
                  return (
                    <g 
                      key={node.id}
                      onMouseEnter={() => setActiveCluster(node)}
                      onMouseLeave={() => setActiveCluster(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? node.size + 4 : node.size}
                        fill={color}
                        fillOpacity={isHovered ? 0.35 : 0.15}
                        stroke={color}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        style={{ transition: 'all 0.2s ease' }}
                      />
                      {/* Inner dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="3"
                        fill={color}
                      />
                      <text
                        x={node.x}
                        y={node.y - node.size - 6}
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="var(--font-cyber)"
                        style={{ pointerEvents: 'none', opacity: isHovered ? 1 : 0.6 }}
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Cluster details side panel */}
            <div className="cluster-details">
              <h4 className="font-cyber glow-text-red">ML Pattern Analysis</h4>
              {activeCluster ? (
                <div className="node-details glass-panel-neon">
                  <div className="node-title font-cyber" style={{ color: getClusterColor(activeCluster.type) }}>
                    {activeCluster.name}
                  </div>
                  <div className="node-meta">
                    <span className="badge badge-purple">{activeCluster.category}</span>
                    <span className="node-type" style={{ color: getClusterColor(activeCluster.type) }}>{activeCluster.type}</span>
                  </div>
                  <p className="node-desc">{activeCluster.desc}</p>
                </div>
              ) : (
                <div className="node-details-empty">
                  <HelpCircle size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                  <p>Hover over cluster coordinates to review the AI model's categorization insights.</p>
                </div>
              )}
              <div className="cluster-legend">
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-green)' }}></span><span>Active</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-gold)' }}></span><span>Idle Spend</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--primary-red)' }}></span><span>Anomaly</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent-purple)' }}></span><span>Trial</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .overview-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: rgba(255, 42, 68, 0.02);
          border-color: rgba(255, 42, 68, 0.15);
        }

        .header-text h2 {
          display: flex;
          align-items: center;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .header-text p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .stat-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-card.warning-card {
          border-color: rgba(245, 166, 35, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-secondary);
        }

        .card-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .card-icon {
          opacity: 0.7;
        }

        .card-value {
          font-size: 32px;
          font-weight: 700;
          font-family: var(--font-cyber);
          line-height: 1;
        }

        .value-sub {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }

        .chart-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }

        .chart-content {
          position: relative;
          min-height: 240px;
          display: flex;
          flex-direction: column;
        }

        .trend-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .sparkline-path {
          filter: drop-shadow(0px 4px 10px rgba(255, 42, 68, 0.4));
        }

        .chart-tooltip-area {
          height: 40px;
          margin-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .trend-tooltip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          font-size: 12px;
          border-radius: 6px;
        }

        .trend-tooltip span.count {
          color: var(--text-muted);
        }

        .trend-tooltip-empty {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Cluster Styling */
        .cluster-view {
          flex-direction: row;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .cluster-view {
            flex-direction: column;
          }
        }

        .cluster-svg-wrapper {
          flex: 1.3;
          border-right: 1px solid var(--border-color);
          padding-right: 16px;
        }

        .cluster-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .cluster-details {
          flex: 0.7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
        }

        .cluster-details h4 {
          font-size: 11px;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .node-details {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .node-details-empty {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          padding: 12px;
          flex-grow: 1;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
        }

        .node-title {
          font-size: 14px;
          font-weight: 700;
        }

        .node-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
        }

        .node-type {
          font-weight: 700;
          text-transform: uppercase;
        }

        .node-desc {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .cluster-legend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 12px;
          font-size: 9px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
