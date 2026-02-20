'use client';

import { useState } from 'react';
import BackButton from '../../../../../components/BackButton';
import './verbs--main-verbs-and-auxiliaries-be-do-have.css';
import '../../topic-layout.css';

const MAIN_VERB_EXAMPLES = [
  {
    sentence: 'She studies every night.',
    focus: 'studies',
  },
  {
    sentence: 'They play football on Sunday.',
    focus: 'play',
  },
  {
    sentence: 'I write notes after class.',
    focus: 'write',
  },
] as const;

const AUXILIARY_BE = [
  { sentence: 'I am ready.', focus: ['am'] },
  { sentence: 'She is in the classroom.', focus: ['is'] },
  { sentence: 'They are happy.', focus: ['are'] },
] as const;

const AUXILIARY_DO = [
  { sentence: 'I do not understand.', focus: ['do'] },
  { sentence: 'Does he work here?', focus: ['Does'] },
  { sentence: 'They did not call me yesterday.', focus: ['did'] },
] as const;

const AUXILIARY_HAVE = [
  { sentence: 'I have finished my homework.', focus: ['have'] },
  { sentence: 'She has studied for two hours.', focus: ['has'] },
  { sentence: 'They had left before we arrived.', focus: ['had'] },
] as const;

const MAIN_VERB_FORMS = [
  {
    label: 'Base Form (V1)',
    use: 'dipakai untuk present simple (I/you/we/they), modal verbs, dan infinitive.',
    examples: ['work', 'study', 'go'],
  },
  {
    label: 'Past Form (V2)',
    use: 'dipakai untuk past simple.',
    examples: ['worked', 'studied', 'went'],
  },
  {
    label: 'Past Participle (V3)',
    use: 'dipakai untuk perfect tenses dan passive voice.',
    examples: ['worked', 'studied', 'gone'],
  },
  {
    label: 'Present Simple 3rd Person (Vs/es)',
    use: 'dipakai untuk he/she/it pada present simple.',
    examples: ['works', 'studies', 'goes'],
  },
  {
    label: 'Ing Form (V-ing)',
    use: 'dipakai untuk continuous tenses (progressive forms).',
    examples: ['working', 'studying', 'going'],
  },
] as const;

const REGULAR_IRREGULAR = [
  { v1: 'work', v2: 'worked', v3: 'worked', vses: 'works', ving: 'working' },
  { v1: 'study', v2: 'studied', v3: 'studied', vses: 'studies', ving: 'studying' },
  { v1: 'go', v2: 'went', v3: 'gone', vses: 'goes', ving: 'going' },
  { v1: 'see', v2: 'saw', v3: 'seen', vses: 'sees', ving: 'seeing' },
] as const;

const REGULAR_VERB_EXAMPLES = [
  { v1: 'work', v2: 'worked', v3: 'worked' },
  { v1: 'study', v2: 'studied', v3: 'studied' },
  { v1: 'clean', v2: 'cleaned', v3: 'cleaned' },
] as const;

const IRREGULAR_VERB_EXAMPLES = [
  { v1: 'go', v2: 'went', v3: 'gone' },
  { v1: 'see', v2: 'saw', v3: 'seen' },
  { v1: 'write', v2: 'wrote', v3: 'written' },
] as const;

