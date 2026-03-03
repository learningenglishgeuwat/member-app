export type HubNodePosition = 'top' | 'left' | 'right';

export type HubNode = {
  id: 'beginning' | 'middle' | 'ending';
  label: string;
  position: HubNodePosition;
  href: string;
  childCount: number;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type GroupCardItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type WordExample = {
  word: string;
  ipa: string;
  spoken?: string;
  note: string;
};

export type PhraseExample = {
  phrase: string;
  ipa: string;
  spoken: string;
  note: string;
};

export type SentenceNoteItem = {
  text: string;
  ipa?: string;
  note: string;
};

export type ClearTExample = {
  text: string;
  ipa: string;
  note: string;
  ttsText?: string;
};
