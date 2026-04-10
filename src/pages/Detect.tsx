import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseProfileUrl } from '../services/urlParser';
import { analyzeProfile, type AnalysisResult } from '../services/detectService';
import { saveToHistory } from '../services/historyService';
import ThreatMeter from '../components/ThreatMeter';
import AnalysisCard from '../components/AnalysisCard';
import ScanLineEffect from '../components/ScanLineEffect';
import MagneticButton from '../components/MagneticButton';
import './Detect.css';

export default function Detect() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const parsed = parseProfileUrl(url);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError('');
      setResult(null);

      if (!url.trim()) {
        setError('Please enter a profile URL.');
        return;
      }

      if (!parsed.isValid) {
        setError('Unsupported URL. Please enter a valid link from Instagram, Twitter/X, Facebook, TikTok, LinkedIn, or YouTube.');
        return;
      }

      setLoading(true);
      try {
        const analysis = await analyzeProfile(url);
        setResult(analysis);
        const entry = saveToHistory(url, analysis);
        // Store entry id for report
        sessionStorage.setItem('lastScanId', entry.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    },
    [url, parsed]
  );

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const riskBadge = () => {
    if (!result) return null;
    const map: Record<string, { cls: string; label: string }> = {
      safe: { cls: 'badge-safe', label: 'Likely Real' },
      suspicious: { cls: 'badge-warn', label: 'Suspicious' },
      fake: { cls: 'badge-danger', label: 'Likely Fake' },
    };
    const m = map[result.riskLevel];
    return <span className={`badge ${m.cls}`}>{m.label}</span>;
  };

  return (
    <div className="detect" id="detect-page">
      {/* Header */}
      <header className="detect-head">
        <p className="section-label">Detect</p>
        <h1 className="section-title">Analyze an Account</h1>
        <p className="section-desc">Paste a profile URL below to run an authenticity analysis.</p>
      </header>

      <div className="detect-layout">
        {/* Left: Input */}
        <div className="detect-input-panel">
          {!loading && !result && (
            <form onSubmit={handleSubmit} className="detect-form anim-fade-up" id="detect-form">
              <div className="input-shell surface-static">
                <span className="input-icon">
                  {parsed.platform ? parsed.platform.icon : '🔗'}
                </span>
                <input
                  type="text"
                  id="profile-url-input"
                  className="input-field"
                  placeholder="https://instagram.com/username"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
                {url && (
                  <button type="button" className="input-clear btn-icon" onClick={() => setUrl('')}>✕</button>
                )}
              </div>

              {parsed.isValid && parsed.platform && (
                <div className="detected-chip anim-fade">
                  <span style={{ color: parsed.platform.color }}>{parsed.platform.icon}</span>
                  <span>{parsed.platform.name}</span>
                  {parsed.username && <code>@{parsed.username}</code>}
                </div>
              )}

              {error && (
                <div className="detect-err anim-fade" id="detect-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <MagneticButton type="submit" id="analyze-btn">
                → Analyze Account
              </MagneticButton>

              <div className="example-row">
                <span className="example-label">Try:</span>
                {[
                  'https://instagram.com/johndoe123',
                  'https://twitter.com/fakefollower99',
                  'https://facebook.com/realuser.profile',
                ].map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    className="example-chip"
                    onClick={() => setUrl(ex)}
                  >
                    {ex.replace('https://', '')}
                  </button>
                ))}
              </div>
            </form>
          )}

          {loading && (
            <ScanLineEffect
              platform={parsed.platform?.name}
              username={parsed.username ?? undefined}
            />
          )}
        </div>

        {/* Right: Results */}
        <div className="detect-results-panel">
          {!loading && !result && (
            <div className="results-placeholder">
              <div className="ph-icon">⊘</div>
              <p>Results will appear here after analysis</p>
            </div>
          )}

          {loading && (
            <div className="results-placeholder scanning">
              <div className="ph-icon pulse-icon">⊘</div>
              <p>Scanning...</p>
            </div>
          )}

          {result && (
            <div className="results anim-fade" id="results-section">
              {/* Profile header */}
              <div className="results-profile surface-static">
                <span className="results-platform-icon" style={{ color: result.platform.color }}>
                  {result.platform.icon}
                </span>
                <div>
                  <h3>@{result.username}</h3>
                  <span className="results-platform-name">{result.platform.name}</span>
                </div>
                {riskBadge()}
              </div>

              {/* Threat Meter */}
              <div className="results-meter surface-static">
                <ThreatMeter score={result.trustScore} size="lg" />
              </div>

              {/* Summary */}
              <div className="results-summary surface-static accent-border-l">
                <strong>Summary</strong>
                <p>{result.summary}</p>
              </div>

              {/* Recommendation */}
              <div className="results-rec surface-static">
                <span className="rec-label">💡 Recommendation</span>
                <p>{result.recommendation}</p>
              </div>

              {/* Metrics */}
              <div className="results-metrics">
                <h3>Detailed Breakdown</h3>
                <div className="metrics-grid">
                  {result.metrics.map((m, i) => (
                    <AnalysisCard key={m.label} metric={m} index={i} />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="results-actions">
                <button className="btn btn-primary" onClick={handleReset} id="scan-another-btn">
                  ↻ Scan Another
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const id = sessionStorage.getItem('lastScanId');
                    if (id) navigate(`/report/${id}`);
                  }}
                  id="view-report-btn"
                >
                  View Full Report →
                </button>
              </div>

              <p className="results-time">
                {result.analyzedAt.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
