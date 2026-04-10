import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteFromHistory, clearHistory, type HistoryEntry } from '../services/historyService';
import './History.css';

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory());
  const [filter, setFilter] = useState<string>('all');

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setEntries(getHistory());
  };

  const handleClear = () => {
    if (window.confirm('Clear all scan history?')) {
      clearHistory();
      setEntries([]);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fakeguard-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.riskLevel === filter);

  return (
    <div className="history" id="history-page">
      <header className="history-head">
        <div>
          <p className="section-label">History</p>
          <h1 className="section-title">Scan History</h1>
          <p className="section-desc">
            All your previous scans stored locally in this browser. {entries.length} total.
          </p>
        </div>
        {entries.length > 0 && (
          <div className="history-actions">
            <button className="btn btn-sm btn-ghost" onClick={handleExport}>↓ Export JSON</button>
            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={handleClear}>🗑 Clear All</button>
          </div>
        )}
      </header>

      {/* Filters */}
      {entries.length > 0 && (
        <div className="filter-bar">
          {['all', 'safe', 'suspicious', 'fake'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'safe' ? '✓ Real' : f === 'suspicious' ? '⚠ Suspicious' : '✗ Fake'}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="history-empty">
          <p>{entries.length === 0 ? 'No scan history yet.' : 'No scans match this filter.'}</p>
          {entries.length === 0 && (
            <Link to="/detect" className="btn btn-sm btn-primary">Run your first scan →</Link>
          )}
        </div>
      ) : (
        <div className="history-table surface-static">
          <div className="h-row h-header">
            <span className="h-cell h-platform">Platform</span>
            <span className="h-cell h-user">Username</span>
            <span className="h-cell h-score">Score</span>
            <span className="h-cell h-risk">Risk</span>
            <span className="h-cell h-date">Date</span>
            <span className="h-cell h-actions"></span>
          </div>
          {filtered.map((e) => (
            <div key={e.id} className="h-row">
              <span className="h-cell h-platform">
                <span className="h-icon">{e.platformIcon}</span>
                <span className="h-pname">{e.platform}</span>
              </span>
              <span className="h-cell h-user">
                <Link to={`/report/${e.id}`} className="h-user-link">@{e.username}</Link>
              </span>
              <span className="h-cell h-score">{e.trustScore}</span>
              <span className="h-cell h-risk">
                <span className={`badge badge-${e.riskLevel === 'safe' ? 'safe' : e.riskLevel === 'suspicious' ? 'warn' : 'danger'}`}>
                  {e.riskLevel}
                </span>
              </span>
              <span className="h-cell h-date">
                {new Date(e.analyzedAt).toLocaleDateString()}
              </span>
              <span className="h-cell h-actions">
                <Link to={`/report/${e.id}`} className="btn btn-sm btn-ghost">View</Link>
                <button className="btn btn-sm btn-icon" onClick={() => handleDelete(e.id)}>✕</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
