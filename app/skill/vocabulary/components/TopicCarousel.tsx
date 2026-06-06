'use client';

import Link from '../../../components/ui/links/HoverPrefetchLink';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type TopicCarouselItem = {
  id: string;
  href: string;
  chipLabel: string;
  subtitle?: string;
  description?: string;
  wordCount: number;
  Icon: LucideIcon;
};

type Props = {
  items: TopicCarouselItem[];
  ariaLabel?: string;
  initialItemId?: string | null;
  onIndexChange?: (index: number) => void;
};

export default function TopicCarousel({
  items,
  ariaLabel = 'Vocabulary topic carousel',
  initialItemId,
  onIndexChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    pointerDown: false,
    startX: 0,
    startY: 0,
    isDragging: false,
  });
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollEndTimerRef = useRef<number | null>(null);

  const pageWidthRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialItemId) return 0;
    const nextIndex = items.findIndex((item) => item.id === initialItemId);
    return nextIndex >= 0 ? nextIndex : 0;
  });
  const currentIndexRef = useRef(0);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const update = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pageWidthRef.current = track.clientWidth || 1;
      });
    };

    update();
    track.addEventListener('scroll', update, { passive: true });

    const resizeObserver = new ResizeObserver(() => update());
    resizeObserver.observe(track);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      track.removeEventListener('scroll', update);
      resizeObserver.disconnect();
    };
  }, [items.length]);

  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const getNearestIndex = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const pageWidth = pageWidthRef.current || track.clientWidth || 1;
    const maxIndex = Math.max(0, items.length - 1);
    const estimated = Math.round(track.scrollLeft / pageWidth);
    return Math.min(maxIndex, Math.max(0, estimated));
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const maxIndex = Math.max(0, items.length - 1);
    const clampedIndex = Math.min(maxIndex, Math.max(0, index));
    const target = itemRefs.current[clampedIndex];
    setCurrentIndex(clampedIndex);
    currentIndexRef.current = clampedIndex;
    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      return;
    }
    const pageWidth = pageWidthRef.current || track.clientWidth || 1;
    track.scrollTo({ left: clampedIndex * pageWidth, behavior: 'smooth' });
  };

  const resolveWrappedIndex = (index: number) => {
    const count = items.length;
    if (count <= 0) return 0;
    return ((index % count) + count) % count;
  };

  const scrollToIndexWrapped = (index: number) => {
    scrollToIndex(resolveWrappedIndex(index));
  };

  useEffect(() => {
    hasRestoredRef.current = false;
  }, [items.length]);

  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    if (currentIndex <= 0) return;

    const track = trackRef.current;
    if (!track) return;
    const target = itemRefs.current[currentIndex];
    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'auto' });
      return;
    }
    const pageWidth = pageWidthRef.current || track.clientWidth || 1;
    track.scrollTo({ left: currentIndex * pageWidth, behavior: 'auto' });
  }, [currentIndex]);

  return (
    <section className="vocab-topic-carousel" aria-label={ariaLabel}>
      <p className="vocab-topic-carousel-hint">Swipe untuk lihat topik lainnya, lalu tap untuk buka.</p>
      <div className="vocab-carousel-shell">
        <div className="vocab-carousel-controls" aria-hidden="true">
          <button
            type="button"
            className="vocab-carousel-arrow vocab-carousel-arrow--left"
            onClick={() => scrollToIndexWrapped(currentIndexRef.current - 1)}
            disabled={items.length <= 1}
            aria-label="Scroll topik ke kiri"
          >
            <ChevronLeft className="vocab-carousel-arrow-icon" />
          </button>
          <button
            type="button"
            className="vocab-carousel-arrow vocab-carousel-arrow--right"
            onClick={() => scrollToIndexWrapped(currentIndexRef.current + 1)}
            disabled={items.length <= 1}
            aria-label="Scroll topik ke kanan"
          >
            <ChevronRight className="vocab-carousel-arrow-icon" />
          </button>
        </div>

        <div
          ref={trackRef}
          className="vocab-topic-carousel-track"
          role="list"
          onScroll={() => {
            if (scrollEndTimerRef.current) {
              window.clearTimeout(scrollEndTimerRef.current);
            }
            scrollEndTimerRef.current = window.setTimeout(() => {
              scrollEndTimerRef.current = null;
              if (dragStateRef.current.pointerDown) return;
              const nearestIndex = getNearestIndex();
              scrollToIndex(nearestIndex);
            }, 110);
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            dragStateRef.current.pointerDown = true;
            dragStateRef.current.isDragging = false;
            dragStateRef.current.startX = event.clientX;
            dragStateRef.current.startY = event.clientY;
          }}
          onPointerMove={(event) => {
            if (!dragStateRef.current.pointerDown || dragStateRef.current.isDragging) return;
            const deltaX = Math.abs(event.clientX - dragStateRef.current.startX);
            const deltaY = Math.abs(event.clientY - dragStateRef.current.startY);
            if (deltaX > 8 && deltaX > deltaY) {
              dragStateRef.current.isDragging = true;
            }
          }}
          onPointerUp={(event) => {
            const wasDragging = dragStateRef.current.isDragging;
            const deltaX = event.clientX - dragStateRef.current.startX;
            dragStateRef.current.pointerDown = false;
            window.setTimeout(() => {
              dragStateRef.current.isDragging = false;
            }, 0);

            if (!wasDragging || items.length <= 1) return;
            const threshold = 36;
            if (deltaX <= -threshold) {
              scrollToIndexWrapped(currentIndexRef.current + 1);
              return;
            }
            if (deltaX >= threshold) {
              scrollToIndexWrapped(currentIndexRef.current - 1);
            }
          }}
          onPointerCancel={() => {
            dragStateRef.current.pointerDown = false;
            dragStateRef.current.isDragging = false;
          }}
        >
        {items.map((item, index) => {
          const ItemIcon = item.Icon;

          return (
            <div
              key={item.id}
              className="vocab-topic-carousel-item"
              role="listitem"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
            >
              <Link
                href={item.href}
                className="vocab-topic-card vocab-topic-card--carousel"
                prefetchOnHover={false}
                  aria-label={`Buka topik ${item.chipLabel}`}
                  onClick={(event) => {
                    if (dragStateRef.current.isDragging) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }}
                >
                  <div className="vocab-topic-head">
                    <h2 className="vocab-topic-title">
                      <span className="vocab-topic-icon" aria-hidden="true">
                        <ItemIcon className="vocab-topic-icon-svg" />
                      </span>
                      <span className="vocab-topic-chip vocab-topic-chip--title">{item.chipLabel}</span>
                    </h2>
                    {item.subtitle ? <p className="vocab-topic-subtitle">{item.subtitle}</p> : null}
                  </div>

                  {item.subtitle && item.description ? (
                    <span className="vocab-topic-divider" aria-hidden="true" />
                  ) : null}
                  {item.description ? <p className="vocab-topic-description">{item.description}</p> : null}

                  <div className="vocab-topic-footer">
                    <span className="vocab-topic-meta">{item.wordCount} kata</span>
                    <span className="vocab-topic-link">Lihat Detail</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
