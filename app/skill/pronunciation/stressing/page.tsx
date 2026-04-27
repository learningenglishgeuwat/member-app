'use client';

import { useState } from 'react';
import Link from '../../../components/HoverPrefetchLink';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import './stressing-hub.css';

export default function StressingHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--stressing sh-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="sh-shell">
        <header className="sh-header">
          <h1 className="sh-title">Stressing</h1>
          <p className="sh-subtitle">Pilih jalur latihan sebelum masuk materi.</p>
        </header>

        <section className="sh-grid" aria-label="Stressing categories">
          <Link href="/skill/pronunciation/stressing/word-stress" className="sh-card sh-card-word">
            <div className="sh-card-top">
              <h2 className="sh-card-title">Word Stress</h2>
              <p className="sh-card-desc">Tekanan suku kata di dalam kata.</p>
            </div>
            <ul className="sh-card-bullets">
              <li>IPA stress marks</li>
              <li>Quick rules</li>
              <li>Noun–verb contrast</li>
              <li>Practice bank</li>
            </ul>
            <span className="sh-card-cta">Mulai</span>
          </Link>

          <Link
            href="/skill/pronunciation/stressing/sentence-stress"
            className="sh-card sh-card-sentence"
          >
            <div className="sh-card-top">
              <h2 className="sh-card-title">Sentence Stress</h2>
              <p className="sh-card-desc">Tekanan kata di dalam kalimat.</p>
            </div>
            <ul className="sh-card-bullets">
              <li>Meaning focus</li>
              <li>Content vs function words</li>
              <li>Rhythm (stress-timed)</li>
              <li>Practice sentences</li>
            </ul>
            <span className="sh-card-cta">Mulai</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
