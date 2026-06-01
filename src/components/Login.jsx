import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Terminal, Key } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('noor@sentry.ai');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [authStep, setAuthStep] = useState('');

  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (!email || !passcode) {
      setErrorMsg("CRITICAL: All authentication vectors must be populated.");
      return;
    }

    setIsAuthenticating(true);
    setErrorMsg(null);
    setAuthStep("Establishing secure tunnel...");

    setTimeout(() => {
      setAuthStep("Injecting cryptographic signature...");
    }, 1000);

    setTimeout(() => {
      setAuthStep("Bypassing firewall constraints...");
    }, 2000);

    setTimeout(() => {
      // Allow general entry, but check for special passcode
      const isAdmin = passcode === 'SENTRY-2026';
      setIsAuthenticating(false);
      onLogin({
        email,
        name: isAdmin ? 'ADMIN_NOOR' : 'NOOR',
        role: isAdmin ? 'ADMINISTRATOR' : 'OPERATIVE',
        budgetLimit: isAdmin ? 15000 : 8000
      });
    }, 3200);
  };

  return (
    <div className="login-wrapper">
      <div className="glass-panel-neon login-card animated-pulse-panel scanning-container">
        <div className="login-header">
          <div className="shield-icon-container">
            <Shield size={36} className="glow-text-red" />
          </div>
          <h1 className="font-cyber">SUB<span className="glow-text-red">SENTRY</span></h1>
          <div className="login-subtitle font-cyber">AI RECURRING DEBT SCANNER</div>
        </div>

        {isAuthenticating ? (
          <div className="authenticating-view font-cyber">
            <div className="terminal-loader">
              <Terminal size={14} className="glow-text-red blink" />
              <span>{authStep}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill"></div>
            </div>
            <div className="secure-notice">DO NOT TERMINATE SESSION</div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleAuthenticate}>
            {errorMsg && (
              <div className="error-box font-cyber">
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-field">
              <label className="font-cyber">SECURITY EMAIL</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@sentry.ai"
              />
            </div>

            <div className="form-field">
              <label className="font-cyber">CRYPTOGRAPHIC PASSCODE</label>
              <div className="passcode-input-wrapper">
                <input
                  type={showPasscode ? "text" : "password"}
                  className="login-input"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="toggle-passcode"
                  onClick={() => setShowPasscode(!showPasscode)}
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-cyber btn-login font-cyber">
              <Key size={14} style={{ marginRight: 8 }} />
              Decrypt Dashboard
            </button>
          </form>
        )}

        <div className="login-footer">
          <div className="hint-box font-cyber">
            <span>KEY: Enter passcode <code>SENTRY-2026</code> for admin clearance status.</span>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px 30px;
          background: rgba(16, 16, 22, 0.85);
          text-align: center;
          position: relative;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .shield-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 42, 68, 0.05);
          border: 1px solid var(--primary-red-border);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(255, 42, 68, 0.1);
        }

        .login-header h1 {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 0.1em;
          margin: 0;
          font-family: var(--font-cyber);
        }

        .login-subtitle {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.15em;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .error-box {
          background: rgba(255, 42, 68, 0.08);
          border: 1px solid var(--primary-red-border);
          color: var(--primary-red);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 11px;
          line-height: 1.4;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 9px;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .login-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          transition: var(--transition-smooth);
        }

        .login-input:focus {
          border-color: var(--primary-red-border);
          box-shadow: 0 0 8px var(--primary-red-glow);
        }

        .passcode-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .toggle-passcode {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .toggle-passcode:hover {
          color: var(--text-primary);
        }

        .btn-login {
          margin-top: 10px;
          width: 100%;
          padding: 12px;
          font-size: 13px;
        }

        .authenticating-view {
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .terminal-loader {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-primary);
        }

        .blink {
          animation: terminal-blink 1s infinite step-end;
        }

        @keyframes terminal-blink {
          50% { opacity: 0; }
        }

        .progress-bar-container {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          width: 0;
          background: var(--primary-red);
          box-shadow: 0 0 10px var(--primary-red);
          animation: fillProgress 3.2s linear forwards;
        }

        .secure-notice {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }

        .login-footer {
          margin-top: 24px;
        }

        .hint-box {
          font-size: 10px;
          color: var(--text-muted);
          border-top: 1px dashed var(--border-color);
          padding-top: 16px;
        }

        .hint-box code {
          background: rgba(255, 255, 255, 0.03);
          padding: 2px 4px;
          border-radius: 4px;
          color: var(--primary-red);
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
