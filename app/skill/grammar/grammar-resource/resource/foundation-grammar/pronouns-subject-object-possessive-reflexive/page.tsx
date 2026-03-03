import BackButton from '../../../../../components/BackButton';
import './pronouns-subject-object-possessive-reflexive.css';
import '../../topic-layout.css';

const PRONOUN_SETS = [
  {
    title: 'Subject Pronouns',
    use: 'Dipakai sebagai pelaku (subject) dalam kalimat.',
    pairs: [
      'I, you, he, she, it, we, they',
      'Contoh: She studies every day.',
    ],
  },
  {
    title: 'Object Pronouns',
    use: 'Dipakai sebagai object (yang dikenai aksi verb).',
    pairs: [
      'me, you, him, her, it, us, them',
      'Contoh: The teacher helps us.',
    ],
  },
  {
    title: 'Possessive Determiners',
    use: 'Dipakai sebelum noun untuk menunjukkan kepemilikan.',
    pairs: [
      'my, your, his, her, its, our, their',
      'Contoh: This is my book.',
    ],
  },
  {
    title: 'Possessive Pronouns',
    use: 'Menunjukkan kepemilikan tanpa diikuti noun.',
    pairs: [
      'mine, yours, his, hers, ours, theirs',
      'Contoh: The red bag is hers.',
    ],
  },
  {
    title: 'Reflexive Pronouns',
    use: 'Digunakan ketika subject dan object merujuk orang yang sama.',
    pairs: [
      'myself, yourself/yourselves, himself, herself, itself, ourselves, themselves',
      'Contoh: She taught herself English.',
    ],
  },
] as const;

const COMMON_FIXES = [
  {
    wrong: 'Me and Rina are classmates.',
    correct: 'Rina and I are classmates.',
  },
  {
    wrong: 'This is her book. The book is her.',
    correct: 'This is her book. The book is hers.',
  },
  {
    wrong: 'He blamed hisself.',
    correct: 'He blamed himself.',
  },
] as const;

const PRONOUN_TABLE = [
  {
    subject: 'I',
    indonesian: 'saya / aku',
    object: 'me',
    possAdj: 'my',
    possPro: 'mine',
    reflexive: 'myself',
  },
  {
    subject: 'you',
    indonesian: 'kamu / Anda / kalian',
    object: 'you',
    possAdj: 'your',
    possPro: 'yours',
    reflexive: 'yourself / yourselves',
  },
  {
    subject: 'he',
    indonesian: 'dia (laki-laki)',
    object: 'him',
    possAdj: 'his',
    possPro: 'his',
    reflexive: 'himself',
  },
  {
    subject: 'she',
    indonesian: 'dia (perempuan)',
    object: 'her',
    possAdj: 'her',
    possPro: 'hers',
    reflexive: 'herself',
  },
  {
    subject: 'it',
    indonesian: 'itu (benda/hewan)',
    object: 'it',
    possAdj: 'its',
    possPro: '-',
    reflexive: 'itself',
  },
  {
    subject: 'we',
    indonesian: 'kami / kita',
    object: 'us',
    possAdj: 'our',
    possPro: 'ours',
    reflexive: 'ourselves',
  },
  {
    subject: 'they',
    indonesian: 'mereka',
    object: 'them',
    possAdj: 'their',
    possPro: 'theirs',
    reflexive: 'themselves',
  },
] as const;

