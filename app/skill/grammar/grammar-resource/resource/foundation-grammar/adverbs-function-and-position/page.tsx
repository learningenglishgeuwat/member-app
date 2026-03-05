import BackButton from '../../../../../components/BackButton';
import './adverbs-function-and-position.css';
import '../../topic-layout.css';

const ADVERB_FUNCTIONS = [
  {
    title: 'Manner Adverbs',
    desc: 'Menjelaskan bagaimana aksi dilakukan.',
    examples: [
      { sentence: 'She speaks clearly.', focus: 'clearly' },
      { sentence: 'He answered quickly.', focus: 'quickly' },
      { sentence: 'They worked carefully.', focus: 'carefully' },
    ],
  },
  {
    title: 'Frequency Adverbs',
    desc: 'Menjelaskan seberapa sering aksi terjadi.',
    examples: [
      { sentence: 'I always review my notes.', focus: 'always' },
      { sentence: 'She usually comes early.', focus: 'usually' },
      { sentence: 'They rarely eat out.', focus: 'rarely' },
    ],
  },
  {
    title: 'Time Adverbs',
    desc: 'Menjelaskan kapan aksi terjadi.',
    examples: [
      { sentence: 'We will start now.', focus: 'now' },
      { sentence: 'I called him yesterday.', focus: 'yesterday' },
      { sentence: 'She arrived today.', focus: 'today' },
    ],
  },
  {
    title: 'Place Adverbs',
    desc: 'Menjelaskan di mana aksi terjadi.',
    examples: [
      { sentence: 'Please sit here.', focus: 'here' },
      { sentence: 'They looked outside.', focus: 'outside' },
      { sentence: 'The kids are playing upstairs.', focus: 'upstairs' },
    ],
  },
  {
    title: 'Degree Adverbs',
    desc: 'Menjelaskan tingkat/intensitas adjective, adverb, atau verb.',
    examples: [
      { sentence: 'This task is very difficult.', focus: 'very' },
      { sentence: 'She almost finished her homework.', focus: 'almost' },
      { sentence: 'I completely agree.', focus: 'completely' },
    ],
  },
] as const;

const POSITION_RULES = [
  {
    title: 'End Position',
    desc: 'Paling umum untuk manner, place, dan time.',
    examples: [
      { sentence: 'She sings beautifully.', focus: 'beautifully' },
      { sentence: 'We met there.', focus: 'there' },
      { sentence: 'I will call you tomorrow.', focus: 'tomorrow' },
    ],
  },
  {
    title: 'Mid Position',
    desc: 'Umum untuk frequency (sebelum main verb, setelah be).',
    examples: [
      { sentence: 'I usually wake up at 6.', focus: 'usually' },
      { sentence: 'She is always on time.', focus: 'always' },
      { sentence: 'They never miss class.', focus: 'never' },
    ],
  },
  {
    title: 'Front Position',
    desc: 'Dipakai untuk penekanan, terutama adverb time/linking.',
    examples: [
      { sentence: 'Yesterday, we had a meeting.', focus: 'Yesterday' },
      { sentence: 'Usually, he studies at night.', focus: 'Usually' },
      { sentence: 'Finally, we finished.', focus: 'Finally' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She speaks very clear.', correct: 'She speaks very clearly.' },
  { wrong: 'I am always late usually.', correct: 'I am usually late.' },
  { wrong: 'He quickly drives always.', correct: 'He always drives quickly.' },
] as const;

function highlightFocus(sentence: string, focus: string) {
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
      <span className="adv-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function AdverbsPage() {
  return (
    <main className="adv-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="adv-shell gr-topic-shell">
        <header className="adv-header">
          <h1 className="adv-title">Adverbs (Function and Position)</h1>
          <p className="adv-subtitle">
            Memahami fungsi adverb dan posisi yang tepat agar kalimat lebih natural dan jelas.
          </p>
        </header>

        <section className="adv-block">
          <h2 className="adv-block-title">Konsep</h2>
          <p className="adv-text">
            Adverb menjelaskan verb, adjective, adverb lain, atau seluruh kalimat. Posisi adverb
            memengaruhi kejelasan dan penekanan makna.
          </p>
        </section>

        <section className="adv-block">
          <h2 className="adv-block-title">Function</h2>
          <div className="adv-grid">
            {ADVERB_FUNCTIONS.map((item) => (
              <details key={item.title} className="adv-card adv-card-accordion">
                <summary className="adv-card-summary">
                  <h3 className="adv-card-title">{item.title}</h3>
                  <span className="adv-card-caret" aria-hidden="true" />
                </summary>
                <div className="adv-card-body">
                  <p className="adv-card-desc">{item.desc}</p>
                  <ul className="adv-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightFocus(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="adv-block">
          <h2 className="adv-block-title">Position</h2>
          <div className="adv-grid">
            {POSITION_RULES.map((item) => (
              <details key={item.title} className="adv-card adv-card-accordion">
                <summary className="adv-card-summary">
                  <h3 className="adv-card-title">{item.title}</h3>
                  <span className="adv-card-caret" aria-hidden="true" />
                </summary>
                <div className="adv-card-body">
                  <p className="adv-card-desc">{item.desc}</p>
                  <ul className="adv-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightFocus(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="adv-block">
          <h2 className="adv-block-title">Kesalahan Umum</h2>
          <div className="adv-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="adv-fix-card">
                <p className="adv-fix-wrong">Salah: {item.wrong}</p>
                <p className="adv-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="adv-block">
          <h2 className="adv-block-title">Catatan Penting:</h2>
          <ul className="adv-list">
            <li>- Adjective menjelaskan noun, sedangkan adverb biasanya menjelaskan verb/adjective/adverb.</li>
            <li>- Frequency adverb umumnya sebelum main verb, tetapi setelah be verb.</li>
            <li>
              - Jika ada beberapa adverb sekaligus di akhir kalimat, urutan umum: manner - place -
              time.
            </li>
            <li>- Jika ragu, mulai dari end position lalu cek apakah makna kalimat sudah natural.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
