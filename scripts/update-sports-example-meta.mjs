import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/sports.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const SPORTS_ROWS = [
  { en: 'My favorite sport is badminton.', id: 'Olahraga favorit saya adalah bulu tangkis.', ipa: '/maɪ ˈfeɪvərɪt spɔrt ɪz ˈbædmɪntən/' },
  { en: 'I exercise every morning.', id: 'Saya berolahraga setiap pagi.', ipa: '/aɪ ˈɛksərˌsaɪz ˈɛvri ˈmɔrnɪŋ/' },
  { en: 'We do a short workout before class.', id: 'Kami melakukan latihan fisik singkat sebelum kelas.', ipa: '/wi du ə ʃɔrt ˈwɝkaʊt bɪˈfɔr klæs/' },
  { en: 'The team has training tonight.', id: 'Tim kami latihan malam ini.', ipa: '/ðə tim hæz ˈtreɪnɪŋ təˈnaɪt/' },
  { en: 'Our coach is very strict.', id: 'Pelatih kami sangat tegas.', ipa: '/aʊər koʊtʃ ɪz ˈvɛri strɪkt/' },
  { en: 'She is a good player.', id: 'Dia pemain yang bagus.', ipa: '/ʃi ɪz ə ɡʊd ˈpleɪər/' },
  { en: 'Our team won yesterday.', id: 'Tim kami menang kemarin.', ipa: '/aʊər tim wʌn ˈjɛstərdeɪ/' },
  { en: 'The captain gives clear instructions.', id: 'Kapten memberi instruksi yang jelas.', ipa: '/ðə ˈkæptɪn ɡɪvz klɪr ɪnˈstrʌkʃənz/' },
  { en: 'Their opponent is very strong.', id: 'Lawan mereka sangat kuat.', ipa: '/ðɛr əˈpoʊnənt ɪz ˈvɛri strɔŋ/' },
  { en: 'The referee blew the whistle.', id: 'Wasit meniup peluit.', ipa: '/ðə ˌrɛfəˈri blu ðə ˈwɪsəl/' },
  { en: 'The match starts at three.', id: 'Pertandingan mulai jam tiga.', ipa: '/ðə mætʃ stɑrts æt θri/' },
  { en: 'We watched the whole game.', id: 'Kami menonton seluruh pertandingan.', ipa: '/wi wɑtʃt ðə hoʊl ɡeɪm/' },
  { en: 'He joined a school competition.', id: 'Dia ikut kompetisi sekolah.', ipa: '/hi dʒɔɪnd ə skul ˌkɑmpəˈtɪʃən/' },
  { en: 'Our city hosts a tournament.', id: 'Kota kami mengadakan turnamen.', ipa: '/aʊər ˈsɪti hoʊsts ə ˈtʊrnəmənt/' },
  { en: 'The final score was two-one.', id: 'Skor akhirnya dua-satu.', ipa: '/ðə ˈfaɪnəl skɔr wəz tu wʌn/' },
  { en: 'He scored a goal in the last minute.', id: 'Dia mencetak gol di menit terakhir.', ipa: '/hi skɔrd ə ɡoʊl ɪn ðə læst ˈmɪnɪt/' },
  { en: 'We need one more point.', id: 'Kami butuh satu poin lagi.', ipa: '/wi nid wʌn mɔr pɔɪnt/' },
  { en: 'I hope we win today.', id: 'Saya harap kami menang hari ini.', ipa: '/aɪ hoʊp wi wɪn təˈdeɪ/' },
  { en: 'They did not want to lose.', id: 'Mereka tidak mau kalah.', ipa: '/ðeɪ dɪd nɑt wɑnt tə luz/' },
  { en: 'The game ended in a draw.', id: 'Pertandingannya berakhir seri.', ipa: '/ðə ɡeɪm ˈɛndɪd ɪn ə drɔ/' },
  { en: 'My brother plays football.', id: 'Saudara laki-laki saya bermain sepak bola.', ipa: '/maɪ ˈbrʌðər pleɪz ˈfʊtbɔl/' },
  { en: 'We play futsal on Friday night.', id: 'Kami bermain futsal pada Jumat malam.', ipa: '/wi pleɪ ˈfʊtsɑl ɑn ˈfraɪdeɪ naɪt/' },
  { en: 'She is on the basketball team.', id: 'Dia masuk tim basket.', ipa: '/ʃi ɪz ɑn ðə ˈbæskɪtbɔl tim/' },
  { en: 'They practice volleyball at school.', id: 'Mereka latihan bola voli di sekolah.', ipa: '/ðeɪ ˈpræktɪs ˈvɑlibɔl æt skul/' },
  { en: 'I play badminton with my dad.', id: 'Saya bermain bulu tangkis dengan ayah.', ipa: '/aɪ pleɪ ˈbædmɪntən wɪð maɪ dæd/' },
  { en: 'He wants to learn tennis.', id: 'Dia ingin belajar tenis.', ipa: '/hi wɑnts tə lɝn ˈtɛnɪs/' },
  { en: 'We play table tennis after class.', id: 'Kami bermain tenis meja setelah kelas.', ipa: '/wi pleɪ ˈteɪbəl ˈtɛnɪs ˈæftər klæs/' },
  { en: 'Swimming keeps your body healthy.', id: 'Renang membuat tubuh tetap sehat.', ipa: '/ˈswɪmɪŋ kips jʊr ˈbɑdi ˈhɛlθi/' },
  { en: 'Running is my morning routine.', id: 'Lari adalah rutinitas pagi saya.', ipa: '/ˈrʌnɪŋ ɪz maɪ ˈmɔrnɪŋ ruˈtin/' },
  { en: 'They go jogging every Sunday.', id: 'Mereka jogging setiap hari Minggu.', ipa: '/ðeɪ ɡoʊ ˈdʒɑɡɪŋ ˈɛvri ˈsʌndeɪ/' },
  { en: 'Cycling is fun in the morning.', id: 'Bersepeda itu menyenangkan di pagi hari.', ipa: '/ˈsaɪklɪŋ ɪz fʌn ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'My sister likes gymnastics.', id: 'Saudari saya suka senam.', ipa: '/maɪ ˈsɪstər laɪks dʒɪmˈnæstɪks/' },
  { en: 'She does yoga before work.', id: 'Dia melakukan yoga sebelum kerja.', ipa: '/ʃi dʌz ˈjoʊɡə bɪˈfɔr wɝk/' },
  { en: 'He is learning martial arts.', id: 'Dia sedang belajar seni bela diri.', ipa: '/hi ɪz ˈlɝnɪŋ ˈmɑrʃəl ɑrts/' },
  { en: 'Boxing needs strong stamina.', id: 'Tinju butuh stamina yang kuat.', ipa: '/ˈbɑksɪŋ nidz strɔŋ ˈstæmənə/' },
  { en: 'They watch baseball on TV.', id: 'Mereka menonton bisbol di TV.', ipa: '/ðeɪ wɑtʃ ˈbeɪsbɔl ɑn ˌtiˈvi/' },
  { en: 'Our school has a softball team.', id: 'Sekolah kami punya tim sofbol.', ipa: '/aʊər skul hæz ə ˈsɔftbɔl tim/' },
  { en: 'He joined the athletics club.', id: 'Dia bergabung dengan klub atletik.', ipa: '/hi dʒɔɪnd ði æθˈlɛtɪks klʌb/' },
  { en: 'The players are on the field.', id: 'Para pemain ada di lapangan.', ipa: '/ðə ˈpleɪərz ɑr ɑn ðə fild/' },
  { en: 'The tennis court is full.', id: 'Lapangan tenisnya penuh.', ipa: '/ðə ˈtɛnɪs kɔrt ɪz fʊl/' },
  { en: 'The stadium is very big.', id: 'Stadionnya sangat besar.', ipa: '/ðə ˈsteɪdiəm ɪz ˈvɛri bɪɡ/' },
  { en: 'I go to the gym three times a week.', id: 'Saya pergi ke gym tiga kali seminggu.', ipa: '/aɪ ɡoʊ tə ðə dʒɪm θri taɪmz ə wik/' },
  { en: 'Their team uniform is blue.', id: 'Seragam tim mereka berwarna biru.', ipa: '/ðɛr tim ˈjunəˌfɔrm ɪz blu/' },
  { en: 'He wears jersey number ten.', id: 'Dia memakai jersey nomor sepuluh.', ipa: '/hi wɛrz ˈdʒɝzi ˈnʌmbər tɛn/' },
  { en: 'These shoes are good for running.', id: 'Sepatu ini bagus untuk lari.', ipa: '/ðiz ʃuz ɑr ɡʊd fɔr ˈrʌnɪŋ/' },
  { en: 'Pass the ball to me.', id: 'Oper bolanya ke saya.', ipa: '/pæs ðə bɔl tə mi/' },
  { en: 'My racket is new.', id: 'Raket saya baru.', ipa: '/maɪ ˈrækɪt ɪz nu/' },
  { en: 'The coach uses a whistle.', id: 'Pelatih menggunakan peluit.', ipa: '/ðə koʊtʃ ˈjuzɪz ə ˈwɪsəl/' },
  { en: 'Always warm up before training.', id: 'Selalu pemanasan sebelum latihan.', ipa: '/ˈɔlweɪz wɔrm ʌp bɪˈfɔr ˈtreɪnɪŋ/' },
  { en: 'Do a cool down after exercise.', id: 'Lakukan pendinginan setelah olahraga.', ipa: '/du ə kul daʊn ˈæftər ˈɛksərsaɪz/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(SPORTS_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing SPORTS_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Sports topic: ${examples.length} translations + IPA`);