export default function PronounsPage() {
  return (
    <main className="pro-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pro-shell gr-topic-shell">
        <header className="pro-header">
          <h1 className="pro-title">Pronouns (Subject, Object, Possessive, Reflexive)</h1>
          <p className="pro-subtitle">
            Pronoun dipakai untuk menggantikan noun agar kalimat lebih ringkas, natural, dan tidak
            repetitif.
          </p>
        </header>

        <section className="pro-block">
          <h2 className="pro-block-title">Konsep</h2>
          <p className="pro-text">
            Pronoun membantu menghindari pengulangan noun yang sama. Kunci utamanya adalah memilih
            bentuk pronoun sesuai fungsi di kalimat: sebagai subject, object, kepemilikan, atau
            reflexive.
          </p>
        </section>

        <section className="pro-block">
          <h2 className="pro-block-title">Jenis Pronoun</h2>
          <div className="pro-grid">
            {PRONOUN_SETS.map((item) => (
              <details key={item.title} className="pro-card pro-card-accordion">
                <summary className="pro-card-summary">
                  <h3 className="pro-card-title">{item.title}</h3>
                  <span className="pro-card-caret" aria-hidden="true" />
                </summary>

                <div className="pro-card-body">
                  <p className="pro-card-desc">{item.use}</p>
                  <p className="pro-card-examples">
                    Bentuk:
                    <span className="pro-chip-list">
                      {item.pairs[0].split(', ').map((word) => (
                        <span key={`${item.title}-${word}`} className="pro-chip">
                          {word}
                        </span>
                      ))}
                    </span>
                  </p>
                  <p className="pro-card-examples">{item.pairs[1]}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pro-block">
          <h2 className="pro-block-title">Person (First, Second, Third)</h2>
          <ul className="pro-notes">
            <li>
              - <strong>First person</strong>: pembicara sendiri atau kelompok pembicara (
              <span className="pro-inline">I, we</span>).
            </li>
            <li>
              - <strong>Second person</strong>: lawan bicara (
              <span className="pro-inline">you</span>).
            </li>
            <li>
              - <strong>Third person</strong>: orang/benda yang dibicarakan (
              <span className="pro-inline">he, she, it, they</span>).
            </li>
            <li>- Ini penting untuk agreement, terutama di present simple (he/she/it + s/es).</li>
          </ul>
          <div className="pro-table-wrap geuwat-table-scroll">
            <table className="pro-table pro-person-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Singular</th>
                  <th>Plural</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>First person</td>
                  <td>I</td>
                  <td>we</td>
                </tr>
                <tr>
                  <td>Second person</td>
                  <td>you</td>
                  <td>you</td>
                </tr>
                <tr>
                  <td>Third person</td>
                  <td>he / she / it</td>
                  <td>they</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="pro-block">
          <h2 className="pro-block-title">Tabel Pronoun</h2>
          <div className="pro-table-wrap geuwat-table-scroll">
            <table className="pro-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Indonesian Meaning</th>
                  <th>Subject</th>
                  <th>Object</th>
                  <th>Possessive Adjective</th>
                  <th>Possessive Pronoun</th>
                  <th>Reflexive</th>
                </tr>
              </thead>
              <tbody>
                {PRONOUN_TABLE.map((row) => (
                  <tr key={row.subject}>
                    <td>{row.indonesian}</td>
                    <td>{row.subject}</td>
                    <td>{row.object}</td>
                    <td>{row.possAdj}</td>
                    <td>{row.possPro}</td>
                    <td>{row.reflexive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pro-block">
          <h2 className="pro-block-title">Kesalahan Umum</h2>
          <div className="pro-fix-list">
            {COMMON_FIXES.map((item) => (
              <article key={item.wrong} className="pro-fix-card">
                <p className="pro-fix-wrong">Salah: {item.wrong}</p>
                <p className="pro-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pro-block">
          <h2 className="pro-block-title">Catatan Penting:</h2>
          <ul className="pro-notes">
            <li>- Subject pronoun untuk pelaku; object pronoun untuk penerima aksi.</li>
            <li>- Pada penggunaan modern, tidak ada possessive pronoun bentuk &quot;its&quot;.</li>
            <li>- Bedakan possessive adjective (my book) dan possessive pronoun (the book is mine).</li>
            <li>- Reflexive dipakai saat subject = object (I taught myself).</li>
            <li>
              - Singular berarti satu (I, he, she, it); plural berarti lebih dari satu (we, they).
            </li>
            <li>- Pronoun &quot;you&quot; bisa singular atau plural, tergantung konteks kalimat.</li>
            <li>- Pilih pronoun sesuai fungsi, bukan sekadar terjemahan kata per kata.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}



