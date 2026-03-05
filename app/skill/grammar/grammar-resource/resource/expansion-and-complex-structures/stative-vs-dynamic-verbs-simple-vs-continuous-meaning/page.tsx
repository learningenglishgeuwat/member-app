import BackButton from '../../../../../components/BackButton';
import './stative-vs-dynamic-verbs-simple-vs-continuous-meaning.css';
import '../../topic-layout.css';

const VERB_TYPES = [
  {
    title: 'Stative Verbs',
    desc: 'Menunjukkan keadaan, perasaan, kepemilikan, pikiran, atau persepsi; biasanya tidak dipakai dalam continuous.',
      groups: [
        'Mental: know, believe, understand, remember',
        'Emotion: love, like, hate, prefer',
        'Possession: have, own, belong',
        'Perception (state meaning): seem, appear, hear, smell',
      ],
    examples: ['I know the answer.', 'She loves classical music.', 'This bag belongs to me.'],
  },
  {
    title: 'Dynamic Verbs',
    desc: 'Menunjukkan aksi atau proses, bisa dipakai dalam simple maupun continuous.',
    groups: ['Action: run, write, study, work, play', 'Process: grow, change, improve'],
    examples: ['He runs every morning.', 'He is running now.', 'They are improving quickly.'],
  },
] as const;

const MEANING_CHANGE = [
  {
    title: 'think',
    simple: 'I think you are right. (opini)',
    continuous: 'I am thinking about your offer. (proses berpikir)',
  },
  {
    title: 'have',
    simple: 'I have a car. (kepemilikan)',
    continuous: 'I am having lunch. (aktivitas)',
  },
  {
    title: 'see',
    simple: 'I see your point. (mengerti)',
    continuous: 'I am seeing the doctor tomorrow. (bertemu)',
  },
  {
    title: 'feel',
    simple: 'The fabric feels soft. (state/quality)',
    continuous: 'I am feeling the fabric. (aksi menyentuh/mengecek)',
  },
  {
    title: 'taste',
    simple: 'This soup tastes great. (state/quality)',
    continuous: 'She is tasting the soup. (aksi mencoba rasa)',
  },
  {
    title: 'look',
    simple: 'You look tired. (state/appearance)',
    continuous: 'He is looking at the board. (aksi melihat)',
  },
  {
    title: 'smell',
    simple: 'The room smells fresh. (state/quality)',
    continuous: 'I am smelling the flowers. (aksi menghirup bau)',
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I am knowing the answer.', correct: 'I know the answer.' },
  { wrong: 'She is loving this song.', correct: 'She loves this song.' },
  { wrong: 'I am having a car.', correct: 'I have a car.' },
] as const;

export default function StativeDynamicPage() {
  return (
    <main className="sd-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="sd-shell gr-topic-shell">
        <header className="sd-header">
          <h1 className="sd-title">Stative vs Dynamic Verbs (Simple vs Continuous Meaning)</h1>
          <p className="sd-subtitle">
            Membedakan verb keadaan dan verb aksi agar pemilihan simple/continuous menjadi akurat.
          </p>
        </header>

        <section className="sd-block">
          <h2 className="sd-block-title">Konsep</h2>
          <p className="sd-text">
            Tidak semua verb bisa dipakai dalam continuous. Banyak verb yang bersifat stative lebih
            natural digunakan dalam simple form.
          </p>
          <ul className="sd-list">
            <li>Simple sering dipakai untuk state, fakta, atau kondisi relatif stabil.</li>
            <li>Continuous sering dipakai untuk aktivitas sementara/proses yang sedang berlangsung.</li>
            <li>Beberapa verb bisa keduanya jika maknanya berubah.</li>
          </ul>
        </section>

        <section className="sd-block">
          <h2 className="sd-block-title">Stative vs Dynamic</h2>
          <div className="sd-grid sd-grid-one-col">
            {VERB_TYPES.map((item) => (
              <details key={item.title} className="sd-card sd-card-accordion">
                <summary className="sd-card-summary">
                  <h3 className="sd-card-title">{item.title}</h3>
                  <span className="sd-card-caret" aria-hidden="true" />
                </summary>
                <div className="sd-card-body">
                  <p className="sd-card-desc">{item.desc}</p>
                  <ul className="sd-list">
                    {item.groups.map((group) => (
                      <li key={group}>{group}</li>
                    ))}
                  </ul>
                  <ul className="sd-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="sd-block">
          <h2 className="sd-block-title">Verb yang Maknanya Bisa Berubah</h2>
          <div className="sd-grid sd-grid-one-col">
            {MEANING_CHANGE.map((item) => (
              <details key={item.title} className="sd-card sd-card-accordion">
                <summary className="sd-card-summary">
                  <h3 className="sd-card-title">{item.title}</h3>
                  <span className="sd-card-caret" aria-hidden="true" />
                </summary>
                <div className="sd-card-body">
                  <ul className="sd-list">
                    <li>{item.simple}</li>
                    <li>{item.continuous}</li>
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="sd-block">
          <h2 className="sd-block-title">Kesalahan Umum</h2>
          <div className="sd-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="sd-fix-card">
                <p className="sd-fix-wrong">Salah: {item.wrong}</p>
                <p className="sd-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sd-block">
          <h2 className="sd-block-title">Catatan Penting:</h2>
          <ul className="sd-list">
            <li>Cek dulu apakah verb menunjukkan state atau action.</li>
            <li>Jika makna state, umumnya pakai simple.</li>
            <li>Jika makna aktivitas/proses sementara, continuous biasanya memungkinkan.</li>
            <li>Beberapa verb fleksibel; makna berubah saat dipakai dalam continuous.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
