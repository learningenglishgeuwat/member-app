import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/vegetables.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const VEGETABLE_ROWS = [
  { en: 'Vegetables are good for health.', id: 'Sayuran bagus untuk kesehatan.', ipa: '/ˈvɛdʒtəbəlz ɑr ɡʊd fɔr hɛlθ/' },
  { en: 'I add carrot to the soup.', id: 'Saya menambahkan wortel ke sup.', ipa: '/aɪ æd ˈkærət tə ðə sup/' },
  { en: 'We boiled some potatoes.', id: 'Kami merebus beberapa kentang.', ipa: '/wi bɔɪld sʌm pəˈteɪtoʊz/' },
  { en: 'This tomato is fresh.', id: 'Tomat ini segar.', ipa: '/ðɪs təˈmeɪtoʊ ɪz frɛʃ/' },
  { en: 'Slice the onion thinly.', id: 'Iris bawang bombai tipis-tipis.', ipa: '/slaɪs ði ˈʌnjən ˈθɪnli/' },
  { en: 'Garlic makes the dish fragrant.', id: 'Bawang putih membuat masakan jadi harum.', ipa: '/ˈɡɑrlɪk meɪks ðə dɪʃ ˈfreɪɡrənt/' },
  { en: 'Add one chili for spicy taste.', id: 'Tambahkan satu cabai supaya rasanya pedas.', ipa: '/æd wʌn ˈtʃɪli fɔr ˈspaɪsi teɪst/' },
  { en: 'I cooked spinach for lunch.', id: 'Saya memasak bayam untuk makan siang.', ipa: '/aɪ kʊkt ˈspɪnɪtʃ fɔr lʌntʃ/' },
  { en: 'This cabbage is cheap today.', id: 'Kol ini murah hari ini.', ipa: '/ðɪs ˈkæbɪdʒ ɪz tʃip təˈdeɪ/' },
  { en: 'Use lettuce for the salad.', id: 'Pakai selada untuk saladnya.', ipa: '/juz ˈlɛtɪs fɔr ðə ˈsæləd/' },
  { en: 'My sister likes broccoli.', id: 'Adik saya suka brokoli.', ipa: '/maɪ ˈsɪstər laɪks ˈbrɑkəli/' },
  { en: 'Cauliflower is in the fridge.', id: 'Kembang kol ada di kulkas.', ipa: '/ˈkɔlɪˌflaʊər ɪz ɪn ðə frɪdʒ/' },
  { en: 'Cucumber tastes fresh.', id: 'Mentimun rasanya segar.', ipa: '/ˈkjukʌmbər teɪsts frɛʃ/' },
  { en: 'I grilled eggplant tonight.', id: 'Saya memanggang terong malam ini.', ipa: '/aɪ ɡrɪld ˈɛɡˌplænt təˈnaɪt/' },
  { en: 'Zucchini cooks quickly.', id: 'Zucchini cepat matang saat dimasak.', ipa: '/zuˈkini kʊks ˈkwɪkli/' },
  { en: 'Pumpkin soup is warm and sweet.', id: 'Sup labu ini hangat dan manis.', ipa: '/ˈpʌmpkɪn sup ɪz wɔrm ænd swit/' },
  { en: 'Boiled corn is my favorite snack.', id: 'Jagung rebus adalah camilan favorit saya.', ipa: '/bɔɪld kɔrn ɪz maɪ ˈfeɪvərɪt snæk/' },
  { en: 'Add peas to fried rice.', id: 'Tambahkan kacang polong ke nasi goreng.', ipa: '/æd piz tə fraɪd raɪs/' },
  { en: 'These beans are still fresh.', id: 'Kacang ini masih segar.', ipa: '/ðiz binz ɑr stɪl frɛʃ/' },
  { en: 'Stir-fry green beans with garlic.', id: 'Tumis buncis dengan bawang putih.', ipa: '/ˈstɝ fraɪ ɡrin binz wɪð ˈɡɑrlɪk/' },
  { en: 'My mom bought long beans.', id: 'Ibu saya membeli kacang panjang.', ipa: '/maɪ mɑm bɔt lɔŋ binz/' },
  { en: 'Soybean is used for tofu.', id: 'Kedelai dipakai untuk membuat tahu.', ipa: '/ˈsɔɪˌbin ɪz juzd fɔr ˈtoʊfu/' },
  { en: 'This mushroom dish is delicious.', id: 'Masakan jamur ini lezat.', ipa: '/ðɪs ˈmʌʃrum dɪʃ ɪz dɪˈlɪʃəs/' },
  { en: 'I use celery for soup.', id: 'Saya pakai seledri untuk sup.', ipa: '/aɪ juz ˈsɛləri fɔr sup/' },
  { en: 'Sprinkle parsley on top.', id: 'Taburkan peterseli di atas.', ipa: '/ˈsprɪŋkəl ˈpɑrsli ɑn tɑp/' },
  { en: 'Leek gives a mild onion flavor.', id: 'Daun prei memberi rasa bawang yang ringan.', ipa: '/lik ɡɪvz ə maɪld ˈʌnjən ˈfleɪvər/' },
  { en: 'Top the noodles with spring onion.', id: 'Tambahkan daun bawang di atas mi.', ipa: '/tɑp ðə ˈnudəlz wɪð sprɪŋ ˈʌnjən/' },
  { en: 'Fry the shallot until golden.', id: 'Goreng bawang merah sampai keemasan.', ipa: '/fraɪ ðə ʃəˈlɑt ənˈtɪl ˈɡoʊldən/' },
  { en: 'Add ginger to the broth.', id: 'Tambahkan jahe ke kuahnya.', ipa: '/æd ˈdʒɪndʒər tə ðə brɔθ/' },
  { en: 'Turmeric gives yellow color.', id: 'Kunyit memberi warna kuning.', ipa: '/ˈtɝmərɪk ɡɪvz ˈjɛloʊ ˈkʌlər/' },
  { en: 'Roasted sweet potato is tasty.', id: 'Ubi jalar panggang rasanya enak.', ipa: '/ˈroʊstəd swit pəˈteɪtoʊ ɪz ˈteɪsti/' },
  { en: 'Cassava chips are crunchy.', id: 'Keripik singkong itu renyah.', ipa: '/kəˈsɑvə tʃɪps ɑr ˈkrʌntʃi/' },
  { en: 'Yam soup is common here.', id: 'Sup ubi itu umum di sini.', ipa: '/jæm sup ɪz ˈkɑmən hɪr/' },
  { en: 'The radish tastes slightly spicy.', id: 'Lobak ini rasanya agak pedas.', ipa: '/ðə ˈrædɪʃ teɪsts ˈslaɪtli ˈspaɪsi/' },
  { en: 'Beetroot has a deep red color.', id: 'Bit punya warna merah tua.', ipa: '/ˈbitrut hæz ə dip rɛd ˈkʌlər/' },
  { en: 'Okra is good in curry.', id: 'Okra enak dimasak kari.', ipa: '/ˈoʊkrə ɪz ɡʊd ɪn ˈkɝi/' },
  { en: 'Stir-fry bok choy quickly.', id: 'Tumis pakcoy sebentar saja.', ipa: '/ˈstɝ fraɪ bɑk tʃɔɪ ˈkwɪkli/' },
  { en: 'Mustard greens are fresh today.', id: 'Sawi hijau hari ini segar.', ipa: '/ˈmʌstərd ɡrinz ɑr frɛʃ təˈdeɪ/' },
  { en: 'Kale is popular in salads.', id: 'Kale populer untuk salad.', ipa: '/keɪl ɪz ˈpɑpjələr ɪn ˈsælədz/' },
  { en: 'Asparagus cooks fast.', id: 'Asparagus cepat matang.', ipa: '/əˈspærəɡəs kʊks fæst/' },
  { en: 'I used red bell pepper.', id: 'Saya memakai paprika merah.', ipa: '/aɪ juzd rɛd bɛl ˈpɛpər/' },
  { en: 'Use chili pepper carefully.', id: 'Pakai cabai dengan hati-hati.', ipa: '/juz ˈtʃɪli ˈpɛpər ˈkɛrfəli/' },
  { en: 'Bitter melon tastes strong.', id: 'Pare rasanya kuat.', ipa: '/ˈbɪtər ˈmɛlən teɪsts strɔŋ/' },
  { en: 'Chayote soup is light.', id: 'Sup labu siam rasanya ringan.', ipa: '/tʃaɪˈoʊteɪ sup ɪz laɪt/' },
  { en: 'We cooked water spinach with garlic.', id: 'Kami memasak kangkung dengan bawang putih.', ipa: '/wi kʊkt ˈwɔtər ˈspɪnɪtʃ wɪð ˈɡɑrlɪk/' },
  { en: 'These vegetables are fresh.', id: 'Sayuran ini segar.', ipa: '/ðiz ˈvɛdʒtəbəlz ɑr frɛʃ/' },
  { en: 'I prefer organic vegetables.', id: 'Saya lebih suka sayuran organik.', ipa: '/aɪ prɪˈfɝ ɔrˈɡænɪk ˈvɛdʒtəbəlz/' },
  { en: 'Please chop the carrot.', id: 'Tolong potong wortelnya.', ipa: '/pliz tʃɑp ðə ˈkærət/' },
  { en: 'Boil the potatoes first.', id: 'Rebus kentangnya dulu.', ipa: '/bɔɪl ðə pəˈteɪtoʊz fɝst/' },
  { en: 'I stir-fry vegetables for dinner.', id: 'Saya menumis sayuran untuk makan malam.', ipa: '/aɪ ˈstɝ fraɪ ˈvɛdʒtəbəlz fɔr ˈdɪnər/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(VEGETABLE_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing VEGETABLE_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Vegetables topic: ${examples.length} translations + IPA`);
