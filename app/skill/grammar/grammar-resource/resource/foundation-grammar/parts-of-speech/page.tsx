import BackButton from '../../../../../components/BackButton';
import './parts-of-speech.css';
import '../../topic-layout.css';

const POS_ITEMS = [
  {
    title: 'Noun',
    description: 'Menamai orang, benda, tempat, ide, atau hal.',
    examples: 'student, book, Jakarta, happiness',
    sentence: 'The student reads a book in Jakarta.',
    focusWord: 'student',
  },
  {
    title: 'Pronoun',
    description: 'Menggantikan noun atau menunjuk referen dalam konteks kalimat.',
    examples: 'I, you, she, they, it, them, mine',
    sentence: 'She is my friend, and I trust her.',
    focusWord: 'She',
  },
  {
    title: 'Verb',
    description: 'Menyatakan aksi, proses, atau keadaan.',
    examples: 'study, run, think, is, have',
    sentence: 'They study English every night.',
    focusWord: 'study',
  },
  {
    title: 'Adjective',
    description: 'Menjelaskan noun atau pronoun.',
    examples: 'big, careful, useful, happy',
    sentence: 'This lesson is very useful for beginners.',
    focusWord: 'useful',
  },
  {
    title: 'Adverb',
    description: 'Menjelaskan verb, adjective, adverb lain, atau seluruh kalimat.',
    examples: 'quickly, very, often, probably',
    sentence: 'He quickly finished his homework.',
    focusWord: 'quickly',
  },
  {
    title: 'Preposition',
    description: 'Menunjukkan relasi waktu, tempat, arah, atau hubungan lain.',
    examples: 'in, on, at, to, with, from',
    sentence: 'She is at home.',
    focusWord: 'at',
  },
  {
    title: 'Conjunction',
    description: 'Menghubungkan kata, frasa, atau klausa.',
    examples: 'and, but, or, because, although',
    sentence: 'I wanted to go out, but it was raining.',
    focusWord: 'but',
  },
] as const;

function renderSentenceWithHighlight(sentence: string, focusWord: string) {
  const focusIndex = sentence.indexOf(focusWord);
  if (focusIndex === -1) return sentence;

  const before = sentence.slice(0, focusIndex);
  const after = sentence.slice(focusIndex + focusWord.length);

  return (
    <>
      {before}
      <span className="pos-inline-highlight">{focusWord}</span>
      {after}
    </>
  );
}

export default function PartsOfSpeechPage() {
  return (
    <main className="pos-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pos-shell gr-topic-shell">
        <header className="pos-header">
          <h1 className="pos-title">Parts of Speech</h1>
          <p className="pos-subtitle">
            Fondasi grammar untuk mengenali fungsi kata sebelum masuk ke struktur kalimat yang lebih
            kompleks.
          </p>
        </header>

        <section className="pos-block">
          <h2 className="pos-block-title">Konsep</h2>
          <p className="pos-text">
            Parts of Speech adalah klasifikasi kata berdasarkan fungsi dalam kalimat. Satu kata bisa
            punya fungsi berbeda tergantung konteks kalimatnya.
          </p>
        </section>

        <section className="pos-block">
          <h2 className="pos-block-title">Komponen Utama</h2>
          <div className="pos-grid">
            {POS_ITEMS.map((item) => (
              <details key={item.title} className="pos-card pos-card-accordion">
                <summary className="pos-card-summary">
                  <h3 className="pos-card-title">{item.title}</h3>
                  <span className="pos-card-caret" aria-hidden="true" />
                </summary>

                <div className="pos-card-body">
                  <p className="pos-card-desc">{item.description}</p>
                  <p className="pos-card-examples">
                    Contoh:
                    <span className="pos-example-list">
                      {item.examples.split(', ').map((word) => (
                        <span key={`${item.title}-${word}`} className="pos-example-chip">
                          {word}
                        </span>
                      ))}
                    </span>
                  </p>
                  <p className="pos-card-sentence">
                    Contoh kalimat:{' '}
                    <span className="pos-inline-sentence">
                      {renderSentenceWithHighlight(item.sentence, item.focusWord)}
                    </span>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pos-block">
          <h2 className="pos-block-title">Kesalahan Umum</h2>
          <ul className="pos-notes">
            <li>- Menentukan kelas kata hanya dari bentuk kata, bukan dari fungsi di kalimat.</li>
            <li>- Mengira semua kata berakhiran -ly pasti adverb.</li>
            <li>- Mencampur adjective dan adverb (mis. speak clear vs speak clearly).</li>
            <li>- Tidak mengecek posisi kata sehingga fungsi kata jadi salah baca.</li>
          </ul>
        </section>

        <section className="pos-block">
          <h2 className="pos-block-title">Catatan Penting</h2>
          <ul className="pos-notes">
            <li>- Halaman ini membahas 7 kelas kata utama pada level foundational.</li>
            <li>- Fokus pertama: kenali fungsi kata, bukan hafalan daftar kata.</li>
            <li>- Periksa posisi kata di kalimat untuk menentukan kelas katanya.</li>
            <li>- Topik ini jadi dasar untuk tense, clause, agreement, dan writing accuracy.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}



