import React from 'react';

export function renderGeneralIpaWithTHighlight(ipa: string) {
  const chunks = ipa.split(/(t̚|t)/g);

  return chunks.map((chunk, idx) => {
    if (chunk === 't' || chunk === 't̚') {
      return (
        <span key={`${ipa}-t-${idx}`} className="at-ipa-t">
          {chunk}
        </span>
      );
    }

    return <span key={`${ipa}-plain-${idx}`}>{chunk}</span>;
  });
}

export function renderAmericanTTextHighlight(text: string) {
  const chunks = text.split(/(t)/gi);

  return chunks.map((chunk, idx) => {
    if (chunk.toLowerCase() === 't') {
      // Check if this 't' is followed by 'h' (part of the 'th' digraph representing /ð/ or /θ/)
      const nextChunk = chunks[idx + 1];
      if (nextChunk && nextChunk.toLowerCase().startsWith('h')) {
        return <span key={`${text}-plain-${idx}`}>{chunk}</span>;
      }
      return (
        <span key={`${text}-t-${idx}`} className="at-text-t">
          {chunk}
        </span>
      );
    }

    return <span key={`${text}-plain-${idx}`}>{chunk}</span>;
  });
}

function escapeRegexForIpaHighlight(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function renderAmericanTIpaSymbolHighlight(
  ipa: string,
  symbols: ReadonlyArray<string>,
) {
  const safeSymbols = symbols
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((symbol) => escapeRegexForIpaHighlight(symbol));

  if (!safeSymbols.length) return ipa;

  const regex = new RegExp(`(${safeSymbols.join('|')})`, 'g');
  const chunks = ipa.split(regex);

  return chunks.map((chunk, idx) => {
    if (symbols.includes(chunk)) {
      return (
        <span key={`${ipa}-symbol-${idx}`} className="at-ipa-t">
          {chunk}
        </span>
      );
    }

    return <span key={`${ipa}-plain-${idx}`}>{chunk}</span>;
  });
}

export function extractFocusPhrase(note: string) {
  const prefix = 'Fokus pada:';
  if (!note.startsWith(prefix)) return '';
  return note.slice(prefix.length).trim();
}

function escapeRegexForHighlight(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function renderSentenceWithFocusHighlight(sentence: string, focusPhrase: string) {
  if (!focusPhrase) return sentence;

  const regex = new RegExp(`(${escapeRegexForHighlight(focusPhrase)})`, 'ig');
  const parts = sentence.split(regex);

  return parts.map((part, idx) => {
    if (part.toLowerCase() === focusPhrase.toLowerCase()) {
      return (
        <mark key={`${sentence}-focus-${idx}`} className="at-final-t-highlight">
          {part}
        </mark>
      );
    }

    return <span key={`${sentence}-text-${idx}`}>{part}</span>;
  });
}

export function renderSentenceWithHighlights(text: string, focusWords: ReadonlyArray<string>) {
  if (!focusWords.length) return <>{text}</>;

  const uniqueWords = Array.from(new Set(focusWords.map((word) => word.trim()).filter(Boolean)));
  if (!uniqueWords.length) return <>{text}</>;

  const pattern = uniqueWords
    .sort((a, b) => b.length - a.length)
    .map((word) => escapeRegexForHighlight(word))
    .join('|');

  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const matched = uniqueWords.some((word) => word.toLowerCase() === part.toLowerCase());
        if (matched) {
          return (
            <span key={`${text}-match-${index}`} className="at-final-t-word-match">
              {renderAmericanTTextHighlight(part)}
            </span>
          );
        }
        return <span key={`${text}-plain-${index}`}>{part}</span>;
      })}
    </>
  );
}

