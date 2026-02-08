'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, ScanBarcode, User, Crown, Star, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/MemberAuthContext';
import { getReferralStats, submitWithdrawal, getTierConfig, getLatestWithdrawRequest, type ReferralStats, type WithdrawRequestRow } from '@/lib/memberStats';
import type { Tier } from '@/types/database';

const AchievementsContent: React.FC = () => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawStatusMessage, setWithdrawStatusMessage] = useState<string | null>(null);
  const [latestWithdrawRequest, setLatestWithdrawRequest] = useState<WithdrawRequestRow | null>(null);
  const [withdrawStatusLoading, setWithdrawStatusLoading] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState<{
    walletType: 'gopay' | 'dana';
    amount: string;
  }>({
    walletType: 'gopay',
    amount: ''
  });
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0
  });
  const [tierConfig, setTierConfig] = useState<Tier[] | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadReferralStats = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Load referral stats and tier config in parallel
      const [stats, tiers] = await Promise.all([
        getReferralStats(user.id),
        getTierConfig()
      ]);

      if (!isMountedRef.current) return;

      setReferralStats(stats);
      setTierConfig(tiers);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user]);

  // Load data when component mounts
  useEffect(() => {
    console.log('🚀 AchievementsContent mounted, user:', user?.id);
    if (user?.id) {
      console.log('✅ User ID found, calling loadReferralStats');
      loadReferralStats();
    } else {
      console.log('❌ No user ID found');
    }
  }, [user, loadReferralStats]);

  const getTierIcon = (tier: string, isCurrentTier: boolean = false) => {
    const iconColor = isCurrentTier ? 'text-white' : 'text-slate-400';
    
    switch (tier) {
      case 'Rookie':
        return <Star className={`w-10 h-10 ${iconColor}`} />;
      case 'Pro':
        return <Trophy className={`w-10 h-10 ${iconColor}`} />;
      case 'Legend':
        return <Crown className={`w-10 h-10 ${iconColor}`} />;
      default:
        return <Star className={`w-10 h-10 ${iconColor}`} />;
    }
  };

  const tierColors = {
    Rookie: 'from-green-500 to-emerald-600',
    Pro: 'from-purple-500 to-purple-600',
    Legend: 'from-amber-500 to-amber-600'
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const loadLatestWithdrawStatus = useCallback(async () => {
    if (!user?.id) return;
    setWithdrawStatusLoading(true);
    const latest = await getLatestWithdrawRequest(user.id);
    setLatestWithdrawRequest(latest);
    setWithdrawStatusLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (showWithdrawModal) {
      loadLatestWithdrawStatus();
    }
  }, [showWithdrawModal, loadLatestWithdrawStatus]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setWithdrawForm({ ...withdrawForm, amount: value });
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setWithdrawSubmitting(true);
      const result = await submitWithdrawal(user?.id || '', {
        amount: parseInt(withdrawForm.amount),
        walletType: withdrawForm.walletType,
        whatsappNumber: user?.whatsapp || '',
        email: user?.email || ''
      });

      if (result.success) {
        setWithdrawStatusMessage('Request submitted. Status: Pending approval.');
        setLatestWithdrawRequest({
          id: 'pending',
          user_id: user?.id || '',
          amount: parseInt(withdrawForm.amount),
          status: 'pending',
          created_at: new Date().toISOString()
        });
        setShowWithdrawModal(false);
        setWithdrawForm({
          walletType: 'gopay',
          amount: ''
        });
        // Refresh referral stats after withdrawal
        loadReferralStats();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Failed to submit withdrawal. Please try again.');
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (latestWithdrawRequest?.status === 'pending') return false;
    if (!withdrawForm.amount) return false;
    const amount = parseInt(withdrawForm.amount);
    if (!Number.isFinite(amount)) return false;
    return (
      amount >= 50000 &&
      amount % 50000 === 0 &&
      amount <= parseInt(user?.balance || '0')
    );
  };

  const getWithdrawStatusBadge = () => {
    if (withdrawStatusLoading) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium border text-slate-300 bg-slate-800/60 border-slate-600/40">
          Loading...
        </span>
      );
    }
    if (!latestWithdrawRequest) return null;
    const status = latestWithdrawRequest.status;
    const color =
      status === 'pending'
        ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30'
        : status === 'approved'
          ? 'text-green-300 bg-green-500/10 border-green-500/30'
          : status === 'paid'
            ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
            : 'text-red-300 bg-red-500/10 border-red-500/30';
    const label =
      status === 'pending'
        ? 'Pending'
        : status === 'approved'
          ? 'Approved'
          : status === 'paid'
            ? 'Paid'
            : 'Rejected';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Member Status Card */}
      <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-2xl p-4 sm:p-5 md:p-8 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {/* Current Tier */}
          <div className="text-center">
            <div 
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br ${tierColors[user?.tier as keyof typeof tierColors]} flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              <div className="relative z-10">{getTierIcon(user?.tier || 'Rookie')}</div>
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-display font-bold text-white mb-1">{user?.tier || 'Rookie'}</h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-purple-300">Current Tier</p>
          </div>

          {/* Balance */}
          <div className="text-center">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={handleWithdrawClick}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <div className="relative z-10"><Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /></div>
            </div>
            <h2 className="text-base sm:text-lg md:text-2xl font-display font-bold text-white mb-1">Rp {parseInt(user?.balance || '0').toLocaleString('id-ID')}</h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-cyan-300">Current Balance</p>
            {withdrawStatusMessage && (
              <p className="text-[9px] sm:text-[10px] md:text-xs text-amber-300 mt-1">{withdrawStatusMessage}</p>
            )}
          </div>

          {/* Referral Code */}
          <div className="text-center">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={handleCopyReferralCode}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <div className="relative z-10"><ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /></div>
            </div>
            <h2 className="text-sm sm:text-base md:text-xl font-display font-bold text-white mb-1">{user?.referral_code || ''}</h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-green-300">
              {copiedCode ? '✅ Copied!' : 'Referral Code'}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Statistics */}
      <h3 className="text-lg sm:text-xl font-bold text-white border-b border-slate-800 pb-3 sm:pb-4 font-display">REFERRAL STATISTICS</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
        <div className="bg-slate-900/50 border border-green-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm max-w-xs sm:max-w-sm mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span className="text-green-300 font-semibold text-xs sm:text-sm">Total Referrals</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{referralStats.totalReferrals}</div>
          <p className="text-slate-400 text-[11px] sm:text-xs mt-1">People joined with your code</p>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-slate-900/50 border border-cyan-500/20 p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-base sm:text-lg font-bold text-cyan-300 mb-3 sm:mb-4 md:mb-6 font-display">TIER BENEFITS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {tierConfig ? (
            (['Rookie', 'Pro', 'Legend'] as const).map((tierName) => {
              const tierData = tierConfig.find(t => t.tier_name === tierName);
              
              if (!tierData) {
                return null;
              }
            
            return (
              <div key={tierName} className={`p-3 md:p-4 rounded-lg border ${
                tierName === user?.tier 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-slate-600/50 bg-slate-900/50'
              }`}>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2">
                    {getTierIcon(tierName, tierName === user?.tier)}
                    <h4 className={`font-bold text-xs sm:text-sm md:text-base ${
                      tierName === user?.tier ? 'text-green-400' : 'text-slate-400'
                    }`}>{tierName}</h4>
                  </div>
                  <div className={`text-[11px] sm:text-xs md:text-sm font-mono ${
                    tierName === user?.tier ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    {tierName === user?.tier ? 'Current' : 'Available'}
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mb-2 md:mb-3 italic">
                  Get {tierData.min_referrals} referrals to unlock
                </div>
                <ul className="text-[11px] sm:text-xs md:text-sm text-slate-300 space-y-1">
                  <li>• {tierData.referral_bonus_percentage}% referral commission</li>
                  {parseInt(tierData.cashback_percentage) > 0 && (
                    <li>• {tierData.cashback_percentage}% cashback on learning packages (subscription only)</li>
                  )}
                </ul>
              </div>
            );
          })
          ) : (
            <div className="col-span-full text-center text-slate-400 py-8">
              Loading tier benefits...
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900/95 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl">
            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white mb-4 sm:mb-6">WITHDRAWAL FORM</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] sm:text-xs text-slate-400">Latest Request Status</span>
              {getWithdrawStatusBadge()}
            </div>
            {latestWithdrawRequest?.status === 'pending' && (
              <div className="mb-4 text-[11px] sm:text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                You already have a pending request. Please wait until it is approved or rejected.
              </div>
            )}
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-6">
              {/* User Info Display (Non-editable) */}
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-2">WhatsApp Number</label>
                  <div className="text-sm sm:text-base text-white font-medium">{user?.whatsapp || 'No WhatsApp number'}</div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-2">Email Address</label>
                  <div className="text-sm sm:text-base text-white font-medium">{user?.email || 'No email'}</div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Withdrawal Amount</label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount (min. Rp 50.000)"
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  min="50000"
                  step="50000"
                />
              </div>

              {/* Admin Fee Note */}
              <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs sm:text-sm font-medium">Admin Fee</p>
                    <p className="text-amber-200 text-[11px] sm:text-xs mt-1">
                      Each withdrawal is subject to an admin fee of Rp 5,000. 
                      The amount you will receive is the total withdrawal minus the admin fee.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {withdrawForm.amount && parseInt(withdrawForm.amount) >= 50000 && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Withdrawal Amount:</span>
                      <span className="text-white">Rp {parseInt(withdrawForm.amount).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Admin Fee:</span>
                      <span className="text-amber-400">Rp 5.000</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2">
                      <div className="flex justify-between font-medium text-xs sm:text-sm">
                        <span className="text-white">Amount Received:</span>
                        <span className="text-green-400">Rp {(parseInt(withdrawForm.amount) - 5000).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Type */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-300">Wallet Type</label>
                <select
                  value={withdrawForm.walletType}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, walletType: e.target.value as 'gopay' | 'dana' })}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="gopay">GoPay</option>
                  <option value="dana">Dana</option>
                </select>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">*Multiples of 50,000</p>

              {/* Balance Info */}
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-purple-300">
                  Available Balance: <span className="font-bold text-white">Rp {parseInt(user?.balance || '0').toLocaleString('id-ID')}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || withdrawSubmitting}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                    !isFormValid() || withdrawSubmitting
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  {withdrawSubmitting ? 'Submitting...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsContent;
