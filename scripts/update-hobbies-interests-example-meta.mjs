import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/hobbies-interests.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const HOBBIES_INTERESTS_ROWS = [
  { en: 'Reading is my hobby.', id: 'Membaca adalah hobi saya.', ipa: '/ˈridɪŋ ɪz maɪ ˈhɑbi/' },
  { en: 'Music is my main interest.', id: 'Musik adalah minat utama saya.', ipa: '/ˈmjuzɪk ɪz maɪ meɪn ˈɪntrəst/' },
  { en: 'I exercise in my free time.', id: 'Saya berolahraga di waktu luang.', ipa: '/aɪ ˈɛksərˌsaɪz ɪn maɪ fri taɪm/' },
  { en: 'What do you do in your spare time?', id: 'Apa yang kamu lakukan di waktu senggang?', ipa: '/wʌt du ju du ɪn jʊr spɛr taɪm/' },
  { en: 'This activity is fun.', id: 'Aktivitas ini menyenangkan.', ipa: '/ðɪs ækˈtɪvəti ɪz fʌn/' },
  { en: 'I relax by listening to music.', id: 'Saya santai dengan mendengarkan musik.', ipa: '/aɪ rɪˈlæks baɪ ˈlɪsənɪŋ tə ˈmjuzɪk/' },
  { en: 'I enjoy cooking at home.', id: 'Saya suka memasak di rumah.', ipa: '/aɪ ɪnˈdʒɔɪ ˈkʊkɪŋ æt hoʊm/' },
  { en: 'I practice guitar every day.', id: 'Saya latihan gitar setiap hari.', ipa: '/aɪ ˈpræktɪs ɡɪˈtɑr ˈɛvri deɪ/' },
  { en: 'She collects old coins.', id: 'Dia mengoleksi koin lama.', ipa: '/ʃi kəˈlɛkts oʊld kɔɪnz/' },
  { en: 'His stamp collection is large.', id: 'Koleksi perangkonya banyak.', ipa: '/hɪz stæmp kəˈlɛkʃən ɪz lɑrdʒ/' },
  { en: 'I read before bed.', id: 'Saya membaca sebelum tidur.', ipa: '/aɪ rid bɪˈfɔr bɛd/' },
  { en: 'This book is interesting.', id: 'Buku ini menarik.', ipa: '/ðɪs bʊk ɪz ˈɪntrəstɪŋ/' },
  { en: 'She is reading a new novel.', id: 'Dia sedang membaca novel baru.', ipa: '/ʃi ɪz ˈridɪŋ ə nu ˈnɑvəl/' },
  { en: 'I write short stories.', id: 'Saya menulis cerita pendek.', ipa: '/aɪ raɪt ʃɔrt ˈstɔriz/' },
  { en: 'He can draw very well.', id: 'Dia bisa menggambar dengan sangat baik.', ipa: '/hi kæn drɔ ˈvɛri wɛl/' },
  { en: 'She likes to paint flowers.', id: 'Dia suka melukis bunga.', ipa: '/ʃi laɪks tə peɪnt ˈflaʊərz/' },
  { en: 'I made a quick sketch.', id: 'Saya membuat sketsa cepat.', ipa: '/aɪ meɪd ə kwɪk skɛtʃ/' },
  { en: 'Coloring helps me relax.', id: 'Mewarnai membantu saya rileks.', ipa: '/ˈkʌlərɪŋ hɛlps mi rɪˈlæks/' },
  { en: 'Music makes me happy.', id: 'Musik membuat saya senang.', ipa: '/ˈmjuzɪk meɪks mi ˈhæpi/' },
  { en: 'This song is my favorite.', id: 'Lagu ini favorit saya.', ipa: '/ðɪs sɔŋ ɪz maɪ ˈfeɪvərɪt/' },
  { en: 'I sing in the shower.', id: 'Saya bernyanyi saat mandi.', ipa: '/aɪ sɪŋ ɪn ðə ˈʃaʊər/' },
  { en: 'They dance every weekend.', id: 'Mereka menari setiap akhir pekan.', ipa: '/ðeɪ dæns ˈɛvri ˌwikˈɛnd/' },
  { en: 'He plays the guitar.', id: 'Dia bermain gitar.', ipa: '/hi pleɪz ðə ɡɪˈtɑr/' },
  { en: 'She practices piano at night.', id: 'Dia latihan piano pada malam hari.', ipa: '/ʃi ˈpræktɪsɪz piˈænoʊ æt naɪt/' },
  { en: 'My brother plays the drum.', id: 'Saudara saya bermain drum.', ipa: '/maɪ ˈbrʌðər pleɪz ðə drʌm/' },
  { en: 'I watch movies on Sunday.', id: 'Saya menonton film pada hari Minggu.', ipa: '/aɪ wɑtʃ ˈmuviz ɑn ˈsʌndeɪ/' },
  { en: 'We watched a comedy movie.', id: 'Kami menonton film komedi.', ipa: '/wi wɑtʃt ə ˈkɑmədi ˈmuvi/' },
  { en: 'She follows one TV series.', id: 'Dia mengikuti satu serial TV.', ipa: '/ʃi ˈfɑloʊz wʌn ˌtiˈvi ˈsɪriz/' },
  { en: 'I took a photo of the park.', id: 'Saya mengambil foto taman.', ipa: '/aɪ tʊk ə ˈfoʊtoʊ əv ðə pɑrk/' },
  { en: 'Photography is his hobby.', id: 'Fotografi adalah hobinya.', ipa: '/fəˈtɑɡrəfi ɪz hɪz ˈhɑbi/' },
  { en: 'I travel with my family.', id: 'Saya bepergian bersama keluarga.', ipa: '/aɪ ˈtrævəl wɪð maɪ ˈfæməli/' },
  { en: 'Our trip was exciting.', id: 'Perjalanan kami seru.', ipa: '/aʊər trɪp wəz ɪkˈsaɪtɪŋ/' },
  { en: 'We go hiking once a month.', id: 'Kami mendaki sekali sebulan.', ipa: '/wi ɡoʊ ˈhaɪkɪŋ wʌns ə mʌnθ/' },
  { en: 'Camping is fun in the dry season.', id: 'Berkemah menyenangkan saat musim kemarau.', ipa: '/ˈkæmpɪŋ ɪz fʌn ɪn ðə draɪ ˈsizən/' },
  { en: 'I swim every Saturday.', id: 'Saya berenang setiap Sabtu.', ipa: '/aɪ swɪm ˈɛvri ˈsætərdeɪ/' },
  { en: 'He runs in the morning.', id: 'Dia berlari di pagi hari.', ipa: '/hi rʌnz ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'She jogs in the park.', id: 'Dia jogging di taman.', ipa: '/ʃi dʒɑɡz ɪn ðə pɑrk/' },
  { en: 'They cycle around the neighborhood.', id: 'Mereka bersepeda keliling lingkungan.', ipa: '/ðeɪ ˈsaɪkəl əˈraʊnd ðə ˈneɪbərˌhʊd/' },
  { en: 'We play football after school.', id: 'Kami bermain sepak bola sepulang sekolah.', ipa: '/wi pleɪ ˈfʊtbɔl ˈæftər skul/' },
  { en: 'My father plays badminton.', id: 'Ayah saya bermain bulu tangkis.', ipa: '/maɪ ˈfɑðər pleɪz ˈbædˌmɪntən/' },
  { en: 'He likes basketball.', id: 'Dia suka bola basket.', ipa: '/hi laɪks ˈbæskɪtˌbɔl/' },
  { en: 'My uncle teaches me chess.', id: 'Paman saya mengajari saya catur.', ipa: '/maɪ ˈʌŋkəl ˈtitʃəz mi tʃɛs/' },
  { en: 'This game is challenging.', id: 'Permainan ini menantang.', ipa: '/ðɪs ɡeɪm ɪz ˈtʃælɪndʒɪŋ/' },
  { en: 'He plays video games at night.', id: 'Dia bermain video game pada malam hari.', ipa: '/hi pleɪz ˈvɪdioʊ ɡeɪmz æt naɪt/' },
  { en: 'I cook with my mother.', id: 'Saya memasak bersama ibu saya.', ipa: '/aɪ kʊk wɪð maɪ ˈmʌðər/' },
  { en: 'She bakes cookies on weekends.', id: 'Dia membuat kue kering saat akhir pekan.', ipa: '/ʃi beɪks ˈkʊkiz ɑn ˌwikˈɛndz/' },
  { en: 'My grandmother loves to garden.', id: 'Nenek saya suka berkebun.', ipa: '/maɪ ˈɡrænˌmʌðər lʌvz tə ˈɡɑrdən/' },
  { en: 'Fishing is his weekend hobby.', id: 'Memancing adalah hobi akhir pekannya.', ipa: '/ˈfɪʃɪŋ ɪz hɪz ˌwikˈɛnd ˈhɑbi/' },
  { en: 'She makes paper craft.', id: 'Dia membuat kerajinan dari kertas.', ipa: '/ʃi meɪks ˈpeɪpər kræft/' },
  { en: 'I want to join a music club.', id: 'Saya ingin bergabung dengan klub musik.', ipa: '/aɪ wɑnt tə dʒɔɪn ə ˈmjuzɪk klʌb/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(HOBBIES_INTERESTS_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing HOBBIES_INTERESTS_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Hobbies & Interests topic: ${examples.length} translations + IPA`);
