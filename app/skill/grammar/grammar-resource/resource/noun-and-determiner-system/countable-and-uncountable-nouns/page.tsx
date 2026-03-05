import BackButton from '../../../../../components/BackButton';
import './countable-and-uncountable-nouns.css';
import '../../topic-layout.css';

const COUNTABLE_RULES = [
  {
    title: 'Countable Nouns',
    desc: 'Bisa dihitung satu per satu (one, two, three...).',
    points: [
      'punya bentuk singular dan plural',
      'bisa dipakai dengan a/an (singular)',
      'bisa dipakai dengan many/few/several (plural)',
    ],
    examples: [
      { text: 'a book', focus: 'a' },
      { text: 'two books', focus: 'two' },
      { text: 'many students', focus: 'many' },
      { text: 'a few chairs', focus: 'a few' },
    ],
  },
  {
    title: 'Uncountable Nouns',
    desc: 'Tidak dihitung satu per satu secara langsung.',
    points: [
      'biasanya tidak punya bentuk plural biasa',
      'tidak dipakai dengan a/an',
      'umum dengan much/little/some',
    ],
    examples: [
      { text: 'water', focus: 'water' },
      { text: 'information', focus: 'information' },
      { text: 'advice', focus: 'advice' },
      { text: 'furniture', focus: 'furniture' },
    ],
  },
] as const;

const UNIT_EXAMPLES = [
  { noun: 'water', unit: 'a glass of water' },
  { noun: 'advice', unit: 'a piece of advice' },
  { noun: 'information', unit: 'a piece of information' },
  { noun: 'furniture', unit: 'a piece of furniture' },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I need many information.', correct: 'I need a lot of information.' },
  { wrong: 'She gave me an advice.', correct: 'She gave me a piece of advice.' },
  { wrong: 'These furnitures are expensive.', correct: 'This furniture is expensive.' },
] as const;

const REGULAR_PLURAL_PATTERNS = [
  {
    rule: 'Most nouns: + -s',
    examples: ['book -> books', 'student -> students', 'car -> cars'],
  },
  {
    rule: 'Nouns ending in -s, -x, -z, -ch, -sh: + -es',
    examples: ['class -> classes', 'box -> boxes', 'watch -> watches'],
  },
  {
    rule: 'Consonant + y: y -> ies',
    examples: ['city -> cities', 'baby -> babies', 'story -> stories'],
  },
  {
    rule: 'Vowel + y: + -s',
    examples: ['boy -> boys', 'day -> days', 'toy -> toys'],
  },
  {
    rule: 'Some nouns ending in -f / -fe: -> ves',
    examples: ['leaf -> leaves', 'wife -> wives', 'knife -> knives'],
  },
] as const;

