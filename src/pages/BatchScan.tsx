import { useState, type FormEvent } from 'react';
import { analyzeProfile, type AnalysisResult } from '../services/detectService';
import { saveToHistory } from '../services/historyService';
import { parseProfileUrl } from '../services/urlParser';
import MagneticButton from '../components/MagneticButton';
import './BatchScan.css';

interface BatchItem {
  url: string;
  status: 'pending' | 'scanning' | 'done' | 'error';
  result?: AnalysisResult;
  error?: string;
}

export default function BatchScan() {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [running, setRunning] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const urls = input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    const batch: BatchItem[] = urls.map((url) => ({ url, status: 'pending' }));
    setItems(batch);
    setRunning(true);

    for (let i = 0; i < batch.length; i++) {
      setItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'scanning' } : item))
      );

      try {
        const result = await analyzeProfile(batch[i].url);
        saveToHistory(batch[i].url, result);
        setItems((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'done', result } : item))
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? { ...item, status: 'error', error: err instanceof Error ? err.message : 'Failed' }
              : item
          )
        );
      }
    }

    setRunning(false);
  };

  const handleExport = () => {
    const data = items
      .filter((i) => i.status === 'done' && i.result)
      .map((i) => ({
        url: i.url,
        platform: i.result!.platform.name,
        username: i.result!.username,
        trustScore: i.result!.trustScore,
        riskLevel: i.result!.riskLevel,
      }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fakeguard-batch-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="batch" id="batch-page">
      <header className="batch-head">
        <p className="section-label">Batch Scan</p>
        <h1 className="section-title">Analyze Multiple Accounts</h1>
        <p className="section-desc">Paste multiple profile URLs (one per line) to scan them all at once.</p>
      </header>

      {items.length === 0 ? (
        <form onSubmit={handleSubmit} className="batch-form anim-fade-up">
          <textarea
            className="batch-textarea surface-static"
            id="batch-input"
            rows={8}
            placeholder={"https://instagram.com/user1\nhttps://twitter.com/user2\nhttps://facebook.com/user3"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <div className="batch-form-footer">
            <span className="batch-count">
              {input.split('\n').filter((l) => l.trim()).length} URLs detected
            </span>
            <MagneticButton type="submit" id="batch-start-btn">
              → Start Batch Scan
            </MagneticButton>
          </div>
        </form>
      ) : (
        <div className="batch-results anim-fade">
          <div className="batch-progress-bar">
            <div
              className="batch-progress-fill"
              style={{ width: `${(doneCount / items.length) * 100}%` }}
            />
          </div>
          <p className="batch-progress-text">
            {running
              ? `Scanning... ${doneCount}/${items.length}`
              : `Complete — ${doneCount}/${items.length} analyzed`}
          </p>

          <div className="batch-table surface-static">
            <div className="b-row b-header">
              <span className="b-cell b-url">URL</span>
              <span className="b-cell b-platform">Platform</span>
              <span className="b-cell b-score">Score</span>
              <span className="b-cell b-risk">Risk</span>
              <span className="b-cell b-status">Status</span>
            </div>
            {items.map((item, i) => {
              const parsed = parseProfileUrl(item.url);
              return (
                <div key={i} className="b-row">
                  <span className="b-cell b-url">
                    <code>{item.url.replace('https://', '')}</code>
                  </span>
                  <span className="b-cell b-platform">
                    {item.result ? `${item.result.platform.icon} ${item.result.platform.name}` : parsed.platform?.name || '—'}
                  </span>
                  <span className="b-cell b-score" style={{
                    color: item.result
                      ? item.result.trustScore >= 70 ? 'var(--safe)' : item.result.trustScore >= 40 ? 'var(--warn)' : 'var(--danger)'
                      : 'var(--text-dim)'
                  }}>
                    {item.result ? item.result.trustScore : '—'}
                  </span>
                  <span className="b-cell b-risk">
                    {item.result && (
                      <span className={`badge badge-${item.result.riskLevel === 'safe' ? 'safe' : item.result.riskLevel === 'suspicious' ? 'warn' : 'danger'}`}>
                        {item.result.riskLevel}
                      </span>
                    )}
                  </span>
                  <span className={`b-cell b-status b-status-${item.status}`}>
                    {item.status === 'scanning' ? '⏳' : item.status === 'done' ? '✓' : item.status === 'error' ? '✗' : '•'}
                  </span>
                </div>
              );
            })}
          </div>

          {!running && (
            <div className="batch-done-actions">
              <button className="btn btn-primary" onClick={() => { setItems([]); setInput(''); }}>
                ↻ New Batch
              </button>
              <button className="btn btn-ghost" onClick={handleExport}>
                ↓ Export Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
