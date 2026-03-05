'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import '../final-sound-new/final-sound-topic.css';
import './intonation.css';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../final-sound-new/tts-utils';
import {
  BASIC_INTONATION_PATTERNS,
  COMMON_MISTAKES,
  DIALOGUE_DRILLS,
  EMPHASIS_FEELING_EXAMPLES,
  INTONATION_CONCEPT_PARAGRAPHS,
  INTONATION_SECTION_LEARNING_GUIDES,
  LIST_CONTINUATION_EXAMPLES,
  STATEMENT_QUESTION_PAIRS,
} from './data/intonationData';
import { runIntonationQualityGate } from './data/quality';
import type {
  IntonationAudioSectionKey,
  IntonationDrillSentence,
  IntonationEmotionExample,
  IntonationExample,
  IntonationLearningGuide,
  IntonationListExample,
  IntonationPairExample,
  IntonationSectionKey,
} from './data/types';
import {
  createIntonationTtsPlayer,
  type IntonationPlaybackState,
} from './intonation-tts';

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

const DEFAULT_OPEN_STATE: Record<IntonationSectionKey, boolean> = {
  concept: false,
  patterns: false,
  statementsQuestions: false,
  listContinuation: false,
  emphasisFeeling: false,
  dialogueDrills: false,
  commonMistakes: false,
  practiceChecklist: false,
};

const DEFAULT_PLAYBACK_STATE: IntonationPlaybackState = {
  isPlaying: false,
  mode: null,
  status: 'idle',
  activeIndex: null,
  currentText: null,
  countdown: null,
};

const AUDIO_SENTENCES: Record<IntonationAudioSectionKey, string[]> = {
  patterns: BASIC_INTONATION_PATTERNS.map((item) => item.ttsText ?? item.sentence),
  statementsQuestions: STATEMENT_QUESTION_PAIRS.flatMap((item) => [
    item.statementTts ?? item.statement,
    item.questionTts ?? item.question,
  ]),
  listContinuation: LIST_CONTINUATION_EXAMPLES.map((item) => item.ttsText ?? item.sentence),
  emphasisFeeling: EMPHASIS_FEELING_EXAMPLES.map((item) => item.ttsText ?? item.sentence),
  dialogueDrills: DIALOGUE_DRILLS.map((item) => item.ttsText ?? item.sentence),
};

const AUDIO_ITEM_IDS: Record<IntonationAudioSectionKey, string[]> = {
  patterns: BASIC_INTONATION_PATTERNS.map((item) => item.id),
  statementsQuestions: STATEMENT_QUESTION_PAIRS.flatMap((item) => [item.id, item.id]),
  listContinuation: LIST_CONTINUATION_EXAMPLES.map((item) => item.id),
  emphasisFeeling: EMPHASIS_FEELING_EXAMPLES.map((item) => item.id),
  dialogueDrills: DIALOGUE_DRILLS.map((item) => item.id),
};

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const INTONATION_COMMON_MISTAKES_OPEN_KEY = 'intonation-common-mistakes-open-v1';
const INTONATION_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama arah nada (rising/falling/fall-rise), penekanan kata penting, dan naturalitas intonation dalam konteks kalimat. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kalimat/frasa yang diucapkan. - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian intonation mana yang perlu diperbaiki.";

function createAudioCardKey(section: IntonationAudioSectionKey, itemId: string): string {
  return `${section}-${itemId}`;
}

function normalizeText(value: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

type ToneDirection = 'rise' | 'fall';
type ToneMode = 'rising' | 'falling' | 'fall-rise' | 'continuation';

function normalizeWordToken(token: string): string {
  return token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
}

function getLastLexicalIndex(tokens: string[]): number {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (normalizeWordToken(tokens[index])) return index;
  }
  return tokens.length - 1;
}

function findPreviousLexicalIndex(tokens: string[], fromIndex: number): number {
  for (let index = fromIndex; index >= 0; index -= 1) {
    if (normalizeWordToken(tokens[index])) return index;
  }
  return Math.max(fromIndex, 0);
}

