import BackButton from '../../../../../components/BackButton';
import './modal-perfect-should-have-could-have-might-have-must-have.css';
import '../../topic-layout.css';

const MODAL_PERFECT_TYPES = [
  {
    title: 'should have + V3',
    usage: 'Kritik, saran, atau penyesalan tentang masa lalu.',
    examples: ['You should have told me earlier.', 'I should have studied more last night.'],
  },
  {
    title: 'could have + V3',
    usage: 'Kemampuan/peluang di masa lalu yang tidak terjadi; kadang juga untuk kritik halus.',
    examples: [
      'We could have won the game.',
      'She could have called me yesterday.',
      'You could have told me earlier.',
    ],
  },
  {
    title: 'might have + V3',
    usage: 'Kemungkinan masa lalu (tidak pasti).',
    examples: ['He might have missed the bus.', 'They might have forgotten the meeting.'],
  },
  {
    title: 'must have + V3',
    usage: 'Kesimpulan/logical deduction tentang masa lalu.',
    examples: ['She must have been very tired.', 'It must have rained last night.'],
  },
  {
    title: "can't / couldn't have + V3",
    usage: 'Kesimpulan kuat bahwa sesuatu hampir pasti tidak terjadi di masa lalu.',
    examples: ['He can\'t have forgotten the meeting.', 'They couldn\'t have arrived that early.'],
  },
] as const;

const COMPARISON_NOTES = [
  'should have: seharusnya terjadi, tapi tidak terjadi.',
  'could have: ada kemampuan/peluang nyata, tapi tidak terjadi.',
  'might have: mungkin terjadi, tapi kita tidak punya kepastian.',
  'must have: hampir pasti terjadi (berdasarkan bukti/logika).',
  "can't/couldn't have: hampir pasti tidak terjadi (kebalikan deduction).",
] as const;

const CONTRAST_EXAMPLES = [
  {
    label: 'could have (missed possibility)',
    sentence: 'She could have taken the earlier train, but she missed it.',
  },
  {
    label: 'might have (uncertain possibility)',
    sentence: 'She might have taken the earlier train; I am not sure.',
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'You should have went home.', correct: 'You should have gone home.' },
  { wrong: 'He might has forgotten.', correct: 'He might have forgotten.' },
  { wrong: 'She must have be tired.', correct: 'She must have been tired.' },
] as const;

export default function ModalPerfectPage() {
  return (
    <main className="mp-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="mp-shell gr-topic-shell">
        <header className="mp-header">
          <h1 className="mp-title">Modal Perfect (should have, could have, might have, must have)</h1>
          <p className="mp-subtitle">
            Modal perfect digunakan untuk membahas kemungkinan, penyesalan, dan kesimpulan tentang
            peristiwa masa lalu.
          </p>
        </header>

        <section className="mp-block">
          <h2 className="mp-block-title">Konsep</h2>
          <p className="mp-text">
            Rumus dasar modal perfect adalah <strong>modal + have + V3</strong>. Pola ini selalu
            merujuk ke masa lalu.
          </p>
        </section>

        <section className="mp-block">
          <h2 className="mp-block-title">Jenis Modal Perfect</h2>
          <div className="mp-grid mp-grid-one-col">
            {MODAL_PERFECT_TYPES.map((item) => (
              <details key={item.title} className="mp-card mp-card-accordion">
                <summary className="mp-card-summary">
                  <h3 className="mp-card-title">{item.title}</h3>
                  <span className="mp-card-caret" aria-hidden="true" />
                </summary>
                <div className="mp-card-body">
                  <p className="mp-card-desc">Fungsi: {item.usage}</p>
                  <ul className="mp-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mp-block">
          <h2 className="mp-block-title">Perbedaan Makna Singkat</h2>
          <ul className="mp-list">
            {COMPARISON_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="mp-block">
          <h2 className="mp-block-title">Kontras: could have vs might have</h2>
          <ul className="mp-list">
            {CONTRAST_EXAMPLES.map((item) => (
              <li key={item.label}>
                {item.label}: {item.sentence}
              </li>
            ))}
          </ul>
        </section>

        <section className="mp-block">
          <h2 className="mp-block-title">Kesalahan Umum</h2>
          <div className="mp-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="mp-fix-card">
                <p className="mp-fix-wrong">Salah: {item.wrong}</p>
                <p className="mp-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mp-block">
          <h2 className="mp-block-title">Catatan Penting:</h2>
          <ul className="mp-list">
            <li>Setelah modal perfect, verb harus bentuk V3.</li>
            <li>must have bukan kewajiban, tetapi kesimpulan tentang masa lalu.</li>
            <li>Gunakan konteks untuk membedakan could have dan might have.</li>
            <li>Untuk deduction negatif di masa lalu, pakai can&apos;t/couldn&apos;t have + V3.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
