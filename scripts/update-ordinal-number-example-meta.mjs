import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/ordinal-number.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const ORDINAL_ROWS = [
  { en: 'This is my first class.', id: 'Ini kelas pertama saya.', ipa: '/ðɪs ɪz maɪ fɝst klæs/' },
  { en: 'She sits in the second row.', id: 'Dia duduk di baris kedua.', ipa: '/ʃi sɪts ɪn ðə ˈsɛkənd roʊ/' },
  { en: 'He is the third speaker.', id: 'Dia pembicara ketiga.', ipa: '/hi ɪz ðə θɝd ˈspikɚ/' },
  { en: 'Today is my fourth lesson.', id: 'Hari ini pelajaran keempat saya.', ipa: '/təˈdeɪ ɪz maɪ fɔrθ ˈlɛsən/' },
  { en: 'She lives on the fifth floor.', id: 'Dia tinggal di lantai lima.', ipa: '/ʃi lɪvz ɑn ðə fɪfθ flɔr/' },
  { en: 'This is the sixth page.', id: 'Ini halaman keenam.', ipa: '/ðɪs ɪz ðə sɪksθ peɪdʒ/' },
  { en: 'We meet on the seventh day.', id: 'Kami bertemu pada hari ketujuh.', ipa: '/wi mit ɑn ðə ˈsɛvənθ deɪ/' },
  { en: 'The eighth student is absent.', id: 'Siswa kedelapan tidak hadir.', ipa: '/ði eɪtθ ˈstudənt ɪz ˈæbsənt/' },
  { en: 'He comes in ninth place.', id: 'Dia finis di posisi kesembilan.', ipa: '/hi kʌmz ɪn naɪnθ pleɪs/' },
  { en: 'My birthday is on the tenth.', id: 'Ulang tahun saya tanggal sepuluh.', ipa: '/maɪ ˈbɝθdeɪ ɪz ɑn ðə tɛnθ/' },
  { en: 'The meeting is on the eleventh.', id: 'Rapatnya tanggal sebelas.', ipa: '/ðə ˈmitɪŋ ɪz ɑn ði ɪˈlɛvənθ/' },
  { en: 'She is in the twelfth group.', id: 'Dia ada di kelompok kedua belas.', ipa: '/ʃi ɪz ɪn ðə twɛlfθ ɡrup/' },
  { en: 'Today is the thirteenth.', id: 'Hari ini tanggal tiga belas.', ipa: '/təˈdeɪ ɪz ðə θɝˈtinθ/' },
  { en: 'He is the fourteenth player.', id: 'Dia pemain keempat belas.', ipa: '/hi ɪz ðə fɔrˈtinθ ˈpleɪɚ/' },
  { en: 'The test is on the fifteenth.', id: 'Ujiannya tanggal lima belas.', ipa: '/ðə tɛst ɪz ɑn ðə fɪfˈtinθ/' },
  { en: 'This is the sixteenth question.', id: 'Ini pertanyaan keenam belas.', ipa: '/ðɪs ɪz ðə sɪksˈtinθ ˈkwɛstʃən/' },
  { en: 'She arrives on the seventeenth.', id: 'Dia datang tanggal tujuh belas.', ipa: '/ʃi əˈraɪvz ɑn ðə ˌsɛvənˈtinθ/' },
  { en: 'It is the eighteenth chapter.', id: 'Ini bab kedelapan belas.', ipa: '/ɪt ɪz ði eɪˈtinθ ˈtʃæptɚ/' },
  { en: 'He was born on the nineteenth.', id: 'Dia lahir tanggal sembilan belas.', ipa: '/hi wəz bɔrn ɑn ðə ˌnaɪnˈtinθ/' },
  { en: 'The twentieth bus is late.', id: 'Bus kedua puluh terlambat.', ipa: '/ðə ˈtwɛntiəθ bʌs ɪz leɪt/' },
  { en: 'My appointment is on the twenty-first.', id: 'Janji saya tanggal dua puluh satu.', ipa: '/maɪ əˈpɔɪntmənt ɪz ɑn ðə ˌtwɛntiˈfɝst/' },
  { en: 'He is the twenty-second member.', id: 'Dia anggota kedua puluh dua.', ipa: '/hi ɪz ðə ˌtwɛntiˈsɛkənd ˈmɛmbɚ/' },
  { en: 'The class starts on the twenty-third.', id: 'Kelas mulai tanggal dua puluh tiga.', ipa: '/ðə klæs stɑrts ɑn ðə ˌtwɛntiˈθɝd/' },
  { en: 'She is on the twenty-fourth page.', id: 'Dia ada di halaman kedua puluh empat.', ipa: '/ʃi ɪz ɑn ðə ˌtwɛntiˈfɔrθ peɪdʒ/' },
  { en: 'The event is on the twenty-fifth.', id: 'Acaranya tanggal dua puluh lima.', ipa: '/ði ɪˈvɛnt ɪz ɑn ðə ˌtwɛntiˈfɪfθ/' },
  { en: 'He finished in the twenty-sixth position.', id: 'Dia finis di posisi kedua puluh enam.', ipa: '/hi ˈfɪnɪʃt ɪn ðə ˌtwɛntiˈsɪksθ pəˈzɪʃən/' },
  { en: 'Today is the twenty-seventh.', id: 'Hari ini tanggal dua puluh tujuh.', ipa: '/təˈdeɪ ɪz ðə ˌtwɛntiˈsɛvənθ/' },
  { en: 'The meeting is on the twenty-eighth.', id: 'Rapatnya tanggal dua puluh delapan.', ipa: '/ðə ˈmitɪŋ ɪz ɑn ðə ˌtwɛntiˈeɪtθ/' },
  { en: 'He came in the twenty-ninth place.', id: 'Dia masuk posisi kedua puluh sembilan.', ipa: '/hi keɪm ɪn ðə ˌtwɛntiˈnaɪnθ pleɪs/' },
  { en: 'The thirtieth student is absent.', id: 'Siswa ketiga puluh tidak hadir.', ipa: '/ðə ˈθɝtiəθ ˈstudənt ɪz ˈæbsənt/' },
  { en: 'Some months end on the thirty-first.', id: 'Beberapa bulan berakhir di tanggal tiga puluh satu.', ipa: '/sʌm mʌnθs ɛnd ɑn ðə ˌθɝtiˈfɝst/' },
  { en: 'This is our fortieth practice.', id: 'Ini latihan keempat puluh kami.', ipa: '/ðɪs ɪz aʊɚ ˈfɔrtiəθ ˈpræktɪs/' },
  { en: 'Today is the fiftieth day.', id: 'Hari ini hari kelima puluh.', ipa: '/təˈdeɪ ɪz ðə ˈfɪftiəθ deɪ/' },
  { en: 'She is the hundredth customer.', id: 'Dia pelanggan keseratus.', ipa: '/ʃi ɪz ðə ˈhʌndrədθ ˈkʌstəmɚ/' },
  { en: 'This is the thousandth visitor.', id: 'Ini pengunjung keseribu.', ipa: '/ðɪs ɪz ðə ˈθaʊzəndθ ˈvɪzɪtɚ/' },
  { en: 'He became the millionth user.', id: 'Dia menjadi pengguna kesejuta.', ipa: '/hi bɪˈkeɪm ðə ˈmɪljənθ ˈjuzɚ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(ORDINAL_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing ORDINAL_ROWS mappings for: ${missingRows.join(' | ')}`);
}

let source = fs.readFileSync(META_PATH, 'utf8');

const updateMapSection = (sectionName, valueFactory) => {
  const startMarker = `export const ${sectionName}: Record<string, string> = {`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Section start not found: ${sectionName}`);
  const bodyStart = start + startMarker.length;
  const end = source.indexOf('\n};', bodyStart);
  if (end < 0) throw new Error(`Section end not found: ${sectionName}`);
  let body = source.slice(bodyStart, end);

  for (const example of examples) {
    const row = rowMap.get(example);
    const value = valueFactory(row);
    const keyPattern = example.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`(\\n\\s*\"${keyPattern}\":\\s*\")([^\"]*)(\",?)`);
    if (lineRegex.test(body)) {
      body = body.replace(lineRegex, `$1${value}$3`);
    } else {
      body += `\n  ${JSON.stringify(example)}: ${JSON.stringify(value)},`;
    }
  }

  source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
};

updateMapSection('VOCAB_EXAMPLE_TRANSLATION_BY_EN', (row) => row.id);
updateMapSection('VOCAB_EXAMPLE_IPA_BY_EN', (row) => row.ipa);

fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated Ordinal Number topic: ${examples.length} translations + IPA`);
