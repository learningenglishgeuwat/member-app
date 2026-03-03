'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

type ApprovePairingRpcResponse = {
  error: { message: string } | null
}

export default function DeviceApproveContent() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    const cleaned = code.replace(/[^0-9]/g, '')
    const rpcClient = supabase as unknown as {
      rpc: (
        fn: 'approve_pairing',
        args: { p_code: string },
      ) => Promise<ApprovePairingRpcResponse>
    }
    const { error: rpcError } = await rpcClient.rpc('approve_pairing', {
      p_code: cleaned,
    })

    if (rpcError) {
      setStatus('error')
      setError(rpcError.message)
      return
    }

    setStatus('success')
    await supabase.auth.signOut()
    window.location.replace('/login')
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/60 p-6 md:p-8">
      <div
        className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8"
        data-tour="device-approve-form"
      >
        <h1 className="text-2xl font-bold text-white" data-tour="device-approve-title">
          Setujui Device Baru
        </h1>
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
            data-tour="device-approve-submit"
            className="w-full rounded-lg bg-emerald-500/90 py-3 font-semibold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Memproses...' : 'Approve'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-4 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-emerald-200">
            Device baru berhasil disetujui. Anda akan diarahkan ke login.
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
    </section>
  )
}
