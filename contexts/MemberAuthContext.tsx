'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDeviceId } from '@/lib/device'
import type { User } from '@/types/database'

interface AuthContextType {
  user: User | null
  hasSession: boolean
  loading: boolean
  authIssue: string | null
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
  const idleTimerRef = React.useRef<number | null>(null)
  const absoluteTimerRef = React.useRef<number | null>(null)
  const lastActivityRef = React.useRef<number>(Date.now())
  const idleTimeoutMs = 15 * 60 * 1000
  const absoluteTimeoutMs = 24 * 60 * 60 * 1000
  const cachedUserKey = 'auth_cached_user'
  const cachedUserAtKey = 'auth_cached_user_at'
  const cachedUserTtlMs = 2 * 60 * 1000

  const getCachedUser = () => {
    try {
      const raw = localStorage.getItem(cachedUserKey)
      if (!raw) return null
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  }

  const setCachedUser = (nextUser: User | null) => {
    if (!nextUser) {
      localStorage.removeItem(cachedUserKey)
      localStorage.removeItem(cachedUserAtKey)
      return
    }
    localStorage.setItem(cachedUserKey, JSON.stringify(nextUser))
    localStorage.setItem(cachedUserAtKey, String(Date.now()))
  }

  const isCachedUserFresh = () => {
    const raw = localStorage.getItem(cachedUserAtKey)
    if (!raw) return false
    const cachedAt = Number(raw)
    if (!Number.isFinite(cachedAt)) return false
    return Date.now() - cachedAt <= cachedUserTtlMs
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

  const startSessionTimers = () => {
    clearSessionTimers()
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
    localStorage.setItem('auth_last_activity', String(lastActivityRef.current))
    if (hasSession) {
      startSessionTimers()
    }
  }

  const fetchUserDataWithTimeout = async (userId: string) => {
    const userDataPromise = supabase
      .from('users')
      .select('id, email, fullname, whatsapp, tier, balance, referral_code, role, status, created_at, subscription_expires_at')
      .eq('id', userId)
      .single()

    const { data: userData } = await Promise.race([
      userDataPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('User data timeout')), 30000)),
    ]) as { data: User }

