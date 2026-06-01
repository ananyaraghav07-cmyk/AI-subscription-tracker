import React, { useState } from 'react';
import { FileText, Cpu, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const PRESETS = [
  {
    label: "Adobe Receipt Email",
    text: "Dear Noor, your payment of INR 4299.00 for Adobe Creative Cloud (Monthly Membership) was processed on May 24, 2026. This charge will recur monthly. Your next renewal date is June 24, 2026. Thank you for your subscription."
  },
  {
    label: "Netflix Debit SMS",
    text: "Alert: Your Visa ending in 4321 was charged ₹649.00 at NETFLIX.COM on 2026-05-29. Auto-debit recurring transaction."
  },
  {
    label: "ChatGPT Plus Invoice",
    text: "OpenAI Invoice #98A77B: Amount Due ₹1999.00. Paid via Mastercard on May 20, 2026. ChatGPT Plus Subscription. Renewal auto-scheduled for 06-20-2026."
  }
];

export default function Parser({ onAddSubscription }) {
  const [inputText, setInputText] = useState(PRESETS[0].text);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [parsedResult, setParsedResult] = useState(null);

  const runSimulation = () => {
    setIsScanning(true);
    setScanStep(1); // Tokenizing
    setParsedResult(null);

    setTimeout(() => {
      setScanStep(2); // Sequence Tagging (BiLSTM/Transformer)
    }, 1200);

    setTimeout(() => {
      setScanStep(3); // Recurring Pattern Check
    }, 2400);

    setTimeout(() => {
      // Analyze text to create mock parsed entity markers
      let name = "Unknown Service";
      let price = 799.00;
      let priceString = "₹799.00";
      let date = "2026-06-01";
      let confidence = 0.88;
      let category = "Software";
      let billingInterval = "monthly";

      const lowerText = inputText.toLowerCase();
      if (lowerText.includes("adobe") || lowerText.includes("creative cloud")) {
        name = "Adobe Creative Cloud";
        price = 4299.00;
        priceString = "INR 4299.00";
        date = "2026-06-24";
        confidence = 0.98;
        category = "Creative";
      } else if (lowerText.includes("netflix")) {
        name = "Netflix";
        price = 649.00;
        priceString = "₹649.00";
        date = "2026-06-29";
        confidence = 0.99;
        category = "Streaming";
      } else if (lowerText.includes("openai") || lowerText.includes("chatgpt")) {
        name = "ChatGPT Plus";
        price = 1999.00;
        priceString = "₹1999.00";
        date = "2026-06-20";
        confidence = 0.97;
        category = "Productivity";
      } else {
        // Try extracting some numbers and names
        const priceMatch = inputText.match(/(?:₹|rs\.?|\$|inr|usd)\s*(\d+(?:\.\d{2})?)/i);
        if (priceMatch) {
          price = parseFloat(priceMatch[1]);
          priceString = priceMatch[0];
        }
        const dateMatch = inputText.match(/(\d{4}-\d{2}-\d{2})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2})/i);
        if (dateMatch) date = dateMatch[0];
      }

      setParsedResult({
        name,
        price,
        priceString,
        date,
        confidence,
        category,
        billingInterval,
        rawText: inputText
      });
      setIsScanning(false);
      setScanStep(0);
    }, 3600);
  };

  const renderHighlightedText = () => {
    if (!parsedResult) return inputText;

    let highlighted = inputText;
    const entities = [
      { word: parsedResult.name, type: "MERCHANT", color: "var(--primary-red)" },
      { word: parsedResult.priceString, type: "AMOUNT", color: "var(--accent-green)" },
      { word: parsedResult.date, type: "RENEW_DATE", color: "var(--accent-purple)" },
      { word: "monthly", type: "INTERVAL", color: "var(--accent-gold)" },
      { word: "recurring", type: "INTERVAL", color: "var(--accent-gold)" }
    ];

    // Simple word replacement visualization (in reality, we split by regex for safety)
    // To present it beautifully in React:
    let textElements = [];
    let currentIdx = 0;
    
    // Sort entities by their occurrence index in the text to parse sequentially
    const activeEntities = [];
    entities.forEach(ent => {
      const idx = inputText.indexOf(ent.word);
      if (idx !== -1 && ent.word.length > 2) {
        activeEntities.push({ ...ent, index: idx });
      }
    });
    activeEntities.sort((a, b) => a.index - b.index);

    activeEntities.forEach((ent, i) => {
      if (ent.index >= currentIdx) {
        // Push preceding plain text
        textElements.push(inputText.substring(currentIdx, ent.index));
        // Push colored token
        textElements.push(
          <span 
            key={i} 
            className="entity-token font-cyber" 
            style={{ 
              backgroundColor: `rgba(${ent.color === 'var(--primary-red)' ? '255, 42, 68' : ent.color === 'var(--accent-green)' ? '16, 185, 129' : ent.color === 'var(--accent-purple)' ? '192, 132, 252' : '245, 166, 35'}, 0.15)`,
              borderColor: ent.color,
              color: ent.color
            }}
          >
            {ent.word}
            <span className="token-tag">{ent.type}</span>
          </span>
        );
        currentIdx = ent.index + ent.word.length;
      }
    });

    if (currentIdx < inputText.length) {
      textElements.push(inputText.substring(currentIdx));
    }

    return textElements.length > 0 ? textElements : inputText;
  };

  const handleAdd = () => {
    if (!parsedResult) return;
    onAddSubscription({
      id: Date.now(),
      name: parsedResult.name,
      category: parsedResult.category,
      price: parsedResult.price,
      billingInterval: parsedResult.billingInterval,
      nextBillingDate: parsedResult.date,
      usageScore: 100, // Starts fresh
      status: 'active',
      logo: parsedResult.name.toLowerCase().replace(' ', '')
    });
    setParsedResult(null);
    setInputText("");
    alert(`${parsedResult.name} successfully registered in active monitors!`);
  };

  return (
    <div className="parser-container">
      <div className="cyber-grid-title font-cyber">
        <span>SEQUENCE CLASSIFIER MODULE</span>
        <span className="badge badge-red">READY</span>
      </div>

      <div className="parser-grid">
        {/* Left Side: Input area */}
        <div className="glass-panel input-panel">
          <div className="panel-header">
            <Cpu size={16} className="glow-text-red" />
            <h3 className="font-cyber">TRANSACTION DATA INPUT</h3>
          </div>
          
          <div className="preset-selector">
            <span className="label font-cyber">presets:</span>
            {PRESETS.map((p, idx) => (
              <button 
                key={idx} 
                className="btn-preset font-cyber"
                onClick={() => {
                  setInputText(p.text);
                  setParsedResult(null);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="text-area-wrapper">
            <textarea
              className={`raw-textarea ${isScanning ? 'scanning-container' : ''}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste email notification content, banking SMS alert, or CSV billing line here..."
              disabled={isScanning}
            />
          </div>

          <div className="panel-actions">
            <button 
              className="btn-cyber font-cyber"
              onClick={runSimulation}
              disabled={isScanning || !inputText.trim()}
            >
              {isScanning ? 'Scrutinizing Text...' : 'Parse Transaction'}
            </button>
          </div>
        </div>

        {/* Right Side: Parsing Visualizer */}
        <div className="glass-panel output-panel">
          <div className="panel-header">
            <FileText size={16} />
            <h3 className="font-cyber">SEQUENCE CLASSIFICATION VISUALIZATION</h3>
          </div>

          <div className="visualization-content">
            {isScanning && (
              <div className="loader-overlay">
                <div className="scan-steps font-cyber">
                  <div className={`step-item ${scanStep >= 1 ? 'active glow-text-red' : ''}`}>
                    <ChevronRight size={14} /> Tokenizing sentence sequence...
                  </div>
                  <div className={`step-item ${scanStep >= 2 ? 'active glow-text-purple' : ''}`}>
                    <ChevronRight size={14} /> Tagging entities (BiLSTM-CRF classifier)...
                  </div>
                  <div className={`step-item ${scanStep >= 3 ? 'active glow-text-gold' : ''}`}>
                    <ChevronRight size={14} /> Extracting cost variables & billing periods...
                  </div>
                </div>
                <div className="cyber-progress">
                  <div className="bar progress-active"></div>
                </div>
              </div>
            )}

            {!isScanning && !parsedResult && (
              <div className="empty-output">
                <AlertCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                <p>Input raw transaction telemetry on the left, then trigger the Sequence Classifier to visualize named entity tags.</p>
              </div>
            )}

            {!isScanning && parsedResult && (
              <div className="result-active">
                <h4 className="font-cyber glow-text-green label-results">
                  <CheckCircle2 size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                  PARSED TRANSACTION STRUCTURE
                </h4>

                <div className="highlighted-display glass-panel">
                  {renderHighlightedText()}
                </div>

                <div className="parsed-attributes">
                  <div className="attr-row">
                    <span className="attr-label font-cyber">MERCHANT:</span>
                    <strong className="attr-value glow-text-red">{parsedResult.name}</strong>
                  </div>
                  <div className="attr-row">
                    <span className="attr-label font-cyber">CLASSIFIED AMOUNT:</span>
                    <strong className="attr-value glow-text-green">₹{parsedResult.price.toFixed(2)} / month</strong>
                  </div>
                  <div className="attr-row">
                    <span className="attr-label font-cyber">RENEWAL CYCLE:</span>
                    <strong className="attr-value">{parsedResult.date}</strong>
                  </div>
                  <div className="attr-row">
                    <span className="attr-label font-cyber">MODEL CONFIDENCE:</span>
                    <span className="badge badge-purple">{(parsedResult.confidence * 100).toFixed(1)}% ACCURACY</span>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn-cyber font-cyber" onClick={handleAdd}>
                    Add Subscription to Monitor
                  </button>
                  <button className="btn-cyber-secondary font-cyber" onClick={() => setParsedResult(null)}>
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .parser-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .parser-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1000px) {
          .parser-grid {
            grid-template-columns: 1fr;
          }
        }

        .input-panel, .output-panel {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 400px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .panel-header h3 {
          font-size: 13px;
          letter-spacing: 0.05em;
        }

        .preset-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-selector .label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .btn-preset {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-preset:hover {
          background: rgba(255, 42, 68, 0.08);
          border-color: var(--primary-red-border);
          color: #fff;
        }

        .text-area-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .raw-textarea {
          flex: 1;
          width: 100%;
          min-height: 180px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 13px;
          line-height: 1.6;
          resize: none;
          outline: none;
          transition: var(--transition-smooth);
        }

        .raw-textarea:focus {
          border-color: var(--primary-red-border);
          box-shadow: 0 0 10px rgba(255, 42, 68, 0.05);
        }

        .panel-actions {
          display: flex;
          justify-content: flex-end;
        }

        /* Visualization Area */
        .visualization-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .empty-output {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
          font-size: 12px;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
        }

        .loader-overlay {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .scan-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 12px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }

        .step-item.active {
          transform: translateX(4px);
        }

        .cyber-progress {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .cyber-progress .bar {
          height: 100%;
          width: 0;
          background: var(--primary-red);
          box-shadow: 0 0 8px var(--primary-red);
        }

        .progress-active {
          animation: fillProgress 3.6s linear forwards;
        }

        @keyframes fillProgress {
          0% { width: 0%; }
          30% { width: 33%; }
          65% { width: 66%; }
          100% { width: 100%; }
        }

        /* Result Display */
        .result-active {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .label-results {
          font-size: 11px;
          letter-spacing: 0.05em;
        }

        .highlighted-display {
          padding: 16px;
          background: rgba(0,0,0,0.3);
          border-color: rgba(255, 255, 255, 0.03);
          font-size: 13px;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .entity-token {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 2px 6px;
          margin: 0 4px;
          border-radius: 4px;
          border: 1px solid;
          font-weight: 500;
          font-size: 12px;
        }

        .token-tag {
          font-size: 8px;
          font-weight: 700;
          opacity: 0.8;
          margin-top: 2px;
          letter-spacing: 0.03em;
        }

        .parsed-attributes {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .attr-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .attr-label {
          color: var(--text-muted);
        }

        .attr-value {
          font-family: var(--font-cyber);
        }

        .result-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
