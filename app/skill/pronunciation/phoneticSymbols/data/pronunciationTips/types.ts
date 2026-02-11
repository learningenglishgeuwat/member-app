// Pronunciation tips shared types

export interface PronunciationTip {
  tip: string;
  category: 'mouth' | 'tongue' | 'lips' | 'airflow' | 'voice' | 'general';
}

export interface SymbolPronunciationTips {
  [key: string]: PronunciationTip[];
}
