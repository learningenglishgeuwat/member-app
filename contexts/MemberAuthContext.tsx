'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDeviceId } from '@/lib/device'
import type { User } from '@/types/database'

type SessionHealth = 'healthy' | 'degraded'
type SessionLossSource = 'initial-session' | 'auth-change' | 'session-recheck'

interface AuthContextType {
  user: User | null
  hasSession: boolean
  loading: boolean
  authIssue: string | null
  sessionHealth: SessionHealth
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_GRACE_MS = 3 * 60 * 60 * 1000
const SESSION_RECHECK_MS = 15_000
const ACTIVITY_PERSIST_INTERVAL_MS = 15_000
const OFFLINE_DEBOUNCE_MS = 3000
const CACHED_USER_TTL_MS = 30 * 60 * 1000
const AUTH_GRACE_UNTIL_KEY = 'auth_grace_until'
const AUTH_GRACE_REASON_KEY = 'auth_grace_reason'
const CACHED_USER_KEY = 'auth_cached_user'
const CACHED_USER_AT_KEY = 'auth_cached_user_at'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [hasSession, setHasSession] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [authIssue, setAuthIssue] = useState<string | null>(null)
  const [sessionHealth, setSessionHealth] = useState<SessionHealth>('healthy')

  const userRef = React.useRef<User | null>(null)
  const hasSessionRef = React.useRef(false)
  const idleTimerRef = React.useRef<number | null>(null)
  const absoluteTimerRef = React.useRef<number | null>(null)
  const offlineDebounceRef = React.useRef<number | null>(null)
  const graceTimerRef = React.useRef<number | null>(null)
  const recheckTimerRef = React.useRef<number | null>(null)
  const userFetchRef = React.useRef<{ userId: string; promise: Promise<User | null> } | null>(null)
  const deviceCheckInFlightRef = React.useRef<Promise<void> | null>(null)
  const lastVerifiedSessionUserIdRef = React.useRef<string | null>(null)
  const lastActivityRef = React.useRef<number>(Date.now())
  const lastActivityPersistedAtRef = React.useRef<number>(0)
  const sessionHealthRef = React.useRef<SessionHealth>('healthy')
  const graceUntilRef = React.useRef<number | null>(null)
  const manualSignOutRef = React.useRef(false)
  const isDev = process.env.NODE_ENV === 'development'

  // Auto sign-out timer dimatikan agar sesi belajar tidak terputus.
  const autoSessionTimeoutEnabled = false
  const idleTimeoutMs = 15 * 60 * 1000
  const absoluteTimeoutMs = 24 * 60 * 60 * 1000

  const logAuthDebug = (...args: unknown[]) => {
    if (!isDev) return
    console.info('[AuthProvider]', ...args)
  }

