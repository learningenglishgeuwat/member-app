'use client';

import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import './stressing.css';

const WORD_STRESS_EXAMPLES = [
  {
    word: 'TAble',
    plain: 'table',
    ipa: '/ˈteɪ.bəl/',
    type: 'Kata Benda',
    note: 'Dua suku kata, umumnya kata benda diberi tekanan di suku kata pertama.',
  },
  {
    word: 'aBOVE',
    plain: 'above',
    ipa: '/əˈbʌv/',
    type: 'Kata Depan',
    note: 'Dua suku kata, banyak kata depan dan kata fungsi diberi tekanan di suku kata kedua.',
  },
  {
    word: 'PHOtograph',
    plain: 'photograph',
    ipa: '/ˈfoʊ.t̬ə.ɡræf/',
    type: 'Kata Benda',
    note: 'Tekanan utama berada di awal kata.',
  },
  {
    word: 'phoTOGraphy',
    plain: 'photography',
    ipa: '/fəˈtɑː.ɡrə.fi/',
    type: 'Kata Benda',
    note: 'Saat bentuk kata berubah, posisi tekanan bisa berpindah.',
  },
  {
    word: 'REcord',
    plain: 'The record is on the table.',
    ipa: '/ˈrek.ərd/',
    type: 'Kata Benda',
    note: 'Kontras kata benda-kata kerja: kata benda biasanya ditekan di awal.',
  },
  {
    word: 'reCORD',
    plain: 'I need to record this lesson now.',
    ipa: '/rɪˈkɔːrd/',
    type: 'Kata Kerja',
    note: 'Pada banyak pasangan kata benda-kata kerja, kata kerja ditekan di suku kata kedua.',
  },
] as const;

const IPA_STRESS_MARKS = [
  { mark: 'ˈ', label: 'Tekanan Utama', note: 'Suku kata yang paling kuat.' },
  { mark: 'ˌ', label: 'Tekanan Sekunder', note: 'Tekanan tambahan yang lebih lemah dari tekanan utama.' },
  {
    mark: 'ə',
    label: 'Schwa',
    note: 'Vokal lemah pada suku kata yang tidak ditekan.',
  },
] as const;

const SYLLABLE_EXAMPLES = [
  {
    word: 'TAble',
    plain: 'table',
    split: 'TA-ble',
    ipa: '/ˈteɪ.bəl/',
    count: 2,
    note: 'Satu puncak tekanan utama di suku kata pertama.',
  },
  {
    word: 'imPORtant',
    plain: 'important',
    split: 'im-POR-tant',
    ipa: '/ɪmˈpɔːr.tənt/',
    count: 3,
    note: 'Suku kata tengah menerima tekanan utama.',
  },
  {
    word: 'phoTOGraphy',
    plain: 'photography',
    split: 'pho-TO-gra-phy',
    ipa: '/fəˈtɑː.ɡrə.fi/',
    count: 4,
    note: 'Untuk kata panjang, hitung ketukan dulu, lalu tentukan tekanan utama.',
  },
  {
    word: 'communiCAtion',
    plain: 'communication',
    split: 'com-mu-ni-CA-tion',
    ipa: '/kəˌmjuː.nəˈkeɪ.ʃən/',
    count: 5,
    note: 'Ada tekanan sekunder (ˌ) dan tekanan utama (ˈ).',
  },
] as const;

const QUICK_RULES = [
  {
    title: 'Kata Benda/Kata Sifat 2 Suku Kata',
    note: 'Umumnya ditekan di suku kata pertama.',
    examples: ['TAble', 'HAPpy'],
  },
  {
    title: 'Kata Kerja 2 Suku Kata',
    note: 'Umumnya ditekan di suku kata kedua.',
    examples: ['reLAX', 'deCIDE'],
  },
  {
    title: 'Pergeseran Tekanan dalam Keluarga Kata',
    note: 'Perubahan bentuk kata bisa menggeser posisi tekanan.',
    examples: ['PHOtograph -> phoTOGraphy', 'eCONomy -> ecoNOMic'],
  },
] as const;

