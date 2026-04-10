import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import MagneticButton from '../components/MagneticButton';
import { getHistory } from '../services/historyService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', color: '#E1306C' },
  { name: 'Twitter / X', icon: '𝕏', color: '#1DA1F2' },
  { name: 'Facebook', icon: '📘', color: '#1877F2' },
  { name: 'TikTok', icon: '♪', color: '#ff0050' },
  { name: 'LinkedIn', icon: 'in', color: '#0A66C2' },
  { name: 'YouTube', icon: '▶', color: '#FF0000' },
];

const THREAT_LEVELS = [
  { label: 'Real', pct: 58, color: 'var(--safe)' },
  { label: 'Suspicious', pct: 27, color: 'var(--warn)' },
  { label: 'Fake', pct: 15, color: 'var(--danger)' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const history = getHistory();
  const recentScans = history.slice(0, 5);

  return (
    <div className="dash" id="dashboard-page">
      {/* Page header */}
      <header className="dash-head">
        <div>
          <p className="section-label">Dashboard</p>
          <h1 className="dash-title">Welcome to <span className="gradient-text">FakeGuard</span></h1>
          <p className="dash-subtitle">Monitor, detect, and protect against fake social media accounts.</p>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="bento">
        {/* Hero card */}
        <div className="bento-hero surface-static">
          <div className="bento-hero-content">
            <span className="bento-hero-eyebrow">AI-Powered Detection</span>
            <h2>Detect fake accounts<br />in seconds</h2>
            <p>Paste any social media profile link and our algorithms will analyze authenticity in real-time. No sign-up needed.</p>
            <MagneticButton
              className="magnetic-btn"
              onClick={() => navigate('/detect')}
              id="dash-detect-btn"
            >
              <span>→</span> Start Scanning
            </MagneticButton>
          </div>
          <div className="bento-hero-visual">
            <div className="bento-hero-ring ring-1" />
            <div className="bento-hero-ring ring-2" />
            <div className="bento-hero-ring ring-3" />
            <span className="bento-hero-shield">🛡️</span>
          </div>
        </div>

        {/* Stats */}
        <StatCard icon="🔍" label="Scans Total" value={127843} delay={0} accentColor="var(--accent)" />
        <StatCard icon="🚫" label="Fakes Found" value={34219} delay={100} accentColor="var(--danger)" />
        <StatCard icon="⚡" label="Avg. Time" value={2} suffix="s" delay={200} accentColor="var(--warn)" />

        {/* Threat Distribution */}
        <div className="bento-threats surface-static">
          <h3>Threat Distribution</h3>
          <div className="threat-bars">
            {THREAT_LEVELS.map((t) => (
              <div key={t.label} className="threat-row">
                <span className="threat-label">{t.label}</span>
                <div className="threat-track">
                  <div
                    className="threat-fill"
                    style={{ width: `${t.pct}%`, background: t.color }}
                  />
                </div>
                <span className="threat-pct" style={{ color: t.color }}>{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="bento-platforms surface-static">
          <h3>Supported Platforms</h3>
          <div className="platform-chips">
            {PLATFORMS.map((p) => (
              <span key={p.name} className="platform-chip" style={{ borderColor: `${p.color}33` }}>
                <span className="platform-chip-icon" style={{ color: p.color }}>{p.icon}</span>
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bento-recent surface-static">
          <div className="bento-recent-head">
            <h3>Recent Scans</h3>
            {history.length > 0 && (
              <Link to="/history" className="btn btn-sm btn-ghost">View All →</Link>
            )}
          </div>
          {recentScans.length === 0 ? (
            <div className="bento-empty">
              <p>No scans yet</p>
              <Link to="/detect" className="btn btn-sm btn-primary">Run your first scan</Link>
            </div>
          ) : (
            <div className="recent-list">
              {recentScans.map((s) => (
                <Link key={s.id} to={`/report/${s.id}`} className="recent-item">
                  <span className="recent-icon">{s.platformIcon}</span>
                  <span className="recent-user">@{s.username}</span>
                  <span className={`badge badge-${s.riskLevel === 'safe' ? 'safe' : s.riskLevel === 'suspicious' ? 'warn' : 'danger'}`}>
                    {s.trustScore}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick tips */}
        <div className="bento-quick surface-static">
          <h3>Quick Red Flags</h3>
          <ul className="quick-flags">
            <li><span className="flag-dot danger" />No profile picture or stock photo</li>
            <li><span className="flag-dot danger" />Account created very recently</li>
            <li><span className="flag-dot warn" />Extremely high follower count, zero posts</li>
            <li><span className="flag-dot warn" />Generic or empty bio</li>
            <li><span className="flag-dot safe" />Verified badge present</li>
          </ul>
          <Link to="/tips" className="btn btn-sm btn-ghost" style={{ marginTop: 'auto' }}>Full Guide →</Link>
        </div>
      </div>
    </div>
  );
}
