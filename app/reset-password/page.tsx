'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash) {
      setStatus('error')
      setMessage('Link reset tidak valid atau sudah kedaluwarsa.')
      setReady(true)
      return
    }

    const params = new URLSearchParams(hash.replace('#', ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setStatus('error')
      setMessage('Link reset tidak valid atau sudah kedaluwarsa.')
      setReady(true)
      return
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setStatus('error')
          setMessage(`Gagal memverifikasi sesi reset: ${error.message}`)
        }
      })
      .finally(() => setReady(true))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirm) {
      setStatus('error')
      setMessage('Password tidak boleh kosong.')
      return
    }
    if (password !== confirm) {
      setStatus('error')
      setMessage('Password dan konfirmasi tidak sama.')
      return
    }
    if (password.length < 6) {
      setStatus('error')
      setMessage('Password minimal 6 karakter.')
      return
    }

    setStatus('loading')
    setMessage(null)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('error')
      setMessage(`Gagal reset password: ${error.message}`)
      return
    }

    setStatus('success')
    setMessage('Password berhasil diubah. Silakan login.')
    setTimeout(() => router.push('/login'), 1200)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <h1 className="text-xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-sm text-slate-400 mb-6">
          Masukkan password baru untuk akun Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password Baru"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 pr-20 text-sm text-white outline-none focus:border-amber-400"
              disabled={!ready || status === 'loading'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-300 hover:text-amber-200"
              disabled={!ready || status === 'loading'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Konfirmasi Password"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 pr-20 text-sm text-white outline-none focus:border-amber-400"
              disabled={!ready || status === 'loading'}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-300 hover:text-amber-200"
              disabled={!ready || status === 'loading'}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={!ready || status === 'loading'}
            className="w-full rounded-xl bg-amber-500 text-slate-900 font-semibold py-3 text-sm hover:bg-amber-400 disabled:opacity-60"
          >
            {!ready ? 'Memverifikasi link...' : status === 'loading' ? 'Menyimpan...' : 'Simpan Password'}
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
