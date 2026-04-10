import { useEffect, useRef, useState } from 'react';
import './StatCard.css';

interface Props {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  accentColor?: string;
}

export default function StatCard({ icon, label, value, suffix = '', delay = 0, accentColor }: Props) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      function animate(now: number) {
        const p = Math.min((now - start) / duration, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, value, delay]);

  return (
    <div
      ref={cardRef}
      className="stat-card surface-static"
      id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{ borderTopColor: accentColor || 'var(--accent)' } as React.CSSProperties}
    >
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <span className="stat-card-value">
        {count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}