  const isAbortLikeError = (error: unknown) => {
    if (!error) return false
    if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
      return error.name === 'AbortError'
    }
    if (error instanceof Error) {
      const name = error.name.toLowerCase()
      const message = error.message.toLowerCase()
      return (
        name.includes('abort') ||
        message.includes('signal is aborted') ||
        message.includes('aborted without reason')
      )
    }
    return false
  }

  const setSessionHealthSafe = (next: SessionHealth) => {
    sessionHealthRef.current = next
    setSessionHealth(next)
  }

  const setUserSafe = (nextUser: User | null) => {
    userRef.current = nextUser
    setUser(nextUser)
  }

  const setHasSessionSafe = (nextHasSession: boolean) => {
    hasSessionRef.current = nextHasSession
    setHasSession(nextHasSession)
  }

  const getCachedUser = (): User | null => {
    try {
      const raw = localStorage.getItem(CACHED_USER_KEY)
      if (!raw) return null
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  }

  const setCachedUser = (nextUser: User | null) => {
    if (!nextUser) {
      localStorage.removeItem(CACHED_USER_KEY)
      localStorage.removeItem(CACHED_USER_AT_KEY)
      return
    }
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(nextUser))
    localStorage.setItem(CACHED_USER_AT_KEY, String(Date.now()))
  }

  const isCachedUserFresh = () => {
    const raw = localStorage.getItem(CACHED_USER_AT_KEY)
    if (!raw) return false
    const cachedAt = Number(raw)
    if (!Number.isFinite(cachedAt)) return false
    return Date.now() - cachedAt <= CACHED_USER_TTL_MS
  }

  const handleMissingUserData = (
    sessionUserId: string,
    cachedUser: User | null,
    source: 'session-check' | 'auth-change',
  ) => {
    const hasMatchingCache = cachedUser?.id === sessionUserId
    logAuthDebug(`${source}:missing-user-data`, {
      sessionUserId,
      hasMatchingCache,
      currentUserId: userRef.current?.id ?? null,
    })

    // Keep a safe user snapshot when cache still belongs to active session.
    if (hasMatchingCache && cachedUser) {
      setUserSafe(cachedUser)
      setAuthIssue(null)
    } else {
      // Prevent stale cross-account state if session changed but profile row not ready yet.
      setUserSafe(null)
      setAuthIssue('Data akun belum siap. Coba refresh halaman.')
    }

    setSessionHealthSafe('degraded')
  }

  const clearSessionTimers = () => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
    if (absoluteTimerRef.current) {
      window.clearTimeout(absoluteTimerRef.current)
      absoluteTimerRef.current = null
    }
  }

  const clearOfflineDebounce = () => {
    if (offlineDebounceRef.current) {
      window.clearTimeout(offlineDebounceRef.current)
      offlineDebounceRef.current = null
    }
  }

  const clearGraceTimers = () => {
    if (graceTimerRef.current) {
      window.clearTimeout(graceTimerRef.current)
      graceTimerRef.current = null
    }
    if (recheckTimerRef.current) {
      window.clearInterval(recheckTimerRef.current)
      recheckTimerRef.current = null
    }
  }

  const clearGraceState = () => {
    graceUntilRef.current = null
    localStorage.removeItem(AUTH_GRACE_UNTIL_KEY)
    localStorage.removeItem(AUTH_GRACE_REASON_KEY)
  }

  const persistActivityIfDue = (force = false) => {
    const now = Date.now()
    if (!force && now - lastActivityPersistedAtRef.current < ACTIVITY_PERSIST_INTERVAL_MS) {
      return
    }
    localStorage.setItem('auth_last_activity', String(lastActivityRef.current))
    lastActivityPersistedAtRef.current = now
  }

  const startSessionTimers = () => {
    clearSessionTimers()
    if (!autoSessionTimeoutEnabled) return

    const now = Date.now()
    const sessionStart = Number(localStorage.getItem('auth_session_start')) || now
    localStorage.setItem('auth_session_start', String(sessionStart))
    localStorage.setItem('auth_last_activity', String(lastActivityRef.current))

    idleTimerRef.current = window.setTimeout(async () => {
      setNotice('Sesi berakhir karena tidak ada aktivitas (15 menit).')
      await signOut()
      router.replace('/login')
    }, idleTimeoutMs)

    const absoluteRemaining = sessionStart + absoluteTimeoutMs - now
    absoluteTimerRef.current = window.setTimeout(async () => {
      setNotice('Sesi berakhir (24 jam). Silakan login ulang.')
      await signOut()
      router.replace('/login')
    }, Math.max(absoluteRemaining, 1000))
  }

  const bumpActivity = () => {
    lastActivityRef.current = Date.now()
    persistActivityIfDue(false)
    if (autoSessionTimeoutEnabled && hasSessionRef.current) startSessionTimers()
  }

  const fetchUserData = async (userId: string): Promise<User | null> => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, fullname, whatsapp, tier, balance, referral_code, role, status, created_at, subscription_expires_at')
      .eq('id', userId)
      .single()
    if (error || !userData) return null
    return userData as User
  }

  const fetchUserDataDedup = async (userId: string) => {
    const inFlight = userFetchRef.current
    if (inFlight && inFlight.userId === userId) return inFlight.promise

    const promise = fetchUserData(userId)
      .then((data) => data ?? null)
      .finally(() => {
        if (userFetchRef.current?.userId === userId) {
          userFetchRef.current = null
        }
      })

    userFetchRef.current = { userId, promise }
    return promise
  }

  const restoreGraceStateFromStorage = () => {
    const rawGraceUntil = localStorage.getItem(AUTH_GRACE_UNTIL_KEY)
    if (!rawGraceUntil) return null
    const graceUntil = Number(rawGraceUntil)
    if (!Number.isFinite(graceUntil) || graceUntil <= Date.now()) {
      localStorage.removeItem(AUTH_GRACE_UNTIL_KEY)
      localStorage.removeItem(AUTH_GRACE_REASON_KEY)
      return null
    }
    graceUntilRef.current = graceUntil
    return graceUntil
  }

  const finalizeLogout = (reason: string) => {
    logAuthDebug('session:final-logout', { reason })
    clearGraceTimers()
    clearGraceState()
    setHasSessionSafe(false)
    setUserSafe(null)
    setSessionHealthSafe('healthy')
    setNotice(null)
    setAuthIssue(null)
    lastVerifiedSessionUserIdRef.current = null
    localStorage.removeItem('auth_session_start')
    localStorage.removeItem('auth_last_activity')
    setCachedUser(null)
  }

  const handleSessionRecovered = (sessionUser: { id: string }) => {
    clearGraceTimers()
    clearGraceState()
    setHasSessionSafe(true)
    setSessionHealthSafe('healthy')
    setNotice(null)
    setAuthIssue(null)
    logAuthDebug('grace:recovered', { userId: sessionUser.id })
  }

  const runGraceRecheck = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession() as {
        data: { session: { user: { id: string } } | null }
      }
      const sessionUser = session?.user || null
      const now = Date.now()
      const graceUntil = graceUntilRef.current
      logAuthDebug('grace:recheck', {
        hasSessionUser: !!sessionUser,
        graceUntil,
        remainingMs: graceUntil ? Math.max(0, graceUntil - now) : null,
      })

      if (sessionUser) {
        handleSessionRecovered(sessionUser)
        return
      }

      if (graceUntil && now >= graceUntil) {
        logAuthDebug('grace:expired')
        finalizeLogout('grace-expired')
      }
    } catch (error) {
      if (isAbortLikeError(error)) {
        logAuthDebug('grace:recheck-aborted')
        return
      }
      const message = error instanceof Error ? error.message : 'unknown'
      logAuthDebug('grace:recheck-failed', { message })
    }
  }

  const startGraceWindow = (reason: string) => {
    const now = Date.now()
    const existingGraceUntil = graceUntilRef.current
    const graceUntil = existingGraceUntil && existingGraceUntil > now
      ? existingGraceUntil
      : now + SESSION_GRACE_MS
    graceUntilRef.current = graceUntil
    localStorage.setItem(AUTH_GRACE_UNTIL_KEY, String(graceUntil))
    localStorage.setItem(AUTH_GRACE_REASON_KEY, reason)

    clearGraceTimers()
    graceTimerRef.current = window.setTimeout(() => {
      logAuthDebug('grace:expired-timeout')
      void runGraceRecheck()
    }, Math.max(1000, graceUntil - now))
    recheckTimerRef.current = window.setInterval(() => {
      void runGraceRecheck()
    }, SESSION_RECHECK_MS)
  }

  const handleSessionLoss = (params: {
    source: SessionLossSource
    reason: string
    sessionUser: { id: string } | null
  }) => {
    const { source, reason } = params
    if (manualSignOutRef.current) {
      finalizeLogout(`manual-signout:${source}`)
      return false
    }

    const cachedUser = getCachedUser()
    const currentUser = userRef.current
    const holdUser = cachedUser ?? currentUser
    const isGraceActive = !!graceUntilRef.current && graceUntilRef.current > Date.now()
    const canHold = !!holdUser || isGraceActive
    if (!canHold) {
      finalizeLogout(`no-cached-user:${source}:${reason}`)
      return false
    }

    if (holdUser) {
      setUserSafe(holdUser)
      setHasSessionSafe(true)
    }
    setAuthIssue(null)
    setSessionHealthSafe('degraded')
    setNotice('Koneksi tidak stabil. Sesi belajar dipertahankan sementara.')
    startGraceWindow(`${source}:${reason}`)
    logAuthDebug('grace:start', {
      source,
      reason,
      hasCachedUser: !!cachedUser,
      graceUntil: graceUntilRef.current,
    })
    return true
  }

  // This effect intentionally runs once to wire auth listeners and timers.
  useEffect(() => {
    const handleOnline = () => {
      clearOfflineDebounce()
      if (graceUntilRef.current) {
        setNotice('Koneksi kembali normal. Sinkronisasi sesi...')
      } else {
        setNotice(null)
      }
      setAuthIssue(null)
      logAuthDebug('network:online')
      void runGraceRecheck()
    }

    const handleOffline = () => {
      clearOfflineDebounce()
      offlineDebounceRef.current = window.setTimeout(() => {
        setSessionHealthSafe('degraded')
        setNotice('Koneksi tidak stabil. Mode belajar tetap berjalan.')
        logAuthDebug('network:offline-debounced')
      }, OFFLINE_DEBOUNCE_MS)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    const activityEvents: Array<keyof WindowEventMap> = ['mousedown', 'keydown', 'touchstart']
    activityEvents.forEach((event) => window.addEventListener(event, bumpActivity, { passive: true }))

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistActivityIfDue(true)
        return
      }
      lastActivityRef.current = Date.now()
      persistActivityIfDue(false)
      if (autoSessionTimeoutEnabled && hasSessionRef.current) {
        startSessionTimers()
      }
    }

    const handleLifecycleFlush = () => {
      persistActivityIfDue(true)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handleLifecycleFlush, { passive: true })
    window.addEventListener('beforeunload', handleLifecycleFlush)

    const verifyDeviceAccess = async (sessionUserId: string, reason: 'initial' | 'auth-change') => {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      // Only enforce automatic device check on dashboard load/refresh.
      if (currentPath !== '/dashboard') {
        logAuthDebug('verifyDeviceAccess:skip-non-dashboard', { reason, currentPath })
        return
      }

      if (lastVerifiedSessionUserIdRef.current === sessionUserId) {
        logAuthDebug('verifyDeviceAccess:skip-already-verified', { reason, sessionUserId })
        return
      }

      if (deviceCheckInFlightRef.current) {
        logAuthDebug('verifyDeviceAccess:skip-in-flight', { reason, sessionUserId })
        return deviceCheckInFlightRef.current
      }

      const runCheck = async () => {
        logAuthDebug('verifyDeviceAccess:start', { reason, sessionUserId })
        const deviceId = getDeviceId()
        if (!deviceId) {
          logAuthDebug('verifyDeviceAccess:no-device-id -> pairing redirect')
          router.replace('/device-pairing')
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('devices')
          .select('id, revoked')
          .eq('user_id', sessionUserId)
          .eq('device_id', deviceId)
          .maybeSingle()

        if (error) {
          console.warn('Device check error:', error.message)
          logAuthDebug('verifyDeviceAccess:error', { message: error.message })
          return
        }

        if (!data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: registerError } = await (supabase as any).rpc('register_device', {
            p_device_id: deviceId,
            p_label: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            p_user_agent: navigator.userAgent,
            p_ip: null,
          })

          if (registerError) {
            if (registerError.message?.includes('MAX_DEVICE_REACHED')) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { data: recheckDevice } = await (supabase as any)
                .from('devices')
                .select('id, revoked')
                .eq('user_id', sessionUserId)
                .eq('device_id', deviceId)
                .maybeSingle()

              if (!recheckDevice || recheckDevice.revoked) {
                logAuthDebug('verifyDeviceAccess:final-redirect-pairing', { reason, sessionUserId })
                router.replace('/device-pairing')
                return
              }

              lastVerifiedSessionUserIdRef.current = sessionUserId
              logAuthDebug('verifyDeviceAccess:recheck-success', { reason, sessionUserId })
              return
            }

            console.warn('Device register error:', registerError.message)
            logAuthDebug('verifyDeviceAccess:register-error-no-redirect', {
              reason,
              message: registerError.message,
            })
            return
          }

          lastVerifiedSessionUserIdRef.current = sessionUserId
          logAuthDebug('verifyDeviceAccess:register-success', { reason, sessionUserId })
          return
        }

        if (data?.revoked) {
          await supabase.auth.signOut()
          lastVerifiedSessionUserIdRef.current = null
          logAuthDebug('verifyDeviceAccess:revoked -> pairing redirect')
          router.replace('/device-pairing')
          return
        }

        lastVerifiedSessionUserIdRef.current = sessionUserId
        logAuthDebug('verifyDeviceAccess:success', { reason, sessionUserId })
      }

      const checkPromise = runCheck().finally(() => {
        deviceCheckInFlightRef.current = null
      })
      deviceCheckInFlightRef.current = checkPromise
      return checkPromise
    }

    const applyGraceStateIfExists = () => {
      const restoredUntil = restoreGraceStateFromStorage()
      if (!restoredUntil) return
      const cachedUser = getCachedUser()
      if (!cachedUser) {
        clearGraceState()
        return
      }
      setUserSafe(cachedUser)
      setHasSessionSafe(true)
      setSessionHealthSafe('degraded')
      setNotice('Koneksi tidak stabil. Sesi belajar dipertahankan sementara.')
      clearGraceTimers()
      const remaining = Math.max(1000, restoredUntil - Date.now())
      graceTimerRef.current = window.setTimeout(() => {
        void runGraceRecheck()
      }, remaining)
      recheckTimerRef.current = window.setInterval(() => {
        void runGraceRecheck()
      }, SESSION_RECHECK_MS)
      logAuthDebug('grace:restored', { restoredUntil })
    }

    const getSession = async () => {
      try {
        applyGraceStateIfExists()

        if (typeof window !== 'undefined' && !navigator.onLine) {
          setSessionHealthSafe('degraded')
          setNotice('Koneksi tidak stabil. Mode belajar tetap berjalan.')
          logAuthDebug('getSession:offline-start')
        }

        const { data: { session } } = await supabase.auth.getSession() as {
          data: { session: { user: { id: string } } | null }
        }
        const sessionUser = session?.user || null

        if (!sessionUser) {
          handleSessionLoss({
            source: 'initial-session',
            reason: 'session-null',
            sessionUser,
          })
          return
        }

        handleSessionRecovered(sessionUser)
        setHasSessionSafe(true)
        if (typeof window === 'undefined' || navigator.onLine) {
          setSessionHealthSafe('healthy')
        }

        const cachedUser = getCachedUser()
        if (cachedUser?.id === sessionUser.id) {
          setUserSafe(cachedUser)
        }

        void verifyDeviceAccess(sessionUser.id, 'initial')
        if (!cachedUser || cachedUser.id !== sessionUser.id || !isCachedUserFresh()) {
          ;(async () => {
            try {
              const userData = await fetchUserDataDedup(sessionUser.id)
              if (!userData) {
                handleMissingUserData(sessionUser.id, cachedUser, 'session-check')
                return
              }
              setUserSafe(userData)
              setCachedUser(userData)
              setAuthIssue(null)
            } catch (error) {
              console.error('Error fetching user data on session check:', error)
              if (!cachedUser || cachedUser.id !== sessionUser.id) {
                setUserSafe(null)
              }
              setAuthIssue('Gagal memuat data akun. Coba refresh halaman.')
              setSessionHealthSafe('degraded')
            }
          })()
        }

        const lastActivityStored = Number(localStorage.getItem('auth_last_activity')) || Date.now()
        lastActivityRef.current = lastActivityStored
        startSessionTimers()
      } catch (error) {
        if (isAbortLikeError(error)) {
          logAuthDebug('getSession:aborted')
          return
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage) {
          console.error('Authentication error:', error)
          logAuthDebug('getSession:error', { errorMessage })
        }
        const held = handleSessionLoss({
          source: 'initial-session',
          reason: 'exception',
          sessionUser: null,
        })
        if (!held) {
          setAuthIssue('Terjadi kendala koneksi. Coba refresh halaman.')
        }
      } finally {
        setLoading(false)
      }
    }

    void getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sessionUser = session?.user || null
      logAuthDebug('auth:event', event, { hasSession: !!sessionUser })
      setLoading(false)

      if (event === 'TOKEN_REFRESHED') {
        logAuthDebug('auth:token-refreshed -> skip heavy checks')
        return
      }

      if (event === 'SIGNED_OUT' || !sessionUser) {
        handleSessionLoss({
          source: 'auth-change',
          reason: `event:${event}`,
          sessionUser: null,
        })
        return
      }

      handleSessionRecovered(sessionUser)
      setHasSessionSafe(true)
      const cachedUser = getCachedUser()
      if (cachedUser?.id === sessionUser.id) {
        setUserSafe(cachedUser)
      }

      // Device access check intentionally runs only on initial page load/refresh.
      // It is skipped on auth change events to avoid reset-like behavior while learning.

      try {
        if (!cachedUser || cachedUser.id !== sessionUser.id || !isCachedUserFresh()) {
          const userData = await fetchUserDataDedup(sessionUser.id)
          if (!userData) {
            handleMissingUserData(sessionUser.id, cachedUser, 'auth-change')
            return
          }
          setUserSafe(userData)
          setCachedUser(userData)
          setAuthIssue(null)
          if (typeof window === 'undefined' || navigator.onLine) {
            setSessionHealthSafe('healthy')
          }
        }
      } catch (error) {
        console.error('Error fetching user data on auth change:', error)
        if (!cachedUser || cachedUser.id !== sessionUser.id) {
          setUserSafe(null)
        }
        setAuthIssue('Gagal memuat data akun. Coba refresh halaman.')
        setSessionHealthSafe('degraded')
      }

      const lastActivityStored = Number(localStorage.getItem('auth_last_activity')) || Date.now()
      lastActivityRef.current = lastActivityStored
      startSessionTimers()
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      activityEvents.forEach((event) => window.removeEventListener(event, bumpActivity))
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handleLifecycleFlush)
      window.removeEventListener('beforeunload', handleLifecycleFlush)
      clearSessionTimers()
      clearOfflineDebounce()
      clearGraceTimers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            email: userData.email || email,
            fullname: userData.fullname || '',
            whatsapp: userData.whatsapp || null,
            role: 'member',
            status: 'unpaid',
            tier: 'Rookie',
            tier_period: null,
            membership_start: null,
            subscription_expires_at: null,
            referred_by: userData.referred_by || null,
            balance: '0',
            referral_period: new Date().toISOString().slice(0, 7),
            monthly_referral_count: 0,
          } as never)

        if (userError) {
          console.error('Error creating user record:', userError)
          return { success: false, error: 'Failed to create user record' }
        }

        return { success: true }
      }

      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        manualSignOutRef.current = false
        const now = Date.now()
        localStorage.setItem('auth_session_start', String(now))
        localStorage.setItem('auth_last_activity', String(now))
        lastActivityRef.current = now
        startSessionTimers()
        return { success: true }
      }

      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      manualSignOutRef.current = true
      logAuthDebug('session:manual-signout')
      clearSessionTimers()
      clearOfflineDebounce()
      clearGraceTimers()
      clearGraceState()
      setUserSafe(null)
      setHasSessionSafe(false)
      setSessionHealthSafe('healthy')
      setNotice(null)
      setAuthIssue(null)
      localStorage.removeItem('auth_session_start')
      localStorage.removeItem('auth_last_activity')
      localStorage.removeItem(CACHED_USER_KEY)
      localStorage.removeItem(CACHED_USER_AT_KEY)
      await supabase.auth.signOut()
      manualSignOutRef.current = false
    } catch (error) {
      console.error('Sign out error:', error)
      manualSignOutRef.current = false
    }
  }

  const value = {
    user,
    hasSession,
    loading,
    authIssue,
    sessionHealth,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {notice && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-amber-500/90 text-black text-sm px-4 py-2 text-center">
          {notice}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}
