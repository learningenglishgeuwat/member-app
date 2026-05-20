'use client'

import React from 'react'
import { HelpCircle, Bug, LifeBuoy } from 'lucide-react'

export default function HelpSupportContent() {
  const reportIssueHref = 'https://forms.gle/ENkpLQVQdPJCpAnd7'

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-black/70 p-6 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-300" />
          <h2 className="font-display text-xl font-bold text-cyan-200">Help &amp; Support</h2>
        </div>
        <p className="text-sm text-slate-300">
          Find quick solutions if you have problems while using the app.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-black/70 p-6">
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

      <section className="rounded-2xl border border-slate-700 bg-black/70 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Bug className="h-5 w-5 text-rose-300" />
          <h3 className="font-display text-lg font-semibold text-white">Report an Issue</h3>
        </div>
        <p className="text-sm text-slate-300">
          If the issue continues, prepare screenshots, error messages, and your device/browser details
          so support can help faster.
        </p>

        <p className="mt-4 text-sm text-slate-300">
          Untuk lapor issue, silakan{' '}
          <a
            href={reportIssueHref}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
          >
            klik link ini
          </a>
          .
        </p>
      </section>
    </div>
  )
}
