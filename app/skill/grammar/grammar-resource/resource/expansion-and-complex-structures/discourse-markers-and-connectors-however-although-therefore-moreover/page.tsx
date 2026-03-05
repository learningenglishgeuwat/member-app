import BackButton from '../../../../../components/BackButton';
import './discourse-markers-and-connectors-however-although-therefore-moreover.css';
import '../../topic-layout.css';

const MARKER_GROUPS = [
  {
    title: 'however (contrast)',
    desc: 'Menunjukkan kontras dengan ide sebelumnya.',
    examples: [
      { before: 'The plan is good. ', focus: 'However', after: ', we need more time.' },
      { before: 'He studied hard; ', focus: 'however', after: ', he felt nervous.' },
    ],
  },
  {
    title: 'although (concession)',
    desc: 'Memperkenalkan klausa yang berlawanan dengan ide utama.',
    examples: [
      { before: '', focus: 'Although', after: ' it was raining, we went out.' },
      { before: '', focus: 'Although', after: ' she was tired, she continued working.' },
    ],
  },
  {
    title: 'therefore (result/conclusion)',
    desc: 'Menunjukkan akibat logis dari pernyataan sebelumnya.',
    examples: [
      { before: 'The road was closed; ', focus: 'therefore', after: ', we took another route.' },
      { before: 'He prepared well. ', focus: 'Therefore', after: ', he passed.' },
    ],
  },
  {
    title: 'moreover (addition)',
    desc: 'Menambahkan poin yang mendukung ide sebelumnya.',
    examples: [
      { before: 'This method is simple. ', focus: 'Moreover', after: ', it is effective.' },
      { before: 'The team is skilled; ', focus: 'moreover', after: ', they are disciplined.' },
    ],
  },
] as const;

const PUNCTUATION_AND_POSITION = [
  {
    marker: 'however / therefore / moreover',
    note: 'Jika menghubungkan dua klausa independen dalam satu kalimat, sering dipakai setelah titik koma dan diikuti koma.',
    example: { before: 'He was late; ', focus: 'however', after: ', he still joined the meeting.' },
  },
  {
    marker: 'however / therefore / moreover (awal kalimat)',
    note: 'Jika di awal kalimat baru, biasanya diikuti koma.',
    example: { before: '', focus: 'Therefore', after: ', we decided to postpone the event.' },
  },
  {
    marker: 'although',
    note: 'Sebagai subordinating conjunction, menghubungkan dependent clause + main clause.',
    example: { before: '', focus: 'Although', after: ' he was tired, he kept working.' },
  },
] as const;

const ALTHOUGH_VS_HOWEVER = [
  {
    title: 'although (dalam satu kalimat kompleks)',
    example: { before: '', focus: 'Although', after: ' it was late, we continued the discussion.' },
  },
  {
    title: 'however (transisi antar klausa/kalimat)',
    example: { before: 'It was late. ', focus: 'However', after: ', we continued the discussion.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Although but he was tired, he worked.', correct: 'Although he was tired, he worked.' },
  { wrong: 'He was late, however he joined the meeting.', correct: 'He was late; however, he joined the meeting.' },
  { wrong: 'She is diligent, therefore but she improves fast.', correct: 'She is diligent; therefore, she improves fast.' },
] as const;

export default function DiscourseMarkersPage() {
  return (
    <main className="dm-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="dm-shell gr-topic-shell">
        <header className="dm-header">
          <h1 className="dm-title">
            Discourse Markers and Connectors (however, although, therefore, moreover)
          </h1>
          <p className="dm-subtitle">
            Memahami discourse markers untuk membuat transisi ide yang lebih jelas, logis, dan natural.
          </p>
        </header>

        <section className="dm-block">
          <h2 className="dm-block-title">Konsep</h2>
          <p className="dm-text">
            Discourse markers membantu menghubungkan gagasan antar kalimat atau antar klausa. Marker
            yang tepat membuat alur bicara/tulisan lebih kohesif.
          </p>
        </section>

        <section className="dm-block">
          <h2 className="dm-block-title">Core Markers</h2>
          <div className="dm-grid dm-grid-one-col">
            {MARKER_GROUPS.map((item) => (
              <details key={item.title} className="dm-card dm-card-accordion">
                <summary className="dm-card-summary">
                  <h3 className="dm-card-title">{item.title}</h3>
                  <span className="dm-card-caret" aria-hidden="true" />
                </summary>
                <div className="dm-card-body">
                  <p className="dm-card-desc">{item.desc}</p>
                  <ul className="dm-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="dm-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="dm-block">
          <h2 className="dm-block-title">Position and Punctuation</h2>
          <div className="dm-grid dm-grid-one-col">
            {PUNCTUATION_AND_POSITION.map((item) => (
              <article key={item.marker} className="dm-card">
                <div className="dm-card-body">
                  <h3 className="dm-card-title">{item.marker}</h3>
                  <p className="dm-text">{item.note}</p>
                  <p className="dm-text">
                    Contoh: {item.example.before}
                    <span className="dm-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dm-block">
          <h2 className="dm-block-title">although vs however</h2>
          <div className="dm-grid dm-grid-one-col">
            {ALTHOUGH_VS_HOWEVER.map((item) => (
              <article key={item.title} className="dm-card">
                <div className="dm-card-body">
                  <h3 className="dm-card-title">{item.title}</h3>
                  <p className="dm-text">
                    {item.example.before}
                    <span className="dm-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dm-block">
          <h2 className="dm-block-title">Kesalahan Umum</h2>
          <div className="dm-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="dm-fix-card">
                <p className="dm-fix-wrong">Salah: {item.wrong}</p>
                <p className="dm-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dm-block">
          <h2 className="dm-block-title">Catatan Penting:</h2>
          <ul className="dm-list">
            <li>however, therefore, moreover sering butuh tanda baca yang tepat (koma/titik koma).</li>
            <li>although sudah membawa makna kontras, jadi tidak dipasangkan dengan but dalam klausa sama.</li>
            <li>Pilih marker berdasarkan relasi makna: tambahan, kontras, sebab-akibat, atau konsesi.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
