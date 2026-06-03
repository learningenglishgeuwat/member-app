import { ReactNode } from 'react';

interface HighlightProps {
  children: ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span className="tt-highlight">
      {children}
    </span>
  );
}
