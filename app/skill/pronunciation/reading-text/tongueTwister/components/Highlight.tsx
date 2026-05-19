import { ReactNode } from 'react';

interface HighlightProps {
  children: ReactNode;
  color?: 'orange' | 'cyan';
}

export function Highlight({ children, color = 'orange' }: HighlightProps) {
  if (color === 'cyan') {
    return (
      <span className="text-[#00f3ff] font-bold" style={{ textShadow: '0 0 8px rgba(0, 243, 255, 0.6)' }}>
        {children}
      </span>
    );
  }
  
  return (
    <span className="text-[#ff8c00] font-bold" style={{ textShadow: '0 0 8px rgba(255, 140, 0, 0.6)' }}>
      {children}
    </span>
  );
}
