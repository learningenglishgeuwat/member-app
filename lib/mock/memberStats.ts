import type { Tier } from '@/types/database'

const MOCK_TIER_CONFIG: Tier[] = [
  {
    id: 'tier-rookie',
    tier_name: 'Rookie',
    referral_bonus_percentage: '7',
    cashback_percentage: '0',
    min_referrals: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tier-pro',
    tier_name: 'Pro',
    referral_bonus_percentage: '10',
    cashback_percentage: '2',
    min_referrals: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tier-legend',
    tier_name: 'Legend',
    referral_bonus_percentage: '15',
    cashback_percentage: '5',
    min_referrals: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Match the interface surface used by member-app so AchievementsContent can be reused as-is.
export interface ReferralStats {
  totalReferrals: number
  totalEarnings: number
}

export interface WithdrawalRequest {
  amount: number
  walletType?: 'gopay' | 'dana'
  whatsappNumber: string
  email: string
}

export interface WithdrawalResult {
  success: boolean
  error?: string
}

export interface WithdrawRequestRow {
  id: string
  user_id: string
  amount: number
  wallet_type?: 'gopay' | 'dana' | null
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  created_at: string
}

const WITHDRAW_KEY = 'partner_mitra_withdraw_requests_v1'

type StoredWithdraw = WithdrawRequestRow & { created_at_ms: number }

function readWithdraws(): StoredWithdraw[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(WITHDRAW_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as StoredWithdraw[]
  } catch {
    return []
  }
}

function writeWithdraws(rows: StoredWithdraw[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(WITHDRAW_KEY, JSON.stringify(rows))
  } catch {
    // ignore
  }
}

export const getCachedTierConfigSnapshot = (): Tier[] | null => {
  return MOCK_TIER_CONFIG
}

export async function getTierConfig(_options?: { forceRefresh?: boolean }): Promise<Tier[] | null> {
  return MOCK_TIER_CONFIG
}

export async function getReferralStats(_userId: string): Promise<ReferralStats> {
  // Keep this predictable for mockups; you can wire it to real tables later.
  return { totalReferrals: 0, totalEarnings: 0 }
}

export async function submitWithdrawal(
  userId: string,
  withdrawalData: WithdrawalRequest,
): Promise<WithdrawalResult> {
  const amount = Number(withdrawalData.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Invalid amount' }
  }

  const now = Date.now()
  const row: StoredWithdraw = {
    id: `w-${now}`,
    user_id: userId,
    amount,
    wallet_type: withdrawalData.walletType ?? null,
    status: 'pending',
    created_at: new Date(now).toISOString(),
    created_at_ms: now,
  }

  const next = readWithdraws()
  next.push(row)
  writeWithdraws(next)
  return { success: true }
}

export async function getLatestWithdrawRequest(userId: string): Promise<WithdrawRequestRow | null> {
  const rows = readWithdraws()
    .filter((r) => r.user_id === userId)
    .slice()
    .sort((a, b) => b.created_at_ms - a.created_at_ms)

  const latest = rows[0] ?? null
  if (!latest) return null

  const { created_at_ms: _ignore, ...rest } = latest
  return rest
}
