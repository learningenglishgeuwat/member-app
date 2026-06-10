'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../../../components/BackButton';
import { ControlCenter, PlayStopButton, IpaVisibilityToggle } from '@/app/components';
import { isSpeechSynthesisSupported, speakTextWithPause, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import './summary-of-phonetic-symbols.css';

const highlightLetterStyle: React.CSSProperties = {
  color: '#fb923c',
  fontWeight: 900,
  textShadow: '0 0 8px rgba(251,146,60,0.95), 0 0 16px rgba(251,146,60,0.6)',
};

// Map IPA symbol → letter patterns commonly used in English words
const SYMBOL_WORD_LETTERS: Record<string, string[]> = {
  'ʌ': ['u', 'o', 'ou', 'oo'],
  'ɪ': ['i', 'y', 'ui', 'e'],
  'ʊ': ['oo', 'u', 'ou'],
  'ɛ': ['ea', 'e', 'a'],
  'ə': ['a', 'e', 'i', 'o', 'u'],
  'ɚ': ['er', 'ar', 'or', 'ur', 'ir'],
  'ɑ': ['al', 'ar', 'a'],
  'i': ['ee', 'ea', 'ie', 'ei', 'e'],
  'u': ['oo', 'ue', 'ui', 'ew', 'ou'],
  'æ': ['a'],
  'ɔ': ['aw', 'al', 'au', 'ou'],
  'aɪ': ['igh', 'ie', 'ai', 'y', 'i'],
  'eɪ': ['ay', 'ai', 'ea', 'a'],
  'ɔɪ': ['oy', 'oi'],
  'ɪr': ['ear', 'eer', 'ere', 'ia'],
  'ɛr': ['are', 'air', 'ear', 'ere'],
  'ʊr': ['our', 'ure', 'oor'],
  'oʊ': ['oa', 'ow', 'oe', 'o'],
  'aʊ': ['ou', 'ow'],
  'p': ['pp', 'p'],
  't': ['tt', 't'],
  'k': ['ck', 'ch', 'cc', 'c', 'k', 'q'],
  'f': ['ff', 'ph', 'f'],
  'θ': ['th'],
  's': ['ss', 'sc', 's', 'c'],
  'ʃ': ['sh', 'ti', 'si', 'ci'],
  'ʧ': ['tch', 'ch'],
  'h': ['h'],
  'b': ['bb', 'b'],
  'd': ['dd', 'd'],
  'g': ['gg', 'gh', 'g'],
  'v': ['v'],
  'ð': ['th'],
  'z': ['zz', 'z', 's'],
  'ʒ': ['si', 'ge', 'su'],
  'ʤ': ['dg', 'ge', 'j', 'g'],
  'l': ['ll', 'l'],
  'm': ['mm', 'm'],
  'n': ['nn', 'n'],
  'ŋ': ['ng', 'n'],
  'r': ['wr', 'rr', 'r'],
  'w': ['wh', 'w', 'u'],
  'j': ['y', 'u'],
};

type TabKey = 'vowel' | 'diphthong' | 'consonant';
type SymbolExample = { word: string; ipa: string };
type SymbolItem = { symbol: string; examples: [SymbolExample, SymbolExample, SymbolExample] };
type SpokenWordEntry = { key: string; word: string };

const IPA_SYMBOL_ALIASES: Record<string, string[]> = {
  'ɪr': ['ɪr', 'ɪə', 'iə'],
  'ʊr': ['ʊr', 'ʊə'],
  'ɛr': ['ɛr', 'er', 'eə'],
  'oʊ': ['oʊ', 'əʊ'],
  'ɚ': ['ɚ', 'ər'],
};

function normalizeIpaSymbol(symbol: string) {
  return symbol.trim();
}

function getIpaVariants(symbol: string) {
  const normalized = normalizeIpaSymbol(symbol);
  const aliases = IPA_SYMBOL_ALIASES[normalized] ?? [normalized];
  return Array.from(new Set(aliases.map(normalizeIpaSymbol)));
}

function selectExamplesForSymbol(symbol: string, fallbackExamples: SymbolExample[]) {
  // Menggunakan fallbackExamples secara langsung agar susunan posisi Awal-Tengah-Akhir yang statis tetap terjaga
  return fallbackExamples;
}

const SYMBOL_DATA: Record<TabKey, string[]> = {
  vowel: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a', '\u0251', 'i', 'u', '\u00e6', '\u0254'],
  diphthong: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026ar', 'ɛr', '\u028ar', 'o\u028a', 'a\u028a'],
  consonant: [
    'p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h',
    'b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'j',
  ],
};

const TAB_LABELS: Record<TabKey, string> = {
  vowel: 'VOWEL',
  diphthong: 'DIPHTHONG',
  consonant: 'CONSONANT',
};

const POP_SOUND_SYMBOLS = new Set(['p', 'b', 't', 'd', 'k', 'g', 'ʧ', 'ʤ']);

const VOWEL_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'LAX VOWELS',
    items: [
      { symbol: '\u028c', examples: [{ word: 'up', ipa: 'ʌp' }, { word: 'sun', ipa: 'sʌn' }, { word: 'cup', ipa: 'kʌp' }] },
      { symbol: '\u026a', examples: [{ word: 'it', ipa: 'ɪt' }, { word: 'sit', ipa: 'sɪt' }, { word: 'big', ipa: 'bɪɡ' }] },
      { symbol: '\u028a', examples: [{ word: 'put', ipa: 'pʊt' }, { word: 'book', ipa: 'bʊk' }, { word: 'good', ipa: 'ɡʊd' }] },
      { symbol: '\u025b', examples: [{ word: 'egg', ipa: 'ɛg' }, { word: 'bed', ipa: 'bɛd' }, { word: 'red', ipa: 'rɛd' }] },
      { symbol: '\u0259', examples: [{ word: 'about', ipa: 'əˈbaʊt' }, { word: 'pencil', ipa: 'ˈpɛnsəl' }, { word: 'sofa', ipa: 'ˈsoʊfə' }] },
      { symbol: '\u025a', examples: [{ word: 'earth', ipa: 'ɝθ' }, { word: 'pattern', ipa: 'ˈpætɚn' }, { word: 'teacher', ipa: 'ˈtiːʧɚ' }] },
    ],
  },
  {
    title: 'TENSE VOWELS',
    items: [
      { symbol: '\u0251', examples: [{ word: 'arm', ipa: 'ɑrm' }, { word: 'father', ipa: 'ˈfɑðɚ' }, { word: 'car', ipa: 'kɑr' }] },
      { symbol: 'i', examples: [{ word: 'eat', ipa: 'it' }, { word: 'meet', ipa: 'mit' }, { word: 'see', ipa: 'si' }] },
      { symbol: 'u', examples: [{ word: 'ooze', ipa: 'uz' }, { word: 'food', ipa: 'fud' }, { word: 'blue', ipa: 'blu' }] },
      { symbol: '\u00e6', examples: [{ word: 'at', ipa: 'æt' }, { word: 'cat', ipa: 'kæt' }, { word: 'man', ipa: 'mæn' }] },
      { symbol: '\u0254', examples: [{ word: 'all', ipa: 'ɔl' }, { word: 'talk', ipa: 'tɔk' }, { word: 'law', ipa: 'lɔ' }] },
    ],
  },
];

