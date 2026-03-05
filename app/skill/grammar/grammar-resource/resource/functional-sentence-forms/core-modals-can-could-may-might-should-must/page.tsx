import BackButton from '../../../../../components/BackButton';
import './core-modals-can-could-may-might-should-must.css';
import '../../topic-layout.css';

const MODAL_GROUPS = [
  {
    title: 'can / could',
    desc: 'Untuk ability, request, dan possibility ringan.',
    points: [
      'can = kemampuan sekarang: I can swim.',
      'could = kemampuan masa lalu / permintaan lebih sopan: Could you help me?',
    ],
    examples: [
      { before: 'She ', focus: 'can', after: ' speak English.' },
      { before: '', focus: 'Could', after: ' you open the door?' },
      { before: 'I ', focus: 'could', after: ' run faster when I was younger.' },
    ],
  },
  {
    title: 'may / might',
    desc: 'Untuk possibility dan permission (lebih formal).',
    points: ['may = kemungkinan/izin (formal)', 'might = kemungkinan lebih lemah'],
    examples: [
      { before: 'It ', focus: 'may', after: ' rain later.' },
      { before: 'She ', focus: 'might', after: ' be late.' },
      { before: '', focus: 'May', after: ' I ask a question?' },
    ],
  },
  {
    title: 'should',
    desc: 'Untuk advice atau saran.',
    points: ['umum untuk rekomendasi: You should rest.', 'bukan kewajiban mutlak'],
    examples: [
      { before: 'You ', focus: 'should', after: ' drink more water.' },
      { before: 'They ', focus: 'should', after: ' study earlier.' },
    ],
  },
  {
    title: 'must',
    desc: 'Untuk strong obligation atau deduction kuat.',
    points: ['kewajiban kuat: You must wear a helmet.', 'dugaan kuat: He must be tired.'],
    examples: [
      { before: 'Students ', focus: 'must', after: ' submit on time.' },
      { before: 'She ', focus: 'must', after: ' be at home now.' },
    ],
  },
] as const;

const CORE_RULES = [
  'Modal + base verb (V1), tanpa to: can go, should study, must finish',
  'Modal tidak berubah oleh subject: I can, she can, they can',
  'Negative: modal + not + V1 (cannot, should not, must not)',
  'Question: modal + subject + V1?',
] as const;

const MODAL_COMPARISONS = [
  {
    title: 'can vs could',
    note: 'can untuk kemampuan saat ini; could untuk kemampuan masa lalu atau permintaan lebih sopan.',
    examples: [
      { before: 'Now: I ', focus: 'can', after: ' swim.' },
      { before: 'Past: I ', focus: 'could', after: ' swim when I was five.' },
      { before: 'Polite request: ', focus: 'Could', after: ' you help me?' },
    ],
  },
  {
    title: 'may vs might',
    note: 'keduanya menyatakan kemungkinan, tetapi might biasanya terasa lebih kecil/kurang pasti.',
    examples: [
      { before: 'It ', focus: 'may', after: ' rain tonight.' },
      { before: 'It ', focus: 'might', after: ' rain tonight.' },
    ],
  },
  {
    title: 'must vs have to / must not vs do not have to',
    note: 'must/have to = wajib; must not = dilarang; do not have to = tidak wajib (boleh, tapi tidak harus).',
    examples: [
      { before: 'You ', focus: 'must', after: ' wear a helmet.' },
      { before: 'You ', focus: 'have to', after: ' wear a helmet.' },
      { before: 'You ', focus: 'must not', after: ' smoke here.' },
      { before: 'You ', focus: "do not have to", after: ' come early tomorrow.' },
    ],
  },
] as const;

