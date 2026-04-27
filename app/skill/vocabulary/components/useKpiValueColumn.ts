'use client';

import { useEffect, type RefObject } from 'react';

type Options = {
  cssVarName?: string;
};

function computeMaxWidthPx(elements: HTMLElement[]) {
  let maxWidth = 0;
  for (const element of elements) {
    const width = Math.ceil(element.getBoundingClientRect().width);
    if (width > maxWidth) maxWidth = width;
  }
  return maxWidth;
}

export function useKpiValueColumn(
  ref: RefObject<HTMLElement | null>,
  options: Options = {},
) {
  const cssVarName = options.cssVarName ?? '--vocab-kpi-value-col';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = ref.current;
    if (!container) return;

    const update = () => {
      const ddNodes = Array.from(container.querySelectorAll('dd')) as HTMLElement[];
      if (!ddNodes.length) return;

      const valueNodes = ddNodes
        .map((dd) => dd.querySelector('.vocab-kpi-value') as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];
      if (!valueNodes.length) return;

      const maxValueWidth = computeMaxWidthPx(valueNodes);
      if (!maxValueWidth) return;

      const sampleDd = ddNodes[0]!;
      const style = window.getComputedStyle(sampleDd);
      const paddingLeft = parseFloat(style.paddingLeft || '0') || 0;
      const paddingRight = parseFloat(style.paddingRight || '0') || 0;
      const extra = Math.ceil(paddingLeft + paddingRight);
      container.style.setProperty(cssVarName, `${maxValueWidth + extra}px`);
    };

    update();

    const initialDdNodes = Array.from(container.querySelectorAll('dd')) as HTMLElement[];
    const initialValueNodes = initialDdNodes
      .map((dd) => dd.querySelector('.vocab-kpi-value') as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => update());
      resizeObserver.observe(container);
      for (const dd of initialDdNodes) resizeObserver.observe(dd);
      for (const value of initialValueNodes) resizeObserver.observe(value);
    }

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
    };
  }, [cssVarName, ref]);
}
