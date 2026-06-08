// Types for Common Letters data

export interface CommonLetter {
  letter: string;
  ipaSymbol: string;
  description: string;
  examples: string[];
  category: 'vowel_lax' | 'vowel_tense' | 'diphthong' | 'consonant_voiceless' | 'consonant_voiced';
  pronunciationTip: string;
  traps?: string[];
}

export interface CommonLettersCategory {
  category: string;
  letters: CommonLetter[];
}
