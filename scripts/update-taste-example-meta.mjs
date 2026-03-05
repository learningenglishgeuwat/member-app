import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/taste.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const TASTE_ROWS = [
  { en: 'This soup has a rich taste.', id: 'Sup ini rasanya kaya.', ipa: '/ðɪs sup hæz ə rɪtʃ teɪst/' },
  { en: 'I like the flavor of this tea.', id: 'Saya suka cita rasa teh ini.', ipa: '/aɪ laɪk ðə ˈfleɪvər əv ðɪs ti/' },
  { en: 'This cake is very sweet.', id: 'Kue ini manis sekali.', ipa: '/ðɪs keɪk ɪz ˈvɛri swit/' },
  { en: 'These chips are too salty.', id: 'Keripik ini terlalu asin.', ipa: '/ðiz tʃɪps ɑr tu ˈsɔlti/' },
  { en: 'This lemon is really sour.', id: 'Lemon ini asam sekali.', ipa: '/ðɪs ˈlɛmən ɪz ˈrɪli saʊər/' },
  { en: 'Black coffee tastes bitter.', id: 'Kopi hitam rasanya pahit.', ipa: '/blæk ˈkɔfi teɪsts ˈbɪtər/' },
  { en: 'The noodles are too spicy for me.', id: 'Mi ini terlalu pedas buat saya.', ipa: '/ðə ˈnudəlz ɑr tu ˈspaɪsi fɔr mi/' },
  { en: 'This snack is savory and crunchy.', id: 'Camilan ini gurih dan renyah.', ipa: '/ðɪs snæk ɪz ˈseɪvəri ænd ˈkrʌntʃi/' },
  { en: 'The soup is bland without salt.', id: 'Sup ini hambar tanpa garam.', ipa: '/ðə sup ɪz blænd wɪˈðaʊt sɔlt/' },
  { en: 'This sauce is rich and creamy.', id: 'Saus ini rasanya kaya dan creamy.', ipa: '/ðɪs sɔs ɪz rɪtʃ ænd ˈkrimi/' },
  { en: 'I want a light meal tonight.', id: 'Saya mau makanan yang ringan malam ini.', ipa: '/aɪ wɑnt ə laɪt mil təˈnaɪt/' },
  { en: 'This coffee has a strong taste.', id: 'Kopi ini rasanya kuat.', ipa: '/ðɪs ˈkɔfi hæz ə strɔŋ teɪst/' },
  { en: 'Can I get a mild curry?', id: 'Boleh minta kari yang tidak terlalu pedas?', ipa: '/kæn aɪ ɡɛt ə maɪld ˈkɝi/' },
  { en: 'The juice tastes fresh.', id: 'Jus ini rasanya segar.', ipa: '/ðə dʒus teɪsts frɛʃ/' },
  { en: 'The grilled meat is smoky.', id: 'Daging bakarnya terasa berasap.', ipa: '/ðə ɡrɪld mit ɪz ˈsmoʊki/' },
  { en: 'This pasta sauce is creamy.', id: 'Saus pasta ini creamy.', ipa: '/ðɪs ˈpɑstə sɔs ɪz ˈkrimi/' },
  { en: 'The fried chicken is crispy.', id: 'Ayam goreng ini renyah.', ipa: '/ðə fraɪd ˈtʃɪkən ɪz ˈkrɪspi/' },
  { en: 'I like crunchy peanuts.', id: 'Saya suka kacang yang garing.', ipa: '/aɪ laɪk ˈkrʌntʃi ˈpiˌnʌts/' },
  { en: 'This bread is soft.', id: 'Roti ini lembut.', ipa: '/ðɪs brɛd ɪz sɔft/' },
  { en: 'The orange is sweet and juicy.', id: 'Jeruk ini manis dan berair.', ipa: '/ði ˈɔrɪndʒ ɪz swit ænd ˈdʒusi/' },
  { en: 'This cake feels dry.', id: 'Kue ini terasa kering.', ipa: '/ðɪs keɪk filz draɪ/' },
  { en: 'The fried rice is a bit oily.', id: 'Nasi gorengnya agak berminyak.', ipa: '/ðə fraɪd raɪs ɪz ə bɪt ˈɔɪli/' },
  { en: 'The toast tastes burnt.', id: 'Roti panggang ini rasanya gosong.', ipa: '/ðə toʊst teɪsts bɝnt/' },
  { en: 'This fish is still raw.', id: 'Ikan ini masih mentah.', ipa: '/ðɪs fɪʃ ɪz stɪl rɔ/' },
  { en: 'This mango is ripe.', id: 'Mangga ini sudah matang.', ipa: '/ðɪs ˈmæŋɡoʊ ɪz raɪp/' },
  { en: 'The banana is overripe.', id: 'Pisangnya terlalu matang.', ipa: '/ðə bəˈnænə ɪz ˌoʊvərˈraɪp/' },
  { en: 'Your cooking is delicious.', id: 'Masakanmu enak sekali.', ipa: '/jʊr ˈkʊkɪŋ ɪz dɪˈlɪʃəs/' },
  { en: 'This sandwich is really tasty.', id: 'Sandwich ini enak banget.', ipa: '/ðɪs ˈsændwɪtʃ ɪz ˈrɪli ˈteɪsti/' },
  { en: 'Wow, this dessert is yummy.', id: 'Wah, dessert ini enak banget.', ipa: '/waʊ ðɪs dɪˈzɝt ɪz ˈjʌmi/' },
  { en: 'The soup looks appetizing.', id: 'Sup ini kelihatan menggugah selera.', ipa: '/ðə sup lʊks ˈæpɪˌtaɪzɪŋ/' },
  { en: 'This drink tastes awful.', id: 'Minuman ini rasanya tidak enak.', ipa: '/ðɪs drɪŋk teɪsts ˈɔfəl/' },
  { en: 'The tea is too sweet for me.', id: 'Teh ini terlalu manis buat saya.', ipa: '/ðə ti ɪz tu swit fɔr mi/' },
  { en: 'This soup is too salty.', id: 'Sup ini terlalu asin.', ipa: '/ðɪs sup ɪz tu ˈsɔlti/' },
  { en: 'The sauce is too spicy.', id: 'Saus ini terlalu pedas.', ipa: '/ðə sɔs ɪz tu ˈspaɪsi/' },
  { en: 'This coffee is not sweet enough.', id: 'Kopi ini kurang manis.', ipa: '/ðɪs ˈkɔfi ɪz nɑt swit ɪˈnʌf/' },
  { en: 'The noodles are not salty enough.', id: 'Mi ini kurang asin.', ipa: '/ðə ˈnudəlz ɑr nɑt ˈsɔlti ɪˈnʌf/' },
  { en: 'This tea needs more sugar.', id: 'Teh ini perlu lebih banyak gula.', ipa: '/ðɪs ti nidz mɔr ˈʃʊɡər/' },
  { en: 'The soup needs more salt.', id: 'Sup ini perlu lebih banyak garam.', ipa: '/ðə sup nidz mɔr sɔlt/' },
  { en: 'Please add chili to mine.', id: 'Tolong tambahkan cabai ke punyaku.', ipa: '/pliz æd ˈtʃɪli tə maɪn/' },
  { en: 'Can you add pepper?', id: 'Bisa tambahkan lada?', ipa: '/kæn ju æd ˈpɛpər/' },
  { en: 'There is too much sugar in this drink.', id: 'Gula di minuman ini terlalu banyak.', ipa: '/ðɛr ɪz tu mʌtʃ ˈʃʊɡər ɪn ðɪs drɪŋk/' },
  { en: 'There is too much salt in this food.', id: 'Garam di makanan ini terlalu banyak.', ipa: '/ðɛr ɪz tu mʌtʃ sɔlt ɪn ðɪs fud/' },
  { en: 'I liked it from the first bite.', id: 'Saya suka dari gigitan pertama.', ipa: '/aɪ laɪkt ɪt frəm ðə fɝst baɪt/' },
  { en: 'This tea has a bitter aftertaste.', id: 'Teh ini punya rasa pahit setelah ditelan.', ipa: '/ðɪs ti hæz ə ˈbɪtər ˈæftərˌteɪst/' },
  { en: 'This soup has a homemade taste.', id: 'Sup ini rasanya seperti masakan rumahan.', ipa: '/ðɪs sup hæz ə ˌhoʊmˈmeɪd teɪst/' },
  { en: 'The dish has a balanced flavor.', id: 'Hidangan ini rasanya seimbang.', ipa: '/ðə dɪʃ hæz ə ˈbælənst ˈfleɪvər/' },
  { en: 'The sauce is too bland.', id: 'Saus ini terlalu hambar.', ipa: '/ðə sɔs ɪz tu blænd/' },
  { en: 'Spicy is my favorite taste.', id: 'Pedas adalah rasa favorit saya.', ipa: '/ˈspaɪsi ɪz maɪ ˈfeɪvərɪt teɪst/' },
  { en: 'This food tastes good.', id: 'Makanan ini rasanya enak.', ipa: '/ðɪs fud teɪsts ɡʊd/' },
  { en: 'This milk tastes bad.', id: 'Susu ini rasanya tidak enak.', ipa: '/ðɪs mɪlk teɪsts bæd/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(TASTE_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing TASTE_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Taste topic: ${examples.length} translations + IPA`);
