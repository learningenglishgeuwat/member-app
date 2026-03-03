import BackButton from '../../../../../components/BackButton';
import './adverbial-clauses.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  {
    title: 'Reason',
    desc: 'Reason clause menjawab "kenapa" suatu aksi terjadi. Gunakan because/since/as + clause untuk memberi sebab langsung.',
    examples: [
      'I stayed home because I was sick.',
      'Since the road was flooded, we took another route.',
      'As she had no cash, she paid by card.',
    ],
  },
  {
    title: 'Purpose',
    desc: 'Purpose clause menjawab "untuk apa" aksi dilakukan. Fokusnya tujuan yang direncanakan, bukan hasil akhir.',
    examples: [
      'She spoke slowly so that everyone understood.',
      'He left early in order that he could catch the first train.',
      'They saved money so that they could start a small business.',
    ],
  },
  {
    title: 'Result',
    desc: 'Result clause menunjukkan akibat nyata yang terjadi. Pola umum: so...that atau such...that.',
    examples: [
      'It was so cold that we went inside.',
      'She was such a good leader that everyone trusted her.',
      'The explanation was so clear that the students stopped asking questions.',
    ],
  },
  {
    title: 'Concession',
    desc: 'Concession clause menunjukkan kontras: ada hambatan, tetapi aksi utama tetap terjadi. Gunakan although/even though/though.',
    examples: [
      'Although he was tired, he kept working.',
      'Even though it rained, they played.',
      'Though the budget was limited, the team delivered a good result.',
    ],
  },
] as const;

const REASON_PURPOSE_RESULT_FLOW = [
  {
    context: 'Project deadline sangat ketat.',
    reason: 'Because the deadline was close, the team worked overtime.',
    purpose: 'They worked overtime so that they could finish the report on time.',
    result: 'The report was so complete that the client approved it immediately.',
  },
  {
    context: 'Siswa ingin meningkatkan speaking.',
    reason: 'Since she often paused in conversations, she practiced daily.',
    purpose: 'She practiced daily so that she could speak more smoothly.',
    result: 'Her fluency improved so much that she felt confident in class.',
  },
  {
    context: 'Tim support menerima banyak komplain.',
    reason: 'As response times were slow, the manager changed the workflow.',
    purpose: 'He changed the workflow so that agents could reply faster.',
    result: 'The process became so efficient that complaint volume dropped.',
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Although but he tried, he failed.', correct: 'Although he tried, he failed.' },
  { wrong: 'Because of he was late, we left.', correct: 'Because he was late, we left.' },
  {
    wrong: 'He studied hard so that he passed the exam yesterday.',
    correct: 'He studied hard, and as a result, he passed the exam yesterday.',
  },
] as const;

const NOTES = [
  'Reason = sebab; Purpose = target yang direncanakan; Result = akibat yang benar-benar terjadi.',
  'Alur yang kuat: reason (masalah) -> purpose (strategi) -> result (outcome).',
  'Jika akibat sudah terjadi, jangan pakai purpose marker sebagai pengganti result marker.',
  'Because butuh clause; because of butuh noun phrase.',
  'Hindari marker kontras ganda: although + but.',
] as const;

export default function AdverbialClausesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="std-shell gr-topic-shell">
        <header className="std-header">
          <h1 className="std-title">Adverbial Clauses (Reason, Purpose, Result, Concession)</h1>
          <p className="std-subtitle">Mengembangkan kalimat kompleks dengan adverbial clause non-time.</p>
        </header>

        <section className="std-block">
          <h2 className="std-block-title">Konsep</h2>
          <p className="std-text">
            Adverbial clauses menambah relasi logis antargagasan. Dalam writing dan speaking, relasi reason, purpose,
            dan result sebaiknya tidak berdiri sendiri: reason menjelaskan masalah awal, purpose menunjukkan target aksi,
            dan result menunjukkan dampak nyata setelah aksi dilakukan.
          </p>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Inti Materi</h2>
          <div className="std-grid">
            {CORE_ITEMS.map((item) => (
              <details key={item.title} className="std-card std-card-accordion">
                <summary className="std-card-summary">
                  <h3 className="std-card-title">{item.title}</h3>
                  <span className="std-card-caret" aria-hidden="true" />
                </summary>
                <div className="std-card-body">
                  <p className="std-card-desc">{item.desc}</p>
                  <ul className="std-list">
                    {item.examples.map((example) => (
                      <li key={item.title + '-' + example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Keterkaitan Reason - Purpose - Result</h2>
          <p className="std-text">
            Gunakan urutan ini saat mengembangkan ide: mulai dari penyebab, lanjutkan dengan tujuan tindakan, lalu tutup
            dengan akibat yang terukur. Dengan pola ini, paragraf jadi lebih logis dan tidak loncat ide.
          </p>
          <div className="std-grid">
            {REASON_PURPOSE_RESULT_FLOW.map((item) => (
              <article key={item.context} className="std-card">
                <div className="std-card-body">
                  <p className="std-card-desc">
                    <strong>Context:</strong> {item.context}
                  </p>
                  <ul className="std-list">
                    <li>
                      <strong>Reason:</strong> {item.reason}
                    </li>
                    <li>
                      <strong>Purpose:</strong> {item.purpose}
                    </li>
                    <li>
                      <strong>Result:</strong> {item.result}
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Kesalahan Umum</h2>
          <div className="std-fix-grid">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="std-fix-card">
                <p className="std-fix-wrong">Salah: {item.wrong}</p>
                <p className="std-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Catatan Penting</h2>
          <ul className="std-list">
            {NOTES.map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