const IRREGULAR_PLURAL_EXAMPLES = [
  { singular: 'man', plural: 'men', meaning: 'pria / laki-laki' },
  { singular: 'woman', plural: 'women', meaning: 'wanita / perempuan' },
  { singular: 'child', plural: 'children', meaning: 'anak' },
  { singular: 'person', plural: 'people', meaning: 'orang' },
  { singular: 'tooth', plural: 'teeth', meaning: 'gigi' },
  { singular: 'foot', plural: 'feet', meaning: 'kaki (bagian telapak)' },
  { singular: 'goose', plural: 'geese', meaning: 'angsa' },
  { singular: 'mouse', plural: 'mice', meaning: 'tikus' },
  { singular: 'louse', plural: 'lice', meaning: 'kutu' },
  { singular: 'ox', plural: 'oxen', meaning: 'lembu jantan' },
  { singular: 'sheep', plural: 'sheep', meaning: 'domba' },
  { singular: 'deer', plural: 'deer', meaning: 'rusa' },
  { singular: 'fish', plural: 'fish', meaning: 'ikan' },
  { singular: 'species', plural: 'species', meaning: 'spesies' },
  { singular: 'series', plural: 'series', meaning: 'seri' },
  { singular: 'aircraft', plural: 'aircraft', meaning: 'pesawat' },
  { singular: 'analysis', plural: 'analyses', meaning: 'analisis' },
  { singular: 'diagnosis', plural: 'diagnoses', meaning: 'diagnosis' },
  { singular: 'oasis', plural: 'oases', meaning: 'oasis' },
  { singular: 'thesis', plural: 'theses', meaning: 'tesis' },
  { singular: 'crisis', plural: 'crises', meaning: 'krisis' },
  { singular: 'basis', plural: 'bases', meaning: 'dasar / basis' },
  { singular: 'axis', plural: 'axes', meaning: 'sumbu' },
  { singular: 'phenomenon', plural: 'phenomena', meaning: 'fenomena' },
  { singular: 'criterion', plural: 'criteria', meaning: 'kriteria' },
  { singular: 'datum', plural: 'data', meaning: 'data (satuan)' },
  { singular: 'bacterium', plural: 'bacteria', meaning: 'bakteri (satuan)' },
  { singular: 'medium', plural: 'media', meaning: 'media / perantara' },
  { singular: 'curriculum', plural: 'curricula', meaning: 'kurikulum' },
  { singular: 'memorandum', plural: 'memoranda', meaning: 'memo / nota resmi' },
  { singular: 'stratum', plural: 'strata', meaning: 'lapisan' },
  { singular: 'alumnus', plural: 'alumni', meaning: 'alumnus / lulusan' },
  { singular: 'focus', plural: 'foci / focuses', meaning: 'fokus' },
  { singular: 'fungus', plural: 'fungi', meaning: 'jamur' },
  { singular: 'nucleus', plural: 'nuclei', meaning: 'inti' },
  { singular: 'syllabus', plural: 'syllabi / syllabuses', meaning: 'silabus' },
  { singular: 'cactus', plural: 'cacti / cactuses', meaning: 'kaktus' },
  { singular: 'radius', plural: 'radii / radiuses', meaning: 'jari-jari' },
  { singular: 'stimulus', plural: 'stimuli', meaning: 'stimulus' },
  { singular: 'appendix', plural: 'appendices / appendixes', meaning: 'lampiran' },
  { singular: 'index', plural: 'indices / indexes', meaning: 'indeks' },
  { singular: 'matrix', plural: 'matrices', meaning: 'matriks' },
  { singular: 'vertex', plural: 'vertices', meaning: 'titik sudut / puncak' },
  { singular: 'formula', plural: 'formulae / formulas', meaning: 'rumus' },
  { singular: 'bureau', plural: 'bureaux / bureaus', meaning: 'biro / kantor' },
  { singular: 'elf', plural: 'elves', meaning: 'peri kecil' },
  { singular: 'calf', plural: 'calves', meaning: 'anak sapi' },
  { singular: 'loaf', plural: 'loaves', meaning: 'roti (satu loaf)' },
  { singular: 'half', plural: 'halves', meaning: 'setengah bagian' },
  { singular: 'knife', plural: 'knives', meaning: 'pisau' },
  { singular: 'wife', plural: 'wives', meaning: 'istri' },
  { singular: 'life', plural: 'lives', meaning: 'kehidupan' },
  { singular: 'leaf', plural: 'leaves', meaning: 'daun' },
  { singular: 'wolf', plural: 'wolves', meaning: 'serigala' },
  { singular: 'shelf', plural: 'shelves', meaning: 'rak' },
  { singular: 'scarf', plural: 'scarves / scarfs', meaning: 'syal' },
] as const;

