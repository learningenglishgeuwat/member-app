'use client'

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  onClick, 
  className = '' 
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      // 🔥 CRITICAL: Cleanup browser state before navigation
      if (to.includes('/skill/pronunciation')) {
        // Reset any zoom/scale changes from previous page
        document.body.style.zoom = '1';
        document.body.style.transform = 'scale(1)';
        document.documentElement.style.zoom = '1';
        document.documentElement.style.transform = 'scale(1)';
      }
      if (to === '/skill' && pathname.startsWith('/skill/pronunciation')) {
        try {
          localStorage.removeItem('lastSkillPath');
        } catch {}
      }
      router.push(to);
    } else {
      // Default behavior: go back to previous page or dashboard
      if (pathname.startsWith('/skill/pronunciation')) {
        try {
          localStorage.removeItem('lastSkillPath');
        } catch {}
        router.push('/skill');
      } else if (pathname.includes('/skill/')) {
        router.push('/skill');
      } else if (pathname === '/skill') {
        router.push('/dashboard');
      } else {
        router.back();
      }
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-3 text-cyber-cyan hover:text-cyber-cyan/80 transition-all duration-300 group relative ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-cyber-cyan/20 rounded-full blur-md group-hover:bg-cyber-cyan/40 transition-colors"></div>
        <div className="relative w-10 h-10 rounded-full border border-cyber-cyan/60 flex items-center justify-center bg-black/50 group-hover:border-cyber-cyan group-hover:shadow-[0_0_20px_rgba(190,41,236,0.6)] transition-all duration-300">
          <ArrowLeft className="w-5 h-5 text-cyber-cyan group-hover:text-white transition-colors" />
        </div>
      </div>
      <span className="font-mono text-sm uppercase tracking-wider">Back</span>
    </button>
  );
};

export default BackButton;