    return userData
  }

  // Check for existing session on mount
  useEffect(() => {
    const handleOnline = () => {
      setNotice(null)
      setAuthIssue(null)
    }
    const handleOffline = () => {
      const message = 'Koneksi terputus. Periksa jaringan lalu refresh halaman.'
      setNotice(message)
      setAuthIssue(message)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    const activityEvents: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((event) => window.addEventListener(event, bumpActivity, { passive: true }))

    const verifyDeviceAccess = async (sessionUserId: string) => {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      const allowedPaths = new Set([
        '/login',
        '/device-pairing',
        '/device-approve',
        '/forgot-password',
        '/reset-password',
      ])
      if (allowedPaths.has(currentPath)) return

      const deviceId = getDeviceId()
      if (!deviceId) {
        router.replace('/device-pairing')
        return
      }

      const { data, error } = await (supabase as any)
        .from('devices')
        .select('id, revoked')
        .eq('user_id', sessionUserId)
        .eq('device_id', deviceId)
        .maybeSingle()

      if (error) {
        console.warn('Device check error:', error.message)
        return
      }

      if (!data) {
        const { error: registerError } = await (supabase as any).rpc('register_device', {
          p_device_id: deviceId,
          p_label: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          p_user_agent: navigator.userAgent,
          p_ip: null,
        })

        if (registerError) {
          if (registerError.message?.includes('MAX_DEVICE_REACHED')) {
            // Guard against transient race: if this device is already linked, do not redirect.
            const { data: recheckDevice } = await (supabase as any)
              .from('devices')
              .select('id, revoked')
              .eq('user_id', sessionUserId)
              .eq('device_id', deviceId)
              .maybeSingle()

            if (!recheckDevice || recheckDevice.revoked) {
              router.replace('/device-pairing')
            }
          } else {
            console.warn('Device register error:', registerError.message)
          }
        }
        return
      }

      if (data?.revoked) {
        await supabase.auth.signOut()
        setUser(null)
        setHasSession(false)
        router.replace('/device-pairing')
      }
    }

    const getSession = async () => {
      try {
        // Check network connectivity
        if (typeof window !== 'undefined' && !navigator.onLine) {
          console.warn('No internet connection')
          const message = 'Koneksi terputus. Periksa jaringan lalu refresh halaman.'
          setNotice(message)
          setAuthIssue(message)
          setHasSession(false)
          setUser(null)
          setLoading(false)
          return
        }

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 30000)
        )
        
        const sessionPromise = supabase.auth.getSession()
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: { user: { id: string } } | null } }

        const sessionUser = session?.user || null
        setHasSession(!!sessionUser)
        setLoading(false)
        setAuthIssue(null)

        if (sessionUser) {
          const cachedUser = getCachedUser()
          if (cachedUser?.id === sessionUser.id) {
            setUser(cachedUser)
          }

          verifyDeviceAccess(sessionUser.id)
          // Fetch user data in the background to avoid blocking initial load
          if (!cachedUser || cachedUser.id !== sessionUser.id || !isCachedUserFresh()) {
            ;(async () => {
              try {
                const userData = await fetchUserDataWithTimeout(sessionUser.id)
                setUser(userData)
                setCachedUser(userData)
                setAuthIssue(null)
              } catch (error) {
                console.error('Error fetching user data on session check:', error)
                if (!cachedUser || cachedUser.id !== sessionUser.id) {
                  setUser(null)
                }
                setAuthIssue('Gagal memuat data akun. Coba refresh halaman.')
              }
            })()
          }

          const lastActivityStored = Number(localStorage.getItem('auth_last_activity')) || Date.now()
          lastActivityRef.current = lastActivityStored
          startSessionTimers()
        } else {
          setUser(null)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage === 'Auth timeout') {
          console.error('Authentication timed out. Check your network connection.')
          console.log('Tip: This can happen with slow connections. Try refreshing the page.')
          const message = 'Koneksi lambat atau terputus. Coba refresh halaman.'
          setNotice(message)
          setAuthIssue(message)
        } else if (errorMessage === 'User data timeout') {
          console.error('User data fetch timed out. Database may be slow.')
        } else {
          console.error('Authentication error:', error)
          setAuthIssue('Terjadi kendala koneksi. Coba refresh halaman.')
        }
        // Set loading to false even on error to prevent infinite loading
        setHasSession(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user || null
        setHasSession(!!sessionUser)
        setLoading(false)

        if (sessionUser) {
          const cachedUser = getCachedUser()
          if (cachedUser?.id === sessionUser.id) {
            setUser(cachedUser)
          }
          verifyDeviceAccess(sessionUser.id)
          try {
            // Fetch user data from our users table - only select needed fields
            if (!cachedUser || cachedUser.id !== sessionUser.id || !isCachedUserFresh()) {
              const userData = await fetchUserDataWithTimeout(sessionUser.id)
              
              setUser(userData)
              setCachedUser(userData)
              setAuthIssue(null)
            }
          } catch (error) {
            console.error('❌ Error fetching user data on auth change:', error)
            if (!cachedUser || cachedUser.id !== sessionUser.id) {
              setUser(null)
            }
            setAuthIssue('Gagal memuat data akun. Coba refresh halaman.')
          }
          const lastActivityStored = Number(localStorage.getItem('auth_last_activity')) || Date.now()
          lastActivityRef.current = lastActivityStored
          startSessionTimers()
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      activityEvents.forEach((event) => window.removeEventListener(event, bumpActivity))
      clearSessionTimers()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        // Create user record in our users table
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
          } as any)

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
        // User data will be fetched by the auth state change listener
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
      // Optimistic update so UI responds immediately
      setUser(null)
      setHasSession(false)
      clearSessionTimers()
      localStorage.removeItem('auth_session_start')
      localStorage.removeItem('auth_last_activity')
      localStorage.removeItem(cachedUserKey)
      localStorage.removeItem(cachedUserAtKey)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    hasSession,
    loading,
    authIssue,
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
