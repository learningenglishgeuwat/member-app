'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type CarouselItem = {
  id: string;
  node: ReactNode;
};

type Props = {
  items: CarouselItem[];
  ariaLabel: string;
  hint?: string;
  initialItemId?: string | null;
  activeItemId?: string | null;
  onIndexChange?: (index: number) => void;
  isPlaying?: boolean;
};

export default function VocabularyWordCarousel({
  items,
  ariaLabel,
  hint,
  initialItemId,
  activeItemId,
  onIndexChange,
  isPlaying,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

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
    if (!activeItemId) return;
    if (dragStateRef.current.pointerDown) return;
    const nextIndex = items.findIndex((item) => item.id === activeItemId);
    if (nextIndex < 0) return;

    const track = trackRef.current;
    const target = itemRefs.current[nextIndex];
    if (!track || !target) return;

    // Use instant scroll first to ensure position, then smooth if needed
    const isAlreadyVisible = (
      target.offsetLeft >= track.scrollLeft &&
      target.offsetLeft < track.scrollLeft + track.clientWidth
    );

    if (!isAlreadyVisible || nextIndex !== currentIndexRef.current) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      window.requestAnimationFrame(() => {
        setCurrentIndex(nextIndex);
      });
    }
  }, [activeItemId, items]);

  useEffect(() => {
    hasRestoredRef.current = false;
  }, [items.length]);

  useEffect(() => {
    if (hasRestoredRef.current) return;
    if (!initialItemId) return;
    if (dragStateRef.current.pointerDown) return;
    const nextIndex = items.findIndex((item) => item.id === initialItemId);
    if (nextIndex < 0) return;
    if (nextIndex === currentIndexRef.current) {
      hasRestoredRef.current = true;
      return;
    }
    hasRestoredRef.current = true;

    const track = trackRef.current;
    const target = itemRefs.current[nextIndex];
    if (!track || !target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
    });
  }, [initialItemId, items]);

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

  const scrollToIndexWrappedStable = useRef(scrollToIndexWrapped);
  useEffect(() => {
    scrollToIndexWrappedStable.current = scrollToIndexWrapped;
  });

  useEffect(() => {
    const handleNext = () => {
      if (items.length <= 1) return;
      scrollToIndexWrappedStable.current(currentIndexRef.current + 1);
    };
    const handlePrev = () => {
      if (items.length <= 1) return;
      scrollToIndexWrappedStable.current(currentIndexRef.current - 1);
    };

    window.addEventListener('app:gesture:navigate-next', handleNext);
    window.addEventListener('app:gesture:navigate-prev', handlePrev);

    return () => {
      window.removeEventListener('app:gesture:navigate-next', handleNext);
      window.removeEventListener('app:gesture:navigate-prev', handlePrev);
    };
  }, [items.length]);

  return (
    <section className="vocab-word-carousel" aria-label={ariaLabel}>
      {hint ? <p className="vocab-word-carousel-hint">{hint}</p> : null}

      <div className="vocab-carousel-shell">
        <div className="vocab-carousel-controls" aria-hidden="true">
          <button
            type="button"
            className="vocab-carousel-arrow vocab-carousel-arrow--left"
            onClick={() => scrollToIndexWrapped(currentIndexRef.current - 1)}
            disabled={items.length <= 1}
            aria-label="Scroll kata ke kiri"
          >
            <ChevronLeft className="vocab-carousel-arrow-icon" />
          </button>
          <button
            type="button"
            className="vocab-carousel-arrow vocab-carousel-arrow--right"
            onClick={() => scrollToIndexWrapped(currentIndexRef.current + 1)}
            disabled={items.length <= 1}
            aria-label="Scroll kata ke kanan"
          >
            <ChevronRight className="vocab-carousel-arrow-icon" />
          </button>
        </div>

        <div
          ref={trackRef}
          className={`vocab-word-carousel-track ${isPlaying ? 'is-playing' : ''}`}
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
          {items.map((item, index) => (
            <div key={item.id} className="vocab-word-carousel-item" role="listitem">
              <div
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                onClickCapture={(event) => {
                  if (dragStateRef.current.isDragging) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              >
                {item.node}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
