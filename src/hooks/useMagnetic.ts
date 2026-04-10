import { useRef, useCallback } from 'react';

interface MagneticOptions {
  strength?: number;   // 0-1, default 0.3
  threshold?: number;  // px radius, default 40
}

export function useMagnetic(opts: MagneticOptions = {}) {
  const { strength = 0.3, threshold = 40 } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold + Math.max(rect.width, rect.height) / 2) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        }
      });
    },
    [strength, threshold]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translate(0, 0)';

    const onEnd = () => {
      el.style.transition = '';
      el.removeEventListener('transitionend', onEnd);
    };
    el.addEventListener('transitionend', onEnd);
  }, []);

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}