const STRESS_POSITION_BANK = [
  {
    title: 'Stress di Syllable Pertama',
    items: [
      'TAble /ˈteɪ.bəl/',
      'HAPpy /ˈhæ.pi/',
      'DOCtor /ˈdɑːk.tər/',
      'WINdow /ˈwɪn.doʊ/',
      'MUsic /ˈmjuː.zɪk/',
      'MOney /ˈmʌ.ni/',
      'BEAUtiful /ˈbjuː.t̬ə.fəl/',
      'FAmily /ˈfæ.mə.li/',
      'ANimal /ˈæ.nə.məl/',
      'CIty /ˈsɪ.ti/',
    ],
  },
  {
    title: 'Stress di Syllable Kedua',
    items: [
      'aBOVE /əˈbʌv/',
      'hoTEL /hoʊˈtel/',
      'beGIN /bɪˈɡɪn/',
      'reLAX /rɪˈlæks/',
      'arRIVE /əˈraɪv/',
      'deCIDE /dɪˈsaɪd/',
      'toDAY /təˈdeɪ/',
      'exPLAIN /ɪkˈspleɪn/',
      'forGET /fərˈɡet/',
      'beLIEVE /bɪˈliːv/',
    ],
  },
  {
    title: 'Stress di Syllable Ketiga',
    items: [
      'engiNEER /ˌen.dʒəˈnɪr/',
      'volunTEER /ˌvɑː.lənˈtɪr/',
      'refuGEE /ˌref.juˈdʒiː/',
      'underSTAND /ˌʌn.dərˈstænd/',
      'interRUPT /ˌɪn.tərˈrʌpt/',
      'overLOOK /ˌoʊ.vərˈlʊk/',
      'afterNOON /ˌæf.tərˈnuːn/',
      'guaranTEE /ˌɡer.ənˈtiː/',
      'enterTAIN /ˌen.tərˈteɪn/',
      'compreHEND /ˌkɑːm.prɪˈhend/',
    ],
  },
  {
    title: 'Stress di Syllable Keempat',
    items: [
      'communiCAtion /kəˌmjuː.nəˈkeɪ.ʃən/',
      'determiNAtion /dɪˌtɝː.məˈneɪ.ʃən/',
      'appreCIAtion /əˌpriː.ʃiˈeɪ.ʃən/',
      'organiZAtion /ˌɔːr.ɡə.nəˈzeɪ.ʃən/',
      'clarifiCAtion /ˌkler.ə.fəˈkeɪ.ʃən/',
      'modifiCAtion /ˌmɑː.də.fəˈkeɪ.ʃən/',
      'verifiCAtion /ˌver.ə.fəˈkeɪ.ʃən/',
      'notifiCAtion /ˌnoʊ.t̬ə.fəˈkeɪ.ʃən/',
      'justifiCAtion /ˌdʒʌ.stə.fəˈkeɪ.ʃən/',
      'classifiCAtion /ˌklæ.sə.fəˈkeɪ.ʃən/',
    ],
  },
] as const;

const SENTENCE_STRESS_EXAMPLES = [
  {
    tokens: [
      { text: 'I', weak: true },
      { text: 'WANTED', stressed: true },
      { text: 'a', weak: true },
      { text: 'RED', stressed: true },
      { text: 'pen,', stressed: true },
      { text: 'not', weak: true },
      { text: 'a', weak: true },
      { text: 'BLUE', stressed: true },
      { text: 'one.', stressed: true },
    ],
    tts: 'I wanted a red pen, not a blue one.',
    note: 'Kata yang ditekankan mengubah fokus makna.',
  },
  {
    tokens: [
      { text: 'She', weak: true },
      { text: 'CAN', stressed: true },
      { text: 'swim,', stressed: true },
      { text: 'but', weak: true },
      { text: 'she', weak: true },
      { text: 'CANNOT', stressed: true },
      { text: 'dive.', stressed: true },
    ],
    tts: 'She can swim, but she cannot dive.',
    note: 'Stress dipakai untuk kontras informasi.',
  },
  {
    tokens: [
      { text: 'I', weak: true },
      { text: 'did', weak: true },
      { text: 'NOT', stressed: true },
      { text: 'say', stressed: true },
      { text: 'he', weak: true },
      { text: 'stole', stressed: true },
      { text: 'the', weak: true },
      { text: 'money.', stressed: true },
    ],
    tts: 'I did not say he stole the money.',
    note: 'Memindahkan tekanan bisa mengubah interpretasi kalimat.',
  },
] as const;

