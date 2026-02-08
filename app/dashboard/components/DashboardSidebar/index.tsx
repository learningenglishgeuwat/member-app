'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'
import { 
  Trophy, 
  BarChart2, 
  Settings, 
  LogOut, 
  CheckCircle,
  HelpCircle,
  Bell,
  Star,
  Crown,
  Compass
} from 'lucide-react'

interface DashboardSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentView: string
  setCurrentView: (view: string) => void
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, setIsOpen, currentView, setCurrentView }) => {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Get tier colors and icon
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'Rookie':
        return {
          icon: Star,
          avatarGradient: 'from-green-600 to-emerald-500',
          badgeBg: 'bg-green-500/20',
          badgeBorder: 'border-green-500/30',
          badgeText: 'text-green-300'
        }
      case 'Pro':
        return {
          icon: Trophy,
          avatarGradient: 'from-purple-600 to-pink-500',
          badgeBg: 'bg-purple-500/20',
          badgeBorder: 'border-purple-500/30',
          badgeText: 'text-purple-300'
        }
      case 'Legend':
        return {
          icon: Crown,
          avatarGradient: 'from-amber-600 to-orange-500',
          badgeBg: 'bg-amber-500/20',
          badgeBorder: 'border-amber-500/30',
          badgeText: 'text-amber-300'
        }
      default:
        return {
          icon: Star,
          avatarGradient: 'from-green-600 to-emerald-500',
          badgeBg: 'bg-green-500/20',
          badgeBorder: 'border-green-500/30',
          badgeText: 'text-green-300'
        }
    }
  }

  const currentTierInfo = getTierInfo(user?.tier || 'Rookie')
  const TierIcon = currentTierInfo.icon
  
  const menuItems = [
    { id: 'dashboard', label: 'Start Journey', icon: Compass },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'tutorial', label: 'Tutorial', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'device-approve', label: 'Approve Device', icon: CheckCircle },
  ]

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await signOut()
      setIsOpen(false)
      router.replace('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: tetap redirect ke login
      router.replace('/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string) => currentView === path

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-[100] min-h-screen h-[100dvh] md:h-screen w-60 sm:w-64 bg-slate-950/90 border-r border-purple-900/30 backdrop-blur-xl 
          transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:h-screen md:translate-x-0 md:transform-none
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 sm:p-6 border-b border-purple-900/30">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr ${currentTierInfo.avatarGradient} p-[2px]`}>
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <TierIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-xs sm:text-sm text-white truncate max-w-[180px]">
                {user?.fullname || user?.email?.split('@')[0] || 'Guest User'}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[180px] font-mono">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
            <div className="mt-2 flex flex-col items-center gap-1">
              <span className={`px-2 py-0.5 rounded-full ${currentTierInfo.badgeBg} border ${currentTierInfo.badgeBorder} text-[9px] sm:text-[10px] ${currentTierInfo.badgeText} font-bold uppercase tracking-wider font-display flex items-center gap-1`}>
                <TierIcon className="w-3 h-3" />
                {user?.tier || 'Rookie'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto pb-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'device-approve') {
                        router.push('/device-approve');
                        setIsOpen(false);
                        return;
                      }
                      setCurrentView(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 font-display text-sm sm:text-base
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-0
                      ${isActive(item.id)
                        ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }
                    `}
                    aria-current={isActive(item.id) ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.id) && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full ml-auto"></div>
                    )}
                  </button>
                </li>
              );
            })}

            {/* Logout (placed under Settings) */}
            <li>
              <button
                onClick={handleLogout}
                type="button"
                disabled={isLoggingOut}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 font-display text-sm sm:text-base border ${
                  isLoggingOut
                    ? 'text-slate-500 cursor-not-allowed bg-slate-900/40 border-slate-800/60'
                    : 'text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
                }`}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout moved into menu list */}
      </aside>
    </>
  );
};

export default DashboardSidebar;
