'use client';

import { useEffect } from 'react';

const TOUR_GUIDE_STYLES_ID = 'geuwat-tour-guide-styles';
const TOUR_GUIDE_STYLES_HREF = '/styles/tourGuide.css';

export function useTourGuideStyles(active = true) {
  useEffect(() => {
    if (!active) return;
    if (document.getElementById(TOUR_GUIDE_STYLES_ID)) return;

    const link = document.createElement('link');
    link.id = TOUR_GUIDE_STYLES_ID;
    link.rel = 'stylesheet';
    link.href = TOUR_GUIDE_STYLES_HREF;
    document.head.appendChild(link);
  }, [active]);
}
