'use client';

import React from 'react';

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

const Sidebar: React.FC<SidebarProps> = () => null;

export default Sidebar;
