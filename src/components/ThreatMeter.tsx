import { useEffect, useState } from 'react';
import './ThreatMeter.css';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThreatMeter({ score, size = 'md' }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1000;
    const start = performance.now();

    function animate(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.round(score * eased));
      if (p < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const getLevel = () => {
    if (score >= 70) return { label: 'Likely Real', cls: 'safe' };
    if (score >= 40) return { label: 'Suspicious', cls: 'warn' };
    return { label: 'Likely Fake', cls: 'danger' };
  };

  const level = getLevel();

  return (
    <div className={`threat-meter threat-meter-${size}`} id="threat-meter">
      <div className="threat-meter-header">
        <span className="threat-meter-score-value">{animatedScore}</span>
        <span className="threat-meter-score-max">/ 100</span>
        <span className={`badge badge-${level.cls} threat-meter-badge`}>
          {level.label}
        </span>
      </div>
      <div className="threat-meter-bar">
        <div className="threat-meter-zones">
          <span className="zone zone-danger" />
          <span className="zone zone-warn" />
          <span className="zone zone-safe" />
        </div>
        <div
          className={`threat-meter-fill threat-${level.cls}`}
          style={{ width: `${animatedScore}%` }}
        />
        <div
          className="threat-meter-thumb"
          style={{ left: `${animatedScore}%` }}
        />
      </div>
      <div className="threat-meter-labels">
        <span>Fake</span>
        <span>Suspicious</span>
        <span>Real</span>
      </div>
    </div>
  );
}
