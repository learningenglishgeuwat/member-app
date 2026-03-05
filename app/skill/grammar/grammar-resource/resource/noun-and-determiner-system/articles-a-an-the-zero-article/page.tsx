import BackButton from '../../../../../components/BackButton';
import './articles-a-an-the-zero-article.css';
import '../../topic-layout.css';

const ARTICLE_RULES = [
  {
    title: 'a / an (indefinite article)',
    desc: 'Dipakai untuk singular countable noun yang belum spesifik.',
    points: [
      'a dipakai sebelum bunyi konsonan: a book, a university',
      'an dipakai sebelum bunyi vokal: an apple, an hour',
      'dipakai saat menyebut sesuatu pertama kali: I saw a dog.',
    ],
    examples: [
      { sentence: 'I bought a book yesterday.', focus: 'a' },
      { sentence: 'She is an engineer.', focus: 'an' },
      { sentence: 'He waited for an hour.', focus: 'an' },
    ],
  },
  {
    title: 'the (definite article)',
    desc: 'Dipakai untuk benda yang sudah spesifik atau sudah diketahui.',
    points: [
      'dipakai saat speaker-listener tahu benda yang dimaksud',
      'dipakai untuk sesuatu yang unik: the sun, the moon',
      'sering muncul pada second mention: I saw a dog. The dog was friendly.',
    ],
    examples: [
      { sentence: 'Please close the door.', focus: 'the' },
      { sentence: 'The sun is very bright today.', focus: 'The' },
      { sentence: 'I met the teacher you mentioned.', focus: 'the' },
    ],
  },
  {
    title: 'zero article (tanpa article)',
    desc: 'Dipakai untuk plural/uncountable dalam makna umum.',
    points: [
      'plural umum: Students need practice.',
      'uncountable umum: Water is important.',
      'nama bahasa/mata pelajaran: English, Mathematics',
    ],
    examples: [
      { sentence: 'I drink water every day.' },
      { sentence: 'Students must submit on time.' },
      { sentence: 'She studies English.' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She is a honest person.', correct: 'She is an honest person.' },
  { wrong: 'I like the music in general.', correct: 'I like music in general.' },
  { wrong: 'Sun rises in the east.', correct: 'The sun rises in the east.' },
] as const;

function highlightArticle(sentence: string, focus?: string) {
  if (!focus) return sentence;
  const lowerSentence = sentence.toLowerCase();
  const lowerFocus = focus.toLowerCase();
  const idx = lowerSentence.indexOf(lowerFocus);
  if (idx === -1) return sentence;

  const start = sentence.slice(0, idx);
  const mid = sentence.slice(idx, idx + focus.length);
  const end = sentence.slice(idx + focus.length);

  return (
    <>
      {start}
      <span className="art-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function ArticlesPage() {
  return (
    <main className="art-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="art-shell gr-topic-shell">
        <header className="art-header">
          <h1 className="art-title">Articles (a, an, the, zero article)</h1>
          <p className="art-subtitle">
            Memahami kapan memakai a/an/the atau tanpa article agar noun phrase lebih tepat.
          </p>
        </header>

        <section className="art-block">
          <h2 className="art-block-title">Konsep</h2>
          <p className="art-text">
            Article adalah penanda noun untuk menunjukkan apakah benda bersifat umum, belum spesifik,
            atau sudah spesifik.
          </p>
        </section>

        <section className="art-block">
          <h2 className="art-block-title">Jenis Article</h2>
          <div className="art-grid art-grid-one-col">
            {ARTICLE_RULES.map((item) => (
              <details key={item.title} className="art-card art-card-accordion">
                <summary className="art-card-summary">
                  <h3 className="art-card-title">{item.title}</h3>
                  <span className="art-card-caret" aria-hidden="true" />
                </summary>
                <div className="art-card-body">
                  <p className="art-card-desc">{item.desc}</p>
                  <ul className="art-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
	                  <ul className="art-list">
	                    {item.examples.map((ex) => (
	                      <li key={ex.sentence}>
	                        {highlightArticle(ex.sentence, 'focus' in ex ? ex.focus : undefined)}
	                      </li>
	                    ))}
	                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="art-block">
          <h2 className="art-block-title">Kesalahan Umum</h2>
          <div className="art-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="art-fix-card">
                <p className="art-fix-wrong">Salah: {item.wrong}</p>
                <p className="art-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="art-block">
          <h2 className="art-block-title">Catatan Penting:</h2>
          <ul className="art-list">
            <li>- Fokus pada bunyi awal (sound), bukan huruf awal, saat memilih a/an.</li>
            <li>- Gunakan the jika noun sudah spesifik dalam konteks.</li>
            <li>- Untuk makna umum plural/uncountable, sering kali tanpa article.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