const MODAL_SNAPSHOTS = [
  {
    modal: 'can',
    negative: { before: 'I ', focus: 'cannot', after: ' attend today.' },
    question: { before: '', focus: 'Can', after: ' you come with us?' },
  },
  {
    modal: 'could',
    negative: { before: 'He ', focus: 'could not', after: ' open the file.' },
    question: { before: '', focus: 'Could', after: ' you explain this?' },
  },
  {
    modal: 'may',
    negative: { before: 'You ', focus: 'may not', after: ' enter this room.' },
    question: { before: '', focus: 'May', after: ' I sit here?' },
  },
  {
    modal: 'might',
    negative: { before: 'She ', focus: 'might not', after: ' join us.' },
    question: { before: '', focus: 'Might', after: ' they be late?' },
  },
  {
    modal: 'should',
    negative: { before: 'You ', focus: 'should not', after: ' skip breakfast.' },
    question: { before: '', focus: 'Should', after: ' we leave now?' },
  },
  {
    modal: 'must',
    negative: { before: 'You ', focus: 'must not', after: ' park here.' },
    question: { before: '', focus: 'Must', after: ' I finish this today?' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She cans swim.', correct: 'She can swim.' },
  { wrong: 'You should to study.', correct: 'You should study.' },
  { wrong: 'He musts finish today.', correct: 'He must finish today.' },
] as const;

export default function CoreModalsPage() {
  return (
    <main className="cm-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="cm-shell gr-topic-shell">
        <header className="cm-header">
          <h1 className="cm-title">Core Modals (can, could, may, might, should, must)</h1>
          <p className="cm-subtitle">
            Memahami fungsi modal utama untuk ability, possibility, advice, obligation, dan permission.
          </p>
        </header>

        <section className="cm-block">
          <h2 className="cm-block-title">Konsep</h2>
          <p className="cm-text">
            Modal verbs dipakai sebelum base verb untuk menambahkan makna fungsi (kemampuan, saran, kemungkinan,
            kewajiban) tanpa mengubah bentuk utama verb.
          </p>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Core Modals</h2>
          <div className="cm-grid cm-grid-one-col">
            {MODAL_GROUPS.map((item) => (
              <details key={item.title} className="cm-card cm-card-accordion">
                <summary className="cm-card-summary">
                  <h3 className="cm-card-title">{item.title}</h3>
                  <span className="cm-card-caret" aria-hidden="true" />
                </summary>
                <div className="cm-card-body">
                  <p className="cm-card-desc">{item.desc}</p>
                  <ul className="cm-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="cm-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="cm-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Core Rules</h2>
          <ul className="cm-list">
            {CORE_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Modal Contrasts</h2>
          <div className="cm-grid cm-grid-one-col">
            {MODAL_COMPARISONS.map((item) => (
              <article key={item.title} className="cm-card">
                <div className="cm-card-body">
                  <h3 className="cm-card-title">{item.title}</h3>
                  <p className="cm-card-desc">{item.note}</p>
                  <ul className="cm-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="cm-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Negative & Question Snapshot</h2>
          <div className="cm-snapshot-grid">
            {MODAL_SNAPSHOTS.map((item) => (
              <article key={item.modal} className="cm-snapshot-card">
                <h3 className="cm-snapshot-title">{item.modal}</h3>
                <p className="cm-snapshot-line">
                  Negative: {item.negative.before}
                  <span className="cm-highlight">{item.negative.focus}</span>
                  {item.negative.after}
                </p>
                <p className="cm-snapshot-line">
                  Question: {item.question.before}
                  <span className="cm-highlight">{item.question.focus}</span>
                  {item.question.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Kesalahan Umum</h2>
          <div className="cm-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="cm-fix-card">
                <p className="cm-fix-wrong">Salah: {item.wrong}</p>
                <p className="cm-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cm-block">
          <h2 className="cm-block-title">Catatan Penting:</h2>
          <ul className="cm-list">
            <li>Setelah modal, verb selalu base form (V1).</li>
            <li>Pilih modal berdasarkan fungsi makna, bukan hanya terjemahan literal.</li>
            <li>must not berarti larangan kuat, berbeda dengan do not have to (tidak wajib).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
