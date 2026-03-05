import BackButton from '../../../../../components/BackButton';
import './possessive-determiners-my-your-his-her-its-our-their.css';
import '../../topic-layout.css';

const POSSESSIVE_MAP = [
  { subject: 'I', determiner: 'my', meaning: 'milik saya', example: 'my book' },
  {
    subject: 'you (singular/plural)',
    determiner: 'your',
    meaning: 'milik kamu/Anda/kalian',
    example: 'your bag',
  },
  { subject: 'he', determiner: 'his', meaning: 'milik dia (laki-laki)', example: 'his car' },
  { subject: 'she', determiner: 'her', meaning: 'milik dia (perempuan)', example: 'her phone' },
  { subject: 'it', determiner: 'its', meaning: 'milik benda/hewan', example: 'its color' },
  { subject: 'we', determiner: 'our', meaning: 'milik kami/kita', example: 'our class' },
  { subject: 'they', determiner: 'their', meaning: 'milik mereka', example: 'their house' },
] as const;

const FUNCTION_RULES = [
  {
    title: 'Before a Noun',
    desc: 'Possessive determiner selalu diikuti noun.',
    examples: [
      { sentence: 'This is my laptop.', focus: 'my' },
      { sentence: 'Her idea is interesting.', focus: 'Her' },
      { sentence: 'Their teacher is kind.', focus: 'Their' },
    ],
  },
  {
    title: 'No Article Together',
    desc: 'Tidak dipakai bersamaan dengan a/an/the pada noun yang sama.',
    examples: [
      { sentence: 'my book (benar)', focus: 'my' },
      { sentence: 'our project (benar)', focus: 'our' },
      { sentence: 'their car (benar)', focus: 'their' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'This is mine book.', correct: 'This is my book.' },
  { wrong: 'She forgot his key.', correct: 'She forgot her key.' },
  { wrong: 'The their car is new.', correct: 'Their car is new.' },
  { wrong: 'The my book is on the table.', correct: 'My book is on the table.' },
] as const;

function highlightWord(sentence: string, focus: string) {
  const lowerSentence = sentence.toLowerCase();
  const lowerFocus = focus.toLowerCase();
  const idx = lowerSentence.indexOf(lowerFocus);
  if (idx === -1) return sentence;

  const start = sentence.slice(0, idx);
  const mid = sentence.slice(idx, idx + focus.length);
  const end = sentence.slice(idx + focus.length);

  return (
    <>
      {start}
      <span className="pd-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PossessiveDeterminersPage() {
  return (
    <main className="pd-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pd-shell gr-topic-shell">
        <header className="pd-header">
          <h1 className="pd-title">Possessive Determiners (my, your, his, her, its, our, their)</h1>
          <p className="pd-subtitle">
            Memahami penanda kepemilikan sebelum noun agar referensi pemilik lebih jelas dan akurat.
          </p>
        </header>

        <section className="pd-block">
          <h2 className="pd-block-title">Konsep</h2>
          <p className="pd-text">
            Possessive determiners dipakai untuk menunjukkan kepemilikan dan diletakkan sebelum noun:
            <em> my book, her phone, our class</em>.
          </p>
        </section>

        <section className="pd-block">
          <h2 className="pd-block-title">Tabel Possessive Determiners</h2>
          <div className="pd-table-wrap geuwat-table-scroll">
            <table className="pd-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Possessive Determiner</th>
                  <th>Meaning</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                {POSSESSIVE_MAP.map((row) => (
                  <tr key={row.subject}>
                    <td>{row.subject}</td>
                    <td>
                      <span className="pd-highlight">{row.determiner}</span>
                    </td>
                    <td>{row.meaning}</td>
                    <td>{highlightWord(row.example, row.determiner)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pd-block">
          <h2 className="pd-block-title">Function and Pattern</h2>
          <div className="pd-grid pd-grid-one-col">
            {FUNCTION_RULES.map((item) => (
              <details key={item.title} className="pd-card pd-card-accordion">
                <summary className="pd-card-summary">
                  <h3 className="pd-card-title">{item.title}</h3>
                  <span className="pd-card-caret" aria-hidden="true" />
                </summary>
                <div className="pd-card-body">
                  <p className="pd-card-desc">{item.desc}</p>
                  <ul className="pd-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pd-block">
          <h2 className="pd-block-title">Kesalahan Umum</h2>
          <div className="pd-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pd-fix-card">
                <p className="pd-fix-wrong">Salah: {item.wrong}</p>
                <p className="pd-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pd-block">
          <h2 className="pd-block-title">Catatan Penting:</h2>
          <ul className="pd-list">
            <li>- Bedakan possessive determiner (my) vs possessive pronoun (mine).</li>
            <li>- its (tanpa apostrophe) adalah possessive determiner; it&apos;s = it is.</li>
            <li>- Jangan gabungkan article dan possessive determiner pada noun yang sama.</li>
            <li>- Pasangan yang sering tertukar: my/mine, her/hers, their/theirs.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

