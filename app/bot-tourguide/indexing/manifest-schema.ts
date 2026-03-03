import type { GuideScope } from '../types';

export type TourGuideManifestQaSection = {
  label: string;
  anchor?: string;
  route?: string;
};

export type TourGuideManifestQaEntry = {
  topicId: string;
  title: string;
  route: string;
  keywords: string[];
  shortAnswer: string;
  sourceSections: TourGuideManifestQaSection[];
};

export type TourGuideManifestSimulation = {
  topicId: string;
  title: string;
  commandTriggers: string[];
  componentKey: string;
  route?: string;
};

export type TourGuideManifest = {
  route: string;
  label?: string;
  scope?: GuideScope;
  keywords?: string[];
  simulation?: TourGuideManifestSimulation;
  qa?: TourGuideManifestQaEntry[];
};

export const GUIDE_SCOPES: GuideScope[] = [
  'dashboard',
  'skill',
  'pronunciation',
  'grammar',
  'grammar-resource',
  'game-links',
  'general',
];

export const isGuideScope = (value: unknown): value is GuideScope =>
  typeof value === 'string' && GUIDE_SCOPES.includes(value as GuideScope);
