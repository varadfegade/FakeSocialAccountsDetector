import type { AnalysisMetric } from '../services/detectService';
import { useState } from 'react';
import './AnalysisCard.css';

interface Props {
  metric: AnalysisMetric;
  index: number;
}

export default function AnalysisCard({ metric, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  const getColor = () => {
    if (metric.score >= 70) return 'var(--safe)';
    if (metric.score >= 40) return 'var(--warn)';
    return 'var(--danger)';
  };

  const getBadgeCls = () => {
    if (metric.score >= 70) return 'badge-safe';
    if (metric.score >= 40) return 'badge-warn';
    return 'badge-danger';
  };

  return (
    <div
      className={`a-card surface-static accent-border-l anim-fade-up ${expanded ? 'expanded' : ''}`}
      id={`analysis-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        animationDelay: `${index * 80}ms`,
        borderLeftColor: getColor(),
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="a-card-top">
        <span className="a-card-icon">{metric.icon}</span>
        <div className="a-card-info">
          <span className="a-card-label">{metric.label}</span>
          <span className={`badge ${getBadgeCls()}`}>{metric.value}</span>
        </div>
        <span className="a-card-score" style={{ color: getColor() }}>
          {metric.score}
        </span>
      </div>

      <div className="a-card-bar">
        <div
          className="a-card-bar-fill"
          style={{ width: `${metric.score}%`, background: getColor() }}
        />
      </div>

      {expanded && (
        <p className="a-card-desc anim-fade">{metric.description}</p>
      )}

      <span className="a-card-expand">
        {expanded ? '▲' : '▼'}
      </span>
    </div>
  );
}
