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