const CONSONANT_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'VOICELESS CONSONANTS',
    items: [
      { symbol: 'p', examples: [{ word: 'pen', ipa: 'pɛn' }, { word: 'paper', ipa: 'ˈpeɪpɚ' }, { word: 'map', ipa: 'mæp' }] },
      { symbol: 't', examples: [{ word: 'top', ipa: 'tɑp' }, { word: 'water', ipa: 'ˈwɔtɚ' }, { word: 'cat', ipa: 'kæt' }] },
      { symbol: 'k', examples: [{ word: 'cat', ipa: 'kæt' }, { word: 'baker', ipa: 'ˈbeɪkɚ' }, { word: 'back', ipa: 'bæk' }] },
      { symbol: 'f', examples: [{ word: 'fish', ipa: 'fɪʃ' }, { word: 'after', ipa: 'ˈæftɚ' }, { word: 'leaf', ipa: 'lif' }] },
      { symbol: 'θ', examples: [{ word: 'think', ipa: 'θɪŋk' }, { word: 'nothing', ipa: 'ˈnʌθɪŋ' }, { word: 'bath', ipa: 'bæθ' }] },
      { symbol: 's', examples: [{ word: 'sun', ipa: 'sʌn' }, { word: 'lesson', ipa: 'ˈlɛsən' }, { word: 'bus', ipa: 'bʌs' }] },
      { symbol: 'ʃ', examples: [{ word: 'ship', ipa: 'ʃɪp' }, { word: 'nation', ipa: 'ˈneɪʃən' }, { word: 'cash', ipa: 'kæʃ' }] },
      { symbol: 'ʧ', examples: [{ word: 'chair', ipa: 'ʧɛr' }, { word: 'teacher', ipa: 'ˈtiʧɚ' }, { word: 'watch', ipa: 'wɑʧ' }] },
      { symbol: 'h', examples: [{ word: 'hat', ipa: 'hæt' }, { word: 'behind', ipa: 'bɪˈhaɪnd' }, { word: 'hello', ipa: 'həˈloʊ' }] },
    ],
  },
  {
    title: 'VOICED & SONORANT CONSONANTS',
    items: [
      { symbol: 'b', examples: [{ word: 'book', ipa: 'bʊk' }, { word: 'baby', ipa: 'ˈbeɪbi' }, { word: 'cab', ipa: 'kæb' }] },
      { symbol: 'd', examples: [{ word: 'dog', ipa: 'dɔg' }, { word: 'ladder', ipa: 'ˈlædɚ' }, { word: 'red', ipa: 'rɛd' }] },
      { symbol: 'g', examples: [{ word: 'go', ipa: 'goʊ' }, { word: 'again', ipa: 'əˈgɛn' }, { word: 'bag', ipa: 'bæg' }] },
      { symbol: 'v', examples: [{ word: 'van', ipa: 'væn' }, { word: 'movie', ipa: 'ˈmuvi' }, { word: 'love', ipa: 'lʌv' }] },
      { symbol: 'ð', examples: [{ word: 'this', ipa: 'ðɪs' }, { word: 'mother', ipa: 'ˈmʌðɚ' }, { word: 'breathe', ipa: 'brið' }] },
      { symbol: 'z', examples: [{ word: 'zoo', ipa: 'zu' }, { word: 'easy', ipa: 'ˈizi' }, { word: 'buzz', ipa: 'bʌz' }] },
      { symbol: 'ʒ', examples: [{ word: 'genre', ipa: 'ˈʒɑnrə' }, { word: 'vision', ipa: 'ˈvɪʒən' }, { word: 'beige', ipa: 'beɪʒ' }] },
      { symbol: 'ʤ', examples: [{ word: 'job', ipa: 'ʤɑb' }, { word: 'danger', ipa: 'ˈdeɪnʤɚ' }, { word: 'bridge', ipa: 'brɪʤ' }] },
      { symbol: 'l', examples: [{ word: 'light', ipa: 'laɪt' }, { word: 'yellow', ipa: 'ˈjɛloʊ' }, { word: 'bell', ipa: 'bɛl' }] },
      { symbol: 'm', examples: [{ word: 'man', ipa: 'mæn' }, { word: 'summer', ipa: 'ˈsʌmɚ' }, { word: 'time', ipa: 'taɪm' }] },
      { symbol: 'n', examples: [{ word: 'nose', ipa: 'noʊz' }, { word: 'dinner', ipa: 'ˈdɪnɚ' }, { word: 'sun', ipa: 'sʌn' }] },
      { symbol: 'ŋ', examples: [{ word: 'singer', ipa: 'ˈsɪŋɚ' }, { word: 'finger', ipa: 'ˈfɪŋgɚ' }, { word: 'sing', ipa: 'sɪŋ' }] },
      { symbol: 'r', examples: [{ word: 'red', ipa: 'rɛd' }, { word: 'around', ipa: 'əˈraʊnd' }, { word: 'car', ipa: 'kɑr' }] },
      { symbol: 'w', examples: [{ word: 'we', ipa: 'wi' }, { word: 'away', ipa: 'əˈweɪ' }, { word: 'window', ipa: 'ˈwɪndoʊ' }] },
      { symbol: 'j', examples: [{ word: 'yes', ipa: 'jɛs' }, { word: 'beyond', ipa: 'bɪˈjɑnd' }, { word: 'music', ipa: 'ˈmjuzɪk' }] },
    ],
  },
];

