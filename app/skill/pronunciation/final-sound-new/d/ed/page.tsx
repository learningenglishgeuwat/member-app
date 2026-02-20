'use client';

import { useEffect, useState } from 'react';
import BackButton from '../../../../components/BackButton';
import Sidebar from '../../../../components/skillSidebar/SkillSidebar';
import '../../final-sound-topic.css';
import './d-ed.css';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../../tts-utils';

const PAST_ENDING_RULES = [
  {
    ending: '/t/',
    trigger: 'Setelah bunyi voiceless (kecuali /t/).',
    examples: [
      { word: 'worked', ipa: '/w\u025C\u02D0rkt/' },
      { word: 'washed', ipa: '/w\u0252\u0283t/' },
      { word: 'stopped', ipa: '/st\u0252pt/' },
    ],
  },
  {
    ending: '/d/',
    trigger: 'Setelah bunyi voiced (kecuali /d/).',
    examples: [
      { word: 'played', ipa: '/ple\u026Ad/' },
      { word: 'cleaned', ipa: '/kli\u02D0nd/' },
      { word: 'called', ipa: '/k\u0254\u02D0ld/' },
    ],
  },
  {
    ending: '/\u026Ad/',
    trigger: 'Setelah bunyi /t/ atau /d/.',
    examples: [
      { word: 'wanted', ipa: '/\u02C8w\u0252nt\u026Ad/' },
      { word: 'needed', ipa: '/\u02C8ni\u02D0d\u026Ad/' },
      { word: 'decided', ipa: '/d\u026A\u02C8sa\u026Ad\u026Ad/' },
    ],
  },
] as const;

const FINAL_SOUND_ED_TABLE = [
  {
    form: '-ed',
    sound: '/t/',
    useAfter: 'Voiceless sound (kecuali /t/): /p/, /k/, /f/, /s/, /\u0283/, /t\u0283/, /\u03B8/',
    before: 'work (/w\u025C\u02D0rk/), wash (/w\u0252\u0283/), stop (/st\u0252p/)',
    after: 'worked (/w\u025C\u02D0rkt/), washed (/w\u0252\u0283t/), stopped (/st\u0252pt/)',
  },
  {
    form: '-ed',
    sound: '/d/',
    useAfter:
      'Voiced sound (kecuali /d/): /b/, /\u0261/, /v/, /z/, /\u0292/, /d\u0292/, /\u00F0/, /m/, /n/, /\u014B/, /l/, /r/, /w/, /j/; atau setelah bunyi vokal',
    before: 'play (/ple\u026A/), clean (/kli\u02D0n/), call (/k\u0254\u02D0l/)',
    after: 'played (/ple\u026Ad/), cleaned (/kli\u02D0nd/), called (/k\u0254\u02D0ld/)',
  },
  {
    form: '-ed',
    sound: '/\u026Ad/',
    useAfter: 'Setelah bunyi /t/ atau /d/',
    before: 'want (/w\u0252nt/), need (/ni\u02D0d/), decide (/d\u026Asa\u026Ad/)',
    after: 'wanted (/w\u0252nt\u026Ad/), needed (/ni\u02D0d\u026Ad/), decided (/d\u026Asa\u026Ad\u026Ad/)',
  },
] as const;

const COMMON_MISTAKES = [
  'Membaca semua akhiran -ed sebagai /ed/ dalam semua kata.',
  'Menghilangkan bunyi akhir pada past tense saat bicara cepat.',
  'Tidak membedakan /t/ vs /d/ sehingga worked dan played terdengar sama.',
  'Membaca wanted/needed terlalu cepat sehingga bunyi /\u026Ad/ hilang.',
] as const;

function renderUseAfter(value: string) {
  const parts = value
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) return value;

  return (
    <div className="fs-topic-table-use-after">
      {parts.map((part) => (
        <p key={part}>{part}</p>
      ))}
    </div>
  );
}

function renderTableExamples(value: string) {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const word = item.split(' (')[0]?.trim() ?? item;
      return { label: item, word };
    });

  return (
    <ul className="fs-topic-table-example-list">
      {items.map((item) => (
        <li key={item.label} className="fs-topic-table-example-row">
          <span>{item.label}</span>
          <button
            type="button"
            className="fs-topic-mini-btn"
            onClick={() => void speakWithBestEnglishVoice(item.word)}
          >
            Putar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function FinalSoundDEdPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    concept: false,
    pastEndings: false,
    rulesTable: false,
    commonMistakes: false,
  });

  const toggleSection = (
    section: 'concept' | 'pastEndings' | 'rulesTable' | 'commonMistakes',
  ) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  return (
    <div className="pronunciation-layout fs-topic-page d-ed-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation/final-sound-new" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="fs-topic-shell">
        <header className="fs-topic-header">
          <h1 className="fs-topic-title">D/ED Final Sound</h1>
          <p className="fs-topic-subtitle">
            Fokus pada aturan pengucapan akhiran -ed pada regular verbs di bentuk past tense.
          </p>
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
              <span className={`fs-topic-section-icon ${openSections.concept ? 'is-open' : ''}`}>
                ▾
              </span>
            </button>
          </h2>
          {openSections.concept ? (
            <p className="fs-topic-text">
              Bunyi akhir pada akhiran <strong>-ed</strong> bergantung pada bunyi terakhir kata
              dasar, bukan dibaca sama untuk semua kata.
            </p>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('pastEndings')}
              aria-expanded={openSections.pastEndings}
            >
              <span>Past Endings (-ed)</span>
              <span className={`fs-topic-section-icon ${openSections.pastEndings ? 'is-open' : ''}`}>
                ▾
              </span>
            </button>
          </h2>
          {openSections.pastEndings ? (
            <div className="fs-topic-grid">
              {PAST_ENDING_RULES.map((rule) => (
                <article key={rule.ending} className="fs-topic-card">
                  <h3 className="fs-topic-card-title">Dibaca {rule.ending}</h3>
                  <p className="fs-topic-card-note">{rule.trigger}</p>
                  <ul className="fs-topic-example-list">
                    {rule.examples.map((example) => (
                      <li key={example.word}>
                        {example.word} {example.ipa}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('rulesTable')}
              aria-expanded={openSections.rulesTable}
            >
              <span>Final Sound Rules for -ed (Table)</span>
              <span className={`fs-topic-section-icon ${openSections.rulesTable ? 'is-open' : ''}`}>
                ▾
              </span>
            </button>
          </h2>
          {openSections.rulesTable ? (
            <div className="fs-topic-rules-table-wrap">
              <table className="fs-topic-rules-table">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Sound</th>
                    <th>Use After</th>
                    <th>Before (IPA)</th>
                    <th>After (IPA)</th>
                  </tr>
                </thead>
                <tbody>
                  {FINAL_SOUND_ED_TABLE.map((row) => (
                    <tr key={`${row.form}-${row.sound}`}>
                      <td>{row.form}</td>
                      <td>{row.sound}</td>
                      <td>{renderUseAfter(row.useAfter)}</td>
                      <td>{renderTableExamples(row.before)}</td>
                      <td>{renderTableExamples(row.after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              <span
                className={`fs-topic-section-icon ${openSections.commonMistakes ? 'is-open' : ''}`}
              >
                ▾
              </span>
            </button>
          </h2>
          {openSections.commonMistakes ? (
            <ul className="fs-topic-list">
              {COMMON_MISTAKES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      </main>
    </div>
  );
}
