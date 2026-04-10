import type { ReactNode } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import './MagneticButton.css';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  id?: string;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  id,
  disabled,
}: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic({
    strength: 0.25,
    threshold: 50,
  });

  return (
    <div
      ref={ref}
      className="magnetic-wrapper"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <button
        type={type}
        className={`magnetic-btn ${className}`}
        onClick={onClick}
        id={id}
        disabled={disabled}
      >
        <span className="magnetic-btn-bg" />
        <span className="magnetic-btn-content">{children}</span>
      </button>
    </div>
  );
}
