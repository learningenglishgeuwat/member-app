import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/time-date.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const TIME_DATE_ROWS = [
  { en: 'What time is it now?', id: 'Sekarang jam berapa?', ipa: '/wʌt taɪm ɪz ɪt naʊ/' },
  { en: 'What is the date today?', id: 'Tanggal berapa hari ini?', ipa: '/wʌt ɪz ðə deɪt təˈdeɪ/' },
  { en: 'Today is a busy day.', id: 'Hari ini hari yang sibuk.', ipa: '/təˈdeɪ ɪz ə ˈbɪzi deɪ/' },
  { en: 'I study English every week.', id: 'Saya belajar bahasa Inggris setiap minggu.', ipa: '/aɪ ˈstʌdi ˈɪŋɡlɪʃ ˈɛvri wik/' },
  { en: 'This month is very busy.', id: 'Bulan ini sangat sibuk.', ipa: '/ðɪs mʌnθ ɪz ˈvɛri ˈbɪzi/' },
  { en: 'Next year, I want to travel.', id: 'Tahun depan, saya ingin bepergian.', ipa: '/nɛkst jɪr aɪ wɑnt tə ˈtrævəl/' },
  { en: 'The class is one hour long.', id: 'Kelasnya berlangsung satu jam.', ipa: '/ðə klæs ɪz wʌn ˈaʊɚ lɔŋ/' },
  { en: 'Please wait five minutes.', id: 'Tolong tunggu lima menit.', ipa: '/pliz weɪt faɪv ˈmɪnɪts/' },
  { en: 'Please wait ten seconds.', id: 'Tolong tunggu sepuluh detik.', ipa: '/pliz weɪt tɛn ˈsɛkəndz/' },
  { en: 'Mark the date on the calendar.', id: 'Tandai tanggalnya di kalender.', ipa: '/mɑrk ðə deɪt ɑn ðə ˈkæləndɚ/' },
  { en: 'The clock is on the wall.', id: 'Jam dindingnya ada di tembok.', ipa: '/ðə klɑk ɪz ɑn ðə wɔl/' },
  { en: 'I wear a watch every day.', id: 'Saya pakai jam tangan setiap hari.', ipa: '/aɪ wɛr ə wɑtʃ ˈɛvri deɪ/' },
  { en: 'I drink coffee in the morning.', id: 'Saya minum kopi di pagi hari.', ipa: '/aɪ drɪŋk ˈkɔfi ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'We have class in the afternoon.', id: 'Kami ada kelas di siang hari.', ipa: '/wi hæv klæs ɪn ði ˌæftɚˈnun/' },
  { en: 'I go for a walk in the evening.', id: 'Saya jalan-jalan di sore hari.', ipa: '/aɪ ɡoʊ fər ə wɔk ɪn ði ˈivnɪŋ/' },
  { en: 'I sleep early at night.', id: 'Saya tidur lebih awal pada malam hari.', ipa: '/aɪ slip ˈɝli ət naɪt/' },
  { en: 'Do not call me at midnight.', id: 'Jangan telepon saya tengah malam.', ipa: '/du nɑt kɔl mi æt ˈmɪdnaɪt/' },
  { en: 'We eat lunch at noon.', id: 'Kami makan siang saat tengah hari.', ipa: '/wi it lʌntʃ æt nun/' },
  { en: 'The sky is beautiful at dawn.', id: 'Langit indah saat fajar.', ipa: '/ðə skaɪ ɪz ˈbjutəfəl æt dɔn/' },
  { en: 'We watched the sunrise at the beach.', id: 'Kami melihat matahari terbit di pantai.', ipa: '/wi wɑtʃt ðə ˈsʌnˌraɪz æt ðə bitʃ/' },
  { en: 'The sunset is amazing today.', id: 'Matahari terbenam hari ini indah banget.', ipa: '/ðə ˈsʌnˌsɛt ɪz əˈmeɪzɪŋ təˈdeɪ/' },
  { en: 'I work on weekdays.', id: 'Saya kerja di hari kerja.', ipa: '/aɪ wɝk ɑn ˈwikˌdeɪz/' },
  { en: 'We visit grandma on the weekend.', id: 'Kami mengunjungi nenek saat akhir pekan.', ipa: '/wi ˈvɪzɪt ˈɡrænˌmɑ ɑn ðə ˈwikˌɛnd/' },
  { en: 'I have a meeting today.', id: 'Saya ada rapat hari ini.', ipa: '/aɪ hæv ə ˈmitɪŋ təˈdeɪ/' },
  { en: 'See you tomorrow.', id: 'Sampai ketemu besok.', ipa: '/si ju təˈmɑroʊ/' },
  { en: 'I met him yesterday.', id: 'Saya ketemu dia kemarin.', ipa: '/aɪ mɛt hɪm ˈjɛstɚˌdeɪ/' },
  { en: 'I am busy now.', id: 'Saya sedang sibuk sekarang.', ipa: '/aɪ æm ˈbɪzi naʊ/' },
  { en: 'Call me later.', id: 'Telepon saya nanti.', ipa: '/kɔl mi ˈleɪtɚ/' },
  { en: 'The class will start soon.', id: 'Kelasnya akan mulai sebentar lagi.', ipa: '/ðə klæs wɪl stɑrt sun/' },
  { en: 'She arrived early.', id: 'Dia datang lebih awal.', ipa: '/ʃi əˈraɪvd ˈɝli/' },
  { en: 'Do not be late for class.', id: 'Jangan terlambat untuk kelas.', ipa: '/du nɑt bi leɪt fər klæs/' },
  { en: 'He is always on time.', id: 'Dia selalu tepat waktu.', ipa: '/hi ɪz ˈɔlweɪz ɑn taɪm/' },
  { en: 'This is my first class today.', id: 'Ini kelas pertama saya hari ini.', ipa: '/ðɪs ɪz maɪ fɝst klæs təˈdeɪ/' },
  { en: 'The last bus leaves at nine.', id: 'Bus terakhir berangkat jam sembilan.', ipa: '/ðə læst bʌs livz æt naɪn/' },
  { en: 'Our next meeting is Monday.', id: 'Rapat berikutnya hari Senin.', ipa: '/aʊɚ nɛkst ˈmitɪŋ ɪz ˈmʌndeɪ/' },
  { en: 'Check the previous schedule.', id: 'Cek jadwal sebelumnya.', ipa: '/tʃɛk ðə ˈpriviəs ˈskɛdʒuːl/' },
  { en: 'I go to the office on Monday.', id: 'Saya ke kantor hari Senin.', ipa: '/aɪ ɡoʊ tə ði ˈɔfɪs ɑn ˈmʌndeɪ/' },
  { en: 'She has class on Tuesday.', id: 'Dia ada kelas hari Selasa.', ipa: '/ʃi hæz klæs ɑn ˈtuzdeɪ/' },
  { en: 'We have a quiz on Wednesday.', id: 'Kami ada kuis hari Rabu.', ipa: '/wi hæv ə kwɪz ɑn ˈwɛnzdeɪ/' },
  { en: 'My appointment is on Thursday.', id: 'Janji saya hari Kamis.', ipa: '/maɪ əˈpɔɪntmənt ɪz ɑn ˈθɝzdeɪ/' },
  { en: 'We play football on Friday.', id: 'Kami main sepak bola hari Jumat.', ipa: '/wi pleɪ ˈfʊtˌbɔl ɑn ˈfraɪdeɪ/' },
  { en: 'I clean my room on Saturday.', id: 'Saya bersihkan kamar hari Sabtu.', ipa: '/aɪ klin maɪ rum ɑn ˈsætɚdeɪ/' },
  { en: 'Sunday is my rest day.', id: 'Minggu adalah hari istirahat saya.', ipa: '/ˈsʌndeɪ ɪz maɪ rɛst deɪ/' },
  { en: 'My birthday is in January.', id: 'Ulang tahun saya di bulan Januari.', ipa: '/maɪ ˈbɝθdeɪ ɪz ɪn ˈdʒænjəˌwɛri/' },
  { en: 'The event is in February.', id: 'Acaranya di bulan Februari.', ipa: '/ði ɪˈvɛnt ɪz ɪn ˈfɛbruˌɛri/' },
  { en: 'School starts in March.', id: 'Sekolah mulai di bulan Maret.', ipa: '/skul stɑrts ɪn mɑrtʃ/' },
  { en: 'It rains a lot in April.', id: 'Bulan April sering hujan.', ipa: '/ɪt reɪnz ə lɑt ɪn ˈeɪprəl/' },
  { en: 'We travel in May.', id: 'Kami bepergian di bulan Mei.', ipa: '/wi ˈtrævəl ɪn meɪ/' },
  { en: 'My exam is in June.', id: 'Ujian saya di bulan Juni.', ipa: '/maɪ ɪɡˈzæm ɪz ɪn dʒun/' },
  { en: 'They move house in July.', id: 'Mereka pindah rumah di bulan Juli.', ipa: '/ðeɪ muv haʊs ɪn dʒuˈlaɪ/' },
  { en: 'We have a holiday in August.', id: 'Kami libur di bulan Agustus.', ipa: '/wi hæv ə ˈhɑləˌdeɪ ɪn ˈɔɡəst/' },
  { en: 'The semester begins in September.', id: 'Semester dimulai di bulan September.', ipa: '/ðə səˈmɛstɚ bɪˈɡɪnz ɪn sɛpˈtɛmbɚ/' },
  { en: 'It is cooler in October.', id: 'Bulan Oktober cuacanya lebih sejuk.', ipa: '/ɪt ɪz ˈkulɚ ɪn ɑkˈtoʊbɚ/' },
  { en: 'My sister got married in November.', id: 'Kakak perempuan saya menikah di bulan November.', ipa: '/maɪ ˈsɪstɚ ɡɑt ˈmærid ɪn noʊˈvɛmbɚ/' },
  { en: 'We visit family in December.', id: 'Kami mengunjungi keluarga di bulan Desember.', ipa: '/wi ˈvɪzɪt ˈfæməli ɪn dɪˈsɛmbɚ/' },
  { en: 'Flowers bloom in spring.', id: 'Bunga-bunga bermekaran di musim semi.', ipa: '/ˈflaʊɚz blum ɪn sprɪŋ/' },
  { en: 'It is hot in summer.', id: 'Musim panas itu panas.', ipa: '/ɪt ɪz hɑt ɪn ˈsʌmɚ/' },
  { en: 'Leaves fall in autumn.', id: 'Daun-daun berguguran di musim gugur.', ipa: '/livz fɔl ɪn ˈɔtəm/' },
  { en: 'It snows in winter.', id: 'Di musim dingin turun salju.', ipa: '/ɪt snoʊz ɪn ˈwɪntɚ/' },
  { en: 'That building is one century old.', id: 'Gedung itu sudah berusia satu abad.', ipa: '/ðæt ˈbɪldɪŋ ɪz wʌn ˈsɛntʃəri oʊld/' },
  { en: 'A decade is ten years.', id: 'Satu dekade itu sepuluh tahun.', ipa: '/ə ˈdɛkeɪd ɪz tɛn jɪrz/' },
  { en: 'Her birthday is next week.', id: 'Ulang tahunnya minggu depan.', ipa: '/hɝ ˈbɝθdeɪ ɪz nɛkst wik/' },
  { en: 'Tomorrow is a holiday.', id: 'Besok hari libur.', ipa: '/təˈmɑroʊ ɪz ə ˈhɑləˌdeɪ/' },
  { en: 'We are on vacation this month.', id: 'Kami sedang liburan bulan ini.', ipa: '/wi ɑr ɑn veɪˈkeɪʃən ðɪs mʌnθ/' },
  { en: 'Please check your schedule.', id: 'Tolong cek jadwalmu.', ipa: '/pliz tʃɛk jʊr ˈskɛdʒuːl/' },
  { en: 'I have a doctor appointment at ten.', id: 'Saya ada janji dengan dokter jam sepuluh.', ipa: '/aɪ hæv ə ˈdɑktɚ əˈpɔɪntmənt æt tɛn/' },
  { en: 'Our meeting starts at two.', id: 'Rapat kami mulai jam dua.', ipa: '/aʊɚ ˈmitɪŋ stɑrts æt tu/' },
  { en: 'The deadline is Friday.', id: 'Batas waktunya hari Jumat.', ipa: '/ðə ˈdɛdˌlaɪn ɪz ˈfraɪdeɪ/' },
  { en: 'It is break time now.', id: 'Sekarang waktunya istirahat.', ipa: '/ɪt ɪz breɪk taɪm naʊ/' },
  { en: 'Lunchtime is at twelve-thirty.', id: 'Waktu makan siang itu jam dua belas lewat tiga puluh.', ipa: '/ˈlʌntʃˌtaɪm ɪz æt twɛlv ˈθɝti/' },
  { en: 'My bedtime is ten o clock.', id: 'Waktu tidur saya jam sepuluh tepat.', ipa: '/maɪ ˈbɛdˌtaɪm ɪz tɛn ə klɑk/' },
  { en: 'My wake-up time is five-thirty.', id: 'Saya bangun jam lima lewat tiga puluh.', ipa: '/maɪ weɪk ʌp taɪm ɪz faɪv ˈθɝti/' },
  { en: 'The class starts at eight o clock.', id: 'Kelas mulai jam delapan tepat.', ipa: '/ðə klæs stɑrts æt eɪt ə klɑk/' },
  { en: 'It is half past seven.', id: 'Sekarang jam setengah delapan.', ipa: '/ɪt ɪz hæf pæst ˈsɛvən/' },
  { en: 'The time is quarter past nine.', id: 'Sekarang jam sembilan lewat seperempat.', ipa: '/ðə taɪm ɪz ˈkwɔrtɚ pæst naɪn/' },
  { en: 'It is quarter to six.', id: 'Sekarang jam enam kurang seperempat.', ipa: '/ɪt ɪz ˈkwɔrtɚ tə sɪks/' },
  { en: 'My class starts at 8 a.m.', id: 'Kelas saya mulai jam 8 pagi.', ipa: '/maɪ klæs stɑrts æt eɪt eɪ ɛm/' },
  { en: 'The movie starts at 7 p.m.', id: 'Filmnya mulai jam 7 malam.', ipa: '/ðə ˈmuvi stɑrts æt ˈsɛvən pi ɛm/' },
  { en: 'I read daily.', id: 'Saya membaca setiap hari.', ipa: '/aɪ rid ˈdeɪli/' },
  { en: 'We have a weekly meeting.', id: 'Kami ada rapat mingguan.', ipa: '/wi hæv ə ˈwikli ˈmitɪŋ/' },
  { en: 'She writes a monthly report.', id: 'Dia menulis laporan bulanan.', ipa: '/ʃi raɪts ə ˈmʌnθli rɪˈpɔrt/' },
  { en: 'We do a yearly check-up.', id: 'Kami melakukan cek tahunan.', ipa: '/wi du ə ˈjɪrli ˈtʃɛk ʌp/' },
  { en: 'I practice speaking every day.', id: 'Saya latihan speaking setiap hari.', ipa: '/aɪ ˈpræktɪs ˈspikɪŋ ˈɛvri deɪ/' },
  { en: 'He visits his parents every week.', id: 'Dia mengunjungi orang tuanya setiap minggu.', ipa: '/hi ˈvɪzɪts hɪz ˈpɛrənts ˈɛvri wik/' },
  { en: 'We pay rent every month.', id: 'Kami bayar sewa setiap bulan.', ipa: '/wi peɪ rɛnt ˈɛvri mʌnθ/' },
  { en: 'They travel every year.', id: 'Mereka bepergian setiap tahun.', ipa: '/ðeɪ ˈtrævəl ˈɛvri jɪr/' },
  { en: 'I go jogging once a week.', id: 'Saya jogging seminggu sekali.', ipa: '/aɪ ɡoʊ ˈdʒɑɡɪŋ wʌns ə wik/' },
  { en: 'She calls her mother twice a day.', id: 'Dia menelepon ibunya dua kali sehari.', ipa: '/ʃi kɔlz hɝ ˈmʌðɚ twaɪs ə deɪ/' },
  { en: 'He checks email three times a day.', id: 'Dia cek email tiga kali sehari.', ipa: '/hi tʃɛks ˈimeɪl θri taɪmz ə deɪ/' },
  { en: 'She is always on time.', id: 'Dia selalu tepat waktu.', ipa: '/ʃi ɪz ˈɔlweɪz ɑn taɪm/' },
  { en: 'I usually wake up at five.', id: 'Saya biasanya bangun jam lima.', ipa: '/aɪ ˈjuʒuəli weɪk ʌp æt faɪv/' },
  { en: 'We often meet after class.', id: 'Kami sering bertemu setelah kelas.', ipa: '/wi ˈɔfən mit ˈæftɚ klæs/' },
  { en: 'I sometimes study at night.', id: 'Saya kadang belajar pada malam hari.', ipa: '/aɪ ˈsʌmˌtaɪmz ˈstʌdi æt naɪt/' },
  { en: 'He rarely comes late.', id: 'Dia jarang datang terlambat.', ipa: '/hi ˈrɛrli kʌmz leɪt/' },
  { en: 'I never miss class.', id: 'Saya tidak pernah bolos kelas.', ipa: '/aɪ ˈnɛvɚ mɪs klæs/' },
  { en: 'Finish your homework before dinner.', id: 'Selesaikan PR-mu sebelum makan malam.', ipa: '/ˈfɪnɪʃ jʊr ˈhoʊmˌwɝk bɪˈfɔr ˈdɪnɚ/' },
  { en: 'We talk after class.', id: 'Kami ngobrol setelah kelas.', ipa: '/wi tɔk ˈæftɚ klæs/' },
  { en: 'The meeting is between two and three.', id: 'Rapatnya antara jam dua sampai jam tiga.', ipa: '/ðə ˈmitɪŋ ɪz bɪˈtwin tu ənd θri/' },
  { en: 'I work from nine to five.', id: 'Saya kerja dari jam sembilan sampai jam lima.', ipa: '/aɪ wɝk frʌm naɪn tə faɪv/' },
  { en: 'I will wait until noon.', id: 'Saya akan menunggu sampai tengah hari.', ipa: '/aɪ wɪl weɪt ənˈtɪl nun/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(TIME_DATE_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing TIME_DATE_ROWS mappings for: ${missingRows.join(' | ')}`);
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
    const value = valueFactory(rowMap.get(example));
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
console.log(`Updated Time & Date topic: ${examples.length} translations + IPA`);
