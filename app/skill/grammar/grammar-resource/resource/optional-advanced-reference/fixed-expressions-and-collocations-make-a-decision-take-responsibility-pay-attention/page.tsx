import BackButton from '../../../../../components/BackButton';
import './fixed-expressions-and-collocations-make-a-decision-take-responsibility-pay-attention.css';
import '../../topic-layout.css';

const COLLOCATION_GROUPS = [
  {
    title: 'make + noun',
    desc: 'Umum dipakai untuk hasil keputusan/aksi konseptual.',
    items: ['make a decision', 'make a mistake', 'make progress', 'make an effort'],
    examples: ['We need to make a decision now.', 'She made great progress this month.'],
  },
  {
    title: 'take + noun',
    desc: 'Sering dipakai untuk tanggung jawab, waktu, atau tindakan spesifik.',
    items: ['take responsibility for', 'take notes', 'take action', 'take a break'],
    examples: ['He took responsibility for the problem.', 'Please take notes during the meeting.'],
  },
  {
    title: 'pay + noun',
    desc: 'Sering dipakai untuk perhatian, kunjungan, atau biaya.',
    items: ['pay attention to', 'pay a visit to', 'pay the bill', 'pay respects to'],
    examples: [
      'Pay attention to the instructions.',
      'They paid a visit to their teacher.',
      'People paid respects to the victims.',
    ],
  },
] as const;

const FIXED_EXPRESSIONS = [
  { expression: 'by the way', meaning: 'ngomong-ngomong / tambahan informasi', example: 'By the way, have you called Anna?' },
  { expression: 'as a matter of fact', meaning: 'sebenarnya / faktanya', example: 'As a matter of fact, I have finished the report.' },
  { expression: 'in charge of', meaning: 'bertanggung jawab atas', example: 'Rina is in charge of this project.' },
  { expression: 'on purpose', meaning: 'dengan sengaja', example: 'He did not break it on purpose.' },
] as const;

const WHY_IMPORTANT = [
  'Collocation membuat kalimat terdengar natural dan tidak terjemahan literal.',
  'Kesalahan collocation sering tetap bisa dipahami, tapi terdengar tidak native.',
  'Collocation penting untuk speaking natural dan writing formal yang rapi.',
] as const;

const COMMON_MISTAKES = [
  { wrong: 'do a decision', correct: 'make a decision' },
  { wrong: 'give attention to details', correct: 'pay attention to details' },
  { wrong: 'take a mistake', correct: 'make a mistake' },
  { wrong: 'pay respect to the hero', correct: 'pay respects to the hero' },
] as const;

export default function FixedExpressionsPage() {
  return (
    <main className="fe-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="fe-shell gr-topic-shell">
        <header className="fe-header">
          <h1 className="fe-title">
            Fixed Expressions and Collocations (make a decision, take responsibility, pay attention)
          </h1>
          <p className="fe-subtitle">
            Menguasai pasangan kata yang umum dipakai bersama agar grammar dan vocabulary terdengar
            natural.
          </p>
        </header>

        <section className="fe-block">
          <h2 className="fe-block-title">Konsep</h2>
          <p className="fe-text">
            Collocation adalah kombinasi kata yang lazim dipakai bersama. Walau secara grammar mungkin
            benar, kombinasi yang tidak natural bisa membuat kalimat terasa kaku.
          </p>
          <p className="fe-text">
            Fixed expressions adalah frasa tetap yang maknanya sudah mapan dan sering dipakai sebagai
            satu unit dalam komunikasi.
          </p>
        </section>

        <section className="fe-block">
          <h2 className="fe-block-title">Core Collocations</h2>
          <div className="fe-grid fe-grid-one-col">
            {COLLOCATION_GROUPS.map((group) => (
              <details key={group.title} className="fe-card fe-card-accordion">
                <summary className="fe-card-summary">
                  <h3 className="fe-card-title">{group.title}</h3>
                  <span className="fe-card-caret" aria-hidden="true" />
                </summary>
                <div className="fe-card-body">
                  <p className="fe-card-desc">{group.desc}</p>
                  <ul className="fe-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <ul className="fe-list">
                    {group.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fe-block">
          <h2 className="fe-block-title">Fixed Expressions</h2>
          <div className="fe-grid fe-grid-one-col">
            {FIXED_EXPRESSIONS.map((item) => (
              <article key={item.expression} className="fe-card">
                <div className="fe-card-body">
                  <h3 className="fe-card-title">{item.expression}</h3>
                  <p className="fe-card-desc">Makna: {item.meaning}</p>
                  <ul className="fe-list">
                    <li>{item.example}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="fe-block">
          <h2 className="fe-block-title">Kenapa Penting</h2>
          <ul className="fe-list">
            {WHY_IMPORTANT.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="fe-block">
          <h2 className="fe-block-title">Kesalahan Umum</h2>
          <div className="fe-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="fe-fix-card">
                <p className="fe-fix-wrong">Salah: {item.wrong}</p>
                <p className="fe-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fe-block">
          <h2 className="fe-block-title">Catatan Penting:</h2>
          <ul className="fe-list">
            <li>Belajar collocation per chunk, bukan per kata tunggal.</li>
            <li>Perhatikan preposition yang menyertai frasa (mis. attention to, responsibility for).</li>
            <li>Simpan contoh kalimat agar konteks pemakaian lebih jelas.</li>
            <li>Prioritaskan collocation frekuensi tinggi untuk speaking harian.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