const IRREGULAR_VOCAB_FULL = [
  { v1: 'be', v2: 'was/were', v3: 'been', meaning: 'menjadi/berada' },
  { v1: 'become', v2: 'became', v3: 'become', meaning: 'menjadi' },
  { v1: 'begin', v2: 'began', v3: 'begun', meaning: 'memulai' },
  { v1: 'bend', v2: 'bent', v3: 'bent', meaning: 'membengkokkan' },
  { v1: 'bet', v2: 'bet', v3: 'bet', meaning: 'bertaruh' },
  { v1: 'bite', v2: 'bit', v3: 'bitten', meaning: 'menggigit' },
  { v1: 'blow', v2: 'blew', v3: 'blown', meaning: 'meniup' },
  { v1: 'break', v2: 'broke', v3: 'broken', meaning: 'memecahkan/rusak' },
  { v1: 'bring', v2: 'brought', v3: 'brought', meaning: 'membawa' },
  { v1: 'build', v2: 'built', v3: 'built', meaning: 'membangun' },
  { v1: 'burn', v2: 'burnt/burned', v3: 'burnt/burned', meaning: 'membakar' },
  { v1: 'buy', v2: 'bought', v3: 'bought', meaning: 'membeli' },
  { v1: 'catch', v2: 'caught', v3: 'caught', meaning: 'menangkap' },
  { v1: 'choose', v2: 'chose', v3: 'chosen', meaning: 'memilih' },
  { v1: 'come', v2: 'came', v3: 'come', meaning: 'datang' },
  { v1: 'cost', v2: 'cost', v3: 'cost', meaning: 'berharga' },
  { v1: 'cut', v2: 'cut', v3: 'cut', meaning: 'memotong' },
  { v1: 'deal', v2: 'dealt', v3: 'dealt', meaning: 'berurusan' },
  { v1: 'dig', v2: 'dug', v3: 'dug', meaning: 'menggali' },
  { v1: 'do', v2: 'did', v3: 'done', meaning: 'melakukan' },
  { v1: 'draw', v2: 'drew', v3: 'drawn', meaning: 'menggambar' },
  { v1: 'drink', v2: 'drank', v3: 'drunk', meaning: 'minum' },
  { v1: 'drive', v2: 'drove', v3: 'driven', meaning: 'mengemudi' },
  { v1: 'eat', v2: 'ate', v3: 'eaten', meaning: 'makan' },
  { v1: 'fall', v2: 'fell', v3: 'fallen', meaning: 'jatuh' },
  { v1: 'feed', v2: 'fed', v3: 'fed', meaning: 'memberi makan' },
  { v1: 'feel', v2: 'felt', v3: 'felt', meaning: 'merasakan' },
  { v1: 'fight', v2: 'fought', v3: 'fought', meaning: 'bertarung' },
  { v1: 'find', v2: 'found', v3: 'found', meaning: 'menemukan' },
  { v1: 'fly', v2: 'flew', v3: 'flown', meaning: 'terbang' },
  { v1: 'forget', v2: 'forgot', v3: 'forgotten', meaning: 'lupa' },
  { v1: 'forgive', v2: 'forgave', v3: 'forgiven', meaning: 'memaafkan' },
  { v1: 'freeze', v2: 'froze', v3: 'frozen', meaning: 'membeku' },
  { v1: 'get', v2: 'got', v3: 'got/gotten', meaning: 'mendapatkan' },
  { v1: 'give', v2: 'gave', v3: 'given', meaning: 'memberi' },
  { v1: 'go', v2: 'went', v3: 'gone', meaning: 'pergi' },
  { v1: 'grow', v2: 'grew', v3: 'grown', meaning: 'tumbuh' },
  { v1: 'hang', v2: 'hung', v3: 'hung', meaning: 'menggantungkan' },
  { v1: 'have', v2: 'had', v3: 'had', meaning: 'memiliki' },
  { v1: 'hear', v2: 'heard', v3: 'heard', meaning: 'mendengar' },
  { v1: 'hide', v2: 'hid', v3: 'hidden', meaning: 'bersembunyi/menyembunyikan' },
  { v1: 'hit', v2: 'hit', v3: 'hit', meaning: 'memukul' },
  { v1: 'hold', v2: 'held', v3: 'held', meaning: 'memegang' },
  { v1: 'keep', v2: 'kept', v3: 'kept', meaning: 'menjaga/menyimpan' },
  { v1: 'know', v2: 'knew', v3: 'known', meaning: 'mengetahui' },
  { v1: 'lead', v2: 'led', v3: 'led', meaning: 'memimpin' },
  { v1: 'leave', v2: 'left', v3: 'left', meaning: 'meninggalkan' },
  { v1: 'lend', v2: 'lent', v3: 'lent', meaning: 'meminjamkan' },
  { v1: 'let', v2: 'let', v3: 'let', meaning: 'membiarkan' },
  { v1: 'lie (recline)', v2: 'lay', v3: 'lain', meaning: 'berbaring' },
  { v1: 'lie (not tell truth)', v2: 'lied', v3: 'lied', meaning: 'berbohong' },
  { v1: 'lose', v2: 'lost', v3: 'lost', meaning: 'kehilangan' },
  { v1: 'make', v2: 'made', v3: 'made', meaning: 'membuat' },
  { v1: 'mean', v2: 'meant', v3: 'meant', meaning: 'berarti' },
  { v1: 'meet', v2: 'met', v3: 'met', meaning: 'bertemu' },
  { v1: 'pay', v2: 'paid', v3: 'paid', meaning: 'membayar' },
  { v1: 'put', v2: 'put', v3: 'put', meaning: 'meletakkan' },
  { v1: 'read', v2: 'read', v3: 'read', meaning: 'membaca' },
  { v1: 'ride', v2: 'rode', v3: 'ridden', meaning: 'mengendarai' },
  { v1: 'ring', v2: 'rang', v3: 'rung', meaning: 'berdering' },
  { v1: 'rise', v2: 'rose', v3: 'risen', meaning: 'naik' },
  { v1: 'run', v2: 'ran', v3: 'run', meaning: 'berlari' },
  { v1: 'say', v2: 'said', v3: 'said', meaning: 'mengatakan' },
  { v1: 'see', v2: 'saw', v3: 'seen', meaning: 'melihat' },
  { v1: 'sell', v2: 'sold', v3: 'sold', meaning: 'menjual' },
  { v1: 'send', v2: 'sent', v3: 'sent', meaning: 'mengirim' },
  { v1: 'set', v2: 'set', v3: 'set', meaning: 'mengatur/menaruh' },
  { v1: 'shake', v2: 'shook', v3: 'shaken', meaning: 'mengguncang' },
  { v1: 'shine', v2: 'shone', v3: 'shone', meaning: 'bersinar' },
  { v1: 'shoot', v2: 'shot', v3: 'shot', meaning: 'menembak' },
  { v1: 'show', v2: 'showed', v3: 'shown', meaning: 'menunjukkan' },
  { v1: 'shut', v2: 'shut', v3: 'shut', meaning: 'menutup' },
  { v1: 'sing', v2: 'sang', v3: 'sung', meaning: 'bernyanyi' },
  { v1: 'sit', v2: 'sat', v3: 'sat', meaning: 'duduk' },
  { v1: 'sleep', v2: 'slept', v3: 'slept', meaning: 'tidur' },
  { v1: 'speak', v2: 'spoke', v3: 'spoken', meaning: 'berbicara' },
  { v1: 'spend', v2: 'spent', v3: 'spent', meaning: 'menghabiskan' },
  { v1: 'stand', v2: 'stood', v3: 'stood', meaning: 'berdiri' },
  { v1: 'steal', v2: 'stole', v3: 'stolen', meaning: 'mencuri' },
  { v1: 'swim', v2: 'swam', v3: 'swum', meaning: 'berenang' },
  { v1: 'take', v2: 'took', v3: 'taken', meaning: 'mengambil' },
  { v1: 'teach', v2: 'taught', v3: 'taught', meaning: 'mengajar' },
  { v1: 'tell', v2: 'told', v3: 'told', meaning: 'memberitahu' },
  { v1: 'think', v2: 'thought', v3: 'thought', meaning: 'berpikir' },
  { v1: 'throw', v2: 'threw', v3: 'thrown', meaning: 'melempar' },
  { v1: 'understand', v2: 'understood', v3: 'understood', meaning: 'memahami' },
  { v1: 'wake', v2: 'woke', v3: 'woken', meaning: 'bangun' },
  { v1: 'wear', v2: 'wore', v3: 'worn', meaning: 'memakai' },
  { v1: 'win', v2: 'won', v3: 'won', meaning: 'menang' },
  { v1: 'write', v2: 'wrote', v3: 'written', meaning: 'menulis' },
] as const;

