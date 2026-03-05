import BackButton from '../../../../../components/BackButton';
import './prepositions-of-time-and-place-in-on-at.css';
import '../../topic-layout.css';

const TIME_PREPOSITIONS = [
  {
    title: 'in (time)',
    desc: 'Dipakai untuk periode panjang: bulan, tahun, abad, bagian hari.',
    examples: [
      { sentence: 'We have a holiday in July.', focus: 'in' },
      { sentence: 'She was born in 2016.', focus: 'in' },
      { sentence: 'I study in the morning.', focus: 'in' },
      { sentence: 'Technology changes fast in the 21st century.', focus: 'in' },
    ],
  },
  {
    title: 'on (time)',
    desc: 'Dipakai untuk hari dan tanggal spesifik.',
    examples: [
      { sentence: 'We have class on Monday.', focus: 'on' },
      { sentence: 'The event is on 17 February.', focus: 'on' },
      { sentence: 'I got a gift on my birthday.', focus: 'on' },
      { sentence: 'We go jogging on Sunday morning.', focus: 'on' },
    ],
  },
  {
    title: 'at (time)',
    desc: 'Dipakai untuk jam atau titik waktu yang spesifik.',
    examples: [
      { sentence: 'The class starts at 7:00.', focus: 'at' },
      { sentence: 'We usually eat lunch at noon.', focus: 'at' },
      { sentence: 'I sleep at night.', focus: 'at' },
      { sentence: 'He is busy at the moment.', focus: 'at' },
    ],
  },
] as const;

const PLACE_PREPOSITIONS = [
  {
    title: 'in (place)',
    desc: 'Dipakai untuk area/ruang tertutup atau wilayah luas.',
    examples: [
      { sentence: 'She lives in Jakarta.', focus: 'in' },
      { sentence: 'The keys are in the room.', focus: 'in' },
      { sentence: 'The toys are in the box.', focus: 'in' },
      { sentence: 'My parents live in Indonesia.', focus: 'in' },
    ],
  },
  {
    title: 'on (place)',
    desc: 'Dipakai untuk permukaan.',
    examples: [
      { sentence: 'The book is on the table.', focus: 'on' },
      { sentence: 'There is a photo on the wall.', focus: 'on' },
      { sentence: 'Your bag is on the floor.', focus: 'on' },
      { sentence: 'Write your name on the page.', focus: 'on' },
    ],
  },
  {
    title: 'at (place)',
    desc: 'Dipakai untuk titik/lokasi spesifik atau tempat aktivitas umum.',
    examples: [
      { sentence: 'The students are at school.', focus: 'at' },
      { sentence: 'She is at home.', focus: 'at' },
      { sentence: 'We are waiting at the bus stop.', focus: 'at' },
      { sentence: 'Someone is standing at the door.', focus: 'at' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I study on the morning.', correct: 'I study in the morning.' },
  { wrong: 'She is in the bus stop.', correct: 'She is at the bus stop.' },
  { wrong: 'The keys are in the table.', correct: 'The keys are on the table.' },
] as const;

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightFocus(sentence: string, focus: string) {
  const regex = new RegExp(`\\b${escapeRegex(focus)}\\b`, 'i');
  const match = sentence.match(regex);
  if (!match || match.index === undefined) return sentence;

  const start = sentence.slice(0, match.index);
  const mid = sentence.slice(match.index, match.index + match[0].length);
  const end = sentence.slice(match.index + match[0].length);

  return (
    <>
      {start}
      <span className="prep-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PrepositionsTimePlacePage() {
  return (
    <main className="prep-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="prep-shell gr-topic-shell">
        <header className="prep-header">
          <h1 className="prep-title">Prepositions of Time and Place (in, on, at)</h1>
          <p className="prep-subtitle">
            Memahami pemakaian in, on, dan at untuk waktu dan tempat agar kalimat lebih akurat.
          </p>
        </header>

        <section className="prep-block">
          <h2 className="prep-block-title">Konsep</h2>
          <p className="prep-text">
            Preposition menunjukkan hubungan kata dengan waktu atau tempat. Dalam topik ini, fokus
            utama adalah membedakan penggunaan <strong>in</strong>, <strong>on</strong>, dan <strong>at</strong>.
          </p>
        </section>

        <section className="prep-block">
          <h2 className="prep-block-title">Prepositions of Time</h2>
          <div className="prep-grid">
            {TIME_PREPOSITIONS.map((item) => (
              <details key={item.title} className="prep-card prep-card-accordion">
                <summary className="prep-card-summary">
                  <h3 className="prep-card-title">{item.title}</h3>
                  <span className="prep-card-caret" aria-hidden="true" />
                </summary>
                <div className="prep-card-body">
                  <p className="prep-card-desc">{item.desc}</p>
                  <ul className="prep-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightFocus(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="prep-block">
          <h2 className="prep-block-title">Prepositions of Place</h2>
          <div className="prep-grid">
            {PLACE_PREPOSITIONS.map((item) => (
              <details key={item.title} className="prep-card prep-card-accordion">
                <summary className="prep-card-summary">
                  <h3 className="prep-card-title">{item.title}</h3>
                  <span className="prep-card-caret" aria-hidden="true" />
                </summary>
                <div className="prep-card-body">
                  <p className="prep-card-desc">{item.desc}</p>
                  <ul className="prep-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightFocus(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="prep-block">
          <h2 className="prep-block-title">Kesalahan Umum</h2>
          <div className="prep-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="prep-fix-card">
                <p className="prep-fix-wrong">Salah: {item.wrong}</p>
                <p className="prep-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="prep-block">
          <h2 className="prep-block-title">Catatan Penting:</h2>
          <ul className="prep-list">
            <li>- Time: in (periode), on (hari/tanggal), at (jam/titik waktu).</li>
            <li>- Place: in (area/ruang), on (permukaan), at (titik lokasi).</li>
            <li>- Pengecualian umum: in the morning/afternoon/evening, tetapi at night.</li>
            <li>- Jika ada hari + bagian hari, gunakan on: on Monday morning.</li>
            <li>- Jika bingung, tentukan dulu: ini konteks periode, permukaan, atau titik.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
