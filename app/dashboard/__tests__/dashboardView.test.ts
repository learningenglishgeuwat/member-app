import {
  DASHBOARD_VIEW_STORAGE_KEY,
  NOTIFICATIONS_VIEW_ID,
  START_JOURNEY_VIEW_ID,
  resolveDashboardView,
  saveDashboardView,
} from '../dashboardView'

describe('dashboard view helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('saves notifications as the dashboard target view', () => {
    saveDashboardView(NOTIFICATIONS_VIEW_ID)

    expect(window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY)).toBe(NOTIFICATIONS_VIEW_ID)
  })

  it('restores notifications for active users', () => {
    expect(resolveDashboardView(NOTIFICATIONS_VIEW_ID, true)).toBe(NOTIFICATIONS_VIEW_ID)
  })

  it('restores Start Journey for active users', () => {
    expect(resolveDashboardView(START_JOURNEY_VIEW_ID, true)).toBe(START_JOURNEY_VIEW_ID)
  })

  it('falls back to notifications when non-active users restore Start Journey', () => {
    expect(resolveDashboardView(START_JOURNEY_VIEW_ID, false)).toBe(NOTIFICATIONS_VIEW_ID)
  })

  it('does not restore locked or unknown views', () => {
    expect(resolveDashboardView('achievements', true)).toBeNull()
    expect(resolveDashboardView('not-a-view', true)).toBeNull()
  })
})
