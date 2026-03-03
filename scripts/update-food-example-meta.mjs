import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/food.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const FOOD_ROWS = [
  { en: 'This food smells good.', id: 'Makanan ini wanginya enak.', ipa: '/ðɪs fud smɛlz ɡʊd/' },
  { en: 'Lunch is my favorite meal.', id: 'Makan siang adalah hidangan favorit saya.', ipa: '/lʌntʃ ɪz maɪ ˈfeɪvərət mil/' },
  { en: 'I eat breakfast at seven.', id: 'Saya sarapan jam tujuh.', ipa: '/aɪ it ˈbrɛkfəst æt ˈsɛvən/' },
  { en: 'We have lunch at noon.', id: 'Kami makan siang saat tengah hari.', ipa: '/wi hæv lʌntʃ æt nun/' },
  { en: 'Dinner is ready now.', id: 'Makan malam sudah siap sekarang.', ipa: '/ˈdɪnɚ ɪz ˈrɛdi naʊ/' },
  { en: 'I need a small snack.', id: 'Saya butuh camilan kecil.', ipa: '/aɪ nid ə smɔl snæk/' },
  { en: 'We eat rice every day.', id: 'Kami makan nasi setiap hari.', ipa: '/wi it raɪs ˈɛvri deɪ/' },
  { en: 'I bought fresh bread.', id: 'Saya membeli roti yang masih segar.', ipa: '/aɪ bɔt frɛʃ brɛd/' },
  { en: 'She likes noodle soup.', id: 'Dia suka sup mi.', ipa: '/ʃi laɪks ˈnudəl sup/' },
  { en: 'We cooked pasta tonight.', id: 'Kami memasak pasta malam ini.', ipa: '/wi kʊkt ˈpɑstə təˈnaɪt/' },
  { en: 'The soup is hot.', id: 'Supnya panas.', ipa: '/ðə sup ɪz hɑt/' },
  { en: 'I ordered a salad.', id: 'Saya memesan salad.', ipa: '/aɪ ˈɔrdɚd ə ˈsæləd/' },
  { en: 'I eat an egg for breakfast.', id: 'Saya makan satu telur untuk sarapan.', ipa: '/aɪ it ən ɛɡ fɔr ˈbrɛkfəst/' },
  { en: 'We grilled chicken.', id: 'Kami memanggang ayam.', ipa: '/wi ɡrɪld ˈtʃɪkən/' },
  { en: 'This beef is tender.', id: 'Daging sapi ini empuk.', ipa: '/ðɪs bif ɪz ˈtɛndɚ/' },
  { en: 'I eat fish twice a week.', id: 'Saya makan ikan dua kali seminggu.', ipa: '/aɪ it fɪʃ twaɪs ə wik/' },
  { en: 'The shrimp is fresh.', id: 'Udangnya segar.', ipa: '/ðə ʃrɪmp ɪz frɛʃ/' },
  { en: 'He cooked sausage and eggs.', id: 'Dia memasak sosis dan telur.', ipa: '/hi kʊkt ˈsɔsɪdʒ ænd ɛɡz/' },
  { en: 'I add cheese to pasta.', id: 'Saya menambahkan keju ke pasta.', ipa: '/aɪ æd tʃiz tə ˈpɑstə/' },
  { en: 'Spread butter on the bread.', id: 'Oleskan mentega di atas roti.', ipa: '/sprɛd ˈbʌtɚ ɑn ðə brɛd/' },
  { en: 'I drink milk in the morning.', id: 'Saya minum susu di pagi hari.', ipa: '/aɪ drɪŋk mɪlk ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'This yogurt is low sugar.', id: 'Yogurt ini rendah gula.', ipa: '/ðɪs ˈjoʊɡɚt ɪz loʊ ˈʃʊɡɚ/' },
  { en: 'Fruit is good for health.', id: 'Buah bagus untuk kesehatan.', ipa: '/frut ɪz ɡʊd fɔr hɛlθ/' },
  { en: 'Eat more vegetables.', id: 'Makan lebih banyak sayuran.', ipa: '/it mɔr ˈvɛdʒtəbəlz/' },
  { en: 'I packed an apple.', id: 'Saya membawa satu apel.', ipa: '/aɪ pækt ən ˈæpəl/' },
  { en: 'Banana is my favorite fruit.', id: 'Pisang adalah buah favorit saya.', ipa: '/bəˈnænə ɪz maɪ ˈfeɪvərət frut/' },
  { en: 'I bought an orange.', id: 'Saya membeli satu jeruk.', ipa: '/aɪ bɔt ən ˈɔrɪndʒ/' },
  { en: 'These grapes are sweet.', id: 'Anggur ini manis.', ipa: '/ðiz ɡreɪps ɑr swit/' },
  { en: 'Watermelon is very refreshing.', id: 'Semangka sangat menyegarkan.', ipa: '/ˈwɔtɚˌmɛlən ɪz ˈvɛri rɪˈfrɛʃɪŋ/' },
  { en: 'This mango is ripe.', id: 'Mangga ini sudah matang.', ipa: '/ðɪs ˈmæŋɡoʊ ɪz raɪp/' },
  { en: 'Carrot soup is delicious.', id: 'Sup wortel ini enak.', ipa: '/ˈkærət sup ɪz dɪˈlɪʃəs/' },
  { en: 'We cooked potato with chicken.', id: 'Kami memasak kentang dengan ayam.', ipa: '/wi kʊkt pəˈteɪtoʊ wɪð ˈtʃɪkən/' },
  { en: 'Add tomato to the salad.', id: 'Tambahkan tomat ke salad.', ipa: '/æd təˈmeɪtoʊ tə ðə ˈsæləd/' },
  { en: 'This soup has onion.', id: 'Sup ini memakai bawang.', ipa: '/ðɪs sup hæz ˈʌnjən/' },
  { en: 'I use garlic for cooking.', id: 'Saya pakai bawang putih untuk memasak.', ipa: '/aɪ juz ˈɡɑrlɪk fɔr ˈkʊkɪŋ/' },
  { en: 'Add a little pepper.', id: 'Tambahkan sedikit lada.', ipa: '/æd ə ˈlɪtəl ˈpɛpɚ/' },
  { en: 'This dish needs more salt.', id: 'Masakan ini butuh lebih banyak garam.', ipa: '/ðɪs dɪʃ nidz mɔr sɔlt/' },
  { en: 'I do not add sugar.', id: 'Saya tidak menambahkan gula.', ipa: '/aɪ du nɑt æd ˈʃʊɡɚ/' },
  { en: 'Tea with honey is nice.', id: 'Teh dengan madu itu enak.', ipa: '/ti wɪð ˈhʌni ɪz naɪs/' },
  { en: 'Use less oil when frying.', id: 'Gunakan lebih sedikit minyak saat menggoreng.', ipa: '/juz lɛs ɔɪl wɛn ˈfraɪɪŋ/' },
  { en: 'We ate fried rice for dinner.', id: 'Kami makan nasi goreng untuk makan malam.', ipa: '/wi eɪt fraɪd raɪs fɔr ˈdɪnɚ/' },
  { en: 'I made a sandwich for lunch.', id: 'Saya membuat roti isi untuk makan siang.', ipa: '/aɪ meɪd ə ˈsænwɪtʃ fɔr lʌntʃ/' },
  { en: 'The kids want pizza.', id: 'Anak-anak mau pizza.', ipa: '/ðə kɪdz wɑnt ˈpitsə/' },
  { en: 'He ordered a chicken burger.', id: 'Dia memesan burger ayam.', ipa: '/hi ˈɔrdɚd ə ˈtʃɪkən ˈbɝɡɚ/' },
  { en: 'We baked a chocolate cake.', id: 'Kami memanggang kue cokelat.', ipa: '/wi beɪkt ə ˈtʃɔklət keɪk/' },
  { en: 'I ate two cookies.', id: 'Saya makan dua kue kering.', ipa: '/aɪ eɪt tu ˈkʊkiz/' },
  { en: 'She likes vanilla ice cream.', id: 'Dia suka es krim vanila.', ipa: '/ʃi laɪks vəˈnɪlə aɪs krim/' },
  { en: 'This soup is too spicy.', id: 'Sup ini terlalu pedas.', ipa: '/ðɪs sup ɪz tu ˈspaɪsi/' },
  { en: 'The tea is too sweet.', id: 'Tehnya terlalu manis.', ipa: '/ðə ti ɪz tu swit/' },
  { en: 'Your cooking is delicious.', id: 'Masakanmu lezat.', ipa: '/jʊr ˈkʊkɪŋ ɪz dɪˈlɪʃəs/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(FOOD_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing FOOD_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Food topic: ${examples.length} translations + IPA`);
