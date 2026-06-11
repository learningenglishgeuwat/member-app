import React from 'react';
import { WORD_HIGHLIGHT_OVERRIDES } from '../../data/wordHighlights';
import { BRITISH_NOTE_COUNTERPARTS } from '../data/symbolLookups';
import type { CSSProperties } from 'react';

export const isIndexBasedOverride = (patterns: string[]): boolean =>
  patterns.length > 0 && patterns.every((pattern) => /^\d+$/.test(pattern));

export const renderIndexBasedWord = (
  word: string,
  patterns: string[],
  highlightLetterStyle: CSSProperties,
) => {
  const targetIndices = new Set(patterns.map(Number));

  return (
    <>
      {word.split('').map((char, index) =>
        targetIndices.has(index) ? (
          <span key={index} className="symbol-letter-highlight" style={highlightLetterStyle}>
            {char}
          </span>
        ) : (
          <React.Fragment key={index}>{char}</React.Fragment>
        ),
      )}
    </>
  );
};

export const renderHighlightedWord = (
  word: string,
  patterns: string[],
  decodedSymbol: string,
  highlightLetterStyle: CSSProperties,
) => {
  if (patterns.length === 0) return word;
  if (isIndexBasedOverride(patterns)) return renderIndexBasedWord(word, patterns, highlightLetterStyle);

  const sortedPatterns = [...patterns].sort((a, b) => b.length - a.length);
  const escapedPatterns = sortedPatterns.map((pattern) =>
    pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/_/g, '.'),
  );
  const regex = new RegExp(`(${escapedPatterns.join('|')})`, 'ig');

  const parts = word.split(regex);
  let matchedCount = 0;
  const lowerWord = word.toLowerCase();
  const onlyFirstOnionMatch = decodedSymbol === 'ʌ' && lowerWord === 'onion';
  const onlyFirstMessageMatch = decodedSymbol === 'ɛ' && lowerWord === 'message';
  const bananaOneThreeMatch = decodedSymbol === 'ə' && lowerWord === 'banana';
  const animalSecondMatch = decodedSymbol === 'ə' && lowerWord === 'animal';
  const attackSecondMatch = decodedSymbol === 'æ' && lowerWord === 'attack';
  const alarmSecondMatch = decodedSymbol === 'ɑ' && lowerWord === 'alarm';
  const tomorrowSchwaMatch = decodedSymbol === 'ə' && lowerWord === 'tomorrow';
  const tomorrowAlphaMatch = decodedSymbol === 'ɑ' && lowerWord === 'tomorrow';
  const peopleSchwaMatch = decodedSymbol === 'ə' && lowerWord === 'people';
  const presentSchwaMatch = decodedSymbol === 'ə' && lowerWord === 'present';
  const presentLaxMatch = decodedSymbol === 'ɛ' && lowerWord === 'present';
  const welcomeLaxMatch = decodedSymbol === 'ɛ' && lowerWord === 'welcome';

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const shouldHighlight = (attackSecondMatch || alarmSecondMatch || peopleSchwaMatch || presentSchwaMatch)
            ? matchedCount === 1
            : animalSecondMatch
              ? matchedCount === 1 || matchedCount === 2
              : bananaOneThreeMatch
                ? matchedCount === 0 || matchedCount === 2
                : onlyFirstOnionMatch || onlyFirstMessageMatch || tomorrowSchwaMatch || presentLaxMatch || welcomeLaxMatch
                  ? matchedCount === 0
                  : tomorrowAlphaMatch
                    ? matchedCount === 1
                    : true;
          matchedCount += 1;
          if (shouldHighlight) {
            return (
              <span key={index} className="symbol-letter-highlight" style={highlightLetterStyle}>
                {part}
              </span>
            );
          }
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const renderWord = (
  word: string,
  showHighlight: boolean,
  decodedSymbol: string,
  highlightLetterStyle: CSSProperties,
) => {
  if (!showHighlight) return word;

  const lowerWord = word.toLowerCase();
  const lookupSymbol = decodedSymbol.trim() === 'ʤ'
    ? 'dʒ'
    : decodedSymbol.trim() === 'ʧ'
      ? 'tʃ'
      : decodedSymbol;
  const symbolOverrides = WORD_HIGHLIGHT_OVERRIDES[lookupSymbol];
  const patterns = (symbolOverrides && symbolOverrides[lowerWord])
    ? symbolOverrides[lowerWord]
    : [];

  return renderHighlightedWord(word, patterns, decodedSymbol, highlightLetterStyle);
};

export const renderBritishNoteWord = (
  word: string,
  showHighlight: boolean,
  decodedSymbol: string,
  highlightLetterStyle: CSSProperties,
) => {
  if (!showHighlight) return word;

  const lowerWord = word.toLowerCase();
  const lookupSymbol = decodedSymbol.trim() === 'ʤ'
    ? 'dʒ'
    : decodedSymbol.trim() === 'ʧ'
      ? 'tʃ'
      : decodedSymbol;
  const symbolOverrides = WORD_HIGHLIGHT_OVERRIDES[lookupSymbol];
  const patterns = (symbolOverrides && symbolOverrides[lowerWord])
    ? symbolOverrides[lowerWord]
    : [];

  return renderHighlightedWord(word, patterns, decodedSymbol, highlightLetterStyle);
};

export const renderIpa = (
  ipa: string | undefined,
  showHighlight: boolean,
  symbolAliasCandidates: string[],
  decodedSymbol: string,
  highlightLetterStyle: CSSProperties,
  isBritishNoteOrAlternative = false,
) => {
  if (!ipa) return '';
  if (!showHighlight || symbolAliasCandidates.length === 0) return ipa;

  const allowedSymbols = isBritishNoteOrAlternative
    ? [...symbolAliasCandidates, ...(BRITISH_NOTE_COUNTERPARTS[decodedSymbol] ?? [])]
    : symbolAliasCandidates;

  const escapedSymbols = allowedSymbols
    .map((symbol) => symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean);
  const regex = new RegExp(`(${escapedSymbols.join('|')})`, 'g');

  if (regex.test(ipa)) {
    const parts = ipa.split(regex);
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <span key={index} className="symbol-letter-highlight" style={highlightLetterStyle}>
                {part}
              </span>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  }

  return ipa;
};
