import { ReactNode } from 'react';

interface HighlightProps {
  children: ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span
      className="text-[#fb923c] font-bold"
      style={{ textShadow: '0 0 8px rgba(251, 146, 60, 0.95), 0 0 16px rgba(251, 146, 60, 0.6)' }}
    >
      {children}
    </span>
  );
}
