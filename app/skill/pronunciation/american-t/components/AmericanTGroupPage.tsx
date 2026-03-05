'use client';

import { useState } from 'react';
import Link from '../../../../components/HoverPrefetchLink';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import '../american-t-hub.css';
import type { BreadcrumbItem, GroupCardItem } from '../data/types';

type AmericanTGroupPageProps = {
  title: string;
  subtitle: string;
  backTo: string;
  breadcrumbs: ReadonlyArray<BreadcrumbItem>;
  cards: ReadonlyArray<GroupCardItem>;
};

export default function AmericanTGroupPage({
  title,
  subtitle,
  backTo,
  breadcrumbs,
  cards,
}: AmericanTGroupPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pronunciation-layout at-hub-page at-group-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to={backTo} />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="at-hub-shell">
        <header className="at-hub-header">
          <nav aria-label="Breadcrumb" className="at-breadcrumb">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className="at-breadcrumb-item">
                {item.href ? (
                  <Link prefetch={false} href={item.href} className="at-breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span className="at-breadcrumb-sep">{'>'}</span>
                ) : null}
              </span>
            ))}
          </nav>
          <h1 className="at-hub-title">{title}</h1>
          <p className="at-hub-subtitle">{subtitle}</p>
        </header>

        <section className="at-group-grid">
          {cards.map((card) => (
            <Link prefetch={false} href={card.href} key={card.id} className="at-group-card">
              <span className="at-group-chip">Lesson Node</span>
              <h2 className="at-group-card-title">{card.title}</h2>
              <p className="at-group-card-desc">{card.description}</p>
              <span className="at-group-card-link">Open</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
