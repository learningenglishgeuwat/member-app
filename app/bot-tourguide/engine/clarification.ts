import type { ClarificationPrompt, ParsedQuery } from '../types';

type BuildClarificationInput = {
  parsed: ParsedQuery;
  candidateTitles?: string[];
};

const dedupeOptions = (values: string[]): string[] =>
  values.filter((value, index, array) => value && array.indexOf(value) === index).slice(0, 3);

export const buildClarificationPrompt = (
  input: BuildClarificationInput,
): ClarificationPrompt => {
  const candidates = dedupeOptions(input.candidateTitles ?? []);

  if (candidates.length >= 2) {
    return {
      question: 'Maksudmu topik yang mana?',
      options: candidates,
    };
  }

  if (input.parsed.intent === 'comparison') {
    return {
      question: 'Kamu mau membandingkan dua topik apa?',
      options: ['Flap T vs Glottal', 'Final sound S/ES vs D/ED', 'Pronunciation vs Grammar'],
    };
  }

  if (input.parsed.intent === 'example_request') {
    return {
      question: 'Kamu mau contoh bagian mana dulu?',
      options: ['Contoh kalimat', 'Contoh dialog', 'Contoh kata dan pengucapan'],
    };
  }

  return {
    question: 'Biar jawabannya tepat, kamu mau fokus ke area mana?',
    options: ['Pronunciation', 'Grammar', 'Vocabulary'],
  };
};