function getToneModeFromPattern(pattern: string): ToneMode | null {
  const normalized = pattern.toLowerCase();
  if (normalized.includes('fall-rise')) return 'fall-rise';
  if (normalized.includes('rising')) return 'rising';
  if (normalized.includes('falling')) return 'falling';
  return null;
}


function getToneModeFromContour(contour: string): ToneMode | null {
  const normalized = contour.toLowerCase();
  if (normalized.includes('fall-rise')) return 'fall-rise';
  if (normalized.includes('continuation')) return 'continuation';
  if (normalized.includes('rising') || normalized.includes('naik')) return 'rising';
  if (normalized.includes('falling') || normalized.includes('turun')) return 'falling';
  return null;
}

function getToneModeFromTargetPattern(targetPattern: string): ToneMode | null {
  const normalized = targetPattern.toLowerCase();
  if (normalized.includes('continuation')) return 'continuation';
  if (normalized.includes('rise')) return 'rising';
  if (normalized.includes('fall')) return 'falling';
  return null;
}

function formatChunkedTone(chunked: string): string {
  return chunked
    .replace(/\s*\/\s*/g, ' ↗ ')
    .replace(/\s*\\\s*/g, ' ↘ ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getToneIndices(tokens: string[], mode: ToneMode | null): Map<number, ToneDirection> {
  const map = new Map<number, ToneDirection>();
  if (!mode || tokens.length === 0) return map;

  const lastIndex = getLastLexicalIndex(tokens);

  if (mode === 'rising') {
    map.set(lastIndex, 'rise');
    return map;
  }

  if (mode === 'falling') {
    map.set(lastIndex, 'fall');
    return map;
  }

  if (mode === 'fall-rise') {
    const commaTokenIndex = tokens.findIndex((token) => token.includes(','));
    const fallIndex =
      commaTokenIndex > 0
        ? findPreviousLexicalIndex(tokens, commaTokenIndex)
        : findPreviousLexicalIndex(tokens, lastIndex - 1);

    map.set(fallIndex, 'fall');
    map.set(lastIndex, 'rise');
    return map;
  }

  if (mode === 'continuation') {
    tokens.forEach((token, index) => {
      if (token.includes(',')) {
        map.set(index, 'rise');
      }
    });
    map.set(lastIndex, 'fall');
  }

  return map;
}

function ToneSentence({ sentence, mode }: { sentence: string; mode: ToneMode | null }) {
  const tokens = sentence.split(/\s+/).filter(Boolean);
  const toneMap = getToneIndices(tokens, mode);

  return (
    <span className="intonation-example-highlight">
      {tokens.map((token, index) => {
        const direction = toneMap.get(index);
        const className =
          direction === 'rise'
            ? 'intonation-tone-word is-rise'
            : direction === 'fall'
              ? 'intonation-tone-word is-fall'
              : 'intonation-tone-word';

        return (
          <span key={`${token}-${index}`} className={className}>
            {token}
            {index < tokens.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}

function LearningGuideBlock({ guide }: { guide: IntonationLearningGuide }) {
  return (
    <div className="intonation-guide-grid">
      <article className="intonation-guide-card">
        <h4>Apa ini?</h4>
        <p>{guide.apaIni}</p>
      </article>
      <article className="intonation-guide-card">
        <h4>Kapan dipakai?</h4>
        <p>{guide.kapanDipakai}</p>
      </article>
      <article className="intonation-guide-card">
        <h4>Cara dengar</h4>
        <p>{guide.caraDengar}</p>
      </article>
      <article className="intonation-guide-card">
        <h4>Cara ucap</h4>
        <p>{guide.caraUcap}</p>
      </article>
      <article className="intonation-guide-card is-warning">
        <h4>Kesalahan umum penutur Indonesia</h4>
        <p>{guide.indoPitfall}</p>
      </article>
      <article className="intonation-guide-card is-practice">
        <h4>Latihan mandiri 3 tahap</h4>
        <ol>
          {guide.latihan3Tahap.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>
    </div>
  );
}

function SectionAudioControls({
  section,
  activeSection,
  playback,
  onPlayAll,
  onStop,
}: {
  section: IntonationAudioSectionKey;
  activeSection: IntonationAudioSectionKey | null;
  playback: IntonationPlaybackState;
  onPlayAll: (section: IntonationAudioSectionKey) => void;
  onStop: () => void;
}) {
  const isActive = activeSection === section && playback.isPlaying;

  return (
    <div className="intonation-audio-wrap">
      <div className="intonation-audio-controls">
        <button
          type="button"
          className="intonation-audio-btn"
          onClick={() => {
            if (isActive) {
              onStop();
              return;
            }
            onPlayAll(section);
          }}
          aria-label="Play all model"
        >
          {isActive ? 'Stop' : 'Play All'}
        </button>
      </div>
    </div>
  );
}

function PatternGrid({
  items,
  activeCardKey,
  onSpeak,
}: {
  items: ReadonlyArray<IntonationExample>;
  activeCardKey: string | null;
  onSpeak: (text: string, cardKey: string) => void;
}) {
  return (
    <div className="intonation-grid two-col">
      {items.map((item) => {
        const cardKey = createAudioCardKey('patterns', item.id);
        const speaking = activeCardKey === cardKey;

        return (
          <article
            key={item.id}
            className={`intonation-card ${speaking ? 'is-speaking' : ''}`}
            data-intonation-card-key={cardKey}
          >
            <div className="intonation-card-head">
              <h3>{item.pattern}</h3>
              <button
                type="button"
                className="fs-topic-mini-btn intonation-play-chip-btn"
                aria-label={`Putar ${item.sentence}`}
                title="Putar"
                onClick={() => onSpeak(item.ttsText ?? item.sentence, cardKey)}
              >
                <span className="intonation-play-chip-icon" aria-hidden="true" />
                <span className="intonation-visually-hidden">Putar</span>
              </button>
            </div>
            <div className="intonation-detail-cards">
              <p className="intonation-line intonation-detail-card">
                <strong>Sentence:</strong>{' '}
                <ToneSentence sentence={item.sentence} mode={getToneModeFromPattern(item.pattern)} />
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Meaning (ID):</strong> {item.translationId}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Contour:</strong> {item.contour}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Kapan dipakai:</strong> {item.whenToUse}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara dengar:</strong> {item.listeningCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara ucap:</strong> {item.speakingCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pitfall ID:</strong> {item.indoPitfall}
              </p>
              <p className="intonation-note intonation-detail-card intonation-detail-card-note">{item.note}</p>
              <p className="intonation-self-check intonation-detail-card intonation-detail-card-self-check">
                Self-check: {item.selfCheck}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PairGrid({
  items,
  activeCardKey,
  onSpeak,
}: {
  items: ReadonlyArray<IntonationPairExample>;
  activeCardKey: string | null;
  onSpeak: (text: string, cardKey: string) => void;
}) {
  return (
    <div className="intonation-grid two-col">
      {items.map((item) => {
        const cardKey = createAudioCardKey('statementsQuestions', item.id);
        const speaking = activeCardKey === cardKey;

        return (
          <article
            key={item.id}
            className={`intonation-card ${speaking ? 'is-speaking' : ''}`}
            data-intonation-card-key={cardKey}
          >
            <h3>{item.prompt}</h3>
            <div className="intonation-detail-cards">
              <div className="intonation-pair-row intonation-detail-card intonation-pair-detail-card">
                <p className="intonation-line">
                  <strong>Statement:</strong>{' '}
                  <ToneSentence sentence={item.statement} mode="falling" />
                </p>
                <button
                  type="button"
                  className="fs-topic-mini-btn intonation-play-chip-btn"
                  aria-label={`Putar ${item.statement}`}
                  title="Putar"
                  onClick={() => onSpeak(item.statementTts ?? item.statement, cardKey)}
                >
                  <span className="intonation-play-chip-icon" aria-hidden="true" />
                  <span className="intonation-visually-hidden">Putar</span>
                </button>
              </div>
              <div className="intonation-pair-row intonation-detail-card intonation-pair-detail-card">
                <p className="intonation-line">
                  <strong>Question:</strong>{' '}
                  <ToneSentence sentence={item.question} mode="rising" />
                </p>
                <button
                  type="button"
                  className="fs-topic-mini-btn intonation-play-chip-btn"
                  aria-label={`Putar ${item.question}`}
                  title="Putar"
                  onClick={() => onSpeak(item.questionTts ?? item.question, cardKey)}
                >
                  <span className="intonation-play-chip-icon" aria-hidden="true" />
                  <span className="intonation-visually-hidden">Putar</span>
                </button>
              </div>
              <p className="intonation-line intonation-detail-card">
                <strong>Meaning (ID):</strong> {item.translationId}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Kapan dipakai:</strong> {item.whenToUse}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara dengar:</strong> {item.listeningCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara ucap:</strong> {item.speakingCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pitfall ID:</strong> {item.indoPitfall}
              </p>
              <p className="intonation-note intonation-detail-card intonation-detail-card-note">{item.note}</p>
              <p className="intonation-self-check intonation-detail-card intonation-detail-card-self-check">
                Self-check: {item.selfCheck}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ListToneGrid({
  items,
  activeCardKey,
  onSpeak,
}: {
  items: ReadonlyArray<IntonationListExample>;
  activeCardKey: string | null;
  onSpeak: (text: string, cardKey: string) => void;
}) {
  return (
    <div className="intonation-grid two-col">
      {items.map((item) => {
        const cardKey = createAudioCardKey('listContinuation', item.id);
        const speaking = activeCardKey === cardKey;

        return (
          <article
            key={item.id}
            className={`intonation-card ${speaking ? 'is-speaking' : ''}`}
            data-intonation-card-key={cardKey}
          >
            <div className="intonation-card-head">
              <h3>List Practice</h3>
              <button
                type="button"
                className="fs-topic-mini-btn intonation-play-chip-btn"
                aria-label={`Putar ${item.sentence}`}
                title="Putar"
                onClick={() => onSpeak(item.ttsText ?? item.sentence, cardKey)}
              >
                <span className="intonation-play-chip-icon" aria-hidden="true" />
                <span className="intonation-visually-hidden">Putar</span>
              </button>
            </div>
            <div className="intonation-detail-cards">
              <p className="intonation-line intonation-detail-card">
                <strong>Sentence:</strong>{' '}
                <ToneSentence sentence={item.sentence} mode="continuation" />
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Meaning (ID):</strong> {item.translationId}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pemenggalan nada:</strong> {formatChunkedTone(item.chunked)}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Kapan dipakai:</strong> {item.whenToUse}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara dengar:</strong> {item.listeningCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara ucap:</strong> {item.speakingCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pitfall ID:</strong> {item.indoPitfall}
              </p>
              <p className="intonation-note intonation-detail-card intonation-detail-card-note">{item.note}</p>
              <p className="intonation-self-check intonation-detail-card intonation-detail-card-self-check">
                Self-check: {item.selfCheck}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EmotionGrid({
  items,
  activeCardKey,
  onSpeak,
}: {
  items: ReadonlyArray<IntonationEmotionExample>;
  activeCardKey: string | null;
  onSpeak: (text: string, cardKey: string) => void;
}) {
  return (
    <div className="intonation-grid two-col">
      {items.map((item) => {
        const cardKey = createAudioCardKey('emphasisFeeling', item.id);
        const speaking = activeCardKey === cardKey;

        return (
          <article
            key={item.id}
            className={`intonation-card ${speaking ? 'is-speaking' : ''}`}
            data-intonation-card-key={cardKey}
          >
            <div className="intonation-card-head">
              <h3>{item.intent}</h3>
              <button
                type="button"
                className="fs-topic-mini-btn intonation-play-chip-btn"
                aria-label={`Putar ${item.sentence}`}
                title="Putar"
                onClick={() => onSpeak(item.ttsText ?? item.sentence, cardKey)}
              >
                <span className="intonation-play-chip-icon" aria-hidden="true" />
                <span className="intonation-visually-hidden">Putar</span>
              </button>
            </div>
            <div className="intonation-detail-cards">
              <p className="intonation-line intonation-detail-card">
                <strong>Sentence:</strong>{' '}
                <ToneSentence sentence={item.sentence} mode={getToneModeFromContour(item.contour)} />
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Meaning (ID):</strong> {item.translationId}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Contour:</strong> {item.contour}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Kapan dipakai:</strong> {item.whenToUse}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara dengar:</strong> {item.listeningCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara ucap:</strong> {item.speakingCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pitfall ID:</strong> {item.indoPitfall}
              </p>
              <p className="intonation-note intonation-detail-card intonation-detail-card-note">{item.note}</p>
              <p className="intonation-self-check intonation-detail-card intonation-detail-card-self-check">
                Self-check: {item.selfCheck}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DialogueGrid({
  items,
  activeCardKey,
  onSpeak,
}: {
  items: ReadonlyArray<IntonationDrillSentence>;
  activeCardKey: string | null;
  onSpeak: (text: string, cardKey: string) => void;
}) {
  const fullDialogueTts = items.map((item) => item.ttsText ?? item.sentence).join(' ');
  const fullDialogueLines = items.map((item) => `Speaker ${item.speaker}: ${item.sentence}`);
  const anchorSentence = 'Got it, I will prepare all three.';
  const anchorIndex = items.findIndex(
    (item) => normalizeText(item.sentence) === normalizeText(anchorSentence),
  );
  const fallbackIndex = items.reduce((lastIndex, item, index) => {
    if (item.speaker === 'B' && item.targetPattern.toLowerCase().includes('falling')) {
      return index;
    }
    return lastIndex;
  }, -1);
  const insertAfterIndex = anchorIndex >= 0 ? anchorIndex : fallbackIndex;

  return (
    <div className="intonation-grid two-col">
      {items.flatMap((item, index) => {
        const cardKey = createAudioCardKey('dialogueDrills', item.id);
        const speaking = activeCardKey === cardKey;
        const cards: JSX.Element[] = [
          <article
            key={item.id}
            className={`intonation-card ${speaking ? 'is-speaking' : ''}`}
            data-intonation-card-key={cardKey}
          >
            <div className="intonation-card-head">
              <h3>
                Speaker {item.speaker} - {item.targetPattern}
              </h3>
              <button
                type="button"
                className="fs-topic-mini-btn intonation-play-chip-btn"
                aria-label={`Putar ${item.sentence}`}
                title="Putar"
                onClick={() => onSpeak(item.ttsText ?? item.sentence, cardKey)}
              >
                <span className="intonation-play-chip-icon" aria-hidden="true" />
                <span className="intonation-visually-hidden">Putar</span>
              </button>
            </div>
            <div className="intonation-detail-cards">
              <p className="intonation-line intonation-detail-card">
                <strong>Sentence:</strong>{' '}
                <ToneSentence sentence={item.sentence} mode={getToneModeFromTargetPattern(item.targetPattern)} />
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Meaning (ID):</strong> {item.translationId}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Kapan dipakai:</strong> {item.whenToUse}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara dengar:</strong> {item.listeningCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Cara ucap:</strong> {item.speakingCue}
              </p>
              <p className="intonation-line intonation-detail-card">
                <strong>Pitfall ID:</strong> {item.indoPitfall}
              </p>
              <p className="intonation-note intonation-detail-card intonation-detail-card-note">{item.note}</p>
              <p className="intonation-self-check intonation-detail-card intonation-detail-card-self-check">
                Self-check: {item.selfCheck}
              </p>
            </div>
          </article>,
        ];

        if (index === insertAfterIndex) {
          const fullCardKey = createAudioCardKey('dialogueDrills', 'full');
          cards.push(
            <article
              key="dialogue-full-example"
              className={`intonation-card ${activeCardKey === fullCardKey ? 'is-speaking' : ''}`}
              data-intonation-card-key={fullCardKey}
            >
              <div className="intonation-card-head">
                <h3>Dialogue Example (Full)</h3>
                <button
                  type="button"
                  className="fs-topic-mini-btn intonation-play-chip-btn"
                  aria-label="Putar dialog penuh"
                  title="Putar"
                  onClick={() => onSpeak(fullDialogueTts, fullCardKey)}
                >
                  <span className="intonation-play-chip-icon" aria-hidden="true" />
                  <span className="intonation-visually-hidden">Putar</span>
                </button>
              </div>
              <div className="intonation-dialogue-sample">
                {fullDialogueLines.map((line, lineIndex) => (
                  <p key={`${line}-${lineIndex}`}>{line}</p>
                ))}
              </div>
            </article>,
          );
        }

        return cards;
      })}
    </div>
  );
}

export default function IntonationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<IntonationSectionKey, boolean>>(() => {
    const initialState = { ...DEFAULT_OPEN_STATE };
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = window.localStorage.getItem(INTONATION_COMMON_MISTAKES_OPEN_KEY);
      if (saved === '1' || saved === '0') {
        return { ...initialState, commonMistakes: saved === '1' };
      }
    } catch {
      // ignore corrupted cache and keep default collapsed state
    }
    return initialState;
  });
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      return typeof currentProgress.intonation === 'number' && currentProgress.intonation > 0;
    } catch {
      return false;
    }
  });
  const [activeAudioSection, setActiveAudioSection] = useState<IntonationAudioSectionKey | null>(null);
  const [playbackState, setPlaybackState] = useState<IntonationPlaybackState>(DEFAULT_PLAYBACK_STATE);
  const [singleActiveCardKey, setSingleActiveCardKey] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const playerRef = useRef<ReturnType<typeof createIntonationTtsPlayer> | null>(null);
  const singlePlayTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);

  const calcPronunciationAverage = useCallback((progress: Record<string, number>) => {
    const validValues = Object.values(progress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
    );

    if (validValues.length === 0) return 0;
    return Math.round(validValues.reduce((sum, value) => sum + value, 0) / validValues.length);
  }, []);

  const handleSaveProgress = useCallback(
    async (percentage: number) => {
      if (typeof window === 'undefined') return;

      setIsProgressSaved(true);
      const pronunciationProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      pronunciationProgress.intonation = percentage;
      window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

      const dashboardProgress = JSON.parse(
        window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
      window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
    },
    [calcPronunciationAverage],
  );

  const handleUnsaveProgress = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsProgressSaved(false);
    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    delete pronunciationProgress.intonation;
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, [calcPronunciationAverage]);

  const handleStopAudio = useCallback(() => {
    singlePlayTokenRef.current += 1;
    playerRef.current?.stop();
    setActiveAudioSection(null);
    setSingleActiveCardKey(null);
  }, []);

  const handleSpeakSingle = useCallback(
    async (text: string, cardKey: string) => {
      handleStopAudio();
      const token = singlePlayTokenRef.current + 1;
      singlePlayTokenRef.current = token;
      setSingleActiveCardKey(cardKey);
      await speakWithBestEnglishVoice(text);
      if (singlePlayTokenRef.current === token) {
        setSingleActiveCardKey(null);
      }
    },
    [handleStopAudio],
  );

  const handlePlayModel = useCallback((section: IntonationAudioSectionKey) => {
    const sentences = AUDIO_SENTENCES[section];
    if (!sentences.length) return;
    setActiveAudioSection(section);
    void playerRef.current?.playModel(sentences);
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(INTONATION_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy intonation prompt:', error);
      setIsPromptCopied(false);
    }
  }, []);

  const toggleSection = (section: IntonationSectionKey) => {
    handleStopAudio();
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleScrollToDialogueExampleFull = useCallback(() => {
    setOpenSections((prev) => (prev.dialogueDrills ? prev : { ...prev, dialogueDrills: true }));

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const targetKey = createAudioCardKey('dialogueDrills', 'full');
    const scrollToTarget = () => {
      const target = document.querySelector<HTMLElement>(`[data-intonation-card-key="${targetKey}"]`);
      if (!target) return false;
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      return true;
    };

    if (scrollToTarget()) return;

    let attempt = 0;
    const timer = window.setInterval(() => {
      attempt += 1;
      if (scrollToTarget() || attempt >= 12) {
        window.clearInterval(timer);
      }
    }, 120);
  }, []);

  useEffect(() => {
    void primeBestEnglishVoice();

    playerRef.current = createIntonationTtsPlayer(setPlaybackState);

    runIntonationQualityGate();

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(
    () => () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        INTONATION_COMMON_MISTAKES_OPEN_KEY,
        openSections.commonMistakes ? '1' : '0',
      );
    } catch {
      // ignore storage write failures
    }
  }, [openSections.commonMistakes]);

  const playbackActiveCardKey =
    activeAudioSection && playbackState.isPlaying && playbackState.activeIndex !== null
      ? (() => {
          const itemId = AUDIO_ITEM_IDS[activeAudioSection][playbackState.activeIndex];
          return itemId ? createAudioCardKey(activeAudioSection, itemId) : null;
        })()
      : null;
  const activeCardKey = playbackActiveCardKey ?? singleActiveCardKey;

  useEffect(() => {
    if (!activeCardKey) return;
    if (typeof document === 'undefined') return;
    const target = document.querySelector<HTMLElement>(`[data-intonation-card-key="${activeCardKey}"]`);
    if (!target) return;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [activeCardKey]);

  return (
    <div className="pronunciation-layout fs-topic-page intonation-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="fs-topic-shell">
        <header className="fs-topic-header">
          <h1 className="fs-topic-title">Intonation</h1>
          <p className="fs-topic-subtitle">
            Jalur belajar mandiri untuk pemula total: dari mendengar pola nada sampai bisa pakai intonation di dialog nyata.
          </p>
          <div className="intonation-tone-legend">
            <span className="intonation-tone-chip is-rise">↗ Naik</span>
            <span className="intonation-tone-chip is-fall">↘ Turun</span>
          </div>
          <div className="intonation-progress-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName="Intonation"
            />
          </div>
        </header>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('concept')}
              aria-expanded={openSections.concept}
            >
              <span>Concept</span>
              <span className={`fs-topic-section-icon ${openSections.concept ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.concept ? (
            <>
              <div className="intonation-concept">
                {INTONATION_CONCEPT_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.concept} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('patterns')}
              aria-expanded={openSections.patterns}
            >
              <span>Basic Intonation Patterns</span>
              <span className={`fs-topic-section-icon ${openSections.patterns ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.patterns ? (
            <>
              <p className="fs-topic-text">
                Mulai dari tiga pola inti: falling, rising, dan fall-rise. Dengarkan bedanya, tirukan, lalu cek hasilmu.
              </p>
              <SectionAudioControls
                section="patterns"
                activeSection={activeAudioSection}
                playback={playbackState}
                onPlayAll={handlePlayModel}
                onStop={handleStopAudio}
              />
              <PatternGrid
                items={BASIC_INTONATION_PATTERNS}
                activeCardKey={activeCardKey}
                onSpeak={handleSpeakSingle}
              />
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.patterns} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('statementsQuestions')}
              aria-expanded={openSections.statementsQuestions}
            >
              <span>Statements vs Questions</span>
              <span className={`fs-topic-section-icon ${openSections.statementsQuestions ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.statementsQuestions ? (
            <>
              <p className="fs-topic-text">
                Latih perbedaan statement vs question dengan grammar form yang benar, lalu fokuskan intonation sebagai pembeda makna.
              </p>
              <SectionAudioControls
                section="statementsQuestions"
                activeSection={activeAudioSection}
                playback={playbackState}
                onPlayAll={handlePlayModel}
                onStop={handleStopAudio}
              />
              <PairGrid
                items={STATEMENT_QUESTION_PAIRS}
                activeCardKey={activeCardKey}
                onSpeak={handleSpeakSingle}
              />
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.statementsQuestions} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('listContinuation')}
              aria-expanded={openSections.listContinuation}
            >
              <span>List and Continuation Tone</span>
              <span className={`fs-topic-section-icon ${openSections.listContinuation ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.listContinuation ? (
            <>
              <p className="fs-topic-text">
                Pada list, nada biasanya naik ringan di item non-final dan turun pada item terakhir.
              </p>
              <SectionAudioControls
                section="listContinuation"
                activeSection={activeAudioSection}
                playback={playbackState}
                onPlayAll={handlePlayModel}
                onStop={handleStopAudio}
              />
              <ListToneGrid
                items={LIST_CONTINUATION_EXAMPLES}
                activeCardKey={activeCardKey}
                onSpeak={handleSpeakSingle}
              />
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.listContinuation} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('emphasisFeeling')}
              aria-expanded={openSections.emphasisFeeling}
            >
              <span>Intonation for Emphasis and Feeling</span>
              <span className={`fs-topic-section-icon ${openSections.emphasisFeeling ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.emphasisFeeling ? (
            <>
              <p className="fs-topic-text">
                Kalimat yang sama bisa terdengar netral, sopan, tegas, atau ragu tergantung kontur nadanya.
              </p>
              <SectionAudioControls
                section="emphasisFeeling"
                activeSection={activeAudioSection}
                playback={playbackState}
                onPlayAll={handlePlayModel}
                onStop={handleStopAudio}
              />
              <EmotionGrid
                items={EMPHASIS_FEELING_EXAMPLES}
                activeCardKey={activeCardKey}
                onSpeak={handleSpeakSingle}
              />
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.emphasisFeeling} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('dialogueDrills')}
              aria-expanded={openSections.dialogueDrills}
            >
              <span>Dialogue Drills</span>
              <span className={`fs-topic-section-icon ${openSections.dialogueDrills ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.dialogueDrills ? (
            <>
              <p className="fs-topic-text">
                Latih dialog pendek A/B. Fokuskan pitch di akhir kalimat sesuai target pattern.
              </p>
              <SectionAudioControls
                section="dialogueDrills"
                activeSection={activeAudioSection}
                playback={playbackState}
                onPlayAll={handlePlayModel}
                onStop={handleStopAudio}
              />
              <DialogueGrid
                items={DIALOGUE_DRILLS}
                activeCardKey={activeCardKey}
                onSpeak={handleSpeakSingle}
              />
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.dialogueDrills} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('commonMistakes')}
              aria-expanded={openSections.commonMistakes}
            >
              <span>Common Mistakes</span>
              <span className={`fs-topic-section-icon ${openSections.commonMistakes ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.commonMistakes ? (
            <>
              <ul className="intonation-list">
                {COMMON_MISTAKES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <LearningGuideBlock guide={INTONATION_SECTION_LEARNING_GUIDES.commonMistakes} />
            </>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('practiceChecklist')}
              aria-expanded={openSections.practiceChecklist}
            >
              <span>Practice</span>
              <span className={`fs-topic-section-icon ${openSections.practiceChecklist ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.practiceChecklist ? (
            <div className="intonation-shadowing-prompt intonation-practice-mission">
              <p>
                <strong>Mission:</strong> Bacakan bagian{' '}
                <button
                  type="button"
                  className="intonation-practice-jump-btn"
                  onClick={handleScrollToDialogueExampleFull}
                >
                  Dialogue Example (Full)
                </button>
                .
              </p>
            </div>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => setIsPromptOpen((prev) => !prev)}
              aria-expanded={isPromptOpen}
            >
              <span>Prompt</span>
              <span className={`fs-topic-section-icon ${isPromptOpen ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {isPromptOpen ? (
            <div className="intonation-prompt-card">
              <div className="intonation-prompt-header">
                <p className="intonation-prompt-title">Prompt Penilaian Intonation</p>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="intonation-prompt-copy-btn"
                  aria-label="Salin prompt"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <p className="intonation-prompt-quote">
                &quot;{INTONATION_EVALUATION_PROMPT}&quot;
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <RecordingControlsButton
        className="intonation-recording-anchor"
        downloadFileName="intonation-GEUWAT-recording.wav"
      />
    </div>
  );
}





