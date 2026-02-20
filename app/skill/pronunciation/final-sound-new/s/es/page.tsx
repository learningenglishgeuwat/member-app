'use client';

import { useEffect, useState } from 'react';
import BackButton from '../../../../components/BackButton';
import Sidebar from '../../../../components/skillSidebar/SkillSidebar';
import '../../final-sound-topic.css';
import './s-es.css';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../../tts-utils';

const PLURAL_ENDING_RULES = [
  {
    ending: '/s/',
    trigger: 'Setelah bunyi voiceless non-sibilant (contoh: /p/, /k/, /t/, /f/).',
    examples: [
      { word: 'cats', ipa: '/k\u00E6ts/' },
      { word: 'books', ipa: '/b\u028Aks/' },
      { word: 'cups', ipa: '/k\u028Cps/' },
    ],
  },
  {
    ending: '/z/',
    trigger: 'Setelah bunyi voiced non-sibilant dan vokal.',
    examples: [
      { word: 'dogs', ipa: '/d\u0254\u0261z/' },
      { word: 'bags', ipa: '/b\u00E6\u0261z/' },
      { word: 'keys', ipa: '/ki\u02D0z/' },
    ],
  },
  {
    ending: '/\u026Az/',
    trigger: 'Setelah sibilant: /s/, /z/, /\u0283/, /\u0292/, /t\u0283/, /d\u0292/.',
    examples: [
      { word: 'buses', ipa: '/\u02C8b\u028Cs\u026Az/' },
      { word: 'watches', ipa: '/\u02C8w\u0252t\u0283\u026Az/' },
      { word: 'bridges', ipa: '/\u02C8br\u026Ad\u0292\u026Az/' },
    ],
  },
] as const;

const FINAL_SOUND_S_ES_TABLE = [
  {
    form: '-s',
    sound: '/s/',
    useAfter: 'Voiceless non-sibilant: /p/, /t/, /k/, /f/, /\u03B8/',
    before: 'cat (/k\u00E6t/), book (/b\u028Ak/), cup (/k\u028Cp/)',
    after: 'cats (/k\u00E6ts/), books (/b\u028Aks/), cups (/k\u028Cps/)',
  },
  {
    form: '-s',
    sound: '/z/',
    useAfter:
      'Voiced non-sibilant: /b/, /d/, /\u0261/, /v/, /\u00F0/, /m/, /n/, /\u014B/, /l/, /r/, /w/, /j/; atau setelah vokal',
    before: 'dog (/d\u0254\u0261/), bag (/b\u00E6\u0261/), key (/ki\u02D0/)',
    after: 'dogs (/d\u0254\u0261z/), bags (/b\u00E6\u0261z/), keys (/ki\u02D0z/)',
  },
  {
    form: '-es',
    sound: '/\u026Az/',
    useAfter: 'Sibilant: /s/, /z/, /\u0283/, /\u0292/, /t\u0283/, /d\u0292/',
    before: 'bus (/b\u028Cs/), watch (/w\u0252t\u0283/), bridge (/br\u026Ad\u0292/)',
    after:
      'buses (/b\u028Cs\u026Az/), watches (/w\u0252t\u0283\u026Az/), bridges (/br\u026Ad\u0292\u026Az/)',
  },
] as const;

const COMMON_MISTAKES = [
  'Membaca semua akhiran -s sebagai /s/ tanpa melihat bunyi sebelumnya.',
  'Mengabaikan bunyi /\u026Az/ pada kata sibilant seperti buses, watches, bridges.',
  'Tidak membedakan plural noun dan third-person singular verb (contoh: dogs vs runs).',
  'Hanya melihat huruf akhir, bukan bunyi akhir kata dasar.',
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

export default function FinalSoundSEsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    concept: false,
    pluralEndings: false,
    rulesTable: false,
    commonMistakes: false,
  });

  const toggleSection = (
    section: 'concept' | 'pluralEndings' | 'rulesTable' | 'commonMistakes',
  ) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  return (
    <div className="pronunciation-layout fs-topic-page s-es-page">
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
          <h1 className="fs-topic-title">S/ES Final Sound</h1>
          <p className="fs-topic-subtitle">
            Fokus pada aturan pengucapan akhiran -s/-es untuk plural noun dan third-person
            singular.
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
              Bunyi akhir pada akhiran <strong>-s/-es</strong> bergantung pada bunyi terakhir kata
              dasarnya, bukan huruf akhirnya.
            </p>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('pluralEndings')}
              aria-expanded={openSections.pluralEndings}
            >
              <span>Plural Endings (-s)</span>
              <span
                className={`fs-topic-section-icon ${openSections.pluralEndings ? 'is-open' : ''}`}
              >
                ▾
              </span>
            </button>
          </h2>
          {openSections.pluralEndings ? (
            <div className="fs-topic-grid">
              {PLURAL_ENDING_RULES.map((rule) => (
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
              <span>Final Sound Rules for -s/-es (Table)</span>
              <span className={`fs-topic-section-icon ${openSections.rulesTable ? 'is-open' : ''}`}>
                ▾
              </span>
            </button>
          </h2>
          {openSections.rulesTable ? (
            <>
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
                    {FINAL_SOUND_S_ES_TABLE.map((row) => (
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
              <div className="fs-topic-table-note">
                <p className="fs-topic-table-note-title">Catatan:</p>
                <ul className="fs-topic-table-note-list">
                  <li>
                    /h/ hampir tidak muncul sebagai bunyi akhir dalam English. Untuk kata
                    berakhiran huruf <strong>h</strong>, lihat bunyi akhirnya (contoh:{' '}
                    <em>laugh</em> /f/, <em>stomach</em> /k/).
                  </li>
                </ul>
              </div>
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
