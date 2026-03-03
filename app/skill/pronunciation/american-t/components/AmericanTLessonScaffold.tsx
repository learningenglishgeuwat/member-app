'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import '../american-t.css';
import '../american-t-hub.css';
import '../../final-sound-new/final-sound-topic.css';
import { primeBestEnglishVoice } from '../../final-sound-new/tts-utils';

type LessonSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type AmericanTLessonScaffoldProps = {
  title: string;
  subtitle: string;
  backTo: string;
  sections: ReadonlyArray<LessonSection>;
  pageClassName?: string;
  headerActions?: ReactNode;
};

export default function AmericanTLessonScaffold({
  title,
  subtitle,
  backTo,
  sections,
  pageClassName,
  headerActions,
}: AmericanTLessonScaffoldProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    sections.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.id] = false;
      return acc;
    }, {}),
  );
  const previousOpenSectionsRef = useRef<Record<string, boolean> | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  useEffect(() => {
    const previousOpenSections = previousOpenSectionsRef.current;
    previousOpenSectionsRef.current = openSections;

    if (!previousOpenSections) return;

    const hasClosedSection = Object.keys(openSections).some(
      (sectionId) => previousOpenSections[sectionId] && !openSections[sectionId],
    );

    if (!hasClosedSection) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.dispatchEvent(new CustomEvent('at-lesson-section-closed'));
    }
  }, [openSections]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleJumpToSection = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId?: string }>;
      const sectionId = customEvent.detail?.sectionId;
      if (!sectionId) return;

      const sectionExists = sections.some((section) => section.id === sectionId);
      if (!sectionExists) return;

      setOpenSections((prev) => (prev[sectionId] ? prev : { ...prev, [sectionId]: true }));

      const scrollToSection = () => {
        const target = sectionRefs.current[sectionId];
        if (!target) return false;
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        return true;
      };

      if (scrollToSection()) return;

      let attempt = 0;
      const timer = window.setInterval(() => {
        attempt += 1;
        if (scrollToSection() || attempt >= 12) {
          window.clearInterval(timer);
        }
      }, 120);
    };

    window.addEventListener('at-lesson-jump-to-section', handleJumpToSection as EventListener);
    return () => {
      window.removeEventListener('at-lesson-jump-to-section', handleJumpToSection as EventListener);
    };
  }, [sections]);

  return (
    <div className={`pronunciation-layout fs-topic-page at-topic-page ${pageClassName ?? ''}`}>
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to={backTo} />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="fs-topic-shell">
        <header className="fs-topic-header">
          <h1 className="fs-topic-title">{title}</h1>
          <p className="fs-topic-subtitle">{subtitle}</p>
          {headerActions ? <div className="at-topic-progress-actions">{headerActions}</div> : null}
        </header>

        {sections.map((section) => (
          <section
            key={section.id}
            className="fs-topic-block"
            ref={(node) => {
              sectionRefs.current[section.id] = node;
            }}
          >
            <h2 className="fs-topic-block-title">
              <button
                type="button"
                className="fs-topic-section-button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={openSections[section.id]}
              >
                <span>{section.title}</span>
                <span className={`fs-topic-section-icon ${openSections[section.id] ? 'is-open' : ''}`} aria-hidden="true"></span>
              </button>
            </h2>
            {openSections[section.id] ? section.content : null}
          </section>
        ))}
      </main>
    </div>
  );
}
