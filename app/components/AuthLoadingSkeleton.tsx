'use client'

import React from 'react'

export type AuthSkeletonVariant = 'default' | 'skill' | 'grammar' | 'speaking' | 'pronunciation'

export function getAuthSkeletonVariant(pathname: string): AuthSkeletonVariant {
  if (pathname.startsWith('/skill/pronunciation')) return 'pronunciation'
  if (pathname.startsWith('/skill/grammar/GrammarForSpeaking')) return 'speaking'
  if (pathname.startsWith('/skill/grammar')) return 'grammar'
  if (pathname === '/skill') return 'skill'
  return 'default'
}

type AuthLoadingSkeletonProps = {
  hint?: string | null
  variant: AuthSkeletonVariant
}

export default function AuthLoadingSkeleton({ hint, variant }: AuthLoadingSkeletonProps) {
  if (variant === 'pronunciation') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
        <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(168,85,247,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative z-10 border-b border-slate-800/70 bg-black/35 px-5 py-4 backdrop-blur-sm" />

        <main className="relative z-10 mx-auto w-[min(1300px,96vw)] px-3 pb-8 pt-5">
          <div className="mx-auto mb-5 w-[min(900px,95vw)] animate-pulse space-y-3">
            <div className="h-9 w-72 rounded bg-slate-700/70" />
            <div className="h-16 rounded-xl bg-slate-900/80" />
            <div className="h-14 rounded-lg bg-fuchsia-900/30" />
          </div>

          <div className="mx-auto mt-5 h-36 w-[min(1100px,95vw)] animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/75" />

          <div className="mx-auto mt-6 flex w-[min(1100px,95vw)] items-center justify-center gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-24 w-[160px] animate-pulse rounded-xl border border-slate-800/80 bg-slate-900/75 max-[768px]:h-20 max-[768px]:w-[130px]"
              />
            ))}
          </div>

          <div className="mx-auto mt-6 h-12 w-12 animate-pulse rounded-lg border border-slate-800/80 bg-slate-900/75" />
          {hint && <p className="mx-auto mt-4 w-[min(900px,95vw)] text-xs text-amber-300">{hint}</p>}
        </main>
      </div>
    )
  }

  if (variant === 'skill') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
        <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(20,184,166,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative z-10 border-b border-slate-800/70 bg-black/30 px-5 py-4 backdrop-blur-sm" />
        <main className="relative z-10 mx-auto w-[min(1200px,95vw)] px-4 pb-10 pt-8">
          <div className="mx-auto mb-10 w-[min(520px,90vw)] animate-pulse space-y-3 text-center">
            <div className="mx-auto h-3 w-40 rounded bg-slate-700/70" />
            <div className="mx-auto h-9 w-72 rounded bg-slate-700/70" />
            <div className="mx-auto h-3 w-44 rounded bg-slate-800/80" />
          </div>

          <div className="mx-auto mb-10 grid w-[min(900px,95vw)] grid-cols-4 gap-4 max-[640px]:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
            ))}
          </div>

          <div className="mx-auto w-[min(760px,95vw)] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="h-6 w-56 rounded bg-slate-700/70" />
            <div className="mt-3 h-3 w-full rounded bg-slate-800/80" />
            <div className="mt-2 h-3 w-11/12 rounded bg-slate-800/80" />
            <div className="mt-4 h-10 w-40 rounded-full bg-slate-700/70" />
          </div>

          {hint && <p className="mx-auto mt-4 w-[min(760px,95vw)] text-xs text-amber-300">{hint}</p>}
        </main>
      </div>
    )
  }

  if (variant === 'grammar') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#10212e_0%,#04070a_48%,#010203_100%)] text-slate-200">
        <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(20,184,166,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative z-10 border-b border-teal-400/25 bg-black/30 px-5 py-4 backdrop-blur-sm" />
        <main className="relative z-10 mx-auto w-[min(960px,92vw)] px-2 pb-12 pt-10">
          <div className="mx-auto w-[220px] animate-pulse space-y-3">
            <div className="h-3 rounded bg-slate-700/70" />
            <div className="h-8 rounded bg-slate-700/70" />
          </div>
          <div className="mx-auto mt-8 h-[250px] w-[min(620px,88vw)] animate-pulse rounded-2xl border border-teal-300/25 bg-slate-900/65" />
          <div className="mx-auto mt-6 w-[min(620px,88vw)] animate-pulse space-y-3 rounded-xl border border-white/10 bg-black/35 p-5">
            <div className="h-5 w-52 rounded bg-slate-700/70" />
            <div className="h-3 w-full rounded bg-slate-800/80" />
            <div className="h-3 w-11/12 rounded bg-slate-800/80" />
            <div className="h-10 w-32 rounded-full bg-slate-700/70" />
          </div>
          {hint && <p className="mx-auto mt-4 w-[min(620px,88vw)] text-xs text-amber-300">{hint}</p>}
        </main>
      </div>
    )
  }

  if (variant === 'speaking') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_14%_0%,#11323a_0%,#081118_48%,#04070a_100%)] text-slate-200">
        <div className="pointer-events-none fixed inset-0 opacity-15 [background-image:linear-gradient(rgba(20,184,166,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.16)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative z-10 border-b border-teal-400/25 bg-black/30 px-5 py-4 backdrop-blur-sm" />
        <main className="relative z-10 mx-auto w-[min(1280px,96vw)] px-2 pb-8 pt-6">
          <div className="mb-4 flex animate-pulse items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-36 rounded bg-slate-700/70" />
              <div className="h-8 w-72 rounded bg-slate-700/70" />
              <div className="h-3 w-80 rounded bg-slate-800/80" />
            </div>
            <div className="h-20 w-36 rounded-xl border border-teal-300/25 bg-slate-900/65" />
          </div>
          <div className="grid min-h-[60vh] grid-cols-[320px_minmax(0,1fr)] grid-rows-[auto_1fr] gap-4 max-[980px]:grid-cols-1 max-[980px]:grid-rows-none">
            <div className="col-span-2 h-20 animate-pulse rounded-xl border border-teal-300/25 bg-slate-900/65 max-[980px]:col-span-1" />
            <div className="animate-pulse rounded-xl border border-teal-300/25 bg-slate-900/65 p-4">
              <div className="h-20 rounded-lg bg-slate-800/70" />
              <div className="mt-3 space-y-2">
                <div className="h-10 rounded-lg bg-slate-800/70" />
                <div className="h-10 rounded-lg bg-slate-800/70" />
                <div className="h-10 rounded-lg bg-slate-800/70" />
              </div>
            </div>
            <div className="animate-pulse rounded-xl border border-teal-300/25 bg-slate-900/65 p-4">
              <div className="h-24 rounded-lg bg-slate-800/70" />
              <div className="mt-3 h-28 rounded-lg bg-slate-800/70" />
              <div className="mt-3 h-24 rounded-lg bg-slate-800/70" />
            </div>
          </div>
          {hint && <p className="mt-4 text-xs text-amber-300">{hint}</p>}
        </main>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
      <div className="w-[min(560px,92vw)] rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-40 rounded bg-slate-700/70" />
          <div className="h-3 w-full rounded bg-slate-800/80" />
          <div className="h-3 w-11/12 rounded bg-slate-800/80" />
          <div className="h-3 w-9/12 rounded bg-slate-800/80" />
          <div className="pt-3">
            <div className="h-10 w-36 rounded-full bg-slate-700/70" />
          </div>
        </div>
        {hint && <div className="mt-4 text-xs text-amber-300">{hint}</div>}
      </div>
    </div>
  )
}
