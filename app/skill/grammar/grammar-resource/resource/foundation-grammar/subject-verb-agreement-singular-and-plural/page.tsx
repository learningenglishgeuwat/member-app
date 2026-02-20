import BackButton from '../../../../../components/BackButton';
import './subject-verb-agreement-singular-and-plural.css';
import '../../topic-layout.css';

const AGREEMENT_RULES = [
  {
    title: 'Singular Subject',
    rule: 'Di present simple, he/she/it biasanya memakai verb +s/es.',
    examples: ['She works every day.', 'The student studies hard.'],
    focus: ['works', 'studies'],
  },
  {
    title: 'Plural Subject',
    rule: 'Subject jamak memakai base verb (tanpa +s/es) di present simple.',
    examples: ['They work every day.', 'The students study hard.'],
    focus: ['work', 'study'],
  },
  {
    title: 'Be Verb Agreement',
    rule: 'Gunakan am/is/are sesuai subject.',
    examples: ['I am ready.', 'He is tired.', 'They are ready.'],
    focus: ['am', 'is', 'are'],
  },
] as const;

const COMMON_ERRORS = [
  { wrong: 'She work every day.', correct: 'She works every day.' },
  { wrong: 'They studies at night.', correct: 'They study at night.' },
  { wrong: 'My friends is here.', correct: 'My friends are here.' },
] as const;

const QUICK_TABLE = [
  { subject: 'I', present: 'work', be: 'am' },
  { subject: 'You', present: 'work', be: 'are' },
  { subject: 'He / She', present: 'works', be: 'is' },
  { subject: 'It', present: 'works', be: 'is' },
  { subject: 'We / They', present: 'work', be: 'are' },
] as const;

function renderHighlighted(sentence: string, focusWords: readonly string[], keyPrefix: string) {
  const targets = [...focusWords].sort((a, b) => b.length - a.length);
  let nodes: Array<string | JSX.Element> = [sentence];

  targets.forEach((target) => {
    nodes = nodes.flatMap((node, idx) => {
      if (typeof node !== 'string') return [node];
      const parts = node.split(target);
      if (parts.length === 1) return [node];

      const out: Array<string | JSX.Element> = [];
      parts.forEach((part, pIdx) => {
        if (part) out.push(part);
        if (pIdx < parts.length - 1) {
          out.push(
            <mark key={`${keyPrefix}-${target}-${idx}-${pIdx}`} className="sva-inline-highlight">
              {target}
            </mark>,
          );
        }
      });
      return out;
    });
  });

  return nodes;
}

export default function SubjectVerbAgreementPage() {
  return (
    <main className="sva-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="sva-shell gr-topic-shell">
        <header className="sva-header">
          <h1 className="sva-title">Subject-Verb Agreement (Singular and Plural)</h1>
          <p className="sva-subtitle">
            Menjaga kecocokan antara subject dan verb agar kalimat benar secara struktur.
          </p>
        </header>

        <section className="sva-block">
          <h2 className="sva-block-title">Konsep</h2>
          <p className="sva-text">
            Subject-Verb Agreement berarti bentuk verb harus cocok dengan subject (singular atau
            plural). Ini sangat penting di present simple dan saat memakai be verb.
          </p>
        </section>

        <section className="sva-block">
          <h2 className="sva-block-title">Aturan Inti</h2>
          <div className="sva-grid">
            {AGREEMENT_RULES.map((item) => (
              <details key={item.title} className="sva-card sva-card-accordion">
                <summary className="sva-card-summary">
                  <h3 className="sva-card-title">{item.title}</h3>
                  <span className="sva-card-caret" aria-hidden="true" />
                </summary>
                <div className="sva-card-body">
                  <p className="sva-card-desc">{item.rule}</p>
                  <ul className="sva-list">
                    {item.examples.map((sentence, idx) => (
                      <li key={`${item.title}-${sentence}`}>
                        {renderHighlighted(sentence, [item.focus[idx] ?? item.focus[0]], `${item.title}-${idx}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="sva-block">
          <h2 className="sva-block-title">Tabel Cepat</h2>
          <div className="sva-table-wrap">
            <table className="sva-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Present Simple</th>
                  <th>Be Verb</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_TABLE.map((row) => (
                  <tr key={row.subject}>
                    <td>{row.subject}</td>
                    <td>{row.present}</td>
                    <td>{row.be}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sva-block">
          <h2 className="sva-block-title">Kesalahan Umum</h2>
          <div className="sva-fix-list">
            {COMMON_ERRORS.map((item) => (
              <article key={item.wrong} className="sva-fix-card">
                <p className="sva-fix-wrong">Salah: {item.wrong}</p>
                <p className="sva-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sva-block">
          <h2 className="sva-block-title">Catatan Penting:</h2>
          <ul className="sva-list">
            <li>- He/She/It biasanya memakai verb +s/es di present simple.</li>
            <li>- Subject jamak (we/they/students) memakai base verb tanpa +s/es.</li>
            <li>- Jika dua subject digabung dengan and, biasanya dianggap plural (Rina and Budi are...).</li>
            <li>- Beberapa bentuk plural tidak pakai -s (children, people), tapi tetap pakai plural verb.</li>
            <li>- Fokus cek cepat: tentukan dulu subject singular atau plural, baru pilih verb.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}




