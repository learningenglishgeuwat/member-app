import BackButton from '../../../../../components/BackButton';
import './prepositions-after-verbs-and-adjectives-depend-on-interested-in-good-at.css';
import '../../topic-layout.css';

const VERB_PREP = [
  {
    title: 'Verb + Preposition',
    desc: 'Banyak verb berpasangan kuat dengan preposition tertentu.',
    pairs: [
      { phrase: 'depend on', meaning: 'bergantung pada' },
      { phrase: 'listen to', meaning: 'mendengarkan' },
      { phrase: 'believe in', meaning: 'percaya pada' },
      { phrase: 'wait for', meaning: 'menunggu' },
      { phrase: 'agree with', meaning: 'setuju dengan (seseorang/pendapat)' },
    ],
  },
] as const;

const ADJ_PREP = [
  {
    title: 'Adjective + Preposition',
    desc: 'Banyak adjective juga berpasangan tetap dengan preposition.',
    pairs: [
      { phrase: 'interested in', meaning: 'tertarik pada' },
      { phrase: 'good at', meaning: 'pandai dalam' },
      { phrase: 'afraid of', meaning: 'takut pada' },
      { phrase: 'ready for', meaning: 'siap untuk' },
      { phrase: 'famous for', meaning: 'terkenal karena' },
    ],
  },
] as const;

const SENTENCE_EXAMPLES = [
  { sentence: 'I depend on my team.', focus: 'depend on' },
  { sentence: 'Please listen to the teacher.', focus: 'listen to' },
  { sentence: 'Many people believe in hard work.', focus: 'believe in' },
  { sentence: 'We are waiting for the bus.', focus: 'wait for' },
  { sentence: 'I agree with your idea.', focus: 'agree with' },
  { sentence: 'She is interested in design.', focus: 'interested in' },
  { sentence: 'He is good at math.', focus: 'good at' },
  { sentence: 'She is afraid of spiders.', focus: 'afraid of' },
  { sentence: 'We are ready for the test.', focus: 'ready for' },
  { sentence: 'This city is famous for batik.', focus: 'famous for' },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I am interested on music.', correct: 'I am interested in music.' },
  { wrong: 'She is good in English.', correct: 'She is good at English.' },
  { wrong: 'We depend with technology.', correct: 'We depend on technology.' },
  { wrong: 'He is good at to solve problems.', correct: 'He is good at solving problems.' },
] as const;

function highlightPhrase(sentence: string, phrase: string) {
  const lowerSentence = sentence.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  const idx = lowerSentence.indexOf(lowerPhrase);
  if (idx === -1) return sentence;

  const start = sentence.slice(0, idx);
  const mid = sentence.slice(idx, idx + phrase.length);
  const end = sentence.slice(idx + phrase.length);

  return (
    <>
      {start}
      <span className="pva-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PrepositionsAfterVerbAdjPage() {
  return (
    <main className="pva-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pva-shell gr-topic-shell">
        <header className="pva-header">
          <h1 className="pva-title">
            Prepositions after Verbs and Adjectives (depend on, interested in, good at)
          </h1>
          <p className="pva-subtitle">
            Memahami pasangan tetap verb/adjective + preposition agar kalimat natural dan akurat.
          </p>
        </header>

        <section className="pva-block">
          <h2 className="pva-block-title">Konsep</h2>
          <p className="pva-text">
            Dalam bahasa Inggris, banyak verb dan adjective membutuhkan preposition tertentu. Pasangan
            ini umumnya tidak bisa diganti bebas karena akan mengubah atau merusak makna.
          </p>
        </section>

        <section className="pva-block">
          <h2 className="pva-block-title">Core Pairs</h2>
          <div className="pva-grid">
            {VERB_PREP.map((item) => (
              <details key={item.title} className="pva-card pva-card-accordion">
                <summary className="pva-card-summary">
                  <h3 className="pva-card-title">{item.title}</h3>
                  <span className="pva-card-caret" aria-hidden="true" />
                </summary>
                <div className="pva-card-body">
                  <p className="pva-card-desc">{item.desc}</p>
                  <ul className="pva-list">
                    {item.pairs.map((ex) => (
                      <li key={ex.phrase}>
                        <span className="pva-highlight">{ex.phrase}</span> ({ex.meaning})
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}

            {ADJ_PREP.map((item) => (
              <details key={item.title} className="pva-card pva-card-accordion">
                <summary className="pva-card-summary">
                  <h3 className="pva-card-title">{item.title}</h3>
                  <span className="pva-card-caret" aria-hidden="true" />
                </summary>
                <div className="pva-card-body">
                  <p className="pva-card-desc">{item.desc}</p>
                  <ul className="pva-list">
                    {item.pairs.map((ex) => (
                      <li key={ex.phrase}>
                        <span className="pva-highlight">{ex.phrase}</span> ({ex.meaning})
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pva-block">
          <h2 className="pva-block-title">Contoh Kalimat</h2>
          <ul className="pva-list">
            {SENTENCE_EXAMPLES.map((item) => (
              <li key={item.sentence}>{highlightPhrase(item.sentence, item.focus)}</li>
            ))}
          </ul>
        </section>

        <section className="pva-block">
          <h2 className="pva-block-title">Kesalahan Umum</h2>
          <div className="pva-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pva-fix-card">
                <p className="pva-fix-wrong">Salah: {item.wrong}</p>
                <p className="pva-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pva-block">
          <h2 className="pva-block-title">Catatan Penting:</h2>
          <ul className="pva-list">
            <li>- Fokus belajar dengan pasangan tetap, bukan terjemahan kata per kata.</li>
            <li>- Simpan per pasangan: verb/adjective + preposition + contoh kalimat.</li>
            <li>
              - Setelah preposition, gunakan noun/pronoun atau V-ing: interested in music / interested
              in learning English.
            </li>
            <li>
              - Beberapa verb punya lebih dari satu preposition dengan makna berbeda: agree with
              someone, agree on a topic, agree to a plan.
            </li>
            <li>- Saat ragu, cek apakah preposition-nya sudah idiomatic (natural dipakai penutur asli).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