const TRANSITIVE_EXAMPLES = [
  { sentence: 'She reads a book every night.', focus: 'reads' },
  { sentence: 'They built a new bridge.', focus: 'built' },
  { sentence: 'I need your help now.', focus: 'need' },
] as const;

const INTRANSITIVE_EXAMPLES = [
  { sentence: 'The baby cried loudly.', focus: 'cried' },
  { sentence: 'He arrived late.', focus: 'arrived' },
  { sentence: 'We slept well.', focus: 'slept' },
] as const;

const LINKING_VERB_EXAMPLES = [
  { sentence: 'She is happy.', focus: 'is' },
  { sentence: 'He seems tired.', focus: 'seems' },
  { sentence: 'The soup tastes good.', focus: 'tastes' },
] as const;

const MONOTRANSITIVE_EXAMPLES = [
  { sentence: 'She reads a book.', focus: 'reads' },
  { sentence: 'They built a bridge.', focus: 'built' },
] as const;

const DITRANSITIVE_EXAMPLES = [
  { sentence: 'She gave me a book.', focus: 'gave' },
  { sentence: 'I sent him a message.', focus: 'sent' },
] as const;

const DITRANSITIVE_TO_FOR_EXAMPLES = [
  { sentence: 'She gave a book to me.', focus: 'gave' },
  { sentence: 'I sent a message to him.', focus: 'sent' },
  { sentence: 'He bought a gift for his mother.', focus: 'bought' },
] as const;

