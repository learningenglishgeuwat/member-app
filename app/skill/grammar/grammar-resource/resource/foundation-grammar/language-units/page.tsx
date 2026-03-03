import BackButton from '../../../../../components/BackButton';
import './language-units.css';
import '../../topic-layout.css';

const LANGUAGE_UNITS = [
  {
    title: 'Letter (Huruf)',
    description: 'Unit paling kecil, tanpa makna sendiri.',
    exampleMode: 'chips',
    examples: ['a', 'b', 'c'],
  },
  {
    title: 'Word (Kata)',
    description: 'Gabungan huruf yang punya makna.',
    exampleMode: 'chips',
    examples: ['book', 'run', 'happy'],
  },
  {
    title: 'Phrase (Frasa)',
    description:
      'Gabungan kata, tidak punya subject + verb lengkap, sehingga tidak bisa berdiri sendiri sebagai kalimat.',
    exampleMode: 'chips',
    examples: ['in the morning', 'a good student', 'running fast'],
  },
  {
    title: 'Clause (Klausa)',
    description: 'Gabungan kata yang umumnya punya subject + verb.',
    exampleMode: 'chips',
    examples: ['She studies', 'because she was late', 'they play football'],
  },
  {
    title: 'Sentence (Kalimat)',
    description: 'Unit paling besar, menyampaikan ide utuh.',
    exampleMode: 'lines',
    examples: [
      '1) Independent clause: She studies every night.',
      '2) Independent + dependent clause: She studies every night because she was late.',
    ],
  },
] as const;

export default function LanguageUnitsPage() {
  return (
    <main className="lu-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="lu-shell gr-topic-shell">
        <header className="lu-header">
          <h1 className="lu-title">Language Units</h1>
          <p className="lu-subtitle">
            Urutan satuan bahasa dari yang paling kecil ke paling besar untuk membangun pemahaman
            grammar yang rapi.
          </p>
        </header>

        <section className="lu-block">
          <h2 className="lu-block-title">Konsep</h2>
          <p className="lu-text">
            Language units adalah susunan tingkat bahasa dari bentuk paling kecil sampai ide utuh.
            Dengan memahami urutan ini, siswa lebih mudah membedakan potongan kata, klausa, dan
            kalimat lengkap.
          </p>
        </section>

        <section className="lu-block">
          <h2 className="lu-block-title">Unit Bahasa (Dari kecil ke besar)</h2>
          <div className="lu-grid">
            {LANGUAGE_UNITS.map((item) => (
              <details key={item.title} className="lu-card lu-card-accordion">
                <summary className="lu-card-summary">
                  <h3 className="lu-card-title">{item.title}</h3>
                  <span className="lu-card-caret" aria-hidden="true" />
                </summary>

                <div className="lu-card-body">
                  <p className="lu-card-desc">{item.description}</p>
	                  <p className="lu-card-examples">
	                    Contoh:
	                    {item.exampleMode === 'chips' ? (
	                      <span className="lu-example-chip-list">
	                        {item.examples.map((example) => (
	                          <span key={`${item.title}-${example}`} className="lu-example-chip">
	                            {example}
	                          </span>
	                        ))}
	                      </span>
	                    ) : (
	                      <span className="lu-example-line-list">
	                        {item.examples.map((example) => (
	                          <span key={`${item.title}-${example}`} className="lu-example-line">
	                            {example}
	                          </span>
	                        ))}
	                      </span>
	                    )}
	                  </p>
	                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="lu-block">
          <details className="lu-card lu-card-accordion">
            <summary className="lu-card-summary">
              <h2 className="lu-block-title">Clause (Klausa)</h2>
              <span className="lu-card-caret" aria-hidden="true" />
            </summary>

            <div className="lu-card-body">
              <p className="lu-text">Pada level dasar, klausa umumnya punya subject + verb.</p>
              <p className="lu-text">Bisa berdiri sendiri atau menempel pada klausa lain:</p>
              <ul className="lu-notes">
                <li>
                  - <strong>Independent Clause (klausa bebas)</strong> &rarr; bisa jadi kalimat
                  sendiri.
                </li>
                <li>- Contoh: <span className="lu-inline">She studies.</span></li>
                <li>
                  - <strong>Dependent Clause (klausa terikat)</strong> &rarr; tidak bisa berdiri
                  sendiri; harus menempel ke independent clause.
                </li>
                <li>- Contoh: <span className="lu-inline">because he was late</span></li>
              </ul>
            </div>
          </details>
        </section>

        <section className="lu-block">
          <details className="lu-card lu-card-accordion">
            <summary className="lu-card-summary">
              <h2 className="lu-block-title">Perbedaan Klausa vs Kalimat</h2>
              <span className="lu-card-caret" aria-hidden="true" />
            </summary>

            <div className="lu-card-body">
              <div className="lu-table-wrap geuwat-table-scroll">
                <table className="lu-table geuwat-table-responsive">
                  <thead>
                    <tr>
                      <th>Aspek</th>
                      <th>Klausa</th>
                      <th>Kalimat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Subject + Verb</td>
                      <td>Harus ada</td>
                      <td>Harus ada</td>
                    </tr>
                    <tr>
                      <td>Ide utuh</td>
                      <td>Tidak selalu</td>
                      <td>Harus menyampaikan ide lengkap</td>
                    </tr>
                    <tr>
                      <td>Bisa berdiri sendiri</td>
                      <td>Hanya klausa independen</td>
                      <td>Selalu bisa berdiri sendiri</td>
                    </tr>
                    <tr>
                      <td>Contoh</td>
                      <td>She studies (independent), because she was late (dependent)</td>
                      <td>She studies every night, She studies every night because she was late</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </section>

        <section className="lu-block">
          <h2 className="lu-block-title">Kesalahan Umum</h2>
          <ul className="lu-notes">
            <li>- Menganggap phrase sudah kalimat, padahal belum tentu ada subject + verb.</li>
            <li>- Menyamakan dependent clause dengan kalimat utuh.</li>
            <li>- Menulis potongan ide tanpa predikat lalu mengira itu sudah sentence.</li>
            <li>- Tidak mengecek apakah pesan sudah lengkap (siapa melakukan apa).</li>
          </ul>
        </section>

        <section className="lu-block">
          <h2 className="lu-block-title">Catatan Penting:</h2>
          <ul className="lu-notes">
            <li>- Semua kalimat mengandung klausa, tapi tidak semua klausa bisa jadi kalimat.</li>
            <li>
              - Frasa &rarr; klausa &rarr; kalimat adalah piramida kompleksitas sebelum belajar tense atau
              struktur kompleks.
            </li>
            <li>- Klausa dependen sering diawali kata seperti because, when, if, although.</li>
            <li>- Jika hanya membaca potongan yang masih menggantung, kemungkinan itu bukan kalimat utuh.</li>
            <li>- Mulai analisis dari S + V dulu, baru tentukan itu frasa, klausa, atau kalimat.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}




