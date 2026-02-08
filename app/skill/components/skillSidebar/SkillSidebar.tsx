'use client'

import React, { useState } from 'react'
import { Home, Cpu, LogOut, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/MemberAuthContext'
import './SkillSidebar.css';

// GEUWAT Menu Button Component
const GeuwatMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative w-14 h-14 sm:w-16 sm:h-16 geuwat-menu-button"
    aria-label="Open GEUWAT Menu"
  >
    <div className="absolute inset-0 bg-cyber-cyan/20 rounded-full blur-lg animate-pulse"></div>
    <div className="absolute inset-[-8px] bg-gradient-to-r from-cyber-cyan/10 via-neon-purple/10 to-cyber-pink/10 rounded-full blur-xl ring-pulse"></div>
    
    {/* Outer Ring */}
    <div className="logo-ring-main absolute inset-[-2px] sm:inset-[-3px] border-2 border-cyber-cyan animate-spin geuwat-ring-main rounded-full"></div>
    
    {/* Inner Ring */}
    <div className="logo-ring-secondary absolute inset-[2px] sm:inset-[3px] border border-cyber-cyan animate-spin-reverse geuwat-ring-secondary rounded-full"></div>
    
    {/* Logo Image */}
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <Image 
        alt="GEUWAT Logo" 
        className="logo-image w-10 h-10 sm:w-12 sm:h-12 geuwat-logo-glow rounded-full object-cover"
        src="/learning_english_geuwat_rb_3d.png"
        width={48}
        height={48}
        loading="eager"
      />
    </div>
  </button>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  customItems?: Array<{
    label: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    available?: boolean;
  }>;
  theme?: 'neon' | 'tech' | 'cyber';
  showMenuButton?: boolean;
  onMenuButtonClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  customItems,
  theme = 'cyber',
  showMenuButton = false,
  onMenuButtonClick
}) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const iconColors = {
    neon: {
      purple: 'text-neon-purple',
      cyan: 'text-neon-cyan', 
      pink: 'text-neon-pink',
      green: 'text-neon-green'
    },
    tech: {
      purple: 'text-tech-blue',
      cyan: 'text-tech-green', 
      pink: 'text-tech-orange',
      green: 'text-tech-red'
    },
    cyber: {
      purple: 'text-purple-400',
      cyan: 'text-green-400', 
      pink: 'text-pink-400',
      green: 'text-teal-400'
    }
  };

  const currentIconColors = iconColors[theme];

  // Enhanced size constants with better responsive design
  const sizes = {
    logo: 'w-12 h-12 sm:w-14 sm:h-14',
    logoRing: 'inset-[-4px] sm:inset-[-6px]',
    description: 'text-[10px] sm:text-[11px]'
  };

  const defaultItems = [
    {
      label: 'Dashboard',
      description: 'SYSTEM_OVERVIEW',
      icon: <Home className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />,
      onClick: () => router.push('/dashboard'),
      available: true
    },
    {
      label: 'Pronunciation',
      description: 'SYNTHESIS_MODULE',
      icon: <Cpu className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIconColors.purple} group-hover:scale-110 transition-transform`} />,
      onClick: () => router.push('/skill/pronunciation'),
      available: true
    },
    {
      label: 'Vocabulary',
      description: 'WORD_DATABASE',
      icon: <Cpu className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIconColors.cyan} group-hover:scale-110 transition-transform`} />,
      onClick: () => router.push('/skill'),
      available: false
    },
    {
      label: 'Grammar',
      description: 'SYNTAX_ENGINE',
      icon: <Cpu className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIconColors.green} group-hover:scale-110 transition-transform`} />,
      onClick: () => router.push('/skill/grammar'),
      available: false
    },
    {
      label: 'Speaking',
      description: 'OUTPUT_INTERFACE',
      icon: <Cpu className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIconColors.pink} group-hover:scale-110 transition-transform`} />,
      onClick: () => router.push('/skill/speaking'),
      available: false
    },
  ];

  const menuItems = customItems || defaultItems;

  // Render menu button if requested
  if (showMenuButton && !isOpen) {
    return <GeuwatMenuButton onClick={onMenuButtonClick || (() => {})} />;
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar-container sidebar-theme-${theme} snake-neon-border ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Futuristic sidebar background */}
        <div className="sidebar-background">
          <div className="tech-grid"></div>
          <div className="scanline-effect"></div>
        </div>
        <div className="sidebar-top-accent"></div>
        
        {/* Snake neon effect */}
        <div className="snake-neon-overlay"></div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`nav-button snake-neon-button ${
                  !item.available ? 'disabled' : ''
                }`}
                disabled={!item.available}
              >
                <div className="button-content">
                  <div className="icon-container">
                    {item.icon}
                  </div>
                  <div className="button-text">
                    <span className="button-label font-display">{item.label}</span>
                    <span className={`${sizes.description} button-description font-mono`}>{item.description}</span>
                  </div>
                </div>
                <div className="button-indicator"></div>
              </button>
            ))}
            
            {/* Divider */}
            <div className="nav-divider">
              <div className="divider-line"></div>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 divider-icon animate-pulse" />
              <div className="divider-line"></div>
            </div>
            
            <button
              onClick={async () => {
                if (isLoggingOut) return;
                setIsLoggingOut(true);
                try {
                  await signOut();
                  router.replace('/login');
                  router.refresh();
                } catch (error) {
                  console.error('Logout error:', error);
                  router.replace('/login');
                  router.refresh();
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              className="logout-button snake-neon-button"
              type="button"
              disabled={isLoggingOut}
            >
              <div className="button-content">
                <div className="icon-container">
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                </div>
                <div className="button-text">
                  <span className="button-label font-display">Logout</span>
                  <span className={`${sizes.description} button-description font-mono`}>SYSTEM_SHUTDOWN</span>
                </div>
              </div>
              <div className="button-indicator"></div>
            </button>
          </nav>
        </div>
        
        {/* Sidebar tech elements */}
        <div className="sidebar-footer">
          <div className="footer-left">
            <div className="w-2 h-2 sm:w-3 sm:h-3 status-indicator animate-pulse"></div>
          </div>
          <div className="footer-right">
            <div className="status-dots">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 status-dot status-low"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 status-dot status-medium"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 status-dot status-high"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      <div 
        className="sidebar-overlay"
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;