const DITRANSITIVE_VOCAB = [
  { verb: 'give', pattern: 'give someone something / give something to someone', meaning: 'memberi' },
  { verb: 'send', pattern: 'send someone something / send something to someone', meaning: 'mengirim' },
  { verb: 'tell', pattern: 'tell someone something', meaning: 'memberitahu' },
  { verb: 'show', pattern: 'show someone something / show something to someone', meaning: 'menunjukkan' },
  { verb: 'offer', pattern: 'offer someone something / offer something to someone', meaning: 'menawarkan' },
  { verb: 'buy', pattern: 'buy someone something / buy something for someone', meaning: 'membelikan' },
  { verb: 'make', pattern: 'make someone something / make something for someone', meaning: 'membuatkan' },
  { verb: 'bring', pattern: 'bring someone something / bring something to someone', meaning: 'membawakan' },
  { verb: 'teach', pattern: 'teach someone something', meaning: 'mengajarkan' },
  { verb: 'lend', pattern: 'lend someone something / lend something to someone', meaning: 'meminjamkan' },
] as const;

function renderHighlightedVerb(sentence: string, focus: string): Array<string | JSX.Element> {
  const parts = sentence.split(focus);
  if (parts.length === 1) return [sentence];

  const out: Array<string | JSX.Element> = [];
  parts.forEach((part, idx) => {
    if (part) out.push(part);
    if (idx < parts.length - 1) {
      out.push(
        <mark key={`${focus}-${idx}`} className="vb-inline-highlight">
          {focus}
        </mark>,
      );
    }
  });
  return out;
}