const CONTENT_FUNCTION_EXAMPLES = [
  {
    title: 'Content Words (Usually Stressed)',
    note: 'Biasanya mencakup noun, main verb, adjective, adverb.',
    points: [
      'Membawa makna inti kalimat',
      'Menerima tekanan yang lebih kuat',
      'Biasanya terdengar lebih jelas dan lebih panjang',
    ],
    example: 'The NEW PROJECT needs CLEAR GOALS.',
    plain: 'The new project needs clear goals.',
  },
  {
    title: 'Function Words (Usually Weak)',
    note: 'Biasanya article, pronoun, preposition, auxiliary, conjunction.',
    points: [
      'Mendukung struktur tata bahasa',
      'Sering direduksi dalam connected speech',
      'Cenderung pendek dan lemah dalam ritme kalimat',
    ],
    example: 'I can DO it in a MINute.',
    plain: 'I can do it in a minute.',
  },
  {
    title: 'When Function Words Become Stressed',
    note: 'Function words bisa ditekankan saat memberi kontras/penegasan.',
    points: [
      'Kontras: CAN vs CANNOT',
      'Koreksi: did vs did NOT',
      'Perpindahan fokus dalam percakapan',
    ],
    example: 'She CAN swim, but she CANNOT dive.',
    plain: 'She can swim, but she cannot dive.',
  },
] as const;

const NOUN_VERB_STRESS_CONTRAST = [
  {
    base: 'record',
    noun: 'REcord',
    nounIpa: '/ˈrek.ərd/',
    nounPlain: 'The record is on the table.',
    verb: 'reCORD',
    verbIpa: '/rɪˈkɔːrd/',
    verbPlain: 'I need to record this lesson now.',
    note: 'Ejaan sama, fungsi berbeda, posisi tekanan ikut berubah.',
  },
  {
    base: 'present',
    noun: 'PREsent',
    nounIpa: '/ˈprez.ənt/',
    nounPlain: 'This is a birthday present.',
    verb: 'preSENT',
    verbIpa: '/prɪˈzent/',
    verbPlain: 'They will present the final report today.',
    note: 'Kontras noun-verb paling umum di level menengah.',
  },
  {
    base: 'increase',
    noun: 'INcrease',
    nounIpa: '/ˈɪn.kriːs/',
    nounPlain: 'There was an increase in sales.',
    verb: 'inCREASE',
    verbIpa: '/ɪnˈkriːs/',
    verbPlain: 'Sales can increase next month.',
    note: 'Noun cenderung tekanan awal, verb cenderung tekanan akhir.',
  },
  {
    base: 'import',
    noun: 'IMport',
    nounIpa: '/ˈɪm.pɔːrt/',
    nounPlain: 'Rice is a major import here.',
    verb: 'imPORT',
    verbIpa: '/ɪmˈpɔːrt/',
    verbPlain: 'They import rice from abroad.',
    note: 'Pergeseran stress mengubah kelas kata sekaligus makna gramatikal.',
  },
] as const;

const SELF_CHECK_STEPS = [
  'Hitung jumlah suku kata terlebih dahulu.',
  'Tandai satu tekanan utama pada setiap kata.',
  'Buat function words lebih ringan, kecuali saat perlu kontras.',
  'Rekam suara Anda lalu bandingkan dengan audio di kamus.',
  'Ulangi kata yang sulit dalam kalimat pendek, bukan hanya kata lepas.',
] as const;

const COMMON_MISTAKES = [
  {
    wrong: 'Meletakkan tekanan sama rata pada semua suku kata.',
    correct: 'Pilih satu suku kata utama yang paling kuat.',
  },
  {
    wrong: 'Menghafal tekanan tanpa mengecek pola kata saat bentuknya berubah.',
    correct: 'Latih pasangan bentuk kata: PHOtograph -> phoTOGraphy.',
  },
  {
    wrong: 'Tidak memberi tekanan pada kata inti saat berbicara.',
    correct: 'Tekankan kata benda, kata kerja utama, kata sifat, dan kata keterangan penting.',
  },
] as const;

