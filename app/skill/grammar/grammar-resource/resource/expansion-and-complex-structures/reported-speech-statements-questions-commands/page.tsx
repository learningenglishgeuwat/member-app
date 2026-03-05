import BackButton from '../../../../../components/BackButton';
import './reported-speech-statements-questions-commands.css';
import '../../topic-layout.css';

const REPORTED_TYPES = [
  {
    title: 'Reported Statements',
    desc: 'Menyampaikan ulang pernyataan orang lain (umumnya with that-clause).',
    examples: [
      'Direct: She said, "I am tired."',
      'Reported: She said (that) she was tired.',
      'Direct: They said, "We have finished."',
      'Reported: They said (that) they had finished.',
    ],
  },
  {
    title: 'Reported Questions',
    desc: 'Menyampaikan pertanyaan tanpa urutan inversi seperti direct question.',
    examples: [
      'Direct: He asked, "Where do you live?"',
      'Reported: He asked where I lived.',
      'Direct: She asked, "Are you ready?"',
      'Reported: She asked if I was ready.',
    ],
  },
  {
    title: 'Reported Commands / Requests',
    desc: 'Perintah/permintaan berubah menjadi tell/ask + object + to infinitive.',
    examples: [
      'Direct: The teacher said, "Open your book."',
      'Reported: The teacher told us to open our books.',
      'Direct: Mom said, "Don\'t be late."',
      'Reported: Mom told me not to be late.',
    ],
  },
] as const;

const BACKSHIFT_RULES = [
  'present simple -> past simple',
  'present continuous -> past continuous',
  'present perfect -> past perfect',
  'past simple -> past perfect',
  'will -> would',
  'may -> might',
  'can -> could',
] as const;

const REFERENCE_SHIFTS = [
  { from: 'now', to: 'then' },
  { from: 'today', to: 'that day' },
  { from: 'tonight', to: 'that night' },
  { from: 'tomorrow', to: 'the next day / the following day' },
  { from: 'yesterday', to: 'the day before' },
  { from: 'this', to: 'that' },
  { from: 'these', to: 'those' },
  { from: 'here', to: 'there' },
] as const;

const QUESTION_PATTERNS = [
  {
    title: 'WH-Questions',
    pattern: 'asked + wh-word + subject + verb',
    example: 'Direct: "Where do you live?" -> Reported: He asked where I lived.',
  },
  {
    title: 'Yes/No Questions',
    pattern: 'asked + if/whether + subject + verb',
    example: 'Direct: "Are you ready?" -> Reported: She asked if I was ready.',
  },
] as const;

const NO_BACKSHIFT_CASES = [
  'Reporting verb present: She says (that) she is tired.',
  'Fakta umum yang tetap benar: The teacher said the Earth revolves around the Sun.',
  'Situasi belum berubah sampai sekarang: He said he works in Jakarta. (dan masih bekerja di sana)',
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She said me that she was busy.', correct: 'She told me that she was busy.' },
  { wrong: 'He asked where did I go.', correct: 'He asked where I went.' },
  { wrong: 'The coach told to run faster.', correct: 'The coach told us to run faster.' },
  { wrong: 'She asked if I was ready?', correct: 'She asked if I was ready.' },
] as const;

export default function ReportedSpeechPage() {
  return (
    <main className="rs-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="rs-shell gr-topic-shell">
        <header className="rs-header">
          <h1 className="rs-title">Reported Speech (Statements, Questions, Commands)</h1>
          <p className="rs-subtitle">
            Reported speech dipakai untuk menyampaikan kembali ucapan orang lain tanpa mengutip
            kalimat persisnya.
          </p>
        </header>

        <section className="rs-block">
          <h2 className="rs-block-title">Konsep</h2>
          <p className="rs-text">
            Direct speech mengutip ucapan asli. Reported speech menyampaikan makna ucapan tersebut
            dengan penyesuaian struktur, pronoun, waktu, dan kadang tense.
          </p>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Jenis Reported Speech</h2>
          <div className="rs-grid rs-grid-one-col">
            {REPORTED_TYPES.map((item) => (
              <details key={item.title} className="rs-card rs-card-accordion">
                <summary className="rs-card-summary">
                  <h3 className="rs-card-title">{item.title}</h3>
                  <span className="rs-card-caret" aria-hidden="true" />
                </summary>
                <div className="rs-card-body">
                  <p className="rs-card-desc">{item.desc}</p>
                  <ul className="rs-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Backshift Umum</h2>
          <ul className="rs-list">
            {BACKSHIFT_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Perubahan Referensi (Pronoun & Time Expression)</h2>
          <ul className="rs-list">
            {REFERENCE_SHIFTS.map((item) => (
              <li key={item.from}>
                {item.from}
                {' -> '}
                {item.to}
              </li>
            ))}
          </ul>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Pola Reported Questions</h2>
          <div className="rs-grid rs-grid-one-col">
            {QUESTION_PATTERNS.map((item) => (
              <article key={item.title} className="rs-card">
                <div className="rs-card-body">
                  <h3 className="rs-card-title">{item.title}</h3>
                  <p className="rs-card-desc">
                    Pola: <strong>{item.pattern}</strong>
                  </p>
                  <ul className="rs-list">
                    <li>{item.example}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Kapan Backshift Tidak Wajib</h2>
          <ul className="rs-list">
            {NO_BACKSHIFT_CASES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Kesalahan Umum</h2>
          <div className="rs-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="rs-fix-card">
                <p className="rs-fix-wrong">Salah: {item.wrong}</p>
                <p className="rs-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rs-block">
          <h2 className="rs-block-title">Catatan Penting:</h2>
          <ul className="rs-list">
            <li>Kalimat tanya dalam reported speech pakai statement order (tanpa do/does/did inversion).</li>
            <li>Untuk reported question, tidak pakai tanda tanya di akhir kalimat reported.</li>
            <li>tell butuh object (tell me/us/him), sedangkan say tidak langsung ke object tanpa to.</li>
            <li>Backshift tidak selalu wajib jika fakta masih berlaku atau konteks waktu tetap sekarang.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
