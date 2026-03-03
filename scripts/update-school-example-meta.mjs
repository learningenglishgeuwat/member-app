import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/school.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const SCHOOL_ROWS = [
  { en: 'My school starts at seven.', id: 'Sekolah saya mulai jam tujuh.', ipa: '/maɪ skul stɑrts æt ˈsɛvən/' },
  { en: 'Our classroom is on the second floor.', id: 'Ruang kelas kami ada di lantai dua.', ipa: '/aʊər ˈklæsrum ɪz ɑn ðə ˈsɛkənd flɔr/' },
  { en: 'The teacher explains clearly.', id: 'Guru menjelaskan dengan jelas.', ipa: '/ðə ˈtitʃər ɪkˈspleɪnz ˈklɪrli/' },
  { en: 'Every student has a notebook.', id: 'Setiap murid punya buku catatan.', ipa: '/ˈɛvri ˈstudənt hæz ə ˈnoʊtbʊk/' },
  { en: 'The principal gave a short speech.', id: 'Kepala sekolah memberi pidato singkat.', ipa: '/ðə ˈprɪnsəpəl ɡeɪv ə ʃɔrt spitʃ/' },
  { en: 'My classmate sits next to me.', id: 'Teman sekelas saya duduk di sebelah saya.', ipa: '/maɪ ˈklæsmeɪt sɪts nɛkst tə mi/' },
  { en: "Today's lesson is easy.", id: 'Pelajaran hari ini mudah.', ipa: '/təˈdeɪz ˈlɛsən ɪz ˈizi/' },
  { en: 'English is my favorite subject.', id: 'Bahasa Inggris adalah mata pelajaran favorit saya.', ipa: '/ˈɪŋɡlɪʃ ɪz maɪ ˈfeɪvərɪt ˈsʌbdʒɪkt/' },
  { en: 'I finish my homework at night.', id: 'Saya menyelesaikan PR pada malam hari.', ipa: '/aɪ ˈfɪnɪʃ maɪ ˈhoʊmwɝk æt naɪt/' },
  { en: 'We have a writing assignment.', id: 'Kami punya tugas menulis.', ipa: '/wi hæv ə ˈraɪtɪŋ əˈsaɪnmənt/' },
  { en: 'Our project is about animals.', id: 'Proyek kami tentang hewan.', ipa: '/aʊər ˈprɑdʒɛkt ɪz əˈbaʊt ˈænəməlz/' },
  { en: 'Her presentation was very good.', id: 'Presentasinya sangat bagus.', ipa: '/hɝ ˌprɛznˈteɪʃən wəz ˈvɛri ɡʊd/' },
  { en: 'We have a math test tomorrow.', id: 'Besok kami ada tes matematika.', ipa: '/wi hæv ə mæθ tɛst təˈmɑroʊ/' },
  { en: 'There is a short quiz today.', id: 'Hari ini ada kuis singkat.', ipa: '/ðɛr ɪz ə ʃɔrt kwɪz təˈdeɪ/' },
  { en: 'My exam starts at nine.', id: 'Ujian saya mulai jam sembilan.', ipa: '/maɪ ɪɡˈzæm stɑrts æt naɪn/' },
  { en: 'I got a good grade in science.', id: 'Saya mendapat nilai bagus di sains.', ipa: '/aɪ ɡɑt ə ɡʊd ɡreɪd ɪn ˈsaɪəns/' },
  { en: 'His score is higher this time.', id: 'Skornya lebih tinggi kali ini.', ipa: '/hɪz skɔr ɪz ˈhaɪər ðɪs taɪm/' },
  { en: 'Please open your notebook.', id: 'Tolong buka buku catatan kalian.', ipa: '/pliz ˈoʊpən jʊr ˈnoʊtbʊk/' },
  { en: 'This book is new.', id: 'Buku ini baru.', ipa: '/ðɪs bʊk ɪz nu/' },
  { en: 'Bring your textbook to class.', id: 'Bawa buku pelajaranmu ke kelas.', ipa: '/brɪŋ jʊr ˈtɛkstbʊk tə klæs/' },
  { en: 'Page ten is in the workbook.', id: 'Halaman sepuluh ada di buku latihan.', ipa: '/peɪdʒ tɛn ɪz ɪn ðə ˈwɝkbʊk/' },
  { en: 'Use a dictionary for new words.', id: 'Gunakan kamus untuk kata-kata baru.', ipa: '/juz ə ˈdɪkʃəˌnɛri fɔr nu wɝdz/' },
  { en: 'I need a pencil for the test.', id: 'Saya butuh pensil untuk tes.', ipa: '/aɪ nid ə ˈpɛnsəl fɔr ðə tɛst/' },
  { en: 'Can I borrow your pen?', id: 'Boleh saya pinjam pulpenmu?', ipa: '/kæn aɪ ˈbɑroʊ jʊr pɛn/' },
  { en: 'My eraser is under the desk.', id: 'Penghapus saya ada di bawah meja.', ipa: '/maɪ ɪˈreɪsər ɪz ˈʌndər ðə dɛsk/' },
  { en: 'Use a ruler to draw a line.', id: 'Pakai penggaris untuk menarik garis.', ipa: '/juz ə ˈrulər tə drɔ ə laɪn/' },
  { en: 'My school bag is heavy today.', id: 'Tas sekolah saya berat hari ini.', ipa: '/maɪ skul bæɡ ɪz ˈhɛvi təˈdeɪ/' },
  { en: 'My desk is near the window.', id: 'Meja saya dekat jendela.', ipa: '/maɪ dɛsk ɪz nɪr ðə ˈwɪndoʊ/' },
  { en: 'Please sit on this chair.', id: 'Tolong duduk di kursi ini.', ipa: '/pliz sɪt ɑn ðɪs tʃɛr/' },
  { en: 'The answer is on the board.', id: 'Jawabannya ada di papan tulis.', ipa: '/ði ˈænsər ɪz ɑn ðə bɔrd/' },
  { en: 'The teacher writes on the whiteboard.', id: 'Guru menulis di papan tulis putih.', ipa: '/ðə ˈtitʃər raɪts ɑn ðə ˈwaɪtbɔrd/' },
  { en: 'The marker is out of ink.', id: 'Spidolnya kehabisan tinta.', ipa: '/ðə ˈmɑrkər ɪz aʊt əv ɪŋk/' },
  { en: 'There is chalk in the drawer.', id: 'Ada kapur tulis di laci.', ipa: '/ðɛr ɪz tʃɔk ɪn ðə drɔr/' },
  { en: 'Check your class schedule.', id: 'Cek jadwal kelasmu.', ipa: '/tʃɛk jʊr klæs ˈskɛdʒul/' },
  { en: 'Our timetable changed this week.', id: 'Jadwal pelajaran kami berubah minggu ini.', ipa: '/aʊər ˈtaɪmˌteɪbəl tʃeɪndʒd ðɪs wik/' },
  { en: 'We have a short break at ten.', id: 'Kami istirahat sebentar jam sepuluh.', ipa: '/wi hæv ə ʃɔrt breɪk æt tɛn/' },
  { en: 'The students play during recess.', id: 'Murid-murid bermain saat jam istirahat.', ipa: '/ðə ˈstudənts pleɪ ˈdʊrɪŋ ˈrisɛs/' },
  { en: 'The bell rings at noon.', id: 'Bel berbunyi saat tengah hari.', ipa: '/ðə bɛl rɪŋz æt nun/' },
  { en: 'I read in the library after class.', id: 'Saya membaca di perpustakaan setelah kelas.', ipa: '/aɪ rid ɪn ðə ˈlaɪˌbrɛri ˈæftər klæs/' },
  { en: 'Our science class is in the laboratory.', id: 'Kelas sains kami ada di laboratorium.', ipa: '/aʊər ˈsaɪəns klæs ɪz ɪn ðə ˈlæbrəˌtɔri/' },
  { en: "Let's eat in the canteen.", id: 'Ayo makan di kantin.', ipa: '/lɛts it ɪn ðə kænˈtin/' },
  { en: 'My uniform is clean.', id: 'Seragam saya bersih.', ipa: '/maɪ ˈjunəˌfɔrm ɪz klin/' },
  { en: 'I have one question.', id: 'Saya punya satu pertanyaan.', ipa: '/aɪ hæv wʌn ˈkwɛstʃən/' },
  { en: 'Write your answer here.', id: 'Tulis jawabanmu di sini.', ipa: '/raɪt jʊr ˈænsər hɪr/' },
  { en: 'Please read the first paragraph.', id: 'Tolong baca paragraf pertama.', ipa: '/pliz rid ðə fɝst ˈpærəˌɡræf/' },
  { en: 'Write your name on the paper.', id: 'Tulis namamu di kertas ini.', ipa: '/raɪt jʊr neɪm ɑn ðə ˈpeɪpər/' },
  { en: 'Listen to the teacher carefully.', id: 'Dengarkan guru dengan saksama.', ipa: '/ˈlɪsən tə ðə ˈtitʃər ˈkɛrfəli/' },
  { en: 'Speak clearly in class.', id: 'Berbicaralah dengan jelas di kelas.', ipa: '/spik ˈklɪrli ɪn klæs/' },
  { en: 'I study English every day.', id: 'Saya belajar bahasa Inggris setiap hari.', ipa: '/aɪ ˈstʌdi ˈɪŋɡlɪʃ ˈɛvri deɪ/' },
  { en: 'We learn new words each week.', id: 'Kami mempelajari kata-kata baru setiap minggu.', ipa: '/wi lɝn nu wɝdz itʃ wik/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(SCHOOL_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing SCHOOL_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated School topic: ${examples.length} translations + IPA`);
