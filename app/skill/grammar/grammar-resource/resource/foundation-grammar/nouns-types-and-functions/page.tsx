import BackButton from '../../../../../components/BackButton';
import './nouns-types-and-functions.css';
import '../../topic-layout.css';

const NOUN_TYPES = [
  {
    title: 'Common Noun',
    description: 'Nama umum untuk orang, benda, tempat, atau ide.',
    examples: ['teacher', 'city', 'book', 'idea'],
  },
  {
    title: 'Proper Noun',
    description: 'Nama khusus dan selalu diawali huruf kapital.',
    examples: ['Jakarta', 'Rina', 'Monday', 'Indonesia'],
  },
  {
    title: 'Concrete Noun',
    description: 'Benda yang bisa ditangkap indra (dilihat/disentuh/didengar).',
    examples: ['table', 'phone', 'rain', 'music'],
  },
  {
    title: 'Abstract Noun',
    description: 'Ide, kualitas, atau perasaan yang tidak bisa disentuh langsung.',
    examples: ['happiness', 'freedom', 'beauty', 'love'],
  },
  {
    title: 'Countable Noun',
    description: 'Bisa dihitung satuan (one, two, three) dan bisa plural.',
    examples: ['book/books', 'student/students', 'apple/apples'],
  },
  {
    title: 'Uncountable Noun',
    description: 'Tidak dihitung satuan langsung; biasanya pakai unit atau quantifier.',
    examples: ['water', 'information', 'advice', 'furniture'],
  },
] as const;

const NOUN_FUNCTIONS = [
  {
    title: 'Subject',
    example: 'The student studies every night.',
    focus: 'The student',
  },
  {
    title: 'Object',
    example: 'She bought a new laptop.',
    focus: 'a new laptop',
  },
  {
    title: 'Complement',
    example: 'Rina is a teacher.',
    focus: 'a teacher',
  },
  {
    title: 'Object of a Preposition',
    example: 'They talked about the project.',
    focus: 'the project',
  },
] as const;

function renderFocusText(text: string, focus: string): Array<string | JSX.Element> {
  const parts = text.split(focus);
  if (parts.length === 1) return [text];

  const out: Array<string | JSX.Element> = [];
  parts.forEach((part, idx) => {
    if (part) out.push(part);
    if (idx < parts.length - 1) {
      out.push(
        <mark key={`${focus}-${idx}`} className="noun-inline-highlight">
          {focus}
        </mark>,
      );
    }
  });
  return out;
}

export default function NounsTypesAndFunctionsPage() {
  return (
    <main className="noun-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="noun-shell gr-topic-shell">
        <header className="noun-header">
          <h1 className="noun-title">Nouns (Types and Functions)</h1>
          <p className="noun-subtitle">
            Memahami jenis noun dan peran noun dalam kalimat agar struktur grammar lebih jelas.
          </p>
        </header>

        <section className="noun-block">
          <h2 className="noun-block-title">Konsep</h2>
          <p className="noun-text">
            Noun adalah kata yang menamai orang, tempat, benda, ide, atau perasaan. Topik ini
            fokus pada dua hal: jenis noun dan fungsi noun dalam kalimat.
          </p>
        </section>

        <section className="noun-block">
          <h2 className="noun-block-title">Jenis Nouns</h2>
          <div className="noun-grid">
            {NOUN_TYPES.map((item) => (
              <details key={item.title} className="noun-card noun-card-accordion">
                <summary className="noun-card-summary">
                  <h3 className="noun-card-title">{item.title}</h3>
                  <span className="noun-card-caret" aria-hidden="true" />
                </summary>

                <div className="noun-card-body">
                  <p className="noun-card-desc">{item.description}</p>
                  <p className="noun-card-examples">
                    Contoh:
                    <span className="noun-example-chip-list">
                      {item.examples.map((example) => (
                        <span key={`${item.title}-${example}`} className="noun-example-chip">
                          {example}
                        </span>
                      ))}
                    </span>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="noun-block">
          <h2 className="noun-block-title">Fungsi Nouns dalam Kalimat</h2>
          <div className="noun-function-grid">
            {NOUN_FUNCTIONS.map((item) => (
              <details key={item.title} className="noun-card noun-card-accordion">
                <summary className="noun-card-summary">
                  <h3 className="noun-card-title">{item.title}</h3>
                  <span className="noun-card-caret" aria-hidden="true" />
                </summary>

                <div className="noun-card-body">
                  <p className="noun-card-examples">
                    Contoh kalimat (yang di-highlight = noun phrase):{' '}
                    {renderFocusText(item.example, item.focus)}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="noun-block">
          <h2 className="noun-block-title">Kesalahan Umum</h2>
          <ul className="noun-notes">
            <li>- Menggunakan proper noun tanpa huruf kapital (mis. jakarta).</li>
            <li>- Memberi article pada uncountable noun tanpa unit (mis. an advice).</li>
            <li>- Bingung membedakan noun sebagai object dan complement.</li>
            <li>- Memakai bentuk singular saat konteksnya jelas plural.</li>
          </ul>
        </section>

        <section className="noun-block">
          <h2 className="noun-block-title">Catatan Penting:</h2>
          <ul className="noun-notes">
            <li>- Proper noun diawali huruf kapital (Rina, Jakarta, Monday).</li>
            <li>- Tidak semua noun bisa dipakai dengan a/an (contoh: information, furniture).</li>
            <li>- Noun bisa muncul di banyak posisi: subject, object, complement, object of preposition.</li>
            <li>
              - Beberapa noun bisa countable/uncountable tergantung makna (contoh: chicken, paper,
              time).
            </li>
            <li>- Pahami jenis noun dulu sebelum masuk article, quantifier, dan agreement.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}




