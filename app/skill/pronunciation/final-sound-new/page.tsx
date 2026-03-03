'use client';

import { useState } from 'react';
import Link from '../../../components/HoverPrefetchLink';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import './final-sound-new.css';

export default function FinalSoundNewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pronunciation-layout fsn-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="fsn-shell">
        <header className="fsn-header">
          <h1 className="fsn-title">Final Sound</h1>
        </header>

        <section className="fsn-orbit-stage">
          <div className="fsn-orbit-ring" aria-hidden="true" />
          <div className="fsn-orbit-glow fsn-orbit-glow-left" aria-hidden="true" />
          <div className="fsn-orbit-glow fsn-orbit-glow-right" aria-hidden="true" />

          <div className="fsn-orbiter fsn-orbiter-left">
            <div className="fsn-orbit-counter fsn-orbit-counter-left">
              <Link href="/skill/pronunciation/final-sound-new/s/es" className="fsn-orbit-link">
                <article className="fsn-card fsn-card-orbit">
                  <h2>S/ES</h2>
                </article>
              </Link>
            </div>
          </div>

          <article className="fsn-card fsn-card-center">
            <h2>Final Sound</h2>
          </article>

          <div className="fsn-orbiter fsn-orbiter-right">
            <div className="fsn-orbit-counter fsn-orbit-counter-right">
              <Link href="/skill/pronunciation/final-sound-new/d/ed" className="fsn-orbit-link">
                <article className="fsn-card fsn-card-orbit">
                  <h2>D/ED</h2>
                </article>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
