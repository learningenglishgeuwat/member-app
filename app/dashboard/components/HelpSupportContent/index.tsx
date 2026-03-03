'use client'

import React, { useMemo, useState } from 'react'
import { HelpCircle, Bug, LifeBuoy } from 'lucide-react'

export default function HelpSupportContent() {
  const [name, setName] = useState('')
  const [issue, setIssue] = useState('')

  const whatsappHref = useMemo(() => {
    const phoneNumber = '6285846003119'
    const message = [
      'Hello GEUWAT Support,',
      '',
      `Name: ${name || '-'}`,
      `Issue: ${issue || '-'}`,
    ].join('\n')

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }, [name, issue])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-300" />
          <h2 className="font-display text-xl font-bold text-cyan-200">Help &amp; Support</h2>
        </div>
        <p className="text-sm text-slate-300">
          Find quick solutions if you have problems while using the app.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <div className="mb-3 flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-teal-300" />
          <h3 className="font-display text-lg font-semibold text-white">Common Checks</h3>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Muat ulang halaman lalu coba lagi.</li>
          <li>Periksa koneksi internet kamu.</li>
          <li>Keluar lalu masuk lagi jika sesi terlihat tidak valid.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Bug className="h-5 w-5 text-rose-300" />
          <h3 className="font-display text-lg font-semibold text-white">Report an Issue</h3>
        </div>
        <p className="text-sm text-slate-300">
          If the issue continues, prepare screenshots, error messages, and your device/browser details
          so support can help faster.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">
              Issue Details
            </label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe your issue..."
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                issue.trim()
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'pointer-events-none bg-slate-700 text-slate-400'
              }`}
            >
              Send via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
