import type { ConversationState } from '../types';

const MEMORY_KEY = 'tourguide_ai_like_session_v1';

const isValidConversationState = (value: unknown): value is ConversationState => {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ConversationState>;
  return typeof state.updatedAt === 'number';
};

export const loadConversationState = (): ConversationState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(MEMORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidConversationState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveConversationState = (state: ConversationState): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(state));
  } catch {
    // ignore storage write failure
  }
};
