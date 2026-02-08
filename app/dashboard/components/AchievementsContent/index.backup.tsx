'use client'

import React, { useState } from 'react';
import { Zap, ScanBarcode, User, TrendingUp, Crown, Star, Trophy } from 'lucide-react';

// Mock data untuk member
const mockMemberData = {
  tier: 'Pro',
  balance: 2500000,
  referralCode: 'GEUWAT123',
  referralStats: {
    totalReferrals: 15,
    monthlyReferrals: 3,
    totalEarnings: 750000
  },
  tierProgress: {
    Rookie: 100,
    Pro: 65,
    Legend: 25
  },
  tierRequirements: {
    Rookie: { description: 'Join the platform and complete your profile' },
    Pro: { description: 'Get 10 referrals or maintain active learning for 30 days' },
    Legend: { description: 'Get 50 referrals or maintain active learning for 90 days' }
  },
  referralPercentages: {
    Rookie: 10,
    Pro: 15,
    Legend: 20
  },
  proCashbackPercentage: 5
};

const AchievementsContent: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    walletType: 'gopay',
    whatsappNumber: '',
    email: '',
    amount: ''
  });

  const memberData = mockMemberData;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Rookie':
        return <Star className="w-10 h-10" />;
      case 'Pro':
        return <Trophy className="w-10 h-10" />;
      case 'Legend':
        return <Crown className="w-10 h-10" />;
      default:
        return <Star className="w-10 h-10" />;
    }
  };

  const getTierStatus = (tier: string, progress: number) => {
    const currentTier = memberData.tier;
    
    if (tier === currentTier) {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/50',
        text: 'Current'
      };
    }
    
    if (progress >= 100) {
      return {
        color: 'text-amber-400',
        bgColor: 'bg-amber-900/20',
        borderColor: 'border-amber-500/50',
        text: 'Available'
      };
    }
    
    return {
      color: 'text-slate-400',
      bgColor: 'bg-slate-900/50',
      borderColor: 'border-slate-600/50',
      text: `${progress}%`
    };
  };

  const tierColors = {
    Rookie: 'from-green-500 to-emerald-600',
    Pro: 'from-purple-500 to-purple-600',
    Legend: 'from-amber-500 to-amber-600'
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(memberData.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 50000 && parseInt(value) % 50000 === 0)) {
      setWithdrawForm({ ...withdrawForm, amount: value });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock withdrawal processing
    alert(`Don't forget to save your progress! Withdrawal submitted successfully!`);
    setShowWithdrawModal(false);
    setWithdrawForm({
      walletType: 'gopay',
      whatsappNumber: '',
      email: '',
      amount: ''
    });
  };

  const isFormValid = () => {
    return (
      withdrawForm.whatsappNumber.length >= 10 &&
      withdrawForm.email.includes('@') &&
      parseInt(withdrawForm.amount) >= 50000 &&
      parseInt(withdrawForm.amount) <= memberData.balance
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Member Status Card */}
      <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Tier */}
          <div className="text-center">
            <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${tierColors[memberData.tier as keyof typeof tierColors]} flex items-center justify-center text-white mb-4 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              <div className="relative z-10">{getTierIcon(memberData.tier)}</div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{memberData.tier}</h2>
            <p className="text-purple-300 text-sm">Current Tier</p>
          </div>

          {/* Balance */}
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-4 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={handleWithdrawClick}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <div className="relative z-10"><Zap className="w-8 h-8" /></div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">Rp {memberData.balance.toLocaleString('id-ID')}</h2>
            <p className="text-cyan-300 text-sm">Current Balance</p>
          </div>

          {/* Referral Code */}
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-white/20 backdrop-blur-sm relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={handleCopyReferralCode}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <div className="relative z-10"><ScanBarcode className="w-8 h-8" /></div>
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-1">{memberData.referralCode}</h2>
            <p className="text-green-300 text-sm">
              {copiedCode ? '✅ Tersalin!' : 'Referral Code'}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Statistics */}
      <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4 font-display">REFERRAL STATISTICS</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-green-500/20 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-green-400" />
              <span className="text-green-300 font-semibold">Total Referrals</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{memberData.referralStats.totalReferrals}</div>
          <p className="text-slate-400 text-sm mt-2">People joined with your code</p>
        </div>

        <div className="bg-slate-900/50 border border-green-500/20 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-green-300 font-semibold">Monthly Referrals</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{memberData.referralStats.monthlyReferrals}</div>
          <p className="text-slate-400 text-sm mt-2">This month&apos;s referrals</p>
        </div>

        <div className="bg-slate-900/50 border border-amber-500/20 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-400" />
              <span className="text-amber-300 font-semibold">Total Earnings</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">Rp {memberData.referralStats.totalEarnings.toLocaleString('id-ID')}</div>
          <p className="text-slate-400 text-sm mt-2">From referral program</p>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-slate-900/50 border border-cyan-500/20 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-lg font-bold text-cyan-300 mb-6 font-display">TIER BENEFITS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Rookie', 'Pro', 'Legend'] as const).map((tier) => {
            const status = getTierStatus(tier, memberData.tierProgress[tier]);
            const requirements = memberData.tierRequirements[tier as keyof typeof memberData.tierRequirements];
            const progress = memberData.tierProgress[tier];
            
            return (
              <div key={tier} className={`p-4 rounded-lg border ${status.borderColor} ${status.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${status.color}`}>{tier}</h4>
                  <div className={`text-sm font-mono ${status.color}`}>{status.text}</div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      tier === 'Rookie' ? 'bg-green-500' :
                      tier === 'Pro' ? 'bg-purple-500' : 'bg-amber-500'
                    }`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mb-3 italic">
                  {requirements.description}
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  {tier === 'Rookie' && (
                    <>
                      <li>• {memberData.referralPercentages.Rookie}% referral commission</li>
                    </>
                  )}
                  {tier === 'Pro' && (
                    <>
                      <li>• {memberData.referralPercentages.Pro}% referral commission</li>
                      <li>• {memberData.proCashbackPercentage}% cashback on learning packages (subscription only)</li>
                    </>
                  )}
                  {tier === 'Legend' && (
                    <>
                      <li>• {memberData.referralPercentages.Legend}% referral commission</li>
                    </>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl">
            <h3 className="text-2xl font-display font-bold text-white mb-6">WITHDRAWAL FORM</h3>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-6">
              {/* Wallet Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Wallet Type</label>
                <select
                  value={withdrawForm.walletType}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, walletType: e.target.value })}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="gopay">GoPay</option>
                  <option value="dana">Dana</option>
                </select>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">WhatsApp Number</label>
                <input
                  type="tel"
                  value={withdrawForm.whatsappNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, whatsappNumber: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-slate-600"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={withdrawForm.email || ''}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-slate-600"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Withdraw Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={withdrawForm.amount}
                    onChange={handleAmountChange}
                    placeholder="50000"
                    min="50000"
                    step="50000"
                    className="w-full bg-black/60 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-slate-600"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">*Multiples of 50,000</p>
              </div>

              {/* Balance Info */}
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300">
                  Available Balance: <span className="font-bold text-white">Rp {memberData.balance.toLocaleString('id-ID')}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                    !isFormValid()
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                >
                  Withdraw
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
