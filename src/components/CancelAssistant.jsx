import React, { useState, useEffect } from 'react';
import { Mail, Bot, Copy, Check, ShieldAlert, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';

export default function CancelAssistant({ subscriptions, onCancelSubscription, selectedSub, setSelectedSub }) {
  const [method, setMethod] = useState(null); // 'email' or 'bot'
  const [cancellationReason, setCancellationReason] = useState('Too expensive');
  const [copied, setCopied] = useState(false);
  
  // Bot simulator state
  const [botLogs, setBotLogs] = useState([]);
  const [botStep, setBotStep] = useState(0);
  const [isBotRunning, setIsBotRunning] = useState(false);

  // Recommendations list
  const recommendations = subscriptions.filter(sub => sub.usageScore < 30 && sub.status === 'active');

  const copyEmailTemplate = () => {
    const text = document.getElementById('email-body-text').innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run automated bot simulation
  const runBotSimulation = () => {
    setIsBotRunning(true);
    setBotStep(1);
    setBotLogs([
      { time: '11:46:12', msg: 'Initializing SubSentry Agent sandbox...', type: 'info' }
    ]);
  };

  useEffect(() => {
    if (botStep === 0 || !selectedSub) return;

    const timer = setTimeout(() => {
      let nextLogs = [...botLogs];
      const now = new Date().toLocaleTimeString();

      switch (botStep) {
        case 1:
          nextLogs.push({ time: now, msg: `Connecting to ${selectedSub.name} account API portal...`, type: 'info' });
          nextLogs.push({ time: now, msg: 'Authentication handshake: SUCCESS (token stored)', type: 'success' });
          setBotLogs(nextLogs);
          setBotStep(2);
          break;
        case 2:
          nextLogs.push({ time: now, msg: 'Locating subscription management node...', type: 'info' });
          nextLogs.push({ time: now, msg: `Current active license found: ${selectedSub.name} Premium Plan.`, type: 'info' });
          setBotLogs(nextLogs);
          setBotStep(3);
          break;
        case 3:
          nextLogs.push({ time: now, msg: 'Triggering termination hook: POST /billing/subscription/cancel', type: 'warning' });
          nextLogs.push({ time: now, msg: `Injecting reason: \"${cancellationReason}\"`, type: 'info' });
          setBotLogs(nextLogs);
          setBotStep(4);
          break;
        case 4:
          nextLogs.push({ time: now, msg: 'Bypassing retention offer popup (declined 10% discount)', type: 'success' });
          nextLogs.push({ time: now, msg: 'Receipt verification pending: WAITING FOR GATEWAY', type: 'info' });
          setBotLogs(nextLogs);
          setBotStep(5);
          break;
        case 5:
          nextLogs.push({ time: now, msg: `Cancellation confirmation token acquired: REF-SUB-${Math.floor(Math.random() * 89999 + 10000)}`, type: 'success' });
          nextLogs.push({ time: now, msg: `SUCCESS: ${selectedSub.name} billing cycle terminated.`, type: 'success' });
          setBotLogs(nextLogs);
          setBotStep(6);
          setIsBotRunning(false);
          break;
        default:
          break;
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [botStep, botLogs, selectedSub, cancellationReason]);

  const handleFinalizeCancel = () => {
    onCancelSubscription(selectedSub.id);
    setSelectedSub(null);
    setMethod(null);
    setBotStep(0);
    setBotLogs([]);
  };

  const getEmailBody = () => {
    if (!selectedSub) return '';
    return `Subject: Request for Immediate Subscription Cancellation - Account Noor
    
To the Billing Support Team at ${selectedSub.name},

I am writing to formally request the cancellation of my subscription for ${selectedSub.name}, associated with this email address.

Cancellation Details:
- Service Plan: Premium / Standard Recurring License
- Monthly Rate: ₹${selectedSub.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Reason for cancellation: ${cancellationReason}

Please process this cancellation immediately and confirm that no further recurring payments will be charged to my credit card. If applicable, please refund any unutilized pre-paid balance for this billing period.

Thank you,
Noor`;
  };

  return (
    <div className="cancel-container">
      <div className="cyber-grid-title font-cyber">
        <span>CANCELLATION DESTRUCT PROTOCOLS</span>
        <span className="badge badge-purple">ASSISTANT ACTIVE</span>
      </div>

      {!selectedSub ? (
        /* Recommendations view */
        <div className="recommendations-view">
          <div className="intro-card glass-panel">
            <h3 className="font-cyber glow-text-gold">HIGH-LEAKAGE DETECTION LIST</h3>
            <p>Our models identified the following idle recurring accounts. Cancelling these will stop immediate payment drain.</p>
          </div>

          <div className="recs-grid">
            {recommendations.length === 0 ? (
              <div className="glass-panel empty-recs font-cyber">
                <Check className="glow-text-green" size={24} />
                <span>All active subscriptions have healthy usage scores! Zero leaks detected.</span>
              </div>
            ) : (
              recommendations.map(sub => (
                <div key={sub.id} className="glass-panel-neon rec-card">
                  <div className="rec-badge font-cyber">IDLE ({sub.usageScore}% Usage)</div>
                  <h4 className="font-cyber">{sub.name}</h4>
                  <div className="rec-price font-cyber">₹{sub.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / month</div>
                  <p className="rec-desc">No login or sync activity detected for over 30 days.</p>
                  <button className="btn-cyber font-cyber" onClick={() => setSelectedSub(sub)}>
                    Initiate Cancellation
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Cancellation wizard view */
        <div className="wizard-view">
          <button className="btn-back font-cyber" onClick={() => { setSelectedSub(null); setMethod(null); setBotStep(0); }}>
            <ArrowLeft size={14} /> Back to Suggestions
          </button>

          <div className="wizard-grid">
            {/* Left: Summary and details */}
            <div className="glass-panel summary-panel">
              <h3 className="font-cyber">CANCELLATION TARGET</h3>
              <div className="target-card">
                <div className="target-logo font-cyber">{selectedSub.name.charAt(0)}</div>
                <div className="target-info">
                  <span className="name">{selectedSub.name}</span>
                  <span className="price font-cyber">₹{selectedSub.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / mo</span>
                </div>
              </div>

              <div className="form-group">
                <label className="font-cyber">Reason for termination:</label>
                <select 
                  value={cancellationReason} 
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="cyber-select"
                  disabled={method !== null}
                >
                  <option value="Too expensive">Too expensive</option>
                  <option value="No longer using the service">No longer using the service</option>
                  <option value="Switched to competitor">Switched to competitor</option>
                  <option value="Temporary pause">Temporary pause</option>
                </select>
              </div>

              {method === null && (
                <div className="method-selection">
                  <h4 className="font-cyber">CHOOSE TERMINATION VECTOR:</h4>
                  <div className="methods-buttons">
                    <button className="method-btn glass-panel-neon" onClick={() => setMethod('email')}>
                      <Mail size={24} className="glow-text-purple" />
                      <span className="title font-cyber">Email Generator</span>
                      <span className="desc">Generate copyable template for support ticket</span>
                    </button>
                    
                    <button className="method-btn glass-panel-neon" onClick={() => { setMethod('bot'); runBotSimulation(); }}>
                      <Bot size={24} className="glow-text-red" />
                      <span className="title font-cyber">AI Agent Simulator</span>
                      <span className="desc">Simulate automated API/DOM termination script</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Method workspace */}
            {method !== null && (
              <div className="glass-panel workspace-panel">
                {method === 'email' && (
                  <div className="email-generator-workspace">
                    <div className="workspace-header">
                      <h4 className="font-cyber glow-text-purple">CANCELLATION EMAIL TEMPLATE</h4>
                      <button className="btn-preset copy-btn font-cyber" onClick={copyEmailTemplate}>
                        {copied ? <Check size={12} className="glow-text-green" /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy Template'}
                      </button>
                    </div>

                    <div className="email-body glass-panel" id="email-body-text">
                      <pre>{getEmailBody()}</pre>
                    </div>

                    <div className="workspace-actions">
                      <button className="btn-cyber font-cyber" onClick={handleFinalizeCancel}>
                        Mark as Cancelled
                      </button>
                      <button className="btn-cyber-secondary font-cyber" onClick={() => setMethod(null)}>
                        Change Method
                      </button>
                    </div>
                  </div>
                )}

                {method === 'bot' && (
                  <div className="bot-simulation-workspace">
                    <div className="workspace-header">
                      <h4 className="font-cyber glow-text-red flex-align">
                        <Terminal size={14} style={{ marginRight: 6 }} /> TERMINAL AUTO-BOT LOGS
                      </h4>
                      {isBotRunning && <span className="pulse-dot pulse-dot-red"></span>}
                    </div>

                    <div className="terminal-body font-cyber">
                      {botLogs.map((log, idx) => (
                        <div key={idx} className={`log-line ${log.type}`}>
                          <span className="time">[{log.time}]</span>
                          <span className="msg">{log.msg}</span>
                        </div>
                      ))}
                      {isBotRunning && (
                        <div className="log-line info typing">
                          <span className="time">[{new Date().toLocaleTimeString()}]</span>
                          <span className="msg">Executing agent subprocess...</span>
                        </div>
                      )}
                    </div>

                    <div className="workspace-actions">
                      {botStep >= 6 ? (
                        <button className="btn-cyber font-cyber" onClick={handleFinalizeCancel}>
                          Confirm Cancellation
                        </button>
                      ) : (
                        <button className="btn-cyber font-cyber" disabled={true}>
                          Awaiting Completion ({Math.round((botStep / 6) * 100)}%)
                        </button>
                      )}
                      <button 
                        className="btn-cyber-secondary font-cyber" 
                        onClick={() => { setMethod(null); setBotStep(0); setBotLogs([]); }}
                        disabled={isBotRunning}
                      >
                        Abort Bot
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .cancel-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .recommendations-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .intro-card {
          padding: 16px 20px;
          background: rgba(245, 166, 35, 0.02);
          border-color: rgba(245, 166, 35, 0.15);
        }

        .intro-card h3 {
          font-size: 14px;
          margin-bottom: 6px;
        }

        .intro-card p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .recs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .empty-recs {
          grid-column: 1 / -1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          font-size: 13px;
          text-align: center;
        }

        .rec-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-color: rgba(245, 166, 35, 0.15);
        }

        .rec-badge {
          align-self: flex-start;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(245, 166, 35, 0.1);
          color: var(--accent-gold);
          border: 1px solid rgba(245, 166, 35, 0.2);
        }

        .rec-price {
          font-size: 20px;
          font-weight: 700;
        }

        .rec-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
          flex: 1;
        }

        /* Cancellation Wizard */
        .wizard-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .btn-back {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-back:hover {
          color: var(--primary-red);
        }

        .wizard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .wizard-grid {
            grid-template-columns: 1fr;
          }
        }

        .summary-panel, .workspace-panel {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-height: 420px;
        }

        .target-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .target-logo {
          width: 44px;
          height: 44px;
          background: rgba(255, 42, 68, 0.08);
          border: 1px solid var(--primary-red-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: var(--primary-red);
        }

        .target-info {
          display: flex;
          flex-direction: column;
        }

        .target-info .name {
          font-size: 16px;
          font-weight: 600;
        }

        .target-info .price {
          font-size: 13px;
          color: var(--text-muted);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .cyber-select {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          border-radius: 6px;
          color: var(--text-primary);
          outline: none;
          font-size: 13px;
          width: 100%;
        }

        .method-selection {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .method-selection h4 {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .methods-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .method-btn {
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          cursor: pointer;
          background: transparent;
        }

        .method-btn:hover {
          transform: translateY(-4px);
        }

        .method-btn .title {
          font-size: 12px;
          font-weight: 700;
        }

        .method-btn .desc {
          font-size: 10px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Workspace Panels */
        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        .workspace-header h4 {
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .workspace-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: auto;
        }

        /* Email view styling */
        .email-body {
          flex: 1;
          padding: 16px;
          background: rgba(0,0,0,0.25);
          overflow-y: auto;
          max-height: 220px;
          border-radius: 6px;
        }

        .email-body pre {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-secondary);
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Terminal styling */
        .terminal-body {
          flex: 1;
          background: #050508;
          border: 1px solid #1a1a24;
          border-radius: 8px;
          padding: 16px;
          font-family: ui-monospace, monospace;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          max-height: 240px;
          min-height: 200px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        }

        .log-line {
          line-height: 1.4;
        }

        .log-line.info { color: var(--text-secondary); }
        .log-line.success { color: var(--accent-green); }
        .log-line.warning { color: var(--primary-red); }
        .log-line .time {
          color: var(--text-muted);
          margin-right: 8px;
        }

        .flex-align {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