const DIPHTHONG_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'COMMON DIPHTHONGS',
    items: [
      { symbol: 'aɪ', examples: [{ word: 'ice', ipa: 'aɪs' }, { word: 'time', ipa: 'taɪm' }, { word: 'my', ipa: 'maɪ' }] },
      { symbol: 'eɪ', examples: [{ word: 'age', ipa: 'eɪʤ' }, { word: 'name', ipa: 'neɪm' }, { word: 'day', ipa: 'deɪ' }] },
      { symbol: 'ɔɪ', examples: [{ word: 'oil', ipa: 'ɔɪl' }, { word: 'coin', ipa: 'kɔɪn' }, { word: 'boy', ipa: 'bɔɪ' }] },
      { symbol: 'ɪr', examples: [{ word: 'ear', ipa: 'ɪr' }, { word: 'beard', ipa: 'bɪrd' }, { word: 'near', ipa: 'nɪr' }] },
      { symbol: 'ɛr', examples: [{ word: 'air', ipa: 'ɛr' }, { word: 'parent', ipa: 'ˈpɛrənt' }, { word: 'care', ipa: 'kɛr' }] },
      { symbol: 'ʊr', examples: [{ word: 'tourist', ipa: 'ˈtʊrɪst' }, { word: 'during', ipa: 'ˈdʊrɪŋ' }, { word: 'tour', ipa: 'tʊr' }] },
      { symbol: 'oʊ', examples: [{ word: 'open', ipa: 'ˈoʊpən' }, { word: 'home', ipa: 'hoʊm' }, { word: 'go', ipa: 'goʊ' }] },
      { symbol: 'aʊ', examples: [{ word: 'out', ipa: 'aʊt' }, { word: 'house', ipa: 'haʊs' }, { word: 'now', ipa: 'naʊ' }] },
    ],
  },
];

