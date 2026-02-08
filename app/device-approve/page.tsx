'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/MemberAuthContext'

export default function DeviceApprovePage() {
  const router = useRouter()
  const { hasSession, loading } = useAuth()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !hasSession) {
      router.replace('/login')
    }
  }, [loading, hasSession, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    const cleaned = code.replace(/[^0-9]/g, '')
    const { error: rpcError } = await (supabase as any).rpc('approve_pairing', {
      p_code: cleaned,
    })

    if (rpcError) {
      setStatus('error')
      setError(rpcError.message)
      return
    }

    setStatus('success')
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-slate-900/40 border border-slate-800 rounded-2xl p-8 relative">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
          aria-label="Kembali ke Dashboard"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold">Setujui Device Baru</h1>
        <p className="mt-2 text-slate-400">
          Masukkan kode pairing yang muncul di device baru.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123-456"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={status === 'loading' || code.trim().length === 0}
            className="w-full rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Memproses...' : 'Approve'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-emerald-200">
              Device baru berhasil disetujui.
            </div>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 hover:border-emerald-400 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-200">
            {error || 'Gagal approve kode.'}
          </div>
        )}

        <div className="mt-6 text-sm text-slate-400">
          Setelah approve, device baru akan otomatis masuk dashboard.
        </div>
      </div>
    </div>
  )
}
