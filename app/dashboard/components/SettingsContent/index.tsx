'use client'

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Calendar, Clock, AlertCircle, CheckCircle, X, Smartphone, ArrowRight, Info, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/MemberAuthContext';
import { updateUserPassword } from '@/lib/userOperations';
import { createExtensionRequest, getLatestExtensionRequest, type ExtensionRequestStatus } from '@/lib/extensionRequests';
import { HapticSettings } from './HapticSettings';
import { useHaptic } from '@/lib/haptic/useHaptic';

const EXTENSION_REQUEST_LOCKED = true;

const PHONETIC_SYMBOL_GROUPS: Array<{ id: string; symbols: string[] }> = [
  { id: 'vowel-lax', symbols: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a'] },
  { id: 'vowel-tense', symbols: ['\u0251', 'i', 'u', '\u00e6', '\u0254'] },
  { id: 'diphthong', symbols: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'] },
  { id: 'consonant-voiceless', symbols: ['p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h'] },
  { id: 'consonant-voiced', symbols: ['b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y'] },
];

const toPercent = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

const readLocalStorageObject = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const SettingsContent: React.FC = () => {
  const { user } = useAuth();
  const { triggerHaptic } = useHaptic();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Extension states
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<ExtensionRequestStatus | null>(null);
  const [extensionRequestId, setExtensionRequestId] = useState<string | null>(null);
  const [extensionStatusLoading, setExtensionStatusLoading] = useState(false);

  const [phoneticSymbolsProgress, setPhoneticSymbolsProgress] = useState(0);
  const [showHeroHelpModal, setShowHeroHelpModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculate = () => {
      const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {});
      const allSymbols = PHONETIC_SYMBOL_GROUPS.flatMap((group) => group.symbols);
      const values = allSymbols.map((symbol) => toPercent(topicProgress[`phoneticSymbols_${symbol}`]));
      const avg = values.length > 0 ? Math.round(values.reduce((acc, curr) => acc + curr, 0) / values.length) : 0;
      setPhoneticSymbolsProgress(avg);
    };

    calculate();

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'pronunciationProgress') {
        calculate();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', calculate);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', calculate);
    };
  }, []);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await updateUserPassword(currentPassword, newPassword);
      
      if (result.success) {
        alert('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(`Failed to update password: ${result.error}`);
      }
    } catch {
      alert('An unexpected error occurred while updating password.');
    } finally {
      setLoading(false);
    }
  };

  const loadLatestExtensionStatus = useCallback(async () => {
    if (EXTENSION_REQUEST_LOCKED || !user?.id) return;
    setExtensionStatusLoading(true);
    const latest = await getLatestExtensionRequest(user.id);
    if (latest) {
      setExtensionStatus(latest.status);
      setExtensionRequestId(latest.id);
    } else {
      setExtensionStatus(null);
      setExtensionRequestId(null);
    }
    setExtensionStatusLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void loadLatestExtensionStatus();
  }, [loadLatestExtensionStatus]);

  const handleExtensionRequest = async () => {
    if (EXTENSION_REQUEST_LOCKED || !user) return;
    
    setExtensionLoading(true);
    try {
      const created = await createExtensionRequest({
        userId: user.id,
        paymentMethod: 'gopay'
      });
      if (created) {
        setExtensionStatus(created.status);
        setExtensionRequestId(created.id);
      }
      
      // Close modal
      setShowExtensionModal(false);
      
      // Redirect to WhatsApp
      const whatsappMessage = encodeURIComponent(
        `Halo admin, saya ingin mengajukan perpanjangan langganan.\n\n` +
        `Nama: ${user.fullname}\n` +
        `Email: ${user.email}\n` +
        `Kode Referral: ${user.referral_code}\n\n` +
        `Saya sudah melakukan transfer ke nomor GoPay 085846003119. Mohon konfirmasi terima kasih.`
      );
      
      window.open(`https://wa.me/6285846003119?text=${whatsappMessage}`, '_blank');
      
      alert('Pengajuan perpanjangan berhasil dikirim! Status: Pending');
    } catch {
      console.error('Error submitting extension request');
      alert('Gagal mengajukan perpanjangan: An unknown error occurred');
    } finally {
      setExtensionLoading(false);
    }
  };

  const getExtensionStatusColor = () => {
    if (EXTENSION_REQUEST_LOCKED) {
      return 'text-slate-300 bg-slate-800/50 border-slate-700/50';
    }
    switch (extensionStatus) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-slate-400 bg-slate-800/50 border-slate-700/30';
    }
  };

  const getExtensionStatusText = () => {
    if (EXTENSION_REQUEST_LOCKED) return 'Locked';
    switch (extensionStatus) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return extensionStatusLoading ? 'Loading...' : 'No Request';
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm">Manage your account and preferences</p>
      </div>

      {/* Member Information - Read Only */}
      <div className="bg-black/50 border border-purple-500/20 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-semibold text-white font-display">Member Information</h2>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-slate-800/50 border border-slate-700/30 rounded-full">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Read-Only</span>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-white text-[11px] sm:text-xs font-medium">{user?.fullname || 'Not Set'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-white text-[9px] sm:text-[10px] font-medium">{user?.email || 'Not Set'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">WhatsApp</p>
              <p className="text-white text-[11px] sm:text-xs font-medium">{user?.whatsapp || 'Not Set'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Your Referral Code</p>
              <p className="text-cyan-400 text-[11px] sm:text-xs font-mono font-bold tracking-widest">{user?.referral_code || 'Not Set'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Joined Since</p>
              <p className="text-white text-[11px] sm:text-xs font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Set'}
              </p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Subscription Expired</p>
              <p className="text-white text-[11px] sm:text-xs font-medium">
                {user?.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Set'}
              </p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Account Status</p>
              <p className="text-green-400 font-medium uppercase tracking-widest text-[9px] sm:text-[10px]">{user?.status || 'Unknown'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
              <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">Extension Status</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-medium border ${getExtensionStatusColor()}`}>
                  {getExtensionStatusText()}
                </span>
                {!EXTENSION_REQUEST_LOCKED && extensionRequestId && (
                  <span className="text-[10px] text-slate-500 font-mono">#{extensionRequestId.slice(0, 8)}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* GEUWAT Tower Hero */}
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-black/40 border border-purple-500/20 rounded-lg">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 text-center font-display leading-snug">
              <span className="block">Hidupkan Hero</span>
              <span className="block text-purple-200">Untuk Mengikuti GEUWAT Tower</span>
            </h3>

            {(() => {
              const tier =
                phoneticSymbolsProgress >= 70 ? 'active' : phoneticSymbolsProgress >= 26 ? 'shadow' : 'locked';
              const isShadow = tier !== 'active';
              const showLock = tier === 'locked';
              const imageClassName = isShadow
                ? 'object-contain w-full h-full opacity-90 [filter:brightness(0)_contrast(1.05)_drop-shadow(0_18px_20px_rgba(0,0,0,0.75))]'
                : 'object-contain w-full h-full drop-shadow-[0_18px_20px_rgba(0,0,0,0.35)]';

              return (
                <div className="rounded-xl border border-slate-700/40 bg-black/30 overflow-hidden">
                  <div className="relative w-full aspect-[16/9] flex items-center justify-center p-4">
                    <Image
                      src="/ChibiLogin.webp?v=20260528"
                      alt="GEUWAT Tower Hero"
                      width={720}
                      height={405}
                      className={imageClassName}
                      unoptimized
                    />
                    {isShadow ? (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/35" />
                    ) : null}
                    {showLock ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-700/60 bg-black/70 px-4 py-3">
                          <Lock className="w-6 h-6 text-slate-200" />
                          <div className="text-[11px] sm:text-xs text-slate-200 font-semibold text-center">
                            Locked
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })()}

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-800/45 border border-slate-700/40 rounded-lg p-3 text-center">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">
                  Phonetic Symbols
                </div>
                <div className="mt-1 text-sm sm:text-base font-mono font-bold text-cyan-300">
                  {phoneticSymbolsProgress}%
                </div>
              </div>
              <div className="bg-slate-800/45 border border-slate-700/40 rounded-lg p-3 text-center">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">
                  Target
                </div>
                <div className="mt-1 text-sm sm:text-base font-mono font-bold text-purple-200">
                  70%
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHeroHelpModal(true)}
              className="mt-3 text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors block mx-auto"
            >
              How to activate?
            </button>
          </div>

          {/* Admin Contact Section */}
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              Profile Changes
            </h3>
            <p className="text-slate-300 mb-3 sm:mb-4 text-xs sm:text-sm">
              To update your profile information, please contact our admin team:
            </p>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <a 
                href="https://wa.me/6285846003119?text=Halo admin, saya ingin mengupdate profile informasi saya."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-green-400 hover:text-green-300 underline transition-colors"
              >
                +62 858-4600-3119
              </a>
            </div>
          </div>
          
          {/* Extension Button */}
          <div className="mt-5 sm:mt-6">
            <button
              onClick={() => {
                if (EXTENSION_REQUEST_LOCKED) return;
                setShowExtensionModal(true);
              }}
              disabled={EXTENSION_REQUEST_LOCKED || extensionStatus === 'pending'}
              className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
                EXTENSION_REQUEST_LOCKED || extensionStatus === 'pending'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
              }`}
            >
              {EXTENSION_REQUEST_LOCKED ? <Lock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              {EXTENSION_REQUEST_LOCKED
                ? 'Extension Request Locked'
                : extensionStatus === 'pending'
                ? 'Extension Request Pending'
                : 'Request Extension'}
            </button>
            {EXTENSION_REQUEST_LOCKED && (
              <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-400">
                Fitur extension request sedang dikunci sementara.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Haptic Settings */}
      <HapticSettings />

      {/* Change Password */}
      <div className="bg-black/50 border border-purple-500/20 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-base sm:text-xl font-semibold text-white mb-3 sm:mb-4 font-display">Change Password</h2>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="text-white text-xs sm:text-sm mb-1 block"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 bg-slate-800/50 border border-slate-700/30 rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="text-white text-xs sm:text-sm mb-1 block"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 bg-slate-800/50 border border-slate-700/30 rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="text-white text-xs sm:text-sm mb-1 block"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-new-password"
                name="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 bg-slate-800/50 border border-slate-700/30 rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
          <button 
            className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              loading 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-500'
            }`}
            onClick={handlePasswordChange}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Change Password'}
          </button>
        </div>
      </div>
      
      {/* Extension Modal */}
      {!EXTENSION_REQUEST_LOCKED && showExtensionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-black border border-purple-500/20 rounded-xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white font-display">Request Extension</h3>
              <button
                onClick={() => setShowExtensionModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <p className="text-yellow-400 font-medium text-sm sm:text-base">Payment Instructions</p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p>Transfer the subscription fee to:</p>
                  <div className="bg-black/50 p-3 rounded border border-slate-600/30 space-y-3">
                    <div>
                      <p className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Smartphone className="w-4 h-4 text-green-400" />
                        GoPay Number:
                      </p>
                      <p className="text-cyan-400 font-mono text-base sm:text-lg">085846003119</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">a.n. Learning English Geuwat</p>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Mandiri</p>
                      <p className="text-cyan-400 font-mono text-base sm:text-lg">1710015448486</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">a.n. Fuad Muslim Nur</p>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400">Please keep your payment receipt as proof.</p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <p className="text-blue-400 font-medium text-sm sm:text-base">Next Steps</p>
                </div>
                <ol className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">1</span>
                    <span>Complete the payment transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">2</span>
                    <span>Click &quot;Submit Request&quot; below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">3</span>
                    <span>You&apos;ll be redirected to WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">4</span>
                    <span>Send payment confirmation to admin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">5</span>
                    <span>Wait for admin approval</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExtensionModal(false)}
                  className="flex-1 px-4 py-2 text-sm sm:text-base bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtensionRequest}
                  disabled={extensionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                    extensionLoading
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                  }`}
                >
                  {extensionLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Request
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Help Modal */}
      {showHeroHelpModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-black border border-purple-500/20 rounded-xl p-4 sm:p-6 max-w-[92vw] sm:max-w-md w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
                How to activate?
              </h3>
              <button
                onClick={() => setShowHeroHelpModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
                type="button"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="text-center space-y-1.5">
                <p className="text-slate-200 font-semibold leading-snug">
                  Hidupkan Hero Untuk Mengikuti GEUWAT Tower
                </p>
                <p className="leading-snug">
                  Hero akan aktif kalau bar{' '}
                  <span className="text-cyan-300 font-semibold">Phonetic Symbols</span>{' '}
                  mencapai <span className="text-cyan-300 font-semibold">70%</span>.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/50 bg-black/30 p-3 space-y-2">
                <p>1. Buka menu <span className="text-white font-semibold">Pronunciation</span>.</p>
                <p>2. Masuk ke <span className="text-white font-semibold">Phonetic Symbols</span>.</p>
                <p>3. Latih symbol-symbol sampai progress rata-rata naik.</p>
                <p>4. Cek lagi di View Progress &gt; Pronunciation &gt; Phonetic Symbols.</p>
              </div>
              <div className="text-slate-400">
                <div className="font-semibold text-slate-300">Status hero</div>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  <div>0-25%: locked</div>
                  <div>26-69%: shadow</div>
                  <div>70%+: active</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHeroHelpModal(false)}
                className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 transition-colors text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsContent;
