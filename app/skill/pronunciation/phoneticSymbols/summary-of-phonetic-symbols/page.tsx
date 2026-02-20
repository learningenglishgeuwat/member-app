'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../../../components/BackButton';
import './summary-of-phonetic-symbols.css';

type TabKey = 'vowel' | 'diphthong' | 'consonant';
type SymbolExample = { word: string; ipa: string };
type SymbolItem = { symbol: string; examples: [SymbolExample, SymbolExample, SymbolExample] };

const SYMBOL_DATA: Record<TabKey, string[]> = {
  vowel: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a', '\u0251', 'i', 'u', '\u00e6', '\u0254'],
  diphthong: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'],
  consonant: [
    'p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h',
    'b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y',
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
      { symbol: '\u028c', examples: [{ word: 'cup', ipa: 'kʌp' }, { word: 'love', ipa: 'lʌv' }, { word: 'sun', ipa: 'sʌn' }] },
      { symbol: '\u026a', examples: [{ word: 'sit', ipa: 'sɪt' }, { word: 'milk', ipa: 'mɪlk' }, { word: 'ship', ipa: 'ʃɪp' }] },
      { symbol: '\u028a', examples: [{ word: 'book', ipa: 'bʊk' }, { word: 'look', ipa: 'lʊk' }, { word: 'good', ipa: 'ɡʊd' }] },
      { symbol: '\u025b', examples: [{ word: 'bed', ipa: 'bɛd' }, { word: 'pen', ipa: 'pɛn' }, { word: 'head', ipa: 'hɛd' }] },
      { symbol: '\u0259', examples: [{ word: 'about', ipa: 'əˈbaʊt' }, { word: 'sofa', ipa: 'ˈsoʊfə' }, { word: 'banana', ipa: 'bəˈnænə' }] },
      { symbol: '\u025a', examples: [{ word: 'teacher', ipa: 'ˈtiːtʃɚ' }, { word: 'better', ipa: 'ˈbɛtɚ' }, { word: 'water', ipa: 'ˈwɔtɚ' }] },
    ],
  },
  {
    title: 'TENSE VOWELS',
    items: [
      { symbol: '\u0251', examples: [{ word: 'car', ipa: 'kɑr' }, { word: 'father', ipa: 'ˈfɑðɚ' }, { word: 'palm', ipa: 'pɑm' }] },
      { symbol: 'i', examples: [{ word: 'see', ipa: 'siː' }, { word: 'green', ipa: 'ɡriːn' }, { word: 'team', ipa: 'tiːm' }] },
      { symbol: 'u', examples: [{ word: 'food', ipa: 'fuːd' }, { word: 'blue', ipa: 'bluː' }, { word: 'true', ipa: 'truː' }] },
      { symbol: '\u00e6', examples: [{ word: 'cat', ipa: 'kæt' }, { word: 'black', ipa: 'blæk' }, { word: 'apple', ipa: 'ˈæpəl' }] },
      { symbol: '\u0254', examples: [{ word: 'law', ipa: 'lɔ' }, { word: 'call', ipa: 'kɔl' }, { word: 'talk', ipa: 'tɔk' }] },
    ],
  },
];

const CONSONANT_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'VOICELESS CONSONANTS',
    items: [
      { symbol: 'p', examples: [{ word: 'pen', ipa: 'pɛn' }, { word: 'map', ipa: 'mæp' }, { word: 'paper', ipa: 'ˈpeɪpər' }] },
      { symbol: 't', examples: [{ word: 'top', ipa: 'tɑp' }, { word: 'cat', ipa: 'kæt' }, { word: 'water', ipa: 'ˈwɔtər' }] },
      { symbol: 'k', examples: [{ word: 'cat', ipa: 'kæt' }, { word: 'back', ipa: 'bæk' }, { word: 'coffee', ipa: 'ˈkɔfi' }] },
      { symbol: 'f', examples: [{ word: 'fish', ipa: 'fɪʃ' }, { word: 'leaf', ipa: 'lif' }, { word: 'phone', ipa: 'foʊn' }] },
      { symbol: 'θ', examples: [{ word: 'think', ipa: 'θɪŋk' }, { word: 'bath', ipa: 'bæθ' }, { word: 'thank', ipa: 'θæŋk' }] },
      { symbol: 's', examples: [{ word: 'sun', ipa: 'sʌn' }, { word: 'bus', ipa: 'bʌs' }, { word: 'city', ipa: 'ˈsɪti' }] },
      { symbol: 'ʃ', examples: [{ word: 'ship', ipa: 'ʃɪp' }, { word: 'cash', ipa: 'kæʃ' }, { word: 'nation', ipa: 'ˈneɪʃən' }] },
      { symbol: 'ʧ', examples: [{ word: 'chair', ipa: 'ʧɛr' }, { word: 'watch', ipa: 'wɑʧ' }, { word: 'teacher', ipa: 'ˈtiʧər' }] },
      { symbol: 'h', examples: [{ word: 'hat', ipa: 'hæt' }, { word: 'behind', ipa: 'bɪˈhaɪnd' }, { word: 'hello', ipa: 'həˈloʊ' }] },
    ],
  },
  {
    title: 'VOICED & SONORANT CONSONANTS',
    items: [
      { symbol: 'b', examples: [{ word: 'book', ipa: 'bʊk' }, { word: 'cab', ipa: 'kæb' }, { word: 'baby', ipa: 'ˈbeɪbi' }] },
      { symbol: 'd', examples: [{ word: 'dog', ipa: 'dɔg' }, { word: 'red', ipa: 'rɛd' }, { word: 'ladder', ipa: 'ˈlædər' }] },
      { symbol: 'g', examples: [{ word: 'go', ipa: 'goʊ' }, { word: 'bag', ipa: 'bæg' }, { word: 'again', ipa: 'əˈgɛn' }] },
      { symbol: 'v', examples: [{ word: 'van', ipa: 'væn' }, { word: 'love', ipa: 'lʌv' }, { word: 'movie', ipa: 'ˈmuvi' }] },
      { symbol: 'ð', examples: [{ word: 'this', ipa: 'ðɪs' }, { word: 'mother', ipa: 'ˈmʌðər' }, { word: 'breathe', ipa: 'brið' }] },
      { symbol: 'z', examples: [{ word: 'zoo', ipa: 'zu' }, { word: 'busy', ipa: 'ˈbɪzi' }, { word: 'music', ipa: 'ˈmjuzɪk' }] },
      { symbol: 'ʒ', examples: [{ word: 'vision', ipa: 'ˈvɪʒən' }, { word: 'genre', ipa: 'ˈʒɑnrə' }, { word: 'measure', ipa: 'ˈmɛʒər' }] },
      { symbol: 'ʤ', examples: [{ word: 'job', ipa: 'ʤɑb' }, { word: 'bridge', ipa: 'brɪʤ' }, { word: 'giant', ipa: 'ˈʤaɪənt' }] },
      { symbol: 'l', examples: [{ word: 'light', ipa: 'laɪt' }, { word: 'bell', ipa: 'bɛl' }, { word: 'yellow', ipa: 'ˈjɛloʊ' }] },
      { symbol: 'm', examples: [{ word: 'man', ipa: 'mæn' }, { word: 'time', ipa: 'taɪm' }, { word: 'summer', ipa: 'ˈsʌmər' }] },
      { symbol: 'n', examples: [{ word: 'nose', ipa: 'noʊz' }, { word: 'sun', ipa: 'sʌn' }, { word: 'dinner', ipa: 'ˈdɪnər' }] },
      { symbol: 'ŋ', examples: [{ word: 'sing', ipa: 'sɪŋ' }, { word: 'long', ipa: 'lɔŋ' }, { word: 'finger', ipa: 'ˈfɪŋgər' }] },
      { symbol: 'r', examples: [{ word: 'red', ipa: 'rɛd' }, { word: 'car', ipa: 'kɑr' }, { word: 'around', ipa: 'əˈraʊnd' }] },
      { symbol: 'w', examples: [{ word: 'we', ipa: 'wi' }, { word: 'window', ipa: 'ˈwɪndoʊ' }, { word: 'quick', ipa: 'kwɪk' }] },
      { symbol: 'y', examples: [{ word: 'yes', ipa: 'jɛs' }, { word: 'yellow', ipa: 'ˈjɛloʊ' }, { word: 'music', ipa: 'ˈmjuzɪk' }] },
    ],
  },
];

const DIPHTHONG_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'COMMON DIPHTHONGS',
    items: [
      { symbol: 'aɪ', examples: [{ word: 'time', ipa: 'taɪm' }, { word: 'bike', ipa: 'baɪk' }, { word: 'light', ipa: 'laɪt' }] },
      { symbol: 'eɪ', examples: [{ word: 'day', ipa: 'deɪ' }, { word: 'name', ipa: 'neɪm' }, { word: 'play', ipa: 'pleɪ' }] },
      { symbol: 'ɔɪ', examples: [{ word: 'boy', ipa: 'bɔɪ' }, { word: 'coin', ipa: 'kɔɪn' }, { word: 'voice', ipa: 'vɔɪs' }] },
      { symbol: 'ɪə', examples: [{ word: 'idea', ipa: 'aɪˈdɪə' }, { word: 'near', ipa: 'nɪə' }, { word: 'ear', ipa: 'ɪə' }] },
      { symbol: 'eə', examples: [{ word: 'care', ipa: 'keə' }, { word: 'share', ipa: 'ʃeə' }, { word: 'bear', ipa: 'beə' }] },
      { symbol: 'ʊə', examples: [{ word: 'tour', ipa: 'tʊə' }, { word: 'cure', ipa: 'kjʊə' }, { word: 'pure', ipa: 'pjʊə' }] },
      { symbol: 'oʊ', examples: [{ word: 'go', ipa: 'goʊ' }, { word: 'home', ipa: 'hoʊm' }, { word: 'phone', ipa: 'foʊn' }] },
      { symbol: 'aʊ', examples: [{ word: 'now', ipa: 'naʊ' }, { word: 'house', ipa: 'haʊs' }, { word: 'sound', ipa: 'saʊnd' }] },
    ],
  },
];

export default function SummaryOfPhoneticSymbolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('vowel');
  const [activePlayGroup, setActivePlayGroup] = useState<string | null>(null);
  const playGroupRef = useRef<string | null>(null);
  const activeSymbols = useMemo(() => SYMBOL_DATA[activeTab], [activeTab]);

  useEffect(() => {
    const warmupVoices = () => {
      window.speechSynthesis.getVoices();
    };
    warmupVoices();
    window.speechSynthesis.onvoiceschanged = warmupVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setActivePlayGroup(null);
    playGroupRef.current = null;
  }, [activeTab]);

  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.name === 'Google US English') ||
      voices.find((v) => v.lang === 'en-US' && v.name.includes('Google')) ||
      voices.find((v) => v.lang === 'en-US' && v.name.includes('Samantha')) ||
      voices.find((v) => v.lang === 'en-US' && v.name.includes('Zira')) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices[0]
    );
  };

  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setActivePlayGroup(null);
    playGroupRef.current = null;
    const utterance = new SpeechSynthesisUtterance(word);
    const preferredVoice = getPreferredVoice();
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  const playAllWordsByGroup = (groupKey: string, words: string[]) => {
    if (!('speechSynthesis' in window) || words.length === 0) return;

    if (activePlayGroup === groupKey) {
      window.speechSynthesis.cancel();
      setActivePlayGroup(null);
      playGroupRef.current = null;
      return;
    }

    window.speechSynthesis.cancel();
    setActivePlayGroup(groupKey);
    playGroupRef.current = groupKey;
    let index = 0;

    const speakNext = () => {
      if (index >= words.length) {
        setActivePlayGroup(null);
        playGroupRef.current = null;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(words[index]);
      const preferredVoice = getPreferredVoice();
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        if (playGroupRef.current !== groupKey) return;
        index += 1;
        speakNext();
      };
      utterance.onerror = () => {
        setActivePlayGroup(null);
        playGroupRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
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
                onClick={() => setActiveTab(tabKey)}
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
                    <button
                      type="button"
                      className={`sps-play-all-btn ${activePlayGroup === `${activeTab}-${group.title}` ? 'is-playing' : ''}`}
                      onClick={() =>
                        playAllWordsByGroup(
                          `${activeTab}-${group.title}`,
                          group.items.flatMap((item) => item.examples.map((example) => example.word)),
                        )
                      }
                      aria-label={activePlayGroup === `${activeTab}-${group.title}` ? 'Stop' : 'Play all words'}
                      title={activePlayGroup === `${activeTab}-${group.title}` ? 'Stop' : 'Play all words'}
                    >
                      <span aria-hidden="true">{activePlayGroup === `${activeTab}-${group.title}` ? '■' : '▶'}</span>
                    </button>
                  </div>
                  <div className="sps-symbol-list">
                    {group.items.map((item) => (
                      <div key={item.symbol} className="sps-symbol-card sps-symbol-card-with-examples">
                        <span
                          className={`sps-symbol ${
                            activeTab === 'consonant' && POP_SOUND_SYMBOLS.has(item.symbol) ? 'is-pop-sound' : ''
                          }`}
                        >
                          {item.symbol}
                        </span>
                        <ul className="sps-example-grid">
                          {item.examples.map((example) => (
                            <li key={`${item.symbol}-${example.word}`}>
                              <button
                                type="button"
                                className="sps-example-card"
                                onClick={() => speakWord(example.word)}
                                aria-label={`Play pronunciation for ${example.word}`}
                              >
                                <span className="sps-word">{example.word}</span>
                                <span className="sps-ipa">/{example.ipa}/</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
    </main>
  );
}
