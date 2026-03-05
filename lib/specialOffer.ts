import { supabase } from '@/lib/supabase'
import type { TierEnum } from '@/types/database'

const DEFAULT_SETTINGS_KEY = 'default'

export type SpecialOfferSource = 'db' | 'fallback'

export type ActiveSpecialOfferReferralCommission = {
  referralCommissionPct: number | null
  isEligible: boolean
  source: SpecialOfferSource
}

type SpecialOfferSettingsRow = {
  key: string
  referral_commission_pct: string
}

type SpecialOfferTierRow = {
  tier_name: TierEnum
}

const FALLBACK_RESULT: ActiveSpecialOfferReferralCommission = {
  referralCommissionPct: null,
  isEligible: true,
  source: 'fallback',
}

function parseReferralCommissionPct(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function checkTierEligibility(userTier: TierEnum, tierMappings: SpecialOfferTierRow[]): boolean {
  if (tierMappings.length === 0) {
    return true
  }
  return tierMappings.some((mapping) => mapping.tier_name === userTier)
}

export async function getActiveSpecialOfferReferralCommission(
  userTier: TierEnum,
): Promise<ActiveSpecialOfferReferralCommission> {
  try {
    const { data: settings, error: settingsError } = await supabase
      .from('special_offer_settings')
      .select('key, referral_commission_pct')
      .eq('key', DEFAULT_SETTINGS_KEY)
      .eq('is_active', true)
      .maybeSingle<SpecialOfferSettingsRow>()

    if (settingsError || !settings) {
      if (settingsError) {
        console.error('Failed to load active special offer settings:', settingsError)
      }
      return FALLBACK_RESULT
    }

    const { data: tierMappings, error: tiersError } = await supabase
      .from('special_offer_tiers')
      .select('tier_name')
      .eq('settings_key', settings.key)

    if (tiersError) {
      console.error('Failed to load special offer tiers:', tiersError)
      return FALLBACK_RESULT
    }

    const mappings = (tierMappings ?? []) as SpecialOfferTierRow[]
    const isEligible = checkTierEligibility(userTier, mappings)
    const referralCommissionPct = parseReferralCommissionPct(settings.referral_commission_pct)

    return {
      referralCommissionPct,
      isEligible,
      source: 'db',
    }
  } catch (error) {
    console.error('Unexpected special offer fetch error:', error)
    return FALLBACK_RESULT
  }
}
