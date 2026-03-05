import BackButton from '../../../../../components/BackButton';
import './noun-clauses-that-clauses-whether-if-clauses-wh-clauses.css';
import '../../topic-layout.css';

const NOUN_CLAUSE_TYPES = [
  {
    title: 'that-clause',
    desc: 'Dipakai setelah reporting/thinking verbs untuk menyatakan informasi atau keyakinan.',
    examples: [
      { before: 'I believe ', focus: 'that he is honest', after: '.' },
      { before: 'She said ', focus: 'that she was tired', after: '.' },
    ],
  },
  {
    title: 'whether / if clause',
    desc: 'Dipakai untuk pertanyaan tidak langsung (yes/no information).',
    examples: [
      { before: "I don't know ", focus: 'whether she will come', after: '.' },
      { before: 'Can you tell me ', focus: 'if this is correct', after: '?' },
    ],
  },
  {
    title: 'wh-clause (what, who, where, when, why, how)',
    desc: 'Dipakai saat informasi yang ditanya bersifat spesifik.',
    examples: [
      { before: 'I know ', focus: 'what he wants', after: '.' },
      { before: 'Please explain ', focus: 'why the meeting was canceled', after: '.' },
    ],
  },
] as const;

const FUNCTIONS = [
  {
    title: 'Sebagai Object',
    patterns: ['Subject + Verb + noun clause'],
    examples: [
      { before: 'I think ', focus: 'that this plan will work', after: '.' },
      { before: 'She asked ', focus: 'where we were going', after: '.' },
    ],
  },
  {
    title: 'Sebagai Subject',
    patterns: ['Noun clause + Verb + ...'],
    examples: [
      { before: '', focus: 'What he said', after: ' is true.' },
      { before: '', focus: 'Whether they agree', after: ' is still unclear.' },
    ],
  },
  {
    title: 'Setelah Noun tertentu',
    patterns: ['Noun + that-clause'],
    examples: [
      { before: 'The fact ', focus: 'that she left', after: ' surprised everyone.' },
      { before: 'The idea ', focus: 'that we can finish today', after: ' is unrealistic.' },
    ],
  },
] as const;

const IF_WHETHER_RULES = [
  {
    rule: 'if dan whether sama-sama bisa untuk yes/no noun clause pada konteks umum.',
    example: { before: "I don't know ", focus: 'if/whether he is ready', after: '.' },
  },
  {
    rule: 'Pakai whether untuk struktur lebih formal atau pola whether ... or not.',
    example: { before: 'We need to decide ', focus: 'whether we should continue or not', after: '.' },
  },
  {
    rule: 'Setelah preposition, umumnya pakai whether (bukan if).',
    example: { before: 'It depends on ', focus: 'whether she agrees', after: '.' },
  },
] as const;

const PUNCTUATION_NOTES = [
  {
    note: 'Noun clause sebagai object biasanya tidak perlu koma tambahan.',
    example: { before: 'I think ', focus: 'that he is right', after: '.' },
  },
  {
    note: 'Noun clause sebagai subject juga umumnya tidak dipisah koma dari verb utama.',
    example: { before: '', focus: 'What he said', after: ' is correct.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I don\'t know where is he.', correct: 'I don\'t know where he is.' },
  { wrong: 'She asked me what did I do.', correct: 'She asked me what I did.' },
  { wrong: 'What he said it is true.', correct: 'What he said is true.' },
] as const;

export default function NounClausesPage() {
  return (
    <main className="nc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="nc-shell gr-topic-shell">
        <header className="nc-header">
          <h1 className="nc-title">Noun Clauses (that clauses, whether/if clauses, wh clauses)</h1>
          <p className="nc-subtitle">
            Noun clause berfungsi seperti noun: bisa jadi subject, object, atau pelengkap dalam
            kalimat formal maupun akademik.
          </p>
        </header>

        <section className="nc-block">
          <h2 className="nc-block-title">Konsep</h2>
          <p className="nc-text">
            Noun clause adalah klausa (punya subject + verb) yang menempati posisi noun. Connector
            yang umum: <strong>that</strong>, <strong>whether/if</strong>, dan <strong>wh-words</strong>.
          </p>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">Jenis Noun Clause</h2>
          <div className="nc-grid nc-grid-one-col">
            {NOUN_CLAUSE_TYPES.map((item) => (
              <details key={item.title} className="nc-card nc-card-accordion">
                <summary className="nc-card-summary">
                  <h3 className="nc-card-title">{item.title}</h3>
                  <span className="nc-card-caret" aria-hidden="true" />
                </summary>
                <div className="nc-card-body">
                  <p className="nc-card-desc">{item.desc}</p>
                  <ul className="nc-list">
                    {item.examples.map((example) => (
                      <li key={`${item.title}-${example.before}-${example.focus}-${example.after}`}>
                        {example.before}
                        <span className="nc-highlight">{example.focus}</span>
                        {example.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">Fungsi di Kalimat</h2>
          <div className="nc-grid nc-grid-one-col">
            {FUNCTIONS.map((item) => (
              <details key={item.title} className="nc-card nc-card-accordion">
                <summary className="nc-card-summary">
                  <h3 className="nc-card-title">{item.title}</h3>
                  <span className="nc-card-caret" aria-hidden="true" />
                </summary>
                <div className="nc-card-body">
                  <ul className="nc-list">
                    {item.patterns.map((pattern) => (
                      <li key={pattern}>{pattern}</li>
                    ))}
                  </ul>
                  <ul className="nc-list">
                    {item.examples.map((example) => (
                      <li key={`${item.title}-${example.before}-${example.focus}-${example.after}`}>
                        {example.before}
                        <span className="nc-highlight">{example.focus}</span>
                        {example.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">if vs whether</h2>
          <div className="nc-grid nc-grid-one-col">
            {IF_WHETHER_RULES.map((item) => (
              <article key={item.rule} className="nc-card">
                <div className="nc-card-body">
                  <p className="nc-text">{item.rule}</p>
                  <p className="nc-text">
                    Contoh: {item.example.before}
                    <span className="nc-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">Punctuation Notes</h2>
          <div className="nc-grid nc-grid-one-col">
            {PUNCTUATION_NOTES.map((item) => (
              <article key={item.note} className="nc-card">
                <div className="nc-card-body">
                  <p className="nc-text">{item.note}</p>
                  <p className="nc-text">
                    Contoh: {item.example.before}
                    <span className="nc-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">Kesalahan Umum</h2>
          <div className="nc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="nc-fix-card">
                <p className="nc-fix-wrong">Salah: {item.wrong}</p>
                <p className="nc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nc-block">
          <h2 className="nc-block-title">Catatan Penting:</h2>
          <ul className="nc-list">
            <li>Dalam indirect structure, urutan kata kembali ke statement (bukan question order).</li>
            <li>that pada object clause kadang boleh dihilangkan dalam gaya informal.</li>
            <li>whether lebih formal daripada if, terutama di writing akademik.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