type SectionKey =
  | 'konsep'
  | 'dasarSukuKata'
  | 'tekananKata'
  | 'kontrasNounVerb'
  | 'tandaIpa'
  | 'aturanCepat'
  | 'bankKata'
  | 'kataKontenFungsi'
  | 'tekananKalimat'
  | 'alurCek'
  | 'kesalahanUmum'
  | 'catatanPenting';

const INITIAL_SECTION_STATE: Record<SectionKey, boolean> = {
  konsep: true,
  dasarSukuKata: true,
  tekananKata: true,
  kontrasNounVerb: true,
  tandaIpa: true,
  aturanCepat: true,
  bankKata: true,
  kataKontenFungsi: true,
  tekananKalimat: true,
  alurCek: true,
  kesalahanUmum: true,
  catatanPenting: true,
};

function renderStressHighlight(text: string) {
  const chunks: Array<{ text: string; highlighted: boolean }> = [];

  for (const ch of text) {
    const highlighted = /[A-Z]/.test(ch);
    const normalized = highlighted ? ch.toLowerCase() : ch;
    const last = chunks[chunks.length - 1];

    if (last && last.highlighted === highlighted) {
      last.text += normalized;
    } else {
      chunks.push({ text: normalized, highlighted });
    }
  }

  return chunks.map((chunk, idx) =>
    chunk.highlighted ? (
      <span key={`${text}-${idx}`} className="stress-inline-highlight">
        {chunk.text}
      </span>
    ) : (
      <span key={`${text}-${idx}`}>{chunk.text}</span>
    ),
  );
}

function normalizeStressText(text: string) {
  return text.replace(/[A-Z]/g, (char) => char.toLowerCase()).replace(/\s*->\s*/g, ' to ');
}

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  return (
    voices.find((voice) => voice.name === 'Google US English') ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Google')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Samantha')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Zira')) ||
    voices.find((voice) => voice.lang === 'en-US') ||
    null
  );
}

