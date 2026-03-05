import BackButton from '../../../../../components/BackButton';
import './sentence-elements-and-word-order.css';
import '../../topic-layout.css';

const ELEMENTS = [
  {
    title: 'Subject (S)',
    description: 'Pelaku atau fokus utama dalam kalimat.',
    highlights: ['She', 'My brother'],
    examples: ['She studies every night.', 'My brother is at home.'],
  },
  {
    title: 'Verb (V)',
    description: 'Aksi, proses, atau keadaan (termasuk be-verb).',
    highlights: ['studies', 'is'],
    examples: ['She studies every night.', 'He is tired.'],
  },
  {
    title: 'Object (O)',
    description: 'Bagian yang dikenai langsung oleh aksi verb.',
    highlights: ['a book', 'the video'],
    examples: ['She reads a book.', 'They watch the video.'],
  },
  {
    title: 'Complement (C)',
    description:
      'Informasi pelengkap setelah linking verb (be, seem, become, feel), bukan objek aksi.',
    highlights: ['a teacher', 'clean'],
    examples: ['He is a teacher.', 'The room looks clean.'],
  },
  {
    title: 'Adverbial (Keterangan)',
    description: 'Keterangan waktu, tempat, cara, alasan, atau frekuensi.',
    highlights: ['at night', 'in the library'],
    examples: ['She studies at night.', 'We met in the library.'],
  },
] as const;

const WORD_ORDER_PATTERNS = [
  { pattern: 'S + V', example: 'She sings.' },
  { pattern: 'S + V + O', example: 'They play football.' },
  { pattern: 'S + V + C', example: 'He is happy.' },
  { pattern: 'S + V + O + Adverbial (Keterangan)', example: 'I read a book every day.' },
  { pattern: 'S + V + Adverbial (Keterangan)', example: 'We study at home.' },
] as const;

function renderHighlightedSentence(
  sentence: string,
  highlights: readonly string[],
  keyPrefix: string,
): Array<string | JSX.Element> {
  const targets = [...highlights].sort((a, b) => b.length - a.length);
  let nodes: Array<string | JSX.Element> = [sentence];

  targets.forEach((target) => {
    nodes = nodes.flatMap((node, nodeIdx) => {
      if (typeof node !== 'string') return [node];

      const parts = node.split(target);
      if (parts.length === 1) return [node];

      const out: Array<string | JSX.Element> = [];
      parts.forEach((part, partIdx) => {
        if (part) out.push(part);
        if (partIdx < parts.length - 1) {
          out.push(
            <mark
              key={`${keyPrefix}-${target}-${nodeIdx}-${partIdx}`}
              className="sewo-inline-highlight"
            >
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

export default function SentenceElementsAndWordOrderPage() {
  return (
    <main className="sewo-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="sewo-shell gr-topic-shell">
        <header className="sewo-header">
          <h1 className="sewo-title">Sentence Elements and Word Order</h1>
          <p className="sewo-subtitle">
            Dasar membangun kalimat yang jelas dengan urutan elemen yang natural.
          </p>
        </header>

        <section className="sewo-block">
          <h2 className="sewo-block-title">Konsep</h2>
          <p className="sewo-text">
            Topik ini membahas dua hal inti: elemen kalimat (Subject, Verb, Object, Complement,
            Adverbial) dan urutan kata (word order) agar makna kalimat tetap jelas.
          </p>
        </section>

        <section className="sewo-block">
          <h2 className="sewo-block-title">Elemen Kalimat</h2>
          <div className="sewo-grid">
            {ELEMENTS.map((item) => (
              <details key={item.title} className="sewo-card sewo-card-accordion">
                <summary className="sewo-card-summary">
                  <h3 className="sewo-card-title">{item.title}</h3>
                  <span className="sewo-card-caret" aria-hidden="true" />
                </summary>

                <div className="sewo-card-body">
                  <p className="sewo-card-desc">{item.description}</p>
                  <p className="sewo-card-examples">
                    Contoh:{' '}
                    {item.examples.map((sentence, sentenceIdx) => (
                      <span key={`${item.title}-${sentenceIdx}`}>
                        {sentenceIdx > 0 ? ' / ' : ''}
                        {renderHighlightedSentence(sentence, item.highlights, `${item.title}-${sentenceIdx}`)}
                      </span>
                    ))}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="sewo-block">
          <h2 className="sewo-block-title">Pola Word Order Dasar</h2>
          <div className="sewo-pattern-grid">
            {WORD_ORDER_PATTERNS.map((item) => (
              <details key={item.pattern} className="sewo-pattern-card sewo-card-accordion">
                <summary className="sewo-card-summary">
                  <mark className="sewo-inline-highlight">{item.pattern}</mark>
                  <span className="sewo-card-caret" aria-hidden="true" />
                </summary>
                <div className="sewo-card-body">
                  <div className="sewo-pattern-example">{item.example}</div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="sewo-block">
          <h2 className="sewo-block-title">Kesalahan Umum</h2>
          <ul className="sewo-list">
            <li>- Menaruh verb sebelum subject pada kalimat statement biasa.</li>
            <li>- Mencampur object dan complement setelah linking verb.</li>
            <li>- Menumpuk terlalu banyak keterangan hingga inti S + V tidak jelas.</li>
            <li>- Tidak menjaga urutan dasar saat menulis kalimat panjang.</li>
          </ul>
        </section>

        <section className="sewo-block">
          <h2 className="sewo-block-title">Catatan Penting</h2>
          <ul className="sewo-list">
            <li>- Urutan paling umum di English statement: Subject sebelum Verb.</li>
            <li>- Pada question/inversion, urutan bisa berubah (mis. Do you study every day?).</li>
            <li>- Posisi adverb bisa berubah, tapi jangan merusak inti S + V (+ O/C).</li>
            <li>- Word order yang tepat meningkatkan clarity di speaking dan writing.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}



