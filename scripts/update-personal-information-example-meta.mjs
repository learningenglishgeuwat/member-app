import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/personal-information.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const PERSONAL_INFORMATION_ROWS = [
  { en: 'My name is Rina.', id: 'Nama saya Rina.', ipa: '/maɪ neɪm ɪz ˈrinə/' },
  { en: 'Please write your full name.', id: 'Tolong tulis nama lengkap Anda.', ipa: '/pliz raɪt jʊr fʊl neɪm/' },
  { en: 'What is your first name?', id: 'Siapa nama depan Anda?', ipa: '/wʌt ɪz jʊr fɝst neɪm/' },
  { en: 'Her last name is Putri.', id: 'Nama belakangnya Putri.', ipa: '/hɝ læst neɪm ɪz ˈputri/' },
  { en: 'Your surname is missing on this form.', id: 'Nama keluarga Anda belum terisi di formulir ini.', ipa: '/jʊr ˈsɝˌneɪm ɪz ˈmɪsɪŋ ɑn ðɪs fɔrm/' },
  { en: 'My nickname is Nia.', id: 'Nama panggilan saya Nia.', ipa: '/maɪ ˈnɪkˌneɪm ɪz ˈniə/' },
  { en: 'Please confirm your identity.', id: 'Mohon konfirmasi identitas Anda.', ipa: '/pliz kənˈfɝm jʊr aɪˈdɛntəti/' },
  { en: 'Keep your personal data safe.', id: 'Jaga data pribadi Anda tetap aman.', ipa: '/kip jʊr ˈpɝsənəl ˈdeɪtə seɪf/' },
  { en: 'Update your profile today.', id: 'Perbarui profil Anda hari ini.', ipa: '/ʌpˈdeɪt jʊr ˈproʊfaɪl təˈdeɪ/' },
  { en: 'I need more information.', id: 'Saya butuh informasi lebih lanjut.', ipa: '/aɪ nid mɔr ˌɪnfərˈmeɪʃən/' },
  { en: 'What is your age?', id: 'Berapa usia Anda?', ipa: '/wʌt ɪz jʊr eɪdʒ/' },
  { en: 'My birthday is in July.', id: 'Ulang tahun saya bulan Juli.', ipa: '/maɪ ˈbɝθdeɪ ɪz ɪn dʒʊˈlaɪ/' },
  { en: 'Please enter your birth date.', id: 'Silakan masukkan tanggal lahir Anda.', ipa: '/pliz ˈɛntər jʊr bɝθ deɪt/' },
  { en: 'His birth place is Bandung.', id: 'Tempat lahirnya Bandung.', ipa: '/hɪz bɝθ pleɪs ɪz ˈbændʊŋ/' },
  { en: 'Select your gender on the form.', id: 'Pilih jenis kelamin Anda di formulir.', ipa: '/səˈlɛkt jʊr ˈdʒɛndər ɑn ðə fɔrm/' },
  { en: 'He is male.', id: 'Dia laki-laki.', ipa: '/hi ɪz meɪl/' },
  { en: 'She is female.', id: 'Dia perempuan.', ipa: '/ʃi ɪz ˈfiˌmeɪl/' },
  { en: 'My nationality is Indonesian.', id: 'Kewarganegaraan saya Indonesia.', ipa: '/maɪ ˌnæʃəˈnæləti ɪz ˌɪndoʊˈniʒən/' },
  { en: 'She is a citizen of Indonesia.', id: 'Dia warga negara Indonesia.', ipa: '/ʃi ɪz ə ˈsɪtəzən əv ˌɪndoʊˈniʒə/' },
  { en: 'Please choose your marital status.', id: 'Silakan pilih status pernikahan Anda.', ipa: '/pliz tʃuz jʊr ˈmærətəl ˈsteɪtəs/' },
  { en: 'He is still single.', id: 'Dia masih lajang.', ipa: '/hi ɪz stɪl ˈsɪŋɡəl/' },
  { en: 'They are married.', id: 'Mereka sudah menikah.', ipa: '/ðeɪ ɑr ˈmærid/' },
  { en: 'What is your home address?', id: 'Apa alamat rumah Anda?', ipa: '/wʌt ɪz jʊr hoʊm əˈdrɛs/' },
  { en: 'I live on this street.', id: 'Saya tinggal di jalan ini.', ipa: '/aɪ lɪv ɑn ðɪs strit/' },
  { en: 'My city is Makassar.', id: 'Kota saya Makassar.', ipa: '/maɪ ˈsɪti ɪz məˈkæsɑr/' },
  { en: 'West Java is a province.', id: 'Jawa Barat adalah sebuah provinsi.', ipa: '/wɛst ˈdʒɑvə ɪz ə ˈprɑvɪns/' },
  { en: 'Indonesia is my country.', id: 'Indonesia adalah negara saya.', ipa: '/ˌɪndoʊˈniʒə ɪz maɪ ˈkʌntri/' },
  { en: 'Please write your postal code.', id: 'Tolong tulis kode pos Anda.', ipa: '/pliz raɪt jʊr ˈpoʊstəl koʊd/' },
  { en: 'Can I have your phone number?', id: 'Boleh saya minta nomor telepon Anda?', ipa: '/kæn aɪ hæv jʊr foʊn ˈnʌmbər/' },
  { en: 'My mobile number changed.', id: 'Nomor ponsel saya berubah.', ipa: '/maɪ ˈmoʊbaɪl ˈnʌmbər tʃeɪndʒd/' },
  { en: 'Please send me an email.', id: 'Tolong kirim email ke saya.', ipa: '/pliz sɛnd mi ən ˈimeɪl/' },
  { en: 'Save my contact first.', id: 'Simpan kontak saya dulu.', ipa: '/seɪv maɪ ˈkɑnˌtækt fɝst/' },
  { en: 'Write an emergency contact here.', id: 'Tulis kontak darurat di sini.', ipa: '/raɪt ən ɪˈmɝdʒənsi ˈkɑnˌtækt hɪr/' },
  { en: 'What is your occupation?', id: 'Apa pekerjaan Anda?', ipa: '/wʌt ɪz jʊr ˌɑkjəˈpeɪʃən/' },
  { en: 'I have a new job.', id: 'Saya punya pekerjaan baru.', ipa: '/aɪ hæv ə nu dʒɑb/' },
  { en: 'She works at a small company.', id: 'Dia bekerja di perusahaan kecil.', ipa: '/ʃi wɝks æt ə smɔl ˈkʌmpəni/' },
  { en: 'I work in the sales department.', id: 'Saya bekerja di departemen penjualan.', ipa: '/aɪ wɝk ɪn ðə seɪlz dɪˈpɑrtmənt/' },
  { en: 'His position is supervisor.', id: 'Jabatannya supervisor.', ipa: '/hɪz pəˈzɪʃən ɪz ˈsupərˌvaɪzər/' },
  { en: 'Bring your student ID card.', id: 'Bawa kartu pelajar Anda.', ipa: '/brɪŋ jʊr ˈstudənt aɪˈdi kɑrd/' },
  { en: 'Show your ID card, please.', id: 'Tolong tunjukkan kartu identitas Anda.', ipa: '/ʃoʊ jʊr aɪˈdi kɑrd pliz/' },
  { en: 'My passport is still valid.', id: 'Paspor saya masih berlaku.', ipa: '/maɪ ˈpæsˌpɔrt ɪz stɪl ˈvæləd/' },
  { en: 'Please add your signature here.', id: 'Tolong tambahkan tanda tangan Anda di sini.', ipa: '/pliz æd jʊr ˈsɪɡnətʃər hɪr/' },
  { en: 'Fill in this form now.', id: 'Isi formulir ini sekarang.', ipa: '/fɪl ɪn ðɪs fɔrm naʊ/' },
  { en: 'Complete every field in the form.', id: 'Lengkapi setiap kolom di formulir.', ipa: '/kəmˈplit ˈɛvri fild ɪn ðə fɔrm/' },
  { en: 'Please fill in your details.', id: 'Silakan isi rincian data Anda.', ipa: '/pliz fɪl ɪn jʊr dɪˈteɪlz/' },
  { en: 'Submit the form before noon.', id: 'Kirim formulir sebelum tengah hari.', ipa: '/səbˈmɪt ðə fɔrm bɪˈfɔr nun/' },
  { en: 'Please confirm your email address.', id: 'Tolong konfirmasi alamat email Anda.', ipa: '/pliz kənˈfɝm jʊr ˈimeɪl əˈdrɛs/' },
  { en: 'Is this information correct?', id: 'Apakah informasi ini benar?', ipa: '/ɪz ðɪs ˌɪnfərˈmeɪʃən kəˈrɛkt/' },
  { en: 'I need to update my profile.', id: 'Saya perlu memperbarui profil saya.', ipa: '/aɪ nid tə ʌpˈdeɪt maɪ ˈproʊfaɪl/' },
  { en: 'Check your personal details again.', id: 'Periksa lagi rincian data pribadi Anda.', ipa: '/tʃɛk jʊr ˈpɝsənəl dɪˈteɪlz əˈɡɛn/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(PERSONAL_INFORMATION_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing PERSONAL_INFORMATION_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Personal Information topic: ${examples.length} translations + IPA`);