function renderWordHighlight(word: string, symbol: string, showHighlight: boolean): React.ReactNode {
  if (!showHighlight) return word;
  const patterns = SYMBOL_WORD_LETTERS[symbol];
  if (!patterns || patterns.length === 0) return word;
  const sorted = [...patterns].sort((a, b) => b.length - a.length);
  const escaped = sorted.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'i');
  const parts = word.split(regex);
  if (parts.length <= 1) return word;
  let highlighted = false;
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1 && !highlighted) {
          highlighted = true;
          return (
            <span key={i} className="symbol-letter-highlight" style={highlightLetterStyle}>
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function renderIpaHighlight(ipa: string, symbol: string, showHighlight: boolean): React.ReactNode {
  if (!showHighlight || !symbol) return ipa;
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'g');
  const parts = ipa.split(regex);
  if (parts.length <= 1) return ipa;
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <span key={i} className="symbol-letter-highlight" style={highlightLetterStyle}>
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default function SummaryOfPhoneticSymbolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('vowel');
  const [activePlayGroup, setActivePlayGroup] = useState<string | null>(null);
  const [activeSpeakingExampleKey, setActiveSpeakingExampleKey] = useState<string | null>(null);
  const [showIpa, setShowIpa] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const playGroupRef = useRef<string | null>(null);
  const playSessionRef = useRef(0);
  const exampleCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeSymbols = useMemo(() => SYMBOL_DATA[activeTab], [activeTab]);

  const buildExampleKey = (
    tab: TabKey,
    groupTitle: string,
    symbol: string,
    itemIndex: number,
    exampleIndex: number,
  ) => `${tab}-${groupTitle}-${symbol}-${itemIndex}-${exampleIndex}`;

  const scrollToExampleCard = (exampleKey: string) => {
    const node = exampleCardRefs.current[exampleKey];
    if (!node) return;
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  const activeGroups = useMemo(() => {
    return activeTab === 'vowel'
      ? VOWEL_GROUPS
      : activeTab === 'consonant'
        ? CONSONANT_GROUPS
        : DIPHTHONG_GROUPS;
  }, [activeTab]);

  const activeGroupPlayLists = useMemo(() => {
    return activeGroups.map((group) => ({
      groupKey: `${activeTab}-${group.title}`,
      label: group.title,
      words: group.items.flatMap((item, itemIndex) =>
        item.examples.map((example, exampleIndex) => ({
          key: buildExampleKey(activeTab, group.title, item.symbol, itemIndex, exampleIndex),
          word: example.word,
        })),
      ),
    }));
  }, [activeGroups, activeTab]);

  const allExampleWords = useMemo(() => {
    return activeGroupPlayLists.flatMap((group) => group.words);
  }, [activeGroupPlayLists]);

  useEffect(() => {
    void waitForVoices();
    return () => {
      playSessionRef.current += 1;
      playGroupRef.current = null;
      stopSpeech();
      setActiveSpeakingExampleKey(null);
    };
  }, []);

  const handleTabChange = (nextTab: TabKey) => {
    if (nextTab === activeTab) return;
    playSessionRef.current += 1;
    stopSpeech();
    setActivePlayGroup(null);
    setActiveSpeakingExampleKey(null);
    playGroupRef.current = null;
    setActiveTab(nextTab);
  };

  const speakWord = async (word: string, exampleKey?: string) => {
    if (!isSpeechSynthesisSupported()) return;
    playSessionRef.current += 1;
    stopSpeech();
    setActivePlayGroup(null);
    setActiveSpeakingExampleKey(exampleKey ?? null);
    if (exampleKey) {
      scrollToExampleCard(exampleKey);
    }
    playGroupRef.current = null;
    await speakTextWithPause(word, {
      preferredEnglish: 'en-US',
      rate: 0.86,
      pitch: 1,
      volume: 1,
    });
    setActiveSpeakingExampleKey(null);
  };

  const playAllWordsByGroup = async (groupKey: string, words: SpokenWordEntry[]) => {
    if (!isSpeechSynthesisSupported() || words.length === 0) return;

    if (activePlayGroup === groupKey) {
      playSessionRef.current += 1;
      stopSpeech();
      setActivePlayGroup(null);
      setActiveSpeakingExampleKey(null);
      playGroupRef.current = null;
      return;
    }

    playSessionRef.current += 1;
    const sessionId = playSessionRef.current;
    stopSpeech();
    setActivePlayGroup(groupKey);
    playGroupRef.current = groupKey;

    for (const currentWord of words) {
      if (playSessionRef.current !== sessionId || playGroupRef.current !== groupKey) break;
      setActiveSpeakingExampleKey(currentWord.key);
      scrollToExampleCard(currentWord.key);
      await speakTextWithPause(currentWord.word, {
        preferredEnglish: 'en-US',
        rate: 0.86,
        pitch: 1,
        volume: 1,
      });
      if (playSessionRef.current !== sessionId || playGroupRef.current !== groupKey) break;
    }

    if (playSessionRef.current === sessionId && playGroupRef.current === groupKey) {
      setActivePlayGroup(null);
      setActiveSpeakingExampleKey(null);
      playGroupRef.current = null;
    }
  };

  return (
    <main className="sps-page">
      <div className="sps-back">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      <section className="sps-shell">
        <header className="sps-header">
          <h1 className="sps-title">SUMMARY OF PHONETIC SYMBOLS</h1>
          <p className="sps-subtitle">Pilih tab untuk melihat semua simbol berdasarkan kategori.</p>
        </header>

        <div className="sps-tabs" role="tablist" aria-label="Phonetic symbol categories">
          {Object.keys(TAB_LABELS).map((key) => {
            const tabKey = key as TabKey;
            const active = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={active}
                className={`sps-tab ${active ? 'is-active' : ''}`}
                onClick={() => handleTabChange(tabKey)}
              >
                {TAB_LABELS[tabKey]}
              </button>
            );
          })}
        </div>

        {activeTab === 'vowel' || activeTab === 'consonant' || activeTab === 'diphthong' ? (
          <div className="sps-panel" role="tabpanel" aria-label={`${TAB_LABELS[activeTab]} symbols`}>
            <div className={`sps-vowel-columns ${activeTab === 'diphthong' ? 'is-single' : ''}`}>
              {(activeTab === 'vowel'
                ? VOWEL_GROUPS
                : activeTab === 'consonant'
                  ? CONSONANT_GROUPS
                  : DIPHTHONG_GROUPS).map((group) => (
                <section key={group.title} className="sps-vowel-column">
                  <div className="sps-column-head">
                    <h2 className="sps-column-title">{group.title}</h2>
                    
                  </div>
                  <div className="sps-symbol-list">
                    {group.items.map((item, itemIndex) => {
                      const examples = selectExamplesForSymbol(item.symbol, item.examples);
                      return (
                      <div key={item.symbol} className="sps-symbol-card sps-symbol-card-with-examples">
                        <span
                          className={`sps-symbol ${
                            activeTab === 'consonant' && POP_SOUND_SYMBOLS.has(item.symbol) ? 'is-pop-sound' : ''
                          }`}
                        >
                          {item.symbol}
                        </span>
                        <ul className="sps-example-grid">
                          {examples.map((example, exampleIndex) => {
                            const exampleKey = buildExampleKey(activeTab, group.title, item.symbol, itemIndex, exampleIndex);
                            const isSpeakingExample = activeSpeakingExampleKey === exampleKey;

                            return (
                            <li key={`${item.symbol}-${example.word}-${exampleIndex}`}>
                              <button
                                type="button"
                                className={`sps-example-card ${isSpeakingExample ? 'is-speaking' : ''}`}
                                onClick={() => void speakWord(example.word, exampleKey)}
                                ref={(node) => {
                                  exampleCardRefs.current[exampleKey] = node;
                                }}
                                aria-label={`Play pronunciation for ${example.word}`}
                              >
                                <span className="sps-word">{renderWordHighlight(example.word, item.symbol, showHighlight)}</span>
                                <span className="sps-ipa">/{renderIpaHighlight(example.ipa, item.symbol, showHighlight)}/</span>
                              </button>
                            </li>
                            );
                          })}
                        </ul>
                      </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
            {activeTab === 'consonant' ? (
              <div className="sps-note">
                <p className="sps-note-title">Catatan:</p>
                <ul className="sps-note-list">
                  <li>- Simbol berwarna biru menandakan <strong>pop sounds</strong>.</li>
                  <li>
                    - Pop sound adalah bunyi saat aliran udara ditahan sebentar lalu dilepas cepat (terdengar seperti
                    letupan kecil).
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="sps-panel" role="tabpanel" aria-label={`${TAB_LABELS[activeTab]} symbols`}>
            <div className="sps-grid">
              {activeSymbols.map((symbol) => (
                <div key={`${activeTab}-${symbol}`} className="sps-symbol-card">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <ControlCenter
        topControls={
          <div className="flex flex-col gap-3">
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
            <IpaVisibilityToggle
              checked={showHighlight}
              onChange={setShowHighlight}
              label="Common Letters"
              className="w-full flex justify-between text-[10px] sm:text-xs"
              activeClass="text-orange-200"
              activeTrackClass="bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.62)]"
              activeDotClass="bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.95)]"
            />
          </div>
        }
        bottomControls={
          <div className="flex flex-col gap-3">
            <div>
              <PlayStopButton
                isActive={activePlayGroup === `${activeTab}-all`}
                label="ALL"
                onClick={() => void playAllWordsByGroup(`${activeTab}-all`, allExampleWords)}
                disabled={!allExampleWords.length}
                size="sm"
              />
            </div>
            {activeTab !== 'diphthong' && (
              <div className="pt-3 border-t border-white/10">
                {activeGroupPlayLists.map((group) => (
                  <PlayStopButton
                    key={group.groupKey}
                    isActive={activePlayGroup === group.groupKey}
                    label={group.label}
                    onClick={() => void playAllWordsByGroup(group.groupKey, group.words)}
                    disabled={!group.words.length}
                    size="sm"
                    className="mb-1.5"
                  />
                ))}
              </div>
            )}
          </div>
        }
      />
    </main>
  );
}