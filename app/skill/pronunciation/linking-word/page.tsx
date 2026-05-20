'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Gauge, Play, Volume2 } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';
import { data } from './data';

type LinkingWordItem = {
  text: string;
  ipaBefore?: string;
  ipa?: string;
  translation?: string;
  subCategory?: string;
  highlightedText?: string;
  highlightedIpa?: string;
};

type LinkingWordCategory = {
  category: string;
  fullCategory?: string;
  linguisticTerm?: string;
  explanation?: string;
  items: LinkingWordItem[];
  extraItems?: LinkingWordItem[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function Toggle({
  checked,
  onChange,
  label,
  activeClass = 'text-cyan-200',
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  activeClass?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <span
        className={cx(
          'font-mono text-xs sm:text-sm tracking-widest text-white/55 uppercase transition-colors',
          checked ? activeClass : 'group-hover:text-cyan-100',
        )}
      >
        {label}
      </span>
      <span className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={cx(
            'block w-11 h-6 rounded-full border-2 bg-transparent transition-all',
            checked ? 'border-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'border-white/25',
          )}
        />
        <span
          className={cx(
            'absolute top-1 left-1 w-3.5 h-3.5 rounded-full transition-all',
            checked ? 'translate-x-5 bg-cyan-300 shadow-[0_0_8px_#00f0ff]' : 'bg-white/35',
          )}
        />
      </span>
    </label>
  );
}

function buildBeforePhaseText(text: string): string {
  return text.replace(/\[[A-Za-z]+\]/g, '').split(/[\s-]+/).join(', ');
}

const AFTER_SPEECH_TEXT_BY_PHRASE: Record<string, string> = {
  'Come on': 'Cmon',
  'Wake up': 'Wakeup',
  'Check it out': 'Checkit out',
  'Put it on': 'pudidon',
  'Keep it up': 'Keepidup',
  'Turn off': 'Turnoff',
  'Hold on': 'Holdon',
  'Fill in': 'Fillin',
  'Drop out': 'Dropout',
  'Get up': 'Gedup',
  'Stand up': 'Standup',
  'Fall in': 'fawlin',
  'Run out': 'Runout',
  'Move on': 'moovon',
  'Pick up': 'Pickup',
  'Log in': 'Login',
  'Look at': 'Lookat',
  'Take it': 'Takeit',
  'Back away': 'Backaway',
  'I am': 'I yam',
  'See it': 'see yitt',
  'He is': 'He yiz',
  'Do it': 'Do wit',
  'Go on': 'Go won',
  'No offense': 'no wuhfense',
  'They are': 'They yar',
  'She is': 'She yiz',
  'We are': 'We yar',
  'Be honest': 'Be yonest',
  'My own': 'My yown',
  'Fly away': 'Fly yaway',
  'High up': 'High yup',
  'Stay up': 'Stay yup',
  'Too often': 'Too woften',
  'Go out': 'go wowt',
  'You are': 'You war',
  'Two apples': 'Two wapples',
  'Show off': 'Show woff',
  'Grow up': 'grow whup',
  'Throw it': 'Throw wit',
  'I told you so!': 'I toldju so',
  'Could you': 'Couldju',
  'Did you': 'Didju',
  'What about you?': 'What aboutchu',
  "Don't you": "Dontchu",
  'Meet you': 'Meetchu',
  'Can I kiss you?': 'Can I kishu',
  'Miss you': 'Mishu',
  'Bless you': 'Bleshu',
  "How's your day?": 'Howzhur day',
  "Where's your": 'wear zher',
  'Close your eyes': 'Clozhur eyes',
  'Glad you': 'gladjoo',
  'Had you': 'hadjoo',
  'Would you': 'Wouldju',
  'Need you': 'Needju',
  'Find you': 'Findju',
  'Not yet': 'Notchet',
  "Won't you": 'Wontchu',
  'Get you': 'Getchu',
  'Let you': 'Letchu',
  'Hurt you': 'Hurtchu',
  'Guess you': 'Geshu',
  'Pass your': 'Pashur',
  'As you': 'Azhu',
  'Because you': 'Becauzhu',
  'Use your': 'yoozhur',
};

function buildAfterPhaseText(item: LinkingWordItem): string {
  return AFTER_SPEECH_TEXT_BY_PHRASE[item.text] ?? item.text;
}

export default function LinkingWordPage() {
  const categories = data as unknown as LinkingWordCategory[];
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [speed, setSpeed] = useState(1);
  const [showIpa, setShowIpa] = useState(true);
  const [highlightZone, setHighlightZone] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const playbackSessionId = useRef(0);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentCategory = categories[activeTab];
  const subCategories = useMemo(() => {
    return Array.from(
      new Set(
        (currentCategory?.items ?? [])
          .map((item) => item.subCategory)
          .filter((value): value is string => Boolean(value)),
      ),
    );
  }, [currentCategory]);

  const cancelPlayback = useCallback(() => {
    stopSpeech();
    playbackSessionId.current += 1;
    setPlayingId(null);
  }, []);

  useEffect(() => {
    if (isSpeechSynthesisSupported()) {
      void waitForVoices();
    }
    return cancelPlayback;
  }, [cancelPlayback]);

  const playPhase = useCallback(
    async (
      text: string,
      id: string | number,
      type: 'before' | 'after',
      pauseAfter: number,
      sessionId: number,
    ) => {
      if (!isSpeechSynthesisSupported()) return;
      await new Promise((resolve) => window.setTimeout(resolve, 50));
      if (playbackSessionId.current !== sessionId) return;

      setPlayingId(`${activeTab}-${id}-${type}`);
      cardRefs.current[String(id)]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      await speakText(text, {
        preferEnglish: true,
        preferredEnglish: 'en-US',
        rate: speed,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });

      if (playbackSessionId.current !== sessionId) return;
      setPlayingId(null);
      if (pauseAfter > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, pauseAfter));
      }
    },
    [activeTab, speed],
  );

  const playItemSequence = useCallback(
    async (
      item: LinkingWordItem,
      id: string | number,
      sessionId: number,
      afterPause: number,
    ) => {
      if (item.ipaBefore) {
        await playPhase(buildBeforePhaseText(item.text), id, 'before', 400, sessionId);
      }
      if (playbackSessionId.current !== sessionId) return;
      await playPhase(buildAfterPhaseText(item), id, 'after', afterPause, sessionId);
    },
    [playPhase],
  );

  const playSinglePhase = useCallback(
    (text: string, id: string | number, type: 'before' | 'after') => {
      stopSpeech();
      const sessionId = ++playbackSessionId.current;
      void playPhase(text, id, type, 0, sessionId);
    },
    [playPhase],
  );

  const playFullPhrase = useCallback(
    (item: LinkingWordItem, id: string | number) => {
      stopSpeech();
      const sessionId = ++playbackSessionId.current;
      void playItemSequence(item, id, sessionId, 0);
    },
    [playItemSequence],
  );

  const playAll = useCallback(
    async (isExtra = false) => {
      stopSpeech();
      const sessionId = ++playbackSessionId.current;
      const sourceItems = isExtra ? currentCategory.extraItems ?? [] : currentCategory.items;

      for (let index = 0; index < sourceItems.length; index++) {
        const item = sourceItems[index];
        if (activeSubTab !== 'All' && item.subCategory !== activeSubTab) continue;
        if (playbackSessionId.current !== sessionId) break;

        const id = isExtra ? `extra-${index}` : index;
        await playItemSequence(item, id, sessionId, 800);
      }
    },
    [activeSubTab, currentCategory, playItemSequence],
  );

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      setActiveSubTab('All');
      setShowMore(false);
      cancelPlayback();
    },
    [cancelPlayback],
  );

  const handleSubTabChange = useCallback(
    (subTab: string) => {
      setActiveSubTab(subTab);
      cancelPlayback();
    },
    [cancelPlayback],
  );

  if (!currentCategory) return null;

  return (
    <div className="min-h-screen text-white">
      <div className="fixed top-4 left-4 z-50">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur overflow-x-auto no-scrollbar-mobile">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex whitespace-nowrap py-4 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.category}
                onClick={() => handleTabChange(index)}
                className={cx(
                  'font-mono text-sm uppercase transition-all pb-2 border-b-2',
                  activeTab === index
                    ? 'text-cyan-200 border-cyan-300'
                    : 'text-white/45 border-transparent hover:text-cyan-100',
                )}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="sticky top-[57px] z-30 border-b border-white/10 bg-[#101314]/95 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => void playAll(false)}
              className="bg-cyan-300 text-cyan-950 px-4 py-2 font-mono text-sm uppercase rounded flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <Play className="w-4 h-4 fill-current stroke-current" />
              PLAY ALL
            </button>
            <div className="flex items-center gap-2 border border-white/15 rounded px-3 py-1.5 bg-black/30 hover:border-cyan-300/50 transition-colors">
              <Gauge className="w-4 h-4 text-white/45" />
              <select
                title="Playback Speed"
                className="bg-transparent border-none text-white font-mono text-sm p-0 focus:ring-0 outline-none cursor-pointer appearance-none pr-8"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              >
                <option value={0.5} className="bg-black">0.5x</option>
                <option value={0.8} className="bg-black">0.8x</option>
                <option value={1} className="bg-black">1.0x</option>
                <option value={1.2} className="bg-black">1.2x</option>
                <option value={1.5} className="bg-black">1.5x</option>
              </select>
              <ChevronDown className="w-4 h-4 text-white/40 -ml-7 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Toggle label="SHOW IPA" checked={showIpa} onChange={setShowIpa} />
            <Toggle
              label="HIGHLIGHT LINKING ZONE"
              checked={highlightZone}
              onChange={setHighlightZone}
              activeClass="text-orange-400"
            />
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-10 sm:mb-12">
          <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-normal text-cyan-200 mb-4 uppercase">
            LINKING WORD
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-cyan-300/15 border border-cyan-300 text-cyan-200 px-2 py-1 font-mono text-xs sm:text-sm rounded uppercase tracking-widest">
              LINGUISTIC TERM
            </span>
            <span className="text-white/65 font-mono text-xs sm:text-sm">
              {currentCategory.linguisticTerm}
            </span>
          </div>

          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <SubTabButton active={activeSubTab === 'All'} onClick={() => handleSubTabChange('All')}>
                All
              </SubTabButton>
              {subCategories.map((subCategory) => (
                <SubTabButton
                  key={subCategory}
                  active={activeSubTab === subCategory}
                  onClick={() => handleSubTabChange(subCategory)}
                >
                  {subCategory}
                </SubTabButton>
              ))}
            </div>
          )}

          {currentCategory.explanation && (
            <p className="text-white/65 max-w-3xl border-l-2 border-white/20 pl-4 text-sm sm:text-lg">
              {currentCategory.explanation}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCategory.items.map((item, index) => {
            if (activeSubTab !== 'All' && item.subCategory !== activeSubTab) return null;
            return (
              <PhraseCard
                key={`item-${index}`}
                item={item}
                id={index}
                cardRefs={cardRefs}
                isPlayingBefore={playingId === `${activeTab}-${index}-before`}
                isPlayingAfter={playingId === `${activeTab}-${index}-after`}
                showIpa={showIpa}
                highlightZone={highlightZone}
                onPlayFull={() => playFullPhrase(item, index)}
                onPlayBefore={() => playSinglePhase(buildBeforePhaseText(item.text), index, 'before')}
                onPlayAfter={() => playSinglePhase(buildAfterPhaseText(item), index, 'after')}
              />
            );
          })}
        </div>

        {(currentCategory.extraItems?.length ?? 0) > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={() => {
                setShowMore((value) => !value);
                cancelPlayback();
              }}
              className="text-cyan-200 border border-cyan-300/50 px-6 py-2 rounded-full font-mono uppercase tracking-widest text-sm hover:bg-cyan-300/10 transition-colors"
            >
              {showMore ? 'Show Less' : 'Show 15 More Examples'}
            </button>

            {showMore && (
              <div className="w-full flex flex-col items-center mt-6">
                <button
                  onClick={() => void playAll(true)}
                  className="bg-cyan-300 text-cyan-950 px-4 py-2 font-mono text-sm uppercase rounded flex items-center gap-2 hover:brightness-110 transition-all mb-6"
                >
                  <Play className="w-4 h-4 fill-current stroke-current" />
                  PLAY ALL 15 EXAMPLES
                </button>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentCategory.extraItems?.map((item, index) => {
                    if (activeSubTab !== 'All' && item.subCategory !== activeSubTab) return null;
                    const id = `extra-${index}`;
                    return (
                      <PhraseCard
                        key={id}
                        item={item}
                        id={id}
                        cardRefs={cardRefs}
                        isPlayingBefore={playingId === `${activeTab}-${id}-before`}
                        isPlayingAfter={playingId === `${activeTab}-${id}-after`}
                        showIpa={showIpa}
                        highlightZone={highlightZone}
                        onPlayFull={() => playFullPhrase(item, id)}
                        onPlayBefore={() => playSinglePhase(buildBeforePhaseText(item.text), id, 'before')}
                        onPlayAfter={() => playSinglePhase(buildAfterPhaseText(item), id, 'after')}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SubTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'px-3 py-1.5 font-mono text-xs rounded transition-colors border',
        active
          ? 'bg-cyan-300 text-cyan-950 border-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
          : 'bg-white/5 text-white/60 border-white/15 hover:border-cyan-300/50 hover:text-cyan-100',
      )}
    >
      {children}
    </button>
  );
}

function PhraseCard({
  item,
  id,
  cardRefs,
  isPlayingBefore,
  isPlayingAfter,
  showIpa,
  highlightZone,
  onPlayFull,
  onPlayBefore,
  onPlayAfter,
}: {
  item: LinkingWordItem;
  id: string | number;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  isPlayingBefore: boolean;
  isPlayingAfter: boolean;
  showIpa: boolean;
  highlightZone: boolean;
  onPlayFull: () => void;
  onPlayBefore: () => void;
  onPlayAfter: () => void;
}) {
  const isPlaying = isPlayingBefore || isPlayingAfter;

  return (
    <div
      ref={(node) => {
        cardRefs.current[String(id)] = node;
      }}
      className={cx(
        'bg-[#101414] border rounded-lg p-6 transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden',
        isPlaying
          ? 'border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
          : 'border-white/15 hover:border-cyan-300/70',
      )}
    >
      {isPlaying && <div className="absolute inset-0 bg-cyan-300/5 pointer-events-none" />}

      <div className="flex justify-between items-start relative z-10 gap-4">
        <div className="min-w-0">
          <div
            className="font-sans text-2xl font-bold text-white break-words"
            dangerouslySetInnerHTML={{
              __html: highlightZone && item.highlightedText ? item.highlightedText : item.text,
            }}
          />
          {item.translation && (
            <div className="text-white/55 mt-1 text-sm">
              {item.translation}
            </div>
          )}
        </div>

        <button
          onClick={onPlayFull}
          className={cx(
            'transition-transform shrink-0',
            isPlaying ? 'text-cyan-200 scale-110' : 'text-white/40 group-hover:text-cyan-200 hover:scale-110',
          )}
          aria-label="Play phrase"
          title="Play phrase"
        >
          <Volume2 className={cx('w-8 h-8', isPlaying && 'fill-current')} />
        </button>
      </div>

      {showIpa && (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 relative z-10 w-full overflow-hidden">
          <span className="font-mono text-xs text-white/40 uppercase tracking-widest leading-none">IPA</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
            {item.ipaBefore && (
              <div className="flex items-center gap-2 text-white/55">
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-80 whitespace-nowrap">
                  Before
                </span>
                <div className="flex items-center gap-1 bg-black/30 border border-white/15 rounded pl-2.5 pr-1 py-1">
                  <span className="font-sans text-sm mr-1 text-cyan-200">
                    {item.ipaBefore}
                  </span>
                  <button
                    onClick={onPlayBefore}
                    className={cx(
                      'p-1 rounded transition-colors',
                      isPlayingBefore
                        ? 'text-cyan-200 bg-cyan-300/10'
                        : 'text-white/40 hover:text-cyan-200 hover:bg-white/5',
                    )}
                    aria-label="Play before linking"
                    title="Play before linking"
                  >
                    <Volume2 className={cx('w-3.5 h-3.5', isPlayingBefore && 'fill-current')} />
                  </button>
                </div>
              </div>
            )}

            {item.ipaBefore && <div className="hidden sm:block text-white/25">-&gt;</div>}

            {item.ipa && (
              <div className="flex items-center gap-2 text-white/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-100 whitespace-nowrap">
                  After
                </span>
                <div className="flex items-center gap-1 bg-white/5 rounded shadow-inner border border-white/10 pl-3 pr-1 py-1.5">
                  <span
                    className="font-sans text-lg mr-2 text-cyan-200"
                    dangerouslySetInnerHTML={{
                      __html: highlightZone && item.highlightedIpa ? item.highlightedIpa : item.ipa,
                    }}
                  />
                  <button
                    onClick={onPlayAfter}
                    className={cx(
                      'p-1.5 rounded transition-colors',
                      isPlayingAfter
                        ? 'text-cyan-200 bg-cyan-300/10'
                        : 'text-white/40 hover:text-cyan-200 hover:bg-white/5',
                    )}
                    aria-label="Play after linking"
                    title="Play after linking"
                  >
                    <Volume2 className={cx('w-4 h-4', isPlayingAfter && 'fill-current')} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-100 to-cyan-300 animate-pulse w-full" />
      )}
    </div>
  );
}
