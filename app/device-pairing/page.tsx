'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDeviceId } from '@/lib/device'
import { useAuth } from '@/contexts/MemberAuthContext'

type PairingStatus = 'pending' | 'approved' | 'rejected' | 'expired'
const PAIRING_POLL_INTERVAL_MS = 3000

const isTerminalStatus = (value: PairingStatus) =>
  value === 'approved' || value === 'rejected' || value === 'expired'

export default function DevicePairingPage() {
  const router = useRouter()
  const { hasSession, loading } = useAuth()
  const [code, setCode] = useState<string | null>(null)
  const [status, setStatus] = useState<PairingStatus>('pending')
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)
  const pollTimeoutRef = useRef<number | null>(null)
  const isPageVisibleRef = useRef(true)
  const isPollingRequestInFlightRef = useRef(false)
  const latestStatusRef = useRef<PairingStatus>('pending')

  const formattedCode = useMemo(() => {
    if (!code) return ''
    return code.slice(0, 3) + '-' + code.slice(3)
  }, [code])

  useEffect(() => {
    if (loading) return
    if (!hasSession) {
      router.replace('/login')
      return
    }

    const run = async () => {
      if (hasInitialized.current) return
      hasInitialized.current = true
      const deviceId = getDeviceId()
      if (!deviceId) {
        setError('Device ID tidak ditemukan.')
        return
      }
      const {
        data: { user: sessionUser },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !sessionUser?.id) {
        setError('Sesi tidak valid. Silakan login ulang.')
        router.replace('/login')
        return
      }

      const { data: existingDevice } = await supabase
        .from('devices')
        .select('id, revoked')
        .eq('user_id', sessionUser.id)
        .eq('device_id', deviceId)
        .eq('revoked', false)
        .maybeSingle()

      if (existingDevice) {
        router.replace('/dashboard')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingPairing } = await (supabase as any)
        .from('device_pairing')
        .select('code, status, expires_at')
        .eq('device_id', deviceId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingPairing?.code) {
        setCode(existingPairing.code)
        setStatus(existingPairing.status as PairingStatus)
        setExpiresAt(existingPairing.expires_at)
        return
      }

      const deviceLabel = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: rpcError } = await (supabase as any).rpc('create_pairing_code', {
        p_device_id: deviceId,
        p_label: deviceLabel,
        p_user_agent: navigator.userAgent,
      })

      if (rpcError) {
        setError(rpcError.message)
        return
      }

      setCode(data)
    }

    run()
  }, [hasSession, loading, router])

  useEffect(() => {
    latestStatusRef.current = status
  }, [status])

  useEffect(() => {
    if (!code) return

    let isDisposed = false

    const clearPollTimeout = () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current)
        pollTimeoutRef.current = null
      }
    }

    const scheduleNextPoll = () => {
      if (isDisposed || isTerminalStatus(latestStatusRef.current)) {
        clearPollTimeout()
        return
      }
      clearPollTimeout()
      pollTimeoutRef.current = window.setTimeout(() => {
        void pollPairingStatus(false)
      }, PAIRING_POLL_INTERVAL_MS)
    }

    const pollPairingStatus = async (force = false) => {
      if (isDisposed || isTerminalStatus(latestStatusRef.current)) {
        clearPollTimeout()
        return
      }

      if (!force && !isPageVisibleRef.current) {
        clearPollTimeout()
        return
      }

      if (isPollingRequestInFlightRef.current) {
        scheduleNextPoll()
        return
      }

      isPollingRequestInFlightRef.current = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError } = await (supabase as any)
        .from('device_pairing')
        .select('status, expires_at')
        .eq('code', code)
        .single()

      try {
        if (fetchError || !data || isDisposed) return

        const nextStatus = data.status as PairingStatus
        latestStatusRef.current = nextStatus
        setStatus(nextStatus)
        setExpiresAt(data.expires_at)

        if (isTerminalStatus(nextStatus)) {
          clearPollTimeout()
          return
        }
      } finally {
        isPollingRequestInFlightRef.current = false
        if (!isDisposed && isPageVisibleRef.current) {
          scheduleNextPoll()
        }
      }
    }

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible'

      if (!isPageVisibleRef.current) {
        clearPollTimeout()
        return
      }

      clearPollTimeout()
      void pollPairingStatus(true)
    }

    isPageVisibleRef.current = document.visibilityState === 'visible'
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (isPageVisibleRef.current && !isTerminalStatus(latestStatusRef.current)) {
      void pollPairingStatus(true)
    }

    return () => {
      isDisposed = true
      clearPollTimeout()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [code])

  useEffect(() => {
    if (status === 'approved') {
      router.replace('/dashboard')
      return
    }
  }, [status, router])

  const isExpired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Izin Device Baru</h1>
        <p className="mt-2 text-slate-400">
          Akun hanya boleh dipakai di 1 device. Masukkan kode ini di device yang sudah terdaftar.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-700 bg-black/30 p-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Kode Pairing</div>
          <div className="mt-3 text-4xl font-mono font-bold text-emerald-400">
            {formattedCode || '•••-•••'}
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Status: <span className="text-slate-200">{isExpired ? 'expired' : status}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Kode berlaku 10 menit. Jika kadaluarsa, login ulang untuk membuat kode baru.
        </div>
      </div>
    </div>
  )
}
