'use client';

import Link from '../../../components/HoverPrefetchLink';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/BackButton';
import { GRAMMAR_RESOURCE_GROUPS } from '../data/grammarResourceCatalog';
import './grammar-resource.css';

const STORAGE_KEY = 'gr_open_group';

const findGroupId = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const direct = GRAMMAR_RESOURCE_GROUPS.find((group) => group.groupId === value);
  if (direct) {
    return direct.groupId;
  }

  const legacy = GRAMMAR_RESOURCE_GROUPS.find((group) => group.groupTitle === value);
  return legacy?.groupId ?? null;
};

export default function GrammarResourcePage() {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [isGroupStateReady, setIsGroupStateReady] = useState(false);
  const restoreGroupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedGroupId = findGroupId(window.sessionStorage.getItem(STORAGE_KEY));
    restoreGroupTimerRef.current = window.setTimeout(() => {
      setOpenGroupId(savedGroupId);
      setIsGroupStateReady(true);
      restoreGroupTimerRef.current = null;
    }, 0);

    return () => {
      if (restoreGroupTimerRef.current !== null) {
        window.clearTimeout(restoreGroupTimerRef.current);
        restoreGroupTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isGroupStateReady) return;

    if (openGroupId) {
      window.sessionStorage.setItem(STORAGE_KEY, openGroupId);
      return;
    }
    window.sessionStorage.removeItem(STORAGE_KEY);
  }, [isGroupStateReady, openGroupId]);

  return (
    <main className="grammar-resource-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar" />
      </div>

      <div className="grammar-resource-shell">
        <h1 className="grammar-resource-title">Grammar Resource</h1>
        <p className="grammar-resource-subtitle">
          Daftar topik inti grammar sebagai sumber referensi utama.
        </p>

        <section className="grammar-resource-tree">
          {GRAMMAR_RESOURCE_GROUPS.map((group) => (
            <details
              key={group.groupId}
              className="grammar-resource-tree-group"
              open={openGroupId === group.groupId}
            >
              <summary
                className="tree-card tree-folder-card"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenGroupId((prev) => (prev === group.groupId ? null : group.groupId));
                }}
              >
                <span className="tree-caret" aria-hidden="true" />
                <span className="tree-folder-label">{group.groupTitle}</span>
              </summary>

              <div className="tree-children">
                {group.topics.map((topic) => (
                  <Link prefetch={false} prefetchOnHover={false}
                    key={topic.topicId}
                    href={topic.href}
                    className="tree-card tree-topic-card tree-topic-link"
                    onClick={() => setOpenGroupId(group.groupId)}
                  >
                    <span className="tree-branch" aria-hidden="true" />
                    <span className="tree-topic-label">{topic.topicLabel}</span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
