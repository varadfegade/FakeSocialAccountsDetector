import { useParams, Link } from 'react-router-dom';
import { getHistoryById } from '../services/historyService';
import ThreatMeter from '../components/ThreatMeter';
import AnalysisCard from '../components/AnalysisCard';
import './Report.css';

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const entry = id ? getHistoryById(id) : undefined;

  if (!entry) {
    return (
      <div className="report" id="report-page">
        <div className="report-empty">
          <h2>Report Not Found</h2>
          <p>This scan may have been deleted or doesn't exist.</p>
          <Link to="/detect" className="btn btn-primary">← Run a new scan</Link>
        </div>
      </div>
    );
  }

  const { result } = entry;

  return (
    <div className="report" id="report-page">
      <header className="report-head">
        <div className="report-head-left">
          <Link to="/history" className="btn btn-sm btn-ghost">← Back to History</Link>
          <p className="section-label">Report</p>
          <h1 className="section-title">
            <span style={{ color: result.platform.color }}>{result.platform.icon}</span>{' '}
            @{result.username}
          </h1>
          <p className="section-desc">
            {result.platform.name} · Analyzed {new Date(entry.analyzedAt).toLocaleString()}
          </p>
        </div>
        <div className="report-head-right">
          <span className={`badge badge-${ result.riskLevel === 'safe' ? 'safe' : result.riskLevel === 'suspicious' ? 'warn' : 'danger' }`} style={{ fontSize: 'var(--fs-sm)', padding: '6px 16px' }}>
            {result.riskLevel === 'safe' ? '✓ Likely Real' : result.riskLevel === 'suspicious' ? '⚠ Suspicious' : '✗ Likely Fake'}
          </span>
        </div>
      </header>

      {/* Trust Score */}
      <div className="report-meter surface-static">
        <h3>Trust Score</h3>
        <ThreatMeter score={result.trustScore} size="lg" />
      </div>

      {/* Summary + Recommendation */}
      <div className="report-two-col">
        <div className="surface-static accent-border-l report-block" style={{ borderLeftColor: 'var(--accent)' }}>
          <h3>Summary</h3>
          <p>{result.summary}</p>
        </div>
        <div className="surface-static report-block" style={{ borderLeft: '3px solid var(--accent-secondary)' }}>
          <h3>💡 Recommendation</h3>
          <p>{result.recommendation}</p>
        </div>
      </div>

      {/* Metrics */}
      <section className="report-metrics">
        <h3>Detailed Breakdown</h3>
        <div className="report-metrics-grid">
          {result.metrics.map((m, i) => (
            <AnalysisCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </section>

      {/* Profile Info */}
      <section className="report-info surface-static">
        <h3>Profile Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Platform</span>
            <span className="info-value">{result.platform.icon} {result.platform.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value" style={{ fontFamily: 'var(--mono)' }}>@{result.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Scanned URL</span>
            <span className="info-value" style={{ fontFamily: 'var(--mono)', fontSize: 'var(--fs-xs)' }}>{entry.url}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Report ID</span>
            <span className="info-value" style={{ fontFamily: 'var(--mono)', fontSize: 'var(--fs-xs)' }}>{entry.id}</span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="report-actions">
        <Link to="/detect" className="btn btn-primary">↻ New Scan</Link>
        <button className="btn btn-ghost" onClick={() => window.print()}>🖨 Print Report</button>
      </div>
    </div>
  );
}
