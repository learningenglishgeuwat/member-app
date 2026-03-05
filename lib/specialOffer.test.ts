import { getActiveSpecialOfferReferralCommission } from './specialOffer'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

type QueryResponse<T> = {
  data: T
  error: { message: string } | null
}

type SettingsResponse = QueryResponse<{ key: string; referral_commission_pct: string } | null>
type TiersResponse = QueryResponse<Array<{ tier_name: 'Rookie' | 'Pro' | 'Legend' }>>

function mockSettingsQuery(response: SettingsResponse) {
  const maybeSingle = jest.fn().mockResolvedValue(response)
  const eqIsActive = jest.fn().mockReturnValue({ maybeSingle })
  const eqKey = jest.fn().mockReturnValue({ eq: eqIsActive })
  const select = jest.fn().mockReturnValue({ eq: eqKey })
  return { select }
}

function mockTiersQuery(response: TiersResponse) {
  const eqSettingsKey = jest.fn().mockResolvedValue(response)
  const select = jest.fn().mockReturnValue({ eq: eqSettingsKey })
  return { select }
}

describe('lib/specialOffer', () => {
  const fromMock = supabase.from as unknown as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns referral commission from DB when active row exists and tier eligible', async () => {
    const settingsQuery = mockSettingsQuery({
      data: { key: 'default', referral_commission_pct: '7.00' },
      error: null,
    })
    const tiersQuery = mockTiersQuery({
      data: [{ tier_name: 'Rookie' }],
      error: null,
    })

    fromMock.mockImplementation((tableName: string) => {
      if (tableName === 'special_offer_settings') return settingsQuery
      if (tableName === 'special_offer_tiers') return tiersQuery
      throw new Error(`Unexpected table ${tableName}`)
    })

    const result = await getActiveSpecialOfferReferralCommission('Rookie')

    expect(result).toEqual({
      referralCommissionPct: 7,
      isEligible: true,
      source: 'db',
    })
  })

  it('returns isEligible false when user tier is not in mapped tiers', async () => {
    const settingsQuery = mockSettingsQuery({
      data: { key: 'default', referral_commission_pct: '9.50' },
      error: null,
    })
    const tiersQuery = mockTiersQuery({
      data: [{ tier_name: 'Pro' }],
      error: null,
    })

    fromMock.mockImplementation((tableName: string) => {
      if (tableName === 'special_offer_settings') return settingsQuery
      if (tableName === 'special_offer_tiers') return tiersQuery
      throw new Error(`Unexpected table ${tableName}`)
    })

    const result = await getActiveSpecialOfferReferralCommission('Rookie')

    expect(result).toEqual({
      referralCommissionPct: 9.5,
      isEligible: false,
      source: 'db',
    })
  })

  it('treats empty tier mapping as globally eligible', async () => {
    const settingsQuery = mockSettingsQuery({
      data: { key: 'default', referral_commission_pct: '11.00' },
      error: null,
    })
    const tiersQuery = mockTiersQuery({
      data: [],
      error: null,
    })

    fromMock.mockImplementation((tableName: string) => {
      if (tableName === 'special_offer_settings') return settingsQuery
      if (tableName === 'special_offer_tiers') return tiersQuery
      throw new Error(`Unexpected table ${tableName}`)
    })

    const result = await getActiveSpecialOfferReferralCommission('Legend')

    expect(result).toEqual({
      referralCommissionPct: 11,
      isEligible: true,
      source: 'db',
    })
  })

  it('falls back safely when query fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const settingsQuery = mockSettingsQuery({
      data: null,
      error: { message: 'permission denied' },
    })

    fromMock.mockImplementation((tableName: string) => {
      if (tableName === 'special_offer_settings') return settingsQuery
      throw new Error(`Unexpected table ${tableName}`)
    })

    const result = await getActiveSpecialOfferReferralCommission('Pro')

    expect(result).toEqual({
      referralCommissionPct: null,
      isEligible: true,
      source: 'fallback',
    })
    expect(consoleSpy).toHaveBeenCalled()
  })
})
