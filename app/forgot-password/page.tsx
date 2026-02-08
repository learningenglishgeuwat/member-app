'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Email tidak boleh kosong.')
      return
    }

    setStatus('loading')
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setStatus('error')
      setMessage(`Gagal mengirim email reset: ${error.message}`)
      if (error.message?.toLowerCase().includes('rate limit')) {
        setCooldown(120)
      }
      return
    }

    setStatus('success')
    setMessage('Link reset password sudah dikirim. Silakan cek email.')
    setCooldown(120)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <h1 className="text-xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-sm text-slate-400 mb-6">
          Masukkan email Anda untuk menerima link reset password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            disabled={status === 'loading' || cooldown > 0}
            className="w-full rounded-xl bg-amber-500 text-slate-900 font-semibold py-3 text-sm hover:bg-amber-400 disabled:opacity-60"
          >
            {status === 'loading'
              ? 'Mengirim...'
              : cooldown > 0
              ? `Tunggu ${cooldown}s`
              : 'Kirim Link Reset'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-xs ${
              status === 'success' ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  )
}
