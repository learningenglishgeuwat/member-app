import { supabase } from './supabase';
import type { Tier, WithdrawRequest as WithdrawRequestDB } from '@/types/database';

// Interface for referral statistics
export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
}

// Interface for withdrawal request (form data)
export interface WithdrawalRequest {
  amount: number;
  walletType?: 'gopay' | 'dana';
  whatsappNumber: string;
  email: string;
}

// Interface for withdrawal result
export interface WithdrawalResult {
  success: boolean;
  error?: string;
}

export interface WithdrawRequestRow {
  id: string;
  user_id: string;
  amount: number;
  wallet_type?: 'gopay' | 'dana' | null;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  created_at: string;
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  try {
    // Get total referrals
    const { count: totalReferrals, error: referralError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);

    if (referralError) {
      console.error('Error fetching referral stats:', referralError);
      return {
        totalReferrals: 0,
        totalEarnings: 0
      };
    }

    // Calculate earnings (example: Rp 10,000 per referral)
    const totalEarnings = (totalReferrals || 0) * 10000;

    return {
      totalReferrals: totalReferrals || 0,
      totalEarnings
    };
  } catch (error) {
    console.error('Error in getReferralStats:', error);
    return {
      totalReferrals: 0,
      totalEarnings: 0
    };
  }
}

/**
 * Submit withdrawal request
 */
export async function submitWithdrawal(
  userId: string, 
  withdrawalData: WithdrawalRequest
): Promise<WithdrawalResult> {
  try {
    // Check user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single() as any;

    if (userError || !userData) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const currentBalance = parseInt(userData.balance || '0');
    const withdrawalAmount = withdrawalData.amount;
    const adminFee = 5000;
    const totalAmount = withdrawalAmount + adminFee;

    // Check if user has sufficient balance
    if (currentBalance < totalAmount) {
      return {
        success: false,
        error: 'Insufficient balance'
      };
    }

    // Create withdrawal record
    const { error: withdrawalError } = await (supabase as any)
      .from('withdraw_requests')
      .insert({
        user_id: userId,
        amount: withdrawalAmount,
        wallet_type: withdrawalData.walletType || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }) as any;

    if (withdrawalError) {
      console.error('Error creating withdrawal record:', withdrawalError);
      return {
        success: false,
        error: 'Failed to create withdrawal request'
      };
    }

    // Do not update balance here. Balance will be updated by admin approval flow.

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in submitWithdrawal:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Get latest withdrawal request for a user
 */
export async function getLatestWithdrawRequest(userId: string): Promise<WithdrawRequestRow | null> {
  try {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .select('id, user_id, amount, wallet_type, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest withdraw request:', error);
      return null;
    }

    if (!data) return null;
    return data as WithdrawRequestRow;
  } catch (error) {
    console.error('Error in getLatestWithdrawRequest:', error);
    return null;
  }
}

/**
 * Get tier configuration from database
 */
export async function getTierConfig(): Promise<Tier[] | null> {
  try {
    const { data, error } = await supabase
      .from('tiers')
      .select('*')
      .order('min_referrals', { ascending: true });

    if (error) {
      console.error('Error fetching tier config:', error);
      return null;
    }

    return data as Tier[];
  } catch (error) {
    console.error('Error in getTierConfig:', error);
    return null;
  }
}

/**
 * Get user balance
 */
export async function getUserBalance(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single() as any;

    if (error || !data) {
      console.error('Error fetching user balance:', error);
      return 0;
    }

    return parseInt(data.balance || '0');
  } catch (error) {
    console.error('Error in getUserBalance:', error);
    return 0;
  }
}

/**
 * Calculate tier progress
 */
export function calculateTierProgress(
  currentTier: 'Rookie' | 'Pro' | 'Legend',
  referralCount: number
): {
  Rookie: number;
  Pro: number;
  Legend: number;
} {
  const tierRequirements = {
    Rookie: 0,
    Pro: 10,
    Legend: 50
  };

  const progress = {
    Rookie: 100,
    Pro: 0,
    Legend: 0
  };

  // Calculate progress for each tier
  if (referralCount >= tierRequirements.Legend) {
    progress.Legend = 100;
    progress.Pro = 100;
    progress.Rookie = 100;
  } else if (referralCount >= tierRequirements.Pro) {
    progress.Pro = 100;
    progress.Rookie = 100;
    progress.Legend = Math.round((referralCount / tierRequirements.Legend) * 100);
  } else {
    progress.Rookie = 100;
    progress.Pro = Math.round((referralCount / tierRequirements.Pro) * 100);
    progress.Legend = Math.round((referralCount / tierRequirements.Legend) * 100);
  }

  return progress;
}
