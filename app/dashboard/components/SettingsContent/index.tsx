'use client'

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Calendar, Clock, AlertCircle, CheckCircle, X, Smartphone, ArrowRight, Info, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/MemberAuthContext';
import { updateUserPassword } from '@/lib/userOperations';
import { createExtensionRequest, getLatestExtensionRequest, type ExtensionRequestStatus } from '@/lib/extensionRequests';

const SettingsContent: React.FC = () => {
  const { user } = useAuth();
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

  const loadLatestExtensionStatus = async () => {
    if (!user?.id) return;
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
  };

  useEffect(() => {
    loadLatestExtensionStatus();
  }, [user?.id]);

  const handleExtensionRequest = async () => {
    if (!user) return;
    
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
      <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
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
                {extensionRequestId && (
                  <span className="text-[10px] text-slate-500 font-mono">#{extensionRequestId.slice(0, 8)}</span>
                )}
              </div>
            </div>
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
              onClick={() => setShowExtensionModal(true)}
              disabled={extensionStatus === 'pending'}
              className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
                extensionStatus === 'pending'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {extensionStatus === 'pending' ? 'Extension Request Pending' : 'Request Extension'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-base sm:text-xl font-semibold text-white mb-3 sm:mb-4 font-display">Change Password</h2>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-white text-xs sm:text-sm mb-1 block">Current Password</label>
            <div className="relative">
              <input
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
            <label className="text-white text-xs sm:text-sm mb-1 block">New Password</label>
            <div className="relative">
              <input
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
            <label className="text-white text-xs sm:text-sm mb-1 block">Confirm New Password</label>
            <div className="relative">
              <input
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
      {showExtensionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md w-full">
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
                  <div className="bg-slate-900/50 p-3 rounded border border-slate-600/30 space-y-3">
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
    </div>
  );
};

export default SettingsContent;
