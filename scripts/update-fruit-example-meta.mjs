import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/fruit.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const FRUIT_ROWS = [
  { en: 'Fruit is healthy for everyone.', id: 'Buah baik untuk kesehatan semua orang.', ipa: '/frut ɪz ˈhɛlθi fɔr ˈɛvriˌwʌn/' },
  { en: 'I eat an apple every day.', id: 'Saya makan apel setiap hari.', ipa: '/aɪ it ən ˈæpəl ˈɛvri deɪ/' },
  { en: 'This banana is very sweet.', id: 'Pisang ini manis sekali.', ipa: '/ðɪs bəˈnænə ɪz ˈvɛri swit/' },
  { en: 'I drink orange juice in the morning.', id: 'Saya minum jus jeruk di pagi hari.', ipa: '/aɪ drɪŋk ˈɔrɪndʒ dʒus ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'These grapes are fresh.', id: 'Anggur ini segar.', ipa: '/ðiz ɡreɪps ɑr frɛʃ/' },
  { en: 'Watermelon is perfect on hot days.', id: 'Semangka cocok dimakan saat hari panas.', ipa: '/ˈwɔtərˌmɛlən ɪz ˈpɝfɪkt ɑn hɑt deɪz/' },
  { en: 'The melon tastes fresh.', id: 'Melon ini rasanya segar.', ipa: '/ðə ˈmɛlən teɪsts frɛʃ/' },
  { en: 'Pineapple can be sweet and sour.', id: 'Nanas bisa manis dan asam.', ipa: '/ˈpaɪnˌæpəl kən bi swit ænd saʊər/' },
  { en: 'This mango is ripe.', id: 'Mangga ini sudah matang.', ipa: '/ðɪs ˈmæŋɡoʊ ɪz raɪp/' },
  { en: 'My mother likes papaya.', id: 'Ibu saya suka pepaya.', ipa: '/maɪ ˈmʌðər laɪks pəˈpaɪə/' },
  { en: 'Guava juice is rich in vitamin C.', id: 'Jus jambu biji kaya vitamin C.', ipa: '/ˈɡwɑvə dʒus ɪz rɪtʃ ɪn ˈvaɪtəmɪn si/' },
  { en: 'Dragon fruit has a bright color.', id: 'Buah naga warnanya cerah.', ipa: '/ˈdræɡən frut hæz ə braɪt ˈkʌlər/' },
  { en: 'This pear is soft and sweet.', id: 'Pir ini lembut dan manis.', ipa: '/ðɪs pɛr ɪz sɔft ænd swit/' },
  { en: 'The peach smells good.', id: 'Persik ini aromanya enak.', ipa: '/ðə pitʃ smɛlz ɡʊd/' },
  { en: 'I bought two plums.', id: 'Saya membeli dua buah plum.', ipa: '/aɪ bɔt tu plʌmz/' },
  { en: 'She put a cherry on the cake.', id: 'Dia menaruh ceri di atas kue.', ipa: '/ʃi pʊt ə ˈtʃɛri ɑn ðə keɪk/' },
  { en: 'Strawberry yogurt is delicious.', id: 'Yogurt stroberi rasanya lezat.', ipa: '/ˈstrɔˌbɛri ˈjoʊɡərt ɪz dɪˈlɪʃəs/' },
  { en: 'Blueberry muffins are popular.', id: 'Muffin blueberry populer.', ipa: '/ˈbluˌbɛri ˈmʌfɪnz ɑr ˈpɑpjələr/' },
  { en: 'I added raspberry jam to toast.', id: 'Saya menambahkan selai raspberry ke roti panggang.', ipa: '/aɪ ˈædəd ˈræzˌbɛri dʒæm tə toʊst/' },
  { en: 'Blackberry tea is nice.', id: 'Teh blackberry enak.', ipa: '/ˈblækˌbɛri ti ɪz naɪs/' },
  { en: 'Kiwi has a unique taste.', id: 'Kiwi punya rasa yang unik.', ipa: '/ˈkiwi hæz ə juˈnik teɪst/' },
  { en: 'I make avocado juice at home.', id: 'Saya membuat jus alpukat di rumah.', ipa: '/aɪ meɪk ˌævəˈkɑdoʊ dʒus æt hoʊm/' },
  { en: 'Fresh coconut water is refreshing.', id: 'Air kelapa segar sangat menyegarkan.', ipa: '/frɛʃ ˈkoʊkənʌt ˈwɔtər ɪz rɪˈfrɛʃɪŋ/' },
  { en: 'Lemon tastes sour.', id: 'Lemon rasanya asam.', ipa: '/ˈlɛmən teɪsts saʊər/' },
  { en: 'Add lime to the drink.', id: 'Tambahkan jeruk nipis ke minuman.', ipa: '/æd laɪm tə ðə drɪŋk/' },
  { en: 'Mandarin oranges are easy to peel.', id: 'Jeruk mandarin mudah dikupas.', ipa: '/ˈmændərɪn ˈɔrɪndʒɪz ɑr ˈizi tə pil/' },
  { en: 'Pomelo is bigger than orange.', id: 'Jeruk bali lebih besar daripada jeruk biasa.', ipa: '/ˈpɑməloʊ ɪz ˈbɪɡər ðæn ˈɔrɪndʒ/' },
  { en: 'Durian has a strong smell.', id: 'Durian punya aroma yang kuat.', ipa: '/ˈdʊriən hæz ə strɔŋ smɛl/' },
  { en: 'Ripe jackfruit is very sweet.', id: 'Nangka matang rasanya sangat manis.', ipa: '/raɪp ˈdʒækˌfrut ɪz ˈvɛri swit/' },
  { en: 'Rambutan is in season now.', id: 'Rambutan sedang musim sekarang.', ipa: '/ræmˈbutən ɪz ɪn ˈsizən naʊ/' },
  { en: 'Mangosteen has white flesh inside.', id: 'Manggis memiliki daging putih di dalamnya.', ipa: '/ˈmæŋɡəˌstin hæz waɪt flɛʃ ɪnˈsaɪd/' },
  { en: 'Salak has brown skin.', id: 'Salak kulitnya cokelat.', ipa: '/ˈsɑlɑk hæz braʊn skɪn/' },
  { en: 'Starfruit looks like a star when sliced.', id: 'Belimbing terlihat seperti bintang saat diiris.', ipa: '/ˈstɑrˌfrut lʊks laɪk ə stɑr wɛn slaɪst/' },
  { en: 'Longan is sweet and juicy.', id: 'Kelengkeng manis dan berair.', ipa: '/ˈlɔŋɡən ɪz swit ænd ˈdʒusi/' },
  { en: 'I like lychee in cold drinks.', id: 'Saya suka leci di minuman dingin.', ipa: '/aɪ laɪk ˈlitʃi ɪn koʊld drɪŋks/' },
  { en: 'Dates are sweet and soft.', id: 'Kurma manis dan lembut.', ipa: '/deɪts ɑr swit ænd sɔft/' },
  { en: 'Dried fig is good for snacks.', id: 'Buah ara kering cocok untuk camilan.', ipa: '/draɪd fɪɡ ɪz ɡʊd fɔr snæks/' },
  { en: 'Apricot jam tastes sweet.', id: 'Selai aprikot rasanya manis.', ipa: '/ˈæprɪˌkɑt dʒæm teɪsts swit/' },
  { en: 'Pomegranate has many seeds.', id: 'Delima punya banyak biji.', ipa: '/ˈpɑməˌɡrænɪt hæz ˈmɛni sidz/' },
  { en: 'We made fruit salad together.', id: 'Kami membuat salad buah bersama.', ipa: '/wi meɪd frut ˈsæləd təˈɡɛðər/' },
  { en: 'This banana is ripe.', id: 'Pisang ini sudah matang.', ipa: '/ðɪs bəˈnænə ɪz raɪp/' },
  { en: 'The mango is still unripe.', id: 'Mangga ini masih belum matang.', ipa: '/ðə ˈmæŋɡoʊ ɪz stɪl ʌnˈraɪp/' },
  { en: 'These fruits are fresh.', id: 'Buah-buahan ini segar.', ipa: '/ðiz fruts ɑr frɛʃ/' },
  { en: 'The watermelon is sweet.', id: 'Semangka ini manis.', ipa: '/ðə ˈwɔtərˌmɛlən ɪz swit/' },
  { en: 'This orange is too sour.', id: 'Jeruk ini terlalu asam.', ipa: '/ðɪs ˈɔrɪndʒ ɪz tu saʊər/' },
  { en: 'The peach is very juicy.', id: 'Persik ini sangat berair.', ipa: '/ðə pitʃ ɪz ˈvɛri ˈdʒusi/' },
  { en: 'Remove the seeds first.', id: 'Buang bijinya dulu.', ipa: '/rɪˈmuv ðə sidz fɝst/' },
  { en: 'The peel is thick.', id: 'Kulit buahnya tebal.', ipa: '/ðə pil ɪz θɪk/' },
  { en: 'Cut the apple into slices.', id: 'Potong apel menjadi beberapa irisan.', ipa: '/kʌt ði ˈæpəl ˈɪntu ˈslaɪsɪz/' },
  { en: 'Please wash the fruit first.', id: 'Tolong cuci buahnya dulu.', ipa: '/pliz wɑʃ ðə frut fɝst/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(FRUIT_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing FRUIT_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Fruit topic: ${examples.length} translations + IPA`);
