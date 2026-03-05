import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/education.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const EDUCATION_ROWS = [
  { en: 'Education is important for everyone.', id: 'Pendidikan penting untuk semua orang.', ipa: '/ˌɛdʒuˈkeɪʃən ɪz ɪmˈpɔrtənt fɔr ˈɛvriˌwʌn/' },
  { en: 'I want to learn English well.', id: 'Saya ingin belajar bahasa Inggris dengan baik.', ipa: '/aɪ wɑnt tə lɝn ˈɪŋɡlɪʃ wɛl/' },
  { en: 'She studies every night.', id: 'Dia belajar setiap malam.', ipa: '/ʃi ˈstʌdiz ˈɛvri naɪt/' },
  { en: 'He teaches math at school.', id: 'Dia mengajar matematika di sekolah.', ipa: '/hi ˈtitʃɪz mæθ æt skul/' },
  { en: 'Our teacher is very kind.', id: 'Guru kami sangat baik.', ipa: '/aʊər ˈtitʃər ɪz ˈvɛri kaɪnd/' },
  { en: 'Each student has an ID card.', id: 'Setiap siswa punya kartu identitas.', ipa: '/itʃ ˈstudənt hæz ən aɪˈdi kɑrd/' },
  { en: 'My school is near my house.', id: 'Sekolah saya dekat rumah.', ipa: '/maɪ skul ɪz nɪr maɪ haʊs/' },
  { en: 'My class starts at eight.', id: 'Kelas saya mulai jam delapan.', ipa: '/maɪ ক্লæs stɑrts æt eɪt/' },
  { en: 'The classroom is clean.', id: 'Ruang kelasnya bersih.', ipa: '/ðə ˈklæsrum ɪz klin/' },
  { en: "Today's lesson is about grammar.", id: 'Pelajaran hari ini tentang tata bahasa.', ipa: '/təˈdeɪz ˈlɛsən ɪz əˈbaʊt ˈɡræmər/' },
  { en: 'Science is my favorite subject.', id: 'Sains adalah mata pelajaran favorit saya.', ipa: '/ˈsaɪəns ɪz maɪ ˈfeɪvərɪt ˈsʌbdʒɪkt/' },
  { en: 'The curriculum changed this year.', id: 'Kurikulumnya berubah tahun ini.', ipa: '/ðə kəˈrɪkjələm tʃeɪndʒd ðɪs jɪr/' },
  { en: 'Read the syllabus before class.', id: 'Baca silabus sebelum kelas.', ipa: '/rid ðə ˈsɪləbəs bɪˈfɔr klæs/' },
  { en: 'I finished my homework early.', id: 'Saya menyelesaikan PR lebih awal.', ipa: '/aɪ ˈfɪnɪʃt maɪ ˈhoʊmˌwɝk ˈɝli/' },
  { en: 'This assignment is due tomorrow.', id: 'Tugas ini harus dikumpulkan besok.', ipa: '/ðɪs əˈsaɪnmənt ɪz du təˈmɑroʊ/' },
  { en: 'We did a group project.', id: 'Kami mengerjakan proyek kelompok.', ipa: '/wi dɪd ə ɡrup ˈprɑdʒɛkt/' },
  { en: 'Her presentation was clear.', id: 'Presentasinya jelas.', ipa: '/hɝ ˌprɛzənˈteɪʃən wəz klɪr/' },
  { en: 'The class had a short discussion.', id: 'Kelas mengadakan diskusi singkat.', ipa: '/ðə klæs hæd ə ʃɔrt dɪˈskʌʃən/' },
  { en: 'I have one question.', id: 'Saya punya satu pertanyaan.', ipa: '/aɪ hæv wʌn ˈkwɛstʃən/' },
  { en: 'Please write your answer here.', id: 'Tolong tulis jawabanmu di sini.', ipa: '/pliz raɪt jʊr ˈænsər hɪr/' },
  { en: 'We have a test next week.', id: 'Kami ada tes minggu depan.', ipa: '/wi hæv ə tɛst nɛkst wik/' },
  { en: 'There is a quiz today.', id: 'Hari ini ada kuis.', ipa: '/ðɛr ɪz ə kwɪz təˈdeɪ/' },
  { en: 'My exam is on Monday.', id: 'Ujian saya hari Senin.', ipa: '/maɪ ɪɡˈzæm ɪz ɑn ˈmʌndeɪ/' },
  { en: 'I got a good grade.', id: 'Saya mendapat nilai bagus.', ipa: '/aɪ ɡɑt ə ɡʊd ɡreɪd/' },
  { en: 'His score improved a lot.', id: 'Skornya meningkat banyak.', ipa: '/hɪz skɔr ɪmˈpruvd ə lɑt/' },
  { en: 'She passed the final exam.', id: 'Dia lulus ujian akhir.', ipa: '/ʃi pæst ðə ˈfaɪnəl ɪɡˈzæm/' },
  { en: 'He failed one subject.', id: 'Dia gagal di satu mata pelajaran.', ipa: '/hi feɪld wʌn ˈsʌbdʒɪkt/' },
  { en: 'I received a certificate.', id: 'Saya menerima sertifikat.', ipa: '/aɪ rɪˈsivd ə sərˈtɪfɪkət/' },
  { en: 'She got her diploma last year.', id: 'Dia mendapat ijazah tahun lalu.', ipa: '/ʃi ɡɑt hɝ dɪˈploʊmə læst jɪr/' },
  { en: 'He has a teaching degree.', id: 'Dia punya gelar pendidikan.', ipa: '/hi hæz ə ˈtitʃɪŋ dɪˈɡri/' },
  { en: 'My sister is in college.', id: 'Saudari saya kuliah.', ipa: '/maɪ ˈsɪstər ɪz ɪn ˈkɑlɪdʒ/' },
  { en: 'He studies at a university.', id: 'Dia kuliah di universitas.', ipa: '/hi ˈstʌdiz æt ə ˌjunəˈvɝsəti/' },
  { en: 'The campus is very large.', id: 'Kampusnya sangat luas.', ipa: '/ðə ˈkæmpəs ɪz ˈvɛri lɑrdʒ/' },
  { en: 'Her major is biology.', id: 'Jurusannya biologi.', ipa: '/hɝ ˈmeɪdʒər ɪz baɪˈɑlədʒi/' },
  { en: 'He has a minor in history.', id: 'Dia mengambil jurusan tambahan sejarah.', ipa: '/hi hæz ə ˈmaɪnər ɪn ˈhɪstəri/' },
  { en: 'This semester is very busy.', id: 'Semester ini sangat sibuk.', ipa: '/ðɪs səˈmɛstər ɪz ˈvɛri ˈbɪzi/' },
  { en: 'The academic year starts in July.', id: 'Tahun ajaran dimulai pada bulan Juli.', ipa: '/ði ˌækəˈdɛmɪk jɪr stɑrts ɪn dʒʊˈlaɪ/' },
  { en: 'Please check your class schedule.', id: 'Tolong cek jadwal kelasmu.', ipa: '/pliz tʃɛk jʊr klæs ˈskɛdʒul/' },
  { en: 'Attendance is important.', id: 'Kehadiran itu penting.', ipa: '/əˈtɛndəns ɪz ɪmˈpɔrtənt/' },
  { en: 'Two students were absent today.', id: 'Dua siswa tidak hadir hari ini.', ipa: '/tu ˈstudənts wɝ ˈæbsənt təˈdeɪ/' },
  { en: 'I study in the library.', id: 'Saya belajar di perpustakaan.', ipa: '/aɪ ˈstʌdi ɪn ðə ˈlaɪˌbrɛri/' },
  { en: 'We have science in the laboratory.', id: 'Kami belajar sains di laboratorium.', ipa: '/wi hæv ˈsaɪəns ɪn ðə ˈlæbrəˌtɔri/' },
  { en: 'Open your notebook, please.', id: 'Buka buku catatanmu, tolong.', ipa: '/ˈoʊpən jʊr ˈnoʊtbʊk pliz/' },
  { en: 'Bring your textbook tomorrow.', id: 'Bawa buku pelajaranmu besok.', ipa: '/brɪŋ jʊr ˈtɛkstˌbʊk təˈmɑroʊ/' },
  { en: 'Use a dictionary for new words.', id: 'Gunakan kamus untuk kata-kata baru.', ipa: '/juz ə ˈdɪkʃəˌnɛri fɔr nu wɝdz/' },
  { en: 'They are doing research together.', id: 'Mereka sedang melakukan riset bersama.', ipa: '/ðeɪ ɑr ˈduɪŋ rɪˈsɝtʃ təˈɡɛðər/' },
  { en: 'She got a scholarship.', id: 'Dia mendapat beasiswa.', ipa: '/ʃi ɡɑt ə ˈskɑlərˌʃɪp/' },
  { en: 'The tuition fee is paid monthly.', id: 'Biaya kuliahnya dibayar setiap bulan.', ipa: '/ðə tuˈɪʃən fi ɪz peɪd ˈmʌnθli/' },
  { en: 'Graduation is in August.', id: 'Kelulusan pada bulan Agustus.', ipa: '/ˌɡrædʒuˈeɪʃən ɪz ɪn ˈɔɡəst/' },
  { en: 'He is a university graduate.', id: 'Dia lulusan universitas.', ipa: '/hi ɪz ə ˌjunəˈvɝsəti ˈɡrædʒuət/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(EDUCATION_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing EDUCATION_ROWS mappings for: ${missingRows.join(' | ')}`);
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
    const keyPattern = JSON.stringify(example).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`(\\n\\s*${keyPattern}:\\s*)\"(?:\\\\.|[^\"])*\"(,?)`);
    if (lineRegex.test(body)) {
      body = body.replace(lineRegex, `$1${JSON.stringify(value)}$2`);
    } else {
      body += `\n  ${JSON.stringify(example)}: ${JSON.stringify(value)},`;
    }
  }

  source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
};

updateMapSection('VOCAB_EXAMPLE_TRANSLATION_BY_EN', (row) => row.id);
updateMapSection('VOCAB_EXAMPLE_IPA_BY_EN', (row) => row.ipa);

fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated Education topic: ${examples.length} translations + IPA`);