function speakText(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const bestVoice = getPreferredEnglishVoice();

  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang;
  } else {
    utterance.lang = 'en-US';
  }

  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export default function StressingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    INITIAL_SECTION_STATE,
  );

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function renderSectionHeader(key: SectionKey, title: string) {
    const isOpen = openSections[key];
    return (
      <h2 className="stress-block-title">
        <button
          type="button"
          className="stress-section-toggle"
          onClick={() => toggleSection(key)}
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <span className="stress-section-indicator" aria-hidden="true">
            {isOpen ? '-' : '+'}
          </span>
        </button>
      </h2>
    );
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <div className="pronunciation-layout stress-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="stress-shell">
        <header className="stress-header">
          <h1 className="stress-title">Stressing</h1>
          <p className="stress-subtitle">
            Latihan tekanan kata dan tekanan kalimat agar ritme ucapan lebih alami.
          </p>
        </header>

        <section className="stress-block">
          {renderSectionHeader('konsep', 'Concept')}
          {openSections.konsep && (
            <p className="stress-text">
              Bahasa Inggris adalah bahasa bertempo tekanan (stress-timed). Artinya, beberapa suku
              kata atau kata diucapkan lebih kuat dibanding yang lain. Tekanan yang tepat membuat
              ucapan lebih jelas dan terdengar alami.
            </p>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('dasarSukuKata', 'Syllable Basics and Beat')}
          {openSections.dasarSukuKata && (
            <>
              <p className="stress-text">
                <strong>Suku kata (syllable)</strong> adalah satu unit bunyi atau ketukan saat kata
                diucapkan. Sebelum belajar tekanan, kenali dulu jumlah suku kata dan
                pemenggalannya.
              </p>
              <ul className="stress-bullets">
                <li>- Cara cepat menghitung: dengarkan jumlah ketukan saat kata diucapkan.</li>
                <li>- Tepuk tangan per ketukan untuk membantu identifikasi suku kata.</li>
                <li>- Setelah jumlah suku kata jelas, tentukan suku kata yang mendapat tekanan.</li>
              </ul>
              <div className="stress-syllable-grid">
                {SYLLABLE_EXAMPLES.map((item) => (
                  <article key={item.word + item.split} className="stress-syllable-card">
                    <div className="stress-card-top">
                      <div className="stress-word-wrap">
                        <h3 className="stress-word">{renderStressHighlight(item.word)}</h3>
                        <p className="stress-ipa">{item.ipa}</p>
                      </div>
                      <button
                        type="button"
                        className="stress-play-btn"
                        onClick={() => speakText(item.plain)}
                      >
                        Putar
                      </button>
                    </div>
                    <p className="stress-syllable-meta">
                      Pemisahan: {renderStressHighlight(item.split)}
                    </p>
                    <p className="stress-syllable-meta">Jumlah suku kata: {item.count}</p>
                    <p className="stress-card-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tandaIpa', 'IPA Stress Symbols')}
          {openSections.tandaIpa && (
            <div className="stress-mark-grid">
              {IPA_STRESS_MARKS.map((item) => (
                <article key={item.mark + item.label} className="stress-mark-card">
                  <div className="stress-mark">{item.mark}</div>
                  <div>
                    <p className="stress-mark-label">{item.label}</p>
                    <p className="stress-mark-note">{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('aturanCepat', 'Word Stress Rules')}
          {openSections.aturanCepat && (
            <div className="stress-rule-grid">
              {QUICK_RULES.map((item) => (
                <article key={item.title} className="stress-rule-card">
                  <h3 className="stress-rule-title">{item.title}</h3>
                  <p className="stress-rule-note">{item.note}</p>
                  <div className="stress-rule-examples">
                    {item.examples.map((example) => (
                      <div key={`${item.title}-${example}`} className="stress-rule-example-item">
                        <span>{renderStressHighlight(example)}</span>
                        <button
                          type="button"
                          className="stress-mini-play-btn"
                          onClick={() => speakText(normalizeStressText(example))}
                        >
                          Putar
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tekananKata', 'Word Stress Examples')}
          {openSections.tekananKata && (
            <>
              <p className="stress-text">
                Fokuskan latihan pada posisi tekanan utama. Perhatikan juga kontras kata benda-kata
                kerja seperti <strong>REcord</strong> vs <strong>reCORD</strong>.
              </p>
              <div className="stress-grid">
                {WORD_STRESS_EXAMPLES.map((item) => (
                  <article key={item.word} className="stress-card">
                    <div className="stress-card-top">
                      <div className="stress-word-wrap">
                        <h3 className="stress-word">{renderStressHighlight(item.word)}</h3>
                        <p className="stress-ipa">{item.ipa}</p>
                      </div>
                      <button
                        type="button"
                        className="stress-play-btn"
                        onClick={() => speakText(item.plain)}
                      >
                        Putar
                      </button>
                    </div>
                    <p className="stress-card-type">{item.type}</p>
                    <p className="stress-card-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kontrasNounVerb', 'Noun-Verb Stress Contrast')}
          {openSections.kontrasNounVerb && (
            <>
              <p className="stress-text">
                Pada beberapa kata 2 suku kata, <strong>noun</strong> sering ditekan di awal,
                sedangkan <strong>verb</strong> di suku kata berikutnya.
              </p>
              <div className="stress-rule-grid">
                {NOUN_VERB_STRESS_CONTRAST.map((item) => (
                  <article key={item.base} className="stress-rule-card">
                    <h3 className="stress-rule-title">{item.base.toUpperCase()}</h3>
                    <p className="stress-rule-note">{item.note}</p>
                    <div className="stress-rule-examples">
                      <div className="stress-rule-example-item">
                        <span>
                          Noun: {renderStressHighlight(item.noun)} {item.nounIpa}
                        </span>
                        <button
                          type="button"
                          className="stress-mini-play-btn"
                          onClick={() => speakText(item.nounPlain)}
                        >
                          Putar
                        </button>
                      </div>
                      <div className="stress-rule-example-item">
                        <span>
                          Verb: {renderStressHighlight(item.verb)} {item.verbIpa}
                        </span>
                        <button
                          type="button"
                          className="stress-mini-play-btn"
                          onClick={() => speakText(item.verbPlain)}
                        >
                          Putar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('bankKata', 'Practice Bank by Stress Position')}
          {openSections.bankKata && (
            <>
              <p className="stress-text">
                Berikut bank kata untuk latihan membedakan posisi tekanan utama pada suku kata
                pertama, kedua, ketiga, dan keempat.
              </p>
              <div className="stress-bank-grid">
                {STRESS_POSITION_BANK.map((group) => (
                  <article key={group.title} className="stress-bank-card">
                    <h3 className="stress-bank-title">{group.title}</h3>
                    <ul className="stress-bank-list">
                      {group.items.map((item) => {
                        const [word, ...ipaParts] = item.split(' ');
                        const ipaText = ipaParts.join(' ');
                        return (
                          <li key={`${group.title}-${item}`}>
                            <div className="stress-bank-item-row">
                              <span>
                                {renderStressHighlight(word)}
                                {ipaText ? <> {ipaText}</> : null}
                              </span>
                              <button
                                type="button"
                                className="stress-mini-play-btn"
                                onClick={() => speakText(normalizeStressText(word))}
                              >
                                Putar
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tekananKalimat', 'Sentence Stress and Meaning Focus')}
          {openSections.tekananKalimat && (
            <div className="stress-list-wrap">
              {SENTENCE_STRESS_EXAMPLES.map((item) => (
                <article key={item.tts} className="stress-list-item">
                  <p className="stress-sentence">
                    {item.tokens.map((token, idx) => (
                      <span
                        key={`${item.tts}-${idx}-${token.text}`}
                        className={`stress-token ${
                          'stressed' in token && token.stressed
                            ? 'stress-token-strong'
                            : 'weak' in token && token.weak
                              ? 'stress-token-weak'
                              : ''
                        }`}
                      >
                        {token.text}
                      </span>
                    ))}
                  </p>
                  <p className="stress-note">{item.note}</p>
                  <button
                    type="button"
                    className="stress-play-btn"
                    onClick={() => speakText(item.tts)}
                  >
                    Putar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kataKontenFungsi', 'Content vs Function Words')}
          {openSections.kataKontenFungsi && (
            <div className="stress-rule-grid">
              {CONTENT_FUNCTION_EXAMPLES.map((item) => (
                <article key={item.title} className="stress-rule-card">
                  <h3 className="stress-rule-title">{item.title}</h3>
                  <p className="stress-rule-note">{item.note}</p>
                  <ul className="stress-bullets">
                    {item.points.map((point) => (
                      <li key={`${item.title}-${point}`}>- {point}</li>
                    ))}
                  </ul>
                  <div className="stress-rule-examples">
                    <div className="stress-rule-example-item">
                      <span>{renderStressHighlight(item.example)}</span>
                      <button
                        type="button"
                        className="stress-mini-play-btn"
                        onClick={() => speakText(item.plain)}
                      >
                        Putar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('alurCek', 'Self-Check Workflow')}
          {openSections.alurCek && (
            <>
              <p className="stress-text">
                Gunakan alur ini setiap selesai latihan supaya perbaikan pronunciation lebih konsisten.
              </p>
              <ul className="stress-bullets">
                {SELF_CHECK_STEPS.map((step) => (
                  <li key={step}>- {step}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kesalahanUmum', 'Common Mistakes and Fixes')}
          {openSections.kesalahanUmum && (
            <div className="stress-fix-grid">
              {COMMON_MISTAKES.map((item) => (
                <article key={item.wrong} className="stress-fix-card">
                  <p className="stress-fix-wrong">Salah: {item.wrong}</p>
                  <p className="stress-fix-correct">Benar: {item.correct}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('catatanPenting', 'Practice Tips')}
          {openSections.catatanPenting && (
            <ul className="stress-bullets">
              <li>- Latih satu kata berkali-kali sambil tepuk ritme suku kata.</li>
              <li>- Bandingkan pronunciation di kamus (IPA + audio) dengan ucapan sendiri.</li>
              <li>
                - Fokus kata inti saat tekanan kalimat (kata benda, kata kerja utama, kata sifat,
                kata keterangan).
              </li>
              <li>- Jangan terlalu menekan semua kata sekaligus.</li>
              <li>- Aturan cepat membantu, tetapi tetap cek pengecualian di kamus.</li>
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
