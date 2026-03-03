type GuideTelemetryEvent = {
  query: string;
  mode: string;
  confidence?: number;
  fallback?: boolean;
  wordIntent?: boolean;
  wordFound?: boolean;
  wordSourceType?: 'vocabulary' | 'qa-term' | 'route-term' | 'pronunciation-term' | 'grammar-term';
  timestamp: number;
};

const TELEMETRY_KEY = 'tourguide_ai_like_telemetry_v1';
const MAX_TELEMETRY = 200;

export const trackGuideTelemetry = (event: Omit<GuideTelemetryEvent, 'timestamp'>): void => {
  if (typeof window === 'undefined') return;

  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    const events = raw ? (JSON.parse(raw) as GuideTelemetryEvent[]) : [];
    const nextEvents = [...events.slice(-(MAX_TELEMETRY - 1)), { ...event, timestamp: Date.now() }];
    window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify(nextEvents));
  } catch {
    // ignore telemetry write failure
  }
};
