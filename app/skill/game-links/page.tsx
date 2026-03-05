'use client'

import { type CSSProperties, useMemo, useState } from 'react'
import Link from '../../components/HoverPrefetchLink'
import { ArrowUpRight, Crosshair } from 'lucide-react'
import BackButton from '../components/BackButton'
import './game-links.css'

type GameItem = {
  id: string
  name: string
  description: string
  url: string
  metric: string
}

const GAME_LINKS: GameItem[] = [
  {
    id: 'spelling-bee',
    name: 'Spelling Bee',
    description: 'Latihan mengeja kata dalam bahasa Inggris.',
    url: 'https://spelling-bee-olive.vercel.app',
    metric: '226 M',
  },
  {
    id: 'phonetic-symbol-quiz',
    name: 'Phonetic Symbol Quiz',
    description: 'Latihan tebak simbol bunyi (IPA).',
    url: 'https://geuwat-phonetic-symbol-quiz.netlify.app',
    metric: '226 M',
  },
  {
    id: 'final-sound-quiz',
    name: 'Final Sound Quiz',
    description: 'Latihan bunyi akhir kata untuk -s/-es dan -d/-ed.',
    url: 'https://geuwat-final-sound-quiz-app.vercel.app/',
    metric: '226 M',
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    description: 'Game baru sedang disiapkan. Nantikan update berikutnya.',
    url: '',
    metric: '---',
  },
]
function getCircularOffset(index: number, selectedIndex: number, total: number) {
  let offset = index - selectedIndex
  const half = Math.floor(total / 2)
  if (offset > half) offset -= total
  if (offset < -half) offset += total
  return offset
}
export default function SkillGameLinksPage() {
  const [selectedGameId, setSelectedGameId] = useState(GAME_LINKS[0]?.id ?? '')
  const selectedGame = useMemo(
    () => GAME_LINKS.find((game) => game.id === selectedGameId) ?? GAME_LINKS[0],
    [selectedGameId]
  )
  const selectedIndex = useMemo(
    () => GAME_LINKS.findIndex((game) => game.id === selectedGame.id),
    [selectedGame.id]
  )

  return (
    <div className="min-h-screen bg-[#020916] px-4 py-6 text-cyan-100">
      <div className="mx-auto flex max-w-5xl items-center justify-start">
        <BackButton to="/skill" />
      </div>

      <main className="mx-auto mt-8 max-w-5xl">
        <div className="game-hud-panel rounded-2xl p-5 md:p-7">
          <h1 className="text-2xl font-black uppercase tracking-wide text-cyan-100 md:text-3xl">
            Skill Games
          </h1>
          <p className="mt-2 text-sm text-cyan-100/85 md:text-base">
            Pilih game dari lingkaran di bawah.
          </p>

          <section className="game-hud-stage mt-6">
            <div className="game-hud-target">
              <div className="game-hud-target-box" data-tour="game-target-box">
                <span className="game-hud-target-line game-hud-target-line--h" />
                <span className="game-hud-target-line game-hud-target-line--v" />
                <span className="game-hud-frame-corner game-hud-frame-corner--tl" />
                <span className="game-hud-frame-corner game-hud-frame-corner--tr" />
                <span className="game-hud-frame-corner game-hud-frame-corner--bl" />
                <span className="game-hud-frame-corner game-hud-frame-corner--br" />
                <span className="game-hud-frame-mark game-hud-frame-mark--top" />
                <span className="game-hud-frame-mark game-hud-frame-mark--bottom" />
                <span className="game-hud-frame-bar game-hud-frame-bar--left" />
                <span className="game-hud-frame-bar game-hud-frame-bar--right" />
                <span className="game-hud-frame-bracket game-hud-frame-bracket--left" />
                <span className="game-hud-frame-bracket game-hud-frame-bracket--right" />
                <span className="game-hud-crosshair" />

                <div className="game-hud-target-metrics">
                  <span className="game-hud-target-metric game-hud-target-metric--left">
                    S 12.3
                  </span>
                  <span className="game-hud-target-metric game-hud-target-metric--right">
                    {selectedGame.metric}
                  </span>
                </div>

                <div className="game-hud-target-content">
                  <p className="game-hud-target-subtitle">
                    {selectedGame.url ? 'ACTIVE GAME' : 'COMING SOON'}
                  </p>
                  <h2 className="game-hud-target-title">{selectedGame.name}</h2>
                  <p className="game-hud-target-description">{selectedGame.description}</p>
                  {selectedGame.url ? (
                    <Link prefetch={false}
                      href={selectedGame.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="game-hud-target-btn"
                    >
                      Open Game
                      <ArrowUpRight size={15} />
                    </Link>
                  ) : (
                    <button type="button" className="game-hud-target-btn game-hud-target-btn--disabled" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="game-hud-orbit" aria-hidden="true">
              <span className="game-hud-orbit-layer game-hud-orbit-layer--outer" />
              <span className="game-hud-orbit-layer game-hud-orbit-layer--mid" />
              <span className="game-hud-orbit-layer game-hud-orbit-layer--inner" />
              <span className="game-hud-orbit-ticks" />
              <span className="game-hud-orbit-arc game-hud-orbit-arc--a" />
              <span className="game-hud-orbit-arc game-hud-orbit-arc--b" />
              <span className="game-hud-orbit-arc game-hud-orbit-arc--c" />
              <span className="game-hud-orbit-core" />
            </div>

            <div className="game-hud-choices" data-tour="game-choice-orbit">
              {GAME_LINKS.map(({ id, name }, index) => {
                const isActive = selectedGame.id === id
                const offset = getCircularOffset(index, selectedIndex, GAME_LINKS.length)
                const depth = Math.abs(offset)
                const cardStyle = {
                  '--offset': String(offset),
                  '--depth': String(depth),
                  '--scale': isActive ? '1.24' : String(Math.max(0.84, 1 - depth * 0.16)),
                  '--z': String(isActive ? 40 : 20 - depth),
                  '--op': isActive ? '1' : String(Math.max(0.46, 1 - depth * 0.26)),
                } as CSSProperties
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedGameId(id)}
                    style={cardStyle}
                    className={[
                      'game-hud-choice',
                      isActive ? 'game-hud-choice--active' : '',
                    ].join(' ')}
                    aria-label={`Select ${name}`}
                  >
                    <span className="game-hud-choice-inner">
                      <span className="game-hud-choice-ring" />
                      <span className="game-hud-choice-ring game-hud-choice-ring--inner" />
                      <span className="game-hud-choice-tabs" />
                      <Crosshair size={20} className="game-hud-choice-icon" />
                    </span>
                    <span className="game-hud-choice-label">{name}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
