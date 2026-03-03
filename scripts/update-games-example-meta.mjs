import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/games.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const GAMES_ROWS = [
  { en: 'This game is very fun.', id: 'Permainan ini seru sekali.', ipa: '/ðɪs ɡeɪm ɪz ˈvɛri fʌn/' },
  { en: 'Each player has a role.', id: 'Setiap pemain punya peran.', ipa: '/itʃ ˈpleɪər hæz ə roʊl/' },
  { en: 'Our team is ready.', id: 'Tim kami siap.', ipa: '/aʊər tim ɪz ˈrɛdi/' },
  { en: 'Their opponent is strong.', id: 'Lawan mereka kuat.', ipa: '/ðɛr əˈpoʊnənt ɪz strɔŋ/' },
  { en: 'The match starts now.', id: 'Pertandingan dimulai sekarang.', ipa: '/ðə mætʃ stɑrts naʊ/' },
  { en: 'We won the first round.', id: 'Kami menang di ronde pertama.', ipa: '/wi wʌn ðə fɝst raʊnd/' },
  { en: 'It is your turn.', id: 'Sekarang giliranmu.', ipa: '/ɪt ɪz jʊr tɝn/' },
  { en: 'Please follow the rules.', id: 'Tolong ikuti aturannya.', ipa: '/pliz ˈfɑloʊ ðə rulz/' },
  { en: 'Our goal is to win.', id: 'Tujuan kami adalah menang.', ipa: '/aʊər ɡoʊl ɪz tə wɪn/' },
  { en: 'This mission is hard.', id: 'Misi ini sulit.', ipa: '/ðɪs ˈmɪʃən ɪz hɑrd/' },
  { en: 'We finished the quest.', id: 'Kami menyelesaikan quest-nya.', ipa: '/wi ˈfɪnɪʃt ðə kwɛst/' },
  { en: 'I reached level ten.', id: 'Saya sudah sampai level sepuluh.', ipa: '/aɪ ritʃt ˈlɛvəl tɛn/' },
  { en: 'The next stage is difficult.', id: 'Tahap berikutnya sulit.', ipa: '/ðə nɛkst steɪdʒ ɪz ˈdɪfɪkəlt/' },
  { en: 'My score is higher today.', id: 'Skor saya lebih tinggi hari ini.', ipa: '/maɪ skɔr ɪz ˈhaɪər təˈdeɪ/' },
  { en: 'We need two more points.', id: 'Kami butuh dua poin lagi.', ipa: '/wi nid tu mɔr pɔɪnts/' },
  { en: 'His rank is now silver.', id: 'Peringkatnya sekarang silver.', ipa: '/hɪz ræŋk ɪz naʊ ˈsɪlvər/' },
  { en: 'I want to win this game.', id: 'Saya ingin menang di game ini.', ipa: '/aɪ wɑnt tə wɪn ðɪs ɡeɪm/' },
  { en: 'We do not want to lose.', id: 'Kami tidak mau kalah.', ipa: '/wi du nɑt wɑnt tə luz/' },
  { en: 'The game ended in a draw.', id: 'Game-nya berakhir seri.', ipa: '/ðə ɡeɪm ˈɛndɪd ɪn ə drɔ/' },
  { en: 'Victory feels amazing.', id: 'Kemenangan rasanya luar biasa.', ipa: '/ˈvɪktəri filz əˈmeɪzɪŋ/' },
  { en: 'We accepted the defeat.', id: 'Kami menerima kekalahan itu.', ipa: '/wi əkˈsɛptɪd ðə dɪˈfit/' },
  { en: 'This challenge is fun.', id: 'Tantangan ini seru.', ipa: '/ðɪs ˈtʃælɪndʒ ɪz fʌn/' },
  { en: 'Our strategy worked well.', id: 'Strategi kami berhasil dengan baik.', ipa: '/aʊər ˈstrætədʒi wɝkt wɛl/' },
  { en: 'Let us make a plan.', id: 'Ayo kita buat rencana.', ipa: '/lɛt ʌs meɪk ə plæn/' },
  { en: 'She has great game skills.', id: 'Dia punya skill game yang bagus.', ipa: '/ʃi hæz ɡreɪt ɡeɪm skɪlz/' },
  { en: 'Practice makes us better.', id: 'Latihan membuat kami lebih baik.', ipa: '/ˈpræktɪs meɪks ʌs ˈbɛtər/' },
  { en: 'My controller is new.', id: 'Controller saya baru.', ipa: '/maɪ kənˈtroʊlər ɪz nu/' },
  { en: 'He plays with a keyboard.', id: 'Dia bermain pakai keyboard.', ipa: '/hi pleɪz wɪð ə ˈkibɔrd/' },
  { en: 'The mouse is too slow.', id: 'Mouse-nya terlalu lambat.', ipa: '/ðə maʊs ɪz tu sloʊ/' },
  { en: 'The screen is very bright.', id: 'Layarnya sangat terang.', ipa: '/ðə skriːn ɪz ˈvɛri braɪt/' },
  { en: 'I changed my avatar.', id: 'Saya mengganti avatar saya.', ipa: '/aɪ tʃeɪndʒd maɪ ˈævətɑr/' },
  { en: 'This character is strong.', id: 'Karakter ini kuat.', ipa: '/ðɪs ˈkærəktər ɪz strɔŋ/' },
  { en: 'My hero has high speed.', id: 'Hero saya punya kecepatan tinggi.', ipa: '/maɪ ˈhɪroʊ hæz haɪ spid/' },
  { en: 'The enemy is near us.', id: 'Musuhnya dekat dengan kami.', ipa: '/ði ˈɛnəmi ɪz nɪr ʌs/' },
  { en: 'I found a rare item.', id: 'Saya menemukan item langka.', ipa: '/aɪ faʊnd ə rɛr ˈaɪtəm/' },
  { en: 'This weapon is powerful.', id: 'Senjata ini sangat kuat.', ipa: '/ðɪs ˈwɛpən ɪz ˈpaʊərfəl/' },
  { en: 'My armor is broken.', id: 'Armor saya rusak.', ipa: '/maɪ ˈɑrmər ɪz ˈbroʊkən/' },
  { en: 'My health is low.', id: 'Darah saya sudah rendah.', ipa: '/maɪ hɛlθ ɪz loʊ/' },
  { en: 'I need more energy.', id: 'Saya butuh lebih banyak energi.', ipa: '/aɪ nid mɔr ˈɛnərdʒi/' },
  { en: 'Grab that power-up.', id: 'Ambil power-up itu.', ipa: '/ɡræb ðæt ˈpaʊər ʌp/' },
  { en: 'This map is very large.', id: 'Map ini sangat luas.', ipa: '/ðɪs mæp ɪz ˈvɛri lɑrdʒ/' },
  { en: 'Stay inside the safe zone.', id: 'Tetap di dalam zona aman.', ipa: '/steɪ ɪnˈsaɪd ðə seɪf zoʊn/' },
  { en: 'Run to the safe zone.', id: 'Lari ke zona aman.', ipa: '/rʌn tə ðə seɪf zoʊn/' },
  { en: 'The server is full.', id: 'Server-nya penuh.', ipa: '/ðə ˈsɝvər ɪz fʊl/' },
  { en: 'My ping is stable now.', id: 'Ping saya stabil sekarang.', ipa: '/maɪ pɪŋ ɪz ˈsteɪbəl naʊ/' },
  { en: 'I cannot move because of lag.', id: 'Saya tidak bisa gerak karena lag.', ipa: '/aɪ ˈkænɑt muv bɪˈkɔz əv læɡ/' },
  { en: 'My friends are online now.', id: 'Teman-teman saya sedang online.', ipa: '/maɪ frɛndz ɑr ˈɑnlaɪn naʊ/' },
  { en: 'I play offline at home.', id: 'Saya bermain offline di rumah.', ipa: '/aɪ pleɪ ˌɔfˈlaɪn æt hoʊm/' },
  { en: 'My teammate helped me.', id: 'Rekan satu tim saya membantu saya.', ipa: '/maɪ ˈtimˌmeɪt hɛlpt mi/' },
  { en: 'Let us do a rematch.', id: 'Ayo kita tanding ulang.', ipa: '/lɛt ʌs du ə ˈriˌmætʃ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(GAMES_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing GAMES_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Games topic: ${examples.length} translations + IPA`);
