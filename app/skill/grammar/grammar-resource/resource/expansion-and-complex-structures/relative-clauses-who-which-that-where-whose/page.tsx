import BackButton from '../../../../../components/BackButton';
import './relative-clauses-who-which-that-where-whose.css';
import '../../topic-layout.css';

const RELATIVE_TYPES = [
  {
    title: 'who (untuk orang)',
    desc: 'Dipakai untuk menjelaskan noun orang.',
    examples: [
      { before: 'The teacher ', focus: 'who', after: ' explains clearly is my favorite.' },
      { before: 'I met a student ', focus: 'who', after: ' speaks Japanese.' },
    ],
  },
  {
    title: 'which (untuk benda/hewan)',
    desc: 'Dipakai untuk menjelaskan noun benda atau hewan.',
    examples: [
      { before: 'The book ', focus: 'which', after: ' you gave me is useful.' },
      { before: 'This is the phone ', focus: 'which', after: ' I bought yesterday.' },
    ],
  },
  {
    title: 'that (orang/benda, lebih umum)',
    desc: 'Bisa menggantikan who/which pada restrictive clause.',
    examples: [
      { before: 'The car ', focus: 'that', after: ' he drives is very old.' },
      { before: 'She is the person ', focus: 'that', after: ' helped me.' },
    ],
  },
  {
    title: 'where (untuk tempat)',
    desc: 'Dipakai untuk menjelaskan noun tempat.',
    examples: [
      { before: 'This is the cafe ', focus: 'where', after: ' we first met.' },
      { before: 'I know a park ', focus: 'where', after: ' children can play safely.' },
    ],
  },
  {
    title: 'whose (kepemilikan)',
    desc: 'Dipakai untuk menunjukkan kepemilikan.',
    examples: [
      { before: 'I have a friend ', focus: 'whose', after: ' brother is a doctor.' },
      { before: 'The writer ', focus: 'whose', after: ' novel won the prize is from Bandung.' },
    ],
  },
] as const;

const CLAUSE_TYPES = [
  {
    title: 'Restrictive Relative Clause',
    note: 'Informasi penting untuk mengidentifikasi noun; biasanya tanpa koma.',
    example: { before: 'The students ', focus: 'who study hard', after: ' usually get good scores.' },
  },
  {
    title: 'Non-restrictive Relative Clause',
    note: 'Informasi tambahan (bukan inti); biasanya diapit koma.',
    example: { before: 'My brother, ', focus: 'who lives in Jakarta', after: ', visits us every month.' },
  },
] as const;

const THAT_LIMITATIONS = [
  'that umumnya dipakai pada restrictive clause.',
  'that tidak dipakai pada non-restrictive clause (yang pakai koma).',
  "setelah preposition, biasanya pakai which/whom (contoh: the room in which we met), bukan 'in that'.",
] as const;

const COMMON_MISTAKES = [
  { wrong: 'The man which lives next door is kind.', correct: 'The man who lives next door is kind.' },
  { wrong: 'This is the place which we met.', correct: 'This is the place where we met.' },
  { wrong: 'I know a girl who father is a pilot.', correct: 'I know a girl whose father is a pilot.' },
] as const;

export default function RelativeClausesPage() {
  return (
    <main className="rc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="rc-shell gr-topic-shell">
        <header className="rc-header">
          <h1 className="rc-title">Relative Clauses (who, which, that, where, whose)</h1>
          <p className="rc-subtitle">
            Relative clause dipakai untuk memberi informasi tambahan tentang noun agar kalimat lebih
            spesifik dan natural.
          </p>
        </header>

        <section className="rc-block">
          <h2 className="rc-block-title">Konsep</h2>
          <p className="rc-text">
            Relative clause adalah anak klausa yang menjelaskan noun di depannya (antecedent). Klausa
            ini biasanya diawali relative pronoun/adverb seperti <strong>who, which, that, where,</strong>{' '}
            dan <strong>whose</strong>.
          </p>
        </section>

        <section className="rc-block">
          <h2 className="rc-block-title">Jenis Relative Clauses</h2>
          <div className="rc-grid rc-grid-one-col">
            {RELATIVE_TYPES.map((item) => (
              <details key={item.title} className="rc-card rc-card-accordion">
                <summary className="rc-card-summary">
                  <h3 className="rc-card-title">{item.title}</h3>
                  <span className="rc-card-caret" aria-hidden="true" />
                </summary>
                <div className="rc-card-body">
                  <p className="rc-card-desc">{item.desc}</p>
                  <ul className="rc-list">
                    {item.examples.map((example) => (
                      <li key={`${item.title}-${example.before}-${example.focus}-${example.after}`}>
                        {example.before}
                        <span className="rc-highlight">{example.focus}</span>
                        {example.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="rc-block">
          <h2 className="rc-block-title">Restrictive vs Non-restrictive</h2>
          <div className="rc-grid rc-grid-one-col">
            {CLAUSE_TYPES.map((item) => (
              <article key={item.title} className="rc-card">
                <div className="rc-card-body">
                  <h3 className="rc-card-title">{item.title}</h3>
                  <p className="rc-text">{item.note}</p>
                  <p className="rc-text">
                    Contoh: {item.example.before}
                    <span className="rc-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rc-block">
          <h2 className="rc-block-title">Notes on that</h2>
          <ul className="rc-list">
            {THAT_LIMITATIONS.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="rc-block">
          <h2 className="rc-block-title">Kesalahan Umum</h2>
          <div className="rc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="rc-fix-card">
                <p className="rc-fix-wrong">Salah: {item.wrong}</p>
                <p className="rc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rc-block">
          <h2 className="rc-block-title">Catatan Penting:</h2>
          <ul className="rc-list">
            <li>Pilih connector berdasarkan fungsi noun: orang, benda, tempat, atau kepemilikan.</li>
            <li>Untuk restrictive clause, that sering dipakai pada speaking/writing informal.</li>
            <li>where dipakai saat antecedent adalah tempat.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
