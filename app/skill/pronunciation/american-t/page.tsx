'use client';

import { type CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react';
import Link from '../../../components/HoverPrefetchLink';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import './american-t-hub.css';
import type { HubNode } from './data/types';

type NodeLesson = {
  title: string;
  href: string;
};

type CircleGeometry = {
  x: number;
  y: number;
  r: number;
};

type LineGeometry = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type HubSvgGeometry = {
  width: number;
  height: number;
  lines: LineGeometry[];
};

const HUB_NODES: ReadonlyArray<HubNode> = [
  {
    id: 'beginning',
    label: 'Beginning',
    position: 'top',
    href: '/skill/pronunciation/american-t/beginning',
    childCount: 1,
  },
  {
    id: 'middle',
    label: 'Middle',
    position: 'left',
    href: '/skill/pronunciation/american-t/middle',
    childCount: 3,
  },
  {
    id: 'ending',
    label: 'Ending',
    position: 'right',
    href: '/skill/pronunciation/american-t/ending',
    childCount: 2,
  },
];

const NODE_LESSONS: Record<HubNode['id'], ReadonlyArray<NodeLesson>> = {
  beginning: [{ title: 'Released /t/', href: '/skill/pronunciation/american-t/beginning/clear-t' }],
  middle: [
    { title: 'Flap T /?/', href: '/skill/pronunciation/american-t/middle/flap' },
    { title: 'Silent /t/ (Casual Speech)', href: '/skill/pronunciation/american-t/middle/silent-t' },
    { title: 'Glottal Stop /?/', href: '/skill/pronunciation/american-t/middle/glottal' },
  ],
  ending: [
    { title: 'Released /t/ Ending', href: '/skill/pronunciation/american-t/ending/clear-t-ending' },
    { title: 'Final T Before Consonant', href: '/skill/pronunciation/american-t/ending/final-t' },
  ],
};

export default function AmericanTHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<HubNode['id'] | null>(null);
  const [hubSvgGeometry, setHubSvgGeometry] = useState<HubSvgGeometry | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<HubNode['id'], HTMLButtonElement | null>>({
    beginning: null,
    middle: null,
    ending: null,
  });

  const getCircleGeometry = (element: HTMLElement, containerRect: DOMRect): CircleGeometry => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
      r: Math.min(rect.width, rect.height) / 2,
    };
  };

  const buildTouchedLine = (from: CircleGeometry, to: CircleGeometry): LineGeometry => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy) || 1;
    const ux = dx / distance;
    const uy = dy / distance;

    return {
      x1: from.x + ux * from.r,
      y1: from.y + uy * from.r,
      x2: to.x - ux * to.r,
      y2: to.y - uy * to.r,
    };
  };

  const recomputeHubLines = useCallback(() => {
    const canvas = canvasRef.current;
    const core = coreRef.current;
    const topNode = nodeRefs.current.beginning;
    const leftNode = nodeRefs.current.middle;
    const rightNode = nodeRefs.current.ending;

    if (!canvas || !core || !topNode || !leftNode || !rightNode) return;

    const canvasRect = canvas.getBoundingClientRect();
    const topCircle = getCircleGeometry(topNode, canvasRect);
    const leftCircle = getCircleGeometry(leftNode, canvasRect);
    const rightCircle = getCircleGeometry(rightNode, canvasRect);
    const coreCircle = getCircleGeometry(core, canvasRect);

    const lines = [
      buildTouchedLine(topCircle, leftCircle),
      buildTouchedLine(topCircle, rightCircle),
      buildTouchedLine(leftCircle, rightCircle),
      buildTouchedLine(topCircle, coreCircle),
      buildTouchedLine(leftCircle, coreCircle),
      buildTouchedLine(rightCircle, coreCircle),
    ];

    setHubSvgGeometry({
      width: canvasRect.width,
      height: canvasRect.height,
      lines,
    });
  }, []);

  useLayoutEffect(() => {
    recomputeHubLines();

    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        recomputeHubLines();
      });
      resizeObserver.observe(canvas);
    }

    const handleWindowResize = () => {
      recomputeHubLines();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
    };
  }, [recomputeHubLines]);

  useLayoutEffect(() => {
    recomputeHubLines();
  }, [activeNodeId, recomputeHubLines]);

  const toggleNodeCard = (nodeId: HubNode['id']) => {
    setActiveNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const getNodeCardWidthCh = (nodeId: HubNode['id']) =>
    Math.max(...NODE_LESSONS[nodeId].map((item) => item.title.length)) + 2;

  return (
    <div className="pronunciation-layout at-hub-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="at-hub-shell">
        <header className="at-hub-header">
          <h1 className="at-hub-title">American T</h1>
          <p className="at-hub-subtitle">
            Pilih area posisi huruf T: awal kata (Beginning), tengah kata (Middle), atau akhir
            kata/frasa (Ending).
          </p>
        </header>

        <section className="at-hub-canvas-wrap">
          <div className="at-hub-canvas" ref={canvasRef}>
            <svg
              className="at-hub-lines"
              viewBox={`0 0 ${hubSvgGeometry?.width ?? 1000} ${hubSvgGeometry?.height ?? 840}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {(hubSvgGeometry?.lines ?? []).map((line, index) => (
                <line
                  key={`hub-line-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                />
              ))}
            </svg>

            <div className="at-hub-core-node" ref={coreRef}>
              <strong>American /t/</strong>
            </div>

            {HUB_NODES.map((node) => (
              <div key={node.id}>
                <button
                  type="button"
                  ref={(element) => {
                    nodeRefs.current[node.id] = element;
                  }}
                  className={`at-hub-node at-hub-node--${node.position} ${
                    activeNodeId === node.id ? 'is-active' : ''
                  }`}
                  onClick={() => toggleNodeCard(node.id)}
                  aria-expanded={activeNodeId === node.id}
                >
                  <span className="at-hub-node-label">{node.label}</span>
                </button>

                {activeNodeId === node.id ? (
                  <article
                    className={`at-hub-node-detail at-hub-node-detail--${node.position === 'top' ? 'top' : 'bottom'} at-hub-node-detail--${node.position}`}
                    style={
                      {
                        '--at-node-card-width': `${getNodeCardWidthCh(node.id)}ch`,
                      } as CSSProperties
                    }
                  >
                    <div className="at-hub-node-lesson-list">
                      {NODE_LESSONS[node.id].map((lesson) => (
                        <Link prefetch={false} key={lesson.href} href={lesson.href} className="at-hub-node-lesson-card">
                          {lesson.title}
                        </Link>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