function highlightWord(text: string, focus: string) {
  const lowerText = text.toLowerCase();
  const lowerFocus = focus.toLowerCase();
  const idx = lowerText.indexOf(lowerFocus);
  if (idx === -1) return text;

  const start = text.slice(0, idx);
  const mid = text.slice(idx, idx + focus.length);
  const end = text.slice(idx + focus.length);

  return (
    <>
      {start}
      <span className="cu-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function CountableUncountablePage() {
  return (
    <main className="cu-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="cu-shell gr-topic-shell">
        <header className="cu-header">
          <h1 className="cu-title">Countable and Uncountable Nouns</h1>
          <p className="cu-subtitle">
            Memahami perbedaan noun yang bisa dihitung dan tidak bisa dihitung untuk pemilihan bentuk
            noun serta quantifier yang tepat.
          </p>
        </header>

        <section className="cu-block">
          <h2 className="cu-block-title">Konsep</h2>
          <p className="cu-text">
            Noun dalam bahasa Inggris dibagi menjadi dua kelompok utama: <strong>countable</strong>{' '}
            dan <strong>uncountable</strong>. Perbedaan ini memengaruhi article, plural, dan quantifier.
          </p>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Core Rules</h2>
          <div className="cu-grid cu-grid-one-col">
            {COUNTABLE_RULES.map((item) => (
              <details key={item.title} className="cu-card cu-card-accordion">
                <summary className="cu-card-summary">
                  <h3 className="cu-card-title">{item.title}</h3>
                  <span className="cu-card-caret" aria-hidden="true" />
                </summary>
                <div className="cu-card-body">
                  <p className="cu-card-desc">{item.desc}</p>
                  <ul className="cu-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul className="cu-list">
                    {item.examples.map((ex) => (
                      <li key={ex.text}>{highlightWord(ex.text, ex.focus)}</li>
                    ))}
                  </ul>

                  {item.title === 'Countable Nouns' ? (
                    <div className="cu-grid cu-grid-one-col">
                      <p className="cu-card-desc">
                        Countable nouns punya bentuk <strong>singular</strong> (satu) dan{' '}
                        <strong>plural</strong> (lebih dari satu). Bentuk plural ada yang mengikuti
                        pola <strong>regular</strong> dan ada yang harus dihafal sebagai{' '}
                        <strong>irregular</strong>.
                      </p>

                      <details className="cu-card cu-card-accordion">
                        <summary className="cu-card-summary">
                          <h3 className="cu-card-title">Regular Plural Patterns</h3>
                          <span className="cu-card-caret" aria-hidden="true" />
                        </summary>
                        <div className="cu-card-body">
                          <div className="cu-table-wrap geuwat-table-scroll">
                            <table className="cu-table geuwat-table-responsive">
                              <thead>
                                <tr>
                                  <th>Rule</th>
                                  <th>Example 1</th>
                                  <th>Example 2</th>
                                  <th>Example 3</th>
                                </tr>
                              </thead>
                              <tbody>
                                {REGULAR_PLURAL_PATTERNS.map((pattern) => (
                                  <tr key={pattern.rule}>
                                    <td>{pattern.rule}</td>
                                    <td>{pattern.examples[0]}</td>
                                    <td>{pattern.examples[1]}</td>
                                    <td>{pattern.examples[2]}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="cu-card-desc">
                            <strong>Catatan:</strong>
                          </p>
                          <p className="cu-card-desc">
                            Pola <code>-f/-fe -&gt; -ves</code> sering dianggap pola khusus
                            (semi-irregular), jadi pelajari juga daftar pengecualiannya.
                          </p>
                          <ul className="cu-list">
                            <li>- Contoh pola khusus: wife -&gt; wives, knife -&gt; knives.</li>
                            <li>- Contoh pengecualian: roof -&gt; roofs, chef -&gt; chefs.</li>
                          </ul>
                        </div>
                      </details>

                      <details className="cu-card cu-card-accordion">
                        <summary className="cu-card-summary">
                          <h3 className="cu-card-title">Irregular Noun Vocabulary (Extended)</h3>
                          <span className="cu-card-caret" aria-hidden="true" />
                        </summary>
                        <div className="cu-card-body">
                          <div className="cu-table-wrap geuwat-table-scroll">
                            <table className="cu-table geuwat-table-responsive">
                              <thead>
                                <tr>
                                  <th>Singular</th>
                                  <th>Plural</th>
                                  <th>Indonesian Meaning</th>
                                </tr>
                              </thead>
                              <tbody>
                                {IRREGULAR_PLURAL_EXAMPLES.map((item) => (
                                  <tr key={item.singular}>
                                    <td>{highlightWord(item.singular, item.singular)}</td>
                                    <td>{highlightWord(item.plural, item.plural)}</td>
                                    <td>{item.meaning}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Unit Expressions for Uncountable Nouns</h2>
          <div className="cu-table-wrap geuwat-table-scroll">
            <table className="cu-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Uncountable Noun</th>
                  <th>Unit Expression</th>
                </tr>
              </thead>
              <tbody>
                {UNIT_EXAMPLES.map((row) => (
                  <tr key={row.noun}>
                    <td>{highlightWord(row.noun, row.noun)}</td>
                    <td>{highlightWord(row.unit, row.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Kesalahan Umum</h2>
          <div className="cu-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="cu-fix-card">
                <p className="cu-fix-wrong">Salah: {item.wrong}</p>
                <p className="cu-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Catatan Penting:</h2>
          <ul className="cu-list">
            <li>- Gunakan many/few untuk countable plural.</li>
            <li>- Gunakan much/little untuk uncountable nouns.</li>
            <li>- Untuk uncountable tertentu, pakai unit expression agar bisa dihitung.</li>
            <li>- Beberapa noun bisa countable/uncountable tergantung makna: chicken, paper, time.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
