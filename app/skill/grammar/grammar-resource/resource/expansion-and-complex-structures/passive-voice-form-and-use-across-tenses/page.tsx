import BackButton from '../../../../../components/BackButton';
import './passive-voice-form-and-use-across-tenses.css';
import '../../topic-layout.css';

const TENSE_PATTERNS = [
  {
    title: 'Present Simple Passive',
    pattern: 'am/is/are + V3',
    examples: ['English is spoken here.', 'The reports are checked every day.'],
  },
  {
    title: 'Past Simple Passive',
    pattern: 'was/were + V3',
    examples: ['The door was locked last night.', 'The emails were sent yesterday.'],
  },
  {
    title: 'Present Continuous Passive',
    pattern: 'am/is/are being + V3',
    examples: ['The room is being cleaned now.', 'The project is being reviewed.'],
  },
  {
    title: 'Present Perfect Passive',
    pattern: 'has/have been + V3',
    examples: ['The task has been completed.', 'All files have been uploaded.'],
  },
  {
    title: 'Past Continuous Passive',
    pattern: 'was/were being + V3',
    examples: ['The road was being repaired yesterday.', 'Dinner was being prepared at 7 p.m.'],
  },
  {
    title: 'Past Perfect Passive',
    pattern: 'had been + V3',
    examples: ['The room had been cleaned before guests arrived.', 'The report had been sent by noon.'],
  },
  {
    title: 'Future Passive',
    pattern: 'will be + V3',
    examples: ['The result will be announced tomorrow.', 'The package will be delivered soon.'],
  },
  {
    title: 'Modal Passive',
    pattern: 'modal + be + V3',
    examples: ['The form must be submitted today.', 'This task can be done online.'],
  },
] as const;

const STEPS = [
  'Object pada kalimat aktif menjadi subject di kalimat pasif.',
  'Pilih bentuk be sesuai tense.',
  'Gunakan past participle (V3) sebagai main verb.',
  'Gunakan by + agent hanya jika pelaku perlu disebutkan.',
] as const;

const COMMON_MISTAKES = [
  { wrong: 'The report is write every day.', correct: 'The report is written every day.' },
  { wrong: 'The room cleaned now.', correct: 'The room is being cleaned now.' },
  { wrong: 'The work has completed.', correct: 'The work has been completed.' },
  { wrong: 'He arrived late. -> Late was arrived by him.', correct: 'Intransitive verb seperti arrive tidak bisa dipasifkan.' },
] as const;

export default function PassiveVoicePage() {
  return (
    <main className="pv-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pv-shell gr-topic-shell">
        <header className="pv-header">
          <h1 className="pv-title">Passive Voice (Form and Use Across Tenses)</h1>
          <p className="pv-subtitle">
            Passive voice dipakai saat fokus utama adalah aksi/hasil, bukan pelakunya.
          </p>
        </header>

        <section className="pv-block">
          <h2 className="pv-block-title">Konsep</h2>
          <p className="pv-text">
            Dalam passive voice, subject menerima aksi. Rumus inti passive adalah <strong>be + V3</strong>{' '}
            dengan bentuk <strong>be</strong> yang menyesuaikan tense.
          </p>
          <p className="pv-text">
            Catatan penting: passive umumnya hanya bisa dibuat dari <strong>transitive verbs</strong> (verb yang
            punya object), karena object aktif dipindah jadi subject pasif.
          </p>
        </section>

        <section className="pv-block">
          <h2 className="pv-block-title">Cara Membentuk Passive</h2>
          <ul className="pv-list">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="pv-block">
          <h2 className="pv-block-title">Passive Across Tenses</h2>
          <div className="pv-grid pv-grid-one-col">
            {TENSE_PATTERNS.map((item) => (
              <details key={item.title} className="pv-card pv-card-accordion">
                <summary className="pv-card-summary">
                  <h3 className="pv-card-title">{item.title}</h3>
                  <span className="pv-card-caret" aria-hidden="true" />
                </summary>
                <div className="pv-card-body">
                  <p className="pv-card-desc">
                    Pola: <strong>{item.pattern}</strong>
                  </p>
                  <ul className="pv-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pv-block">
          <h2 className="pv-block-title">Kesalahan Umum</h2>
          <div className="pv-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pv-fix-card">
                <p className="pv-fix-wrong">Salah: {item.wrong}</p>
                <p className="pv-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pv-block">
          <h2 className="pv-block-title">Catatan Penting:</h2>
          <ul className="pv-list">
            <li>Tidak semua kalimat perlu dipasifkan; pilih passive jika fokus pada hasil/objek.</li>
            <li>by + agent dipakai jika pelaku penting, bukan default di semua kalimat.</li>
            <li>Pastikan V3 benar, terutama untuk irregular verbs.</li>
            <li>Untuk bahasa akademik/formal, passive sering dipakai agar fokus ke proses/hasil.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