function renderHighlightedWords(
  sentence: string,
  focuses: readonly string[],
  keyPrefix: string,
): Array<string | JSX.Element> {
  const targets = [...focuses].sort((a, b) => b.length - a.length);
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
            <mark key={`${keyPrefix}-${target}-${nodeIdx}-${partIdx}`} className="vb-inline-highlight">
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

export default function VerbsBasicsPage() {
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isDitransitiveModalOpen, setIsDitransitiveModalOpen] = useState(false);

  return (
    <main className="vb-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="vb-shell gr-topic-shell">
        <header className="vb-header">
          <h1 className="vb-title">Verbs (Main Verbs and Auxiliaries)</h1>
          <p className="vb-subtitle">
            Fondasi penggunaan verb untuk membentuk kalimat positif, negatif, dan pertanyaan dengan
            struktur yang tepat.
          </p>
        </header>

        <section className="vb-block">
          <h2 className="vb-block-title">Konsep</h2>
          <p className="vb-text">
            Verb adalah inti kalimat. Dalam level dasar, kita membedakan <strong>main verbs</strong>{' '}
            (aksi/kejadian utama) dan <strong>auxiliary verbs</strong> (<span>be, do, have</span>)
            yang membantu membentuk struktur grammar.
          </p>
        </section>

        <section className="vb-block">
          <h2 className="vb-block-title">Verb Types</h2>
          <div className="vb-grid vb-grid-one-col">
            <details className="vb-card vb-card-accordion">
              <summary className="vb-card-summary">
                <h3 className="vb-card-title">Main Verbs</h3>
                <span className="vb-card-caret" aria-hidden="true" />
              </summary>
              <div className="vb-card-body">
                <p className="vb-card-desc">
                  Main verb menyatakan aksi atau keadaan utama dalam kalimat.
                </p>
                <ul className="vb-list">
                  {MAIN_VERB_EXAMPLES.map((item) => (
                    <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                  ))}
                </ul>
                <details className="vb-card vb-card-accordion">
                  <summary className="vb-card-summary">
                    <h3 className="vb-card-title">Main Verb Forms</h3>
                    <span className="vb-card-caret" aria-hidden="true" />
                  </summary>
                  <div className="vb-card-body">
                    <div className="vb-grid">
                      {MAIN_VERB_FORMS.map((item) => (
                        <article key={item.label} className="vb-card">
                          <div className="vb-card-body">
                            <h3 className="vb-card-title">{item.label}</h3>
                            <p className="vb-card-desc">Fungsi: {item.use}</p>
                            <p className="vb-card-desc">
                              Contoh:
                              <span className="vb-chip-list">
                                {item.examples.map((example) => (
                                  <span key={`${item.label}-${example}`} className="vb-chip">
                                    {example}
                                  </span>
                                ))}
                              </span>
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="vb-table-wrap">
                      <table className="vb-table">
                        <thead>
                          <tr>
                            <th>V1</th>
                            <th>V2</th>
                            <th>V3</th>
                            <th>Vs/es</th>
                            <th>V-ing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {REGULAR_IRREGULAR.map((row) => (
                            <tr key={row.v1}>
                              <td>{row.v1}</td>
                              <td>{row.v2}</td>
                              <td>{row.v3}</td>
                              <td>{row.vses}</td>
                              <td>{row.ving}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="vb-text">
                      <strong>Catatan:</strong> untuk <em>he/she/it</em> di present simple, gunakan bentuk
                      <span> Vs/es</span>.
                    </p>
                  </div>
                </details>
                <details className="vb-card vb-card-accordion">
                  <summary className="vb-card-summary">
                    <h3 className="vb-card-title">Regular vs Irregular Verbs</h3>
                    <span className="vb-card-caret" aria-hidden="true" />
                  </summary>
                  <div className="vb-card-body">
                    <div className="vb-grid">
                      <article className="vb-card">
                        <div className="vb-card-body">
                          <h3 className="vb-card-title">Regular Verbs</h3>
                          <p className="vb-card-desc">
                            V2 dan V3 biasanya dibentuk dengan menambah <mark className="vb-inline-highlight">-ed</mark>.
                          </p>
                          <div className="vb-table-wrap">
                            <table className="vb-table">
                              <thead>
                                <tr>
                                  <th>V1</th>
                                  <th>V2</th>
                                  <th>V3</th>
                                </tr>
                              </thead>
                              <tbody>
                                {REGULAR_VERB_EXAMPLES.map((item) => (
                                  <tr key={item.v1}>
                                    <td>{item.v1}</td>
                                    <td>{item.v2}</td>
                                    <td>{item.v3}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </article>

                      <article className="vb-card">
                        <div className="vb-card-body">
                          <h3 className="vb-card-title">Irregular Verbs</h3>
                          <p className="vb-card-desc">
                            Bentuk V2 dan V3 berubah tidak beraturan, jadi perlu diingat per kata.
                          </p>
                          <div className="vb-table-wrap">
                            <table className="vb-table">
                              <thead>
                                <tr>
                                  <th>V1</th>
                                  <th>V2</th>
                                  <th>V3</th>
                                </tr>
                              </thead>
                              <tbody>
                                {IRREGULAR_VERB_EXAMPLES.map((item) => (
                                  <tr key={item.v1}>
                                    <td>{item.v1}</td>
                                    <td>{item.v2}</td>
                                    <td>{item.v3}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="vb-action-row">
                      <button
                        type="button"
                        className="vb-vocab-button"
                        onClick={() => setIsVocabModalOpen(true)}
                      >
                        Lihat Irregular Vocabulary
                      </button>
                    </div>
                    <p className="vb-text">
                      <strong>Catatan:</strong> irregular verbs tidak mengikuti pola tetap, jadi perlu dihafal per kata.
                    </p>
                  </div>
                </details>
                <details className="vb-card vb-card-accordion">
                  <summary className="vb-card-summary">
                    <h3 className="vb-card-title">Transitive vs Intransitive Verbs</h3>
                    <span className="vb-card-caret" aria-hidden="true" />
                  </summary>
                  <div className="vb-card-body">
                    <p className="vb-text">
                      <strong>Transitive verb</strong> membutuhkan object langsung agar makna kalimat lengkap.
                      <strong> Intransitive verb</strong> tidak membutuhkan object langsung.
                    </p>
                    <ul className="vb-list">
                      <li>- Pola transitive: S + V + O</li>
                      <li>- Pola intransitive: S + V (+ keterangan)</li>
                      <li>- Cek cepat: tanya &quot;apa/siapa yang dikenai aksi?&quot; kalau ada jawaban, biasanya transitive.</li>
                    </ul>
                    <div className="vb-table-wrap">
                      <table className="vb-table">
                        <thead>
                          <tr>
                            <th>Jenis Verb</th>
                            <th>Ciri</th>
                            <th>Pola</th>
                            <th>Contoh</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Transitive</td>
                            <td>Wajib ada object</td>
                            <td>S + V + O</td>
                            <td>She reads a book.</td>
                          </tr>
                          <tr>
                            <td>Intransitive</td>
                            <td>Tidak perlu object</td>
                            <td>S + V (+ adverb/time/place)</td>
                            <td>She sleeps well.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="vb-grid vb-grid-one-col">
                      <details className="vb-card vb-card-accordion">
                        <summary className="vb-card-summary">
                          <h3 className="vb-card-title">Transitive Verbs</h3>
                          <span className="vb-card-caret" aria-hidden="true" />
                        </summary>
                        <div className="vb-card-body">
                          <p className="vb-card-desc">
                            Verb yang butuh object agar maknanya lengkap.
                          </p>
                          <ul className="vb-list">
                            {TRANSITIVE_EXAMPLES.map((item) => (
                              <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                            ))}
                          </ul>
                          <details className="vb-card vb-card-accordion">
                            <summary className="vb-card-summary">
                              <h3 className="vb-card-title">Monotransitive vs Ditransitive Verbs</h3>
                              <span className="vb-card-caret" aria-hidden="true" />
                            </summary>
                            <div className="vb-card-body">
                              <p className="vb-text">
                                Keduanya sama-sama <strong>transitive</strong> karena membutuhkan object. Bedanya:
                                <strong> monotransitive</strong> hanya punya satu object, sedangkan <strong>ditransitive</strong>{' '}
                                punya dua object (biasanya <em>indirect object</em> + <em>direct object</em>).
                              </p>
                              <ul className="vb-list">
                                <li>- Monotransitive: S + V + O</li>
                                <li>- Ditransitive: S + V + IO + DO</li>
                              </ul>
                              <div className="vb-grid vb-grid-one-col">
                                <details className="vb-card vb-card-accordion">
                                  <summary className="vb-card-summary">
                                    <h3 className="vb-card-title">Monotransitive</h3>
                                    <span className="vb-card-caret" aria-hidden="true" />
                                  </summary>
                                  <div className="vb-card-body">
                                    <p className="vb-card-desc">Verb + 1 object (S + V + O).</p>
                                    <ul className="vb-list">
                                      {MONOTRANSITIVE_EXAMPLES.map((item) => (
                                        <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </details>

                                <details className="vb-card vb-card-accordion">
                                  <summary className="vb-card-summary">
                                    <h3 className="vb-card-title">Ditransitive</h3>
                                    <span className="vb-card-caret" aria-hidden="true" />
                                  </summary>
                                  <div className="vb-card-body">
                                    <p className="vb-card-desc">Verb + 2 object (indirect + direct).</p>
                                    <ul className="vb-list">
                                      <li>- Pola 1: S + V + IO + DO</li>
                                      <li>- Pola 2: S + V + DO + to/for + IO</li>
                                      <li>
                                        - Umum dipakai oleh: <em>give, send, tell, show, offer, buy, make</em>.
                                      </li>
                                    </ul>
                                    <ul className="vb-list">
                                      {DITRANSITIVE_EXAMPLES.map((item) => (
                                        <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                                      ))}
                                    </ul>
                                    <p className="vb-card-desc">
                                      Versi pola 2 (object benda dulu, lalu <em>to/for + orang</em>):
                                    </p>
                                    <ul className="vb-list">
                                      {DITRANSITIVE_TO_FOR_EXAMPLES.map((item) => (
                                        <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                                      ))}
                                    </ul>
                                    <div className="vb-action-row">
                                      <button
                                        type="button"
                                        className="vb-vocab-button"
                                        onClick={() => setIsDitransitiveModalOpen(true)}
                                      >
                                        Lihat Ditransitive Vocabulary
                                      </button>
                                    </div>
                                  </div>
                                </details>
                              </div>
                              <p className="vb-text">
                                <strong>Catatan:</strong>
                              </p>
                              <ul className="vb-list">
                                <li>
                                  - Jika object orang muncul sebelum benda (mis. <em>give me a book</em>), itu pola
                                  ditransitive.
                                </li>
                                <li>
                                  - Gunakan <em>to</em> untuk perpindahan/pengiriman sesuatu ke orang lain (mis.{' '}
                                  <em>give/send/tell/show ... to someone</em>), dan gunakan <em>for</em> untuk aksi
                                  yang dilakukan demi/manfaat orang lain (mis. <em>buy/make ... for someone</em>).
                                </li>
                              </ul>
                            </div>
                          </details>
                        </div>
                      </details>

                      <details className="vb-card vb-card-accordion">
                        <summary className="vb-card-summary">
                          <h3 className="vb-card-title">Intransitive and Linking Verbs</h3>
                          <span className="vb-card-caret" aria-hidden="true" />
                        </summary>
                        <div className="vb-card-body">
                          <p className="vb-card-desc">
                            Bagian ini memisahkan action intransitive dan linking verbs agar fungsi
                            kalimat lebih jelas.
                          </p>
                          <details className="vb-card vb-card-accordion">
                            <summary className="vb-card-summary">
                              <h3 className="vb-card-title">Action Intransitive Verbs</h3>
                              <span className="vb-card-caret" aria-hidden="true" />
                            </summary>
                            <div className="vb-card-body">
                              <p className="vb-card-desc">
                                Action verb yang tidak membutuhkan object.
                              </p>
                              <ul className="vb-list">
                                <li>- Pola umum: S + V (+ adverb/time/place)</li>
                              </ul>
                              <ul className="vb-list">
                                {INTRANSITIVE_EXAMPLES.map((item) => (
                                  <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                                ))}
                              </ul>
                            </div>
                          </details>
                          <details className="vb-card vb-card-accordion">
                            <summary className="vb-card-summary">
                              <h3 className="vb-card-title">Linking Verbs</h3>
                              <span className="vb-card-caret" aria-hidden="true" />
                            </summary>
                            <div className="vb-card-body">
                              <p className="vb-card-desc">
                                Linking verb menghubungkan subject dengan complement (sifat/identitas/keadaan), bukan aksi.
                              </p>
                              <ul className="vb-list">
                                <li>- Pola umum: S + Linking Verb + Complement</li>
                                <li>- Verb umum: <em>be, seem, become, look, feel, sound, taste</em>.</li>
                              </ul>
                              <ul className="vb-list">
                                {LINKING_VERB_EXAMPLES.map((item) => (
                                  <li key={item.sentence}>{renderHighlightedVerb(item.sentence, item.focus)}</li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        </div>
                      </details>
                    </div>
                    <ul className="vb-list">
                      <li>- Catatan: beberapa verb bisa dua-duanya tergantung konteks (contoh: &quot;eat&quot;, &quot;read&quot;, &quot;write&quot;).</li>
                      <li>- Fokus utama: pastikan setelah transitive ada object yang jelas.</li>
                    </ul>
                  </div>
                </details>
              </div>
            </details>

            <details className="vb-card vb-card-accordion">
              <summary className="vb-card-summary">
                <h3 className="vb-card-title">Auxiliary Verbs</h3>
                <span className="vb-card-caret" aria-hidden="true" />
              </summary>
              <div className="vb-card-body">
                <div className="vb-grid">
                  <article className="vb-card">
                    <div className="vb-card-body">
                      <h3 className="vb-card-title">be (am/is/are/was/were)</h3>
                      <p className="vb-card-desc">Dipakai untuk state, identity, location, dan passive/continuous.</p>
                      <ul className="vb-list">
                        {AUXILIARY_BE.map((item) => (
                          <li key={item.sentence}>
                            {renderHighlightedWords(item.sentence, item.focus, `be-${item.sentence}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>

                  <article className="vb-card">
                    <div className="vb-card-body">
                      <h3 className="vb-card-title">do (do/does/did)</h3>
                      <p className="vb-card-desc">Dipakai untuk negatif dan pertanyaan di simple tenses.</p>
                      <ul className="vb-list">
                        {AUXILIARY_DO.map((item) => (
                          <li key={item.sentence}>
                            {renderHighlightedWords(item.sentence, item.focus, `do-${item.sentence}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>

                  <article className="vb-card">
                    <div className="vb-card-body">
                      <h3 className="vb-card-title">have (have/has/had)</h3>
                      <p className="vb-card-desc">Dipakai sebagai auxiliary untuk perfect tenses.</p>
                      <ul className="vb-list">
                        {AUXILIARY_HAVE.map((item) => (
                          <li key={item.sentence}>
                            {renderHighlightedWords(item.sentence, item.focus, `have-${item.sentence}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
                <p className="vb-text">
                  <strong>Catatan:</strong> pada level dasar, untuk negative/question di simple tense
                  gunakan <em>do/does/did</em> (bukan <em>be</em>) kecuali kalimatnya memang memakai
                  be-verb sebagai main verb.
                </p>
              </div>
            </details>
          </div>
        </section>

        <section className="vb-block">
          <h2 className="vb-block-title">Kesalahan Umum</h2>
          <ul className="vb-list">
            <li>- Menggunakan do/does/did bersama bentuk verb yang sudah berubah (mis. did went).</li>
            <li>- Menganggap semua intransitive verb bisa langsung diikuti object.</li>
            <li>- Tertukar antara linking verb dan action verb dalam analisis complement/object.</li>
            <li>- Tidak menyesuaikan bentuk verb untuk he/she/it pada present simple.</li>
          </ul>
        </section>

        <section className="vb-block">
          <h2 className="vb-block-title">Catatan Penting</h2>
          <ul className="vb-list">
            <li>- Verb adalah pusat struktur kalimat; cek jenis verb sebelum menentukan pola.</li>
            <li>- Main verb menyampaikan makna inti, auxiliary membentuk tense/negatif/pertanyaan.</li>
            <li>- Transitive menuntut object jelas, intransitive tidak menuntut object langsung.</li>
            <li>- Kuasai bentuk V1, V2, V3, Vs/es, dan V-ing untuk lanjut ke tense yang lebih kompleks.</li>
          </ul>
        </section>

      </div>

      {isVocabModalOpen && (
        <div
          className="vb-modal-backdrop"
          role="presentation"
          onClick={() => setIsVocabModalOpen(false)}
        >
          <div
            className="vb-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Irregular Vocabulary Lengkap"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vb-modal-header">
              <h2 className="vb-modal-title">Irregular Vocabulary</h2>
              <button
                type="button"
                className="vb-modal-close"
                onClick={() => setIsVocabModalOpen(false)}
                aria-label="Tutup modal"
              >
                x
              </button>
            </div>
            <div className="vb-modal-body">
              <div className="vb-table-wrap">
                <table className="vb-table">
                  <thead>
                    <tr>
                      <th>V1</th>
                      <th>V2</th>
                      <th>V3</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IRREGULAR_VOCAB_FULL.map((row) => (
                      <tr key={`${row.v1}-${row.v2}-${row.v3}`}>
                        <td>{row.v1}</td>
                        <td>{row.v2}</td>
                        <td>{row.v3}</td>
                        <td>{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDitransitiveModalOpen && (
        <div
          className="vb-modal-backdrop"
          role="presentation"
          onClick={() => setIsDitransitiveModalOpen(false)}
        >
          <div
            className="vb-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Ditransitive Vocabulary"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vb-modal-header">
              <h2 className="vb-modal-title">Ditransitive Vocabulary</h2>
              <button
                type="button"
                className="vb-modal-close"
                onClick={() => setIsDitransitiveModalOpen(false)}
                aria-label="Tutup modal"
              >
                x
              </button>
            </div>
            <div className="vb-modal-body">
              <div className="vb-table-wrap">
                <table className="vb-table">
                  <thead>
                    <tr>
                      <th>Verb</th>
                      <th>Pattern</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DITRANSITIVE_VOCAB.map((row) => (
                      <tr key={`${row.verb}-${row.pattern}`}>
                        <td>{row.verb}</td>
                        <td>{row.pattern}</td>
                        <td>{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



