export const DASHBOARD_VIEW_STORAGE_KEY = 'dashboardCurrentView'

export const VIEW_IDS = [
  'dashboard',
  'progress',
  'achievements',
  'notifications',
  'tutorial',
  'settings',
  'device-approve',
  'help-support',
] as const

export type ViewId = (typeof VIEW_IDS)[number]

const VALID_VIEWS = new Set<ViewId>(VIEW_IDS)
const LOCKED_VIEWS = new Set<ViewId>([])

export const START_JOURNEY_VIEW_ID: ViewId = 'dashboard'
export const NOTIFICATIONS_VIEW_ID: ViewId = 'notifications'

export function isDashboardViewId(value: string): value is ViewId {
  return VALID_VIEWS.has(value as ViewId)
}

export function canAccessDashboardView(viewId: ViewId, canAccessStartJourney: boolean) {
  if (LOCKED_VIEWS.has(viewId)) return false
  if (viewId === START_JOURNEY_VIEW_ID) return canAccessStartJourney
  return true
}

export function resolveDashboardView(
  viewId: string | null | undefined,
  canAccessStartJourney: boolean,
) {
  if (!viewId || !isDashboardViewId(viewId)) return null
  if (canAccessDashboardView(viewId, canAccessStartJourney)) return viewId
  if (viewId === START_JOURNEY_VIEW_ID) return NOTIFICATIONS_VIEW_ID
  return null
}

export function saveDashboardView(viewId: ViewId) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DASHBOARD_VIEW_STORAGE_KEY, viewId)
}
