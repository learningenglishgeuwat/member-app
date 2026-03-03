import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/drinks.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const DRINKS_ROWS = [
  { en: 'What drink do you want?', id: 'Mau minum apa?', ipa: '/wʌt drɪŋk du ju wɑnt/' },
  { en: 'Please drink more water.', id: 'Tolong minum air lebih banyak.', ipa: '/pliz drɪŋk mɔr ˈwɔtɚ/' },
  { en: 'I bought a bottle of mineral water.', id: 'Saya membeli sebotol air mineral.', ipa: '/aɪ bɔt ə ˈbɑtəl əv ˈmɪnərəl ˈwɔtɚ/' },
  { en: 'He prefers sparkling water.', id: 'Dia lebih suka air soda.', ipa: '/hi prɪˈfɝz ˈspɑrklɪŋ ˈwɔtɚ/' },
  { en: 'I drink tea every morning.', id: 'Saya minum teh setiap pagi.', ipa: '/aɪ drɪŋk ti ˈɛvri ˈmɔrnɪŋ/' },
  { en: 'My father likes black tea.', id: 'Ayah saya suka teh hitam.', ipa: '/maɪ ˈfɑðɚ laɪks blæk ti/' },
  { en: 'Green tea is light and fresh.', id: 'Teh hijau rasanya ringan dan segar.', ipa: '/ɡrin ti ɪz laɪt ənd frɛʃ/' },
  { en: 'I ordered iced tea.', id: 'Saya memesan es teh.', ipa: '/aɪ ˈɔrdɚd aɪst ti/' },
  { en: 'She drinks coffee at work.', id: 'Dia minum kopi di kantor.', ipa: '/ʃi drɪŋks ˈkɔfi æt wɝk/' },
  { en: 'He likes black coffee.', id: 'Dia suka kopi hitam.', ipa: '/hi laɪks blæk ˈkɔfi/' },
  { en: 'Can I get a hot latte?', id: 'Boleh saya pesan latte panas?', ipa: '/kæn aɪ ɡɛt ə hɑt ˈlɑteɪ/' },
  { en: 'She ordered a cappuccino.', id: 'Dia memesan cappuccino.', ipa: '/ʃi ˈɔrdɚd ə ˌkæpəˈtʃinoʊ/' },
  { en: 'Kids need milk every day.', id: 'Anak-anak perlu susu setiap hari.', ipa: '/kɪdz nid mɪlk ˈɛvri deɪ/' },
  { en: 'This fresh milk is cold.', id: 'Susu segar ini dingin.', ipa: '/ðɪs frɛʃ mɪlk ɪz koʊld/' },
  { en: 'My son likes chocolate milk.', id: 'Anak saya suka susu cokelat.', ipa: '/maɪ sʌn laɪks ˈtʃɔklət mɪlk/' },
  { en: 'She drinks soy milk.', id: 'Dia minum susu kedelai.', ipa: '/ʃi drɪŋks sɔɪ mɪlk/' },
  { en: 'I made orange juice.', id: 'Saya membuat jus jeruk.', ipa: '/aɪ meɪd ˈɔrɪndʒ dʒus/' },
  { en: 'Would you like orange juice?', id: 'Mau jus jeruk?', ipa: '/wʊd ju laɪk ˈɔrɪndʒ dʒus/' },
  { en: 'The kids drink apple juice.', id: 'Anak-anak minum jus apel.', ipa: '/ðə kɪdz drɪŋk ˈæpəl dʒus/' },
  { en: 'I drink lemon juice in the morning.', id: 'Saya minum air lemon di pagi hari.', ipa: '/aɪ drɪŋk ˈlɛmən dʒus ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'This banana smoothie is thick.', id: 'Smoothie pisang ini kental.', ipa: '/ðɪs bəˈnænə ˈsmuði ɪz θɪk/' },
  { en: 'He ordered a vanilla shake.', id: 'Dia memesan milkshake vanila.', ipa: '/hi ˈɔrdɚd ə vəˈnɪlə ʃeɪk/' },
  { en: 'I rarely drink soda.', id: 'Saya jarang minum soda.', ipa: '/aɪ ˈrɛrli drɪŋk ˈsoʊdə/' },
  { en: 'A can of cola is enough.', id: 'Satu kaleng cola sudah cukup.', ipa: '/ə kæn əv ˈkoʊlə ɪz ɪˈnʌf/' },
  { en: 'He bought an energy drink.', id: 'Dia membeli minuman energi.', ipa: '/hi bɔt ən ˈɛnɚdʒi drɪŋk/' },
  { en: 'A sports drink helps after running.', id: 'Minuman olahraga membantu setelah berlari.', ipa: '/ə spɔrts drɪŋk hɛlps ˈæftɚ ˈrʌnɪŋ/' },
  { en: 'Coconut water is refreshing.', id: 'Air kelapa itu menyegarkan.', ipa: '/ˈkoʊkənʌt ˈwɔtɚ ɪz rɪˈfrɛʃɪŋ/' },
  { en: 'My grandma makes herbal drinks.', id: 'Nenek saya membuat minuman herbal.', ipa: '/maɪ ˈɡrænˌmɑ meɪks ˈɝbəl drɪŋks/' },
  { en: 'I need a hot drink tonight.', id: 'Saya butuh minuman panas malam ini.', ipa: '/aɪ nid ə hɑt drɪŋk təˈnaɪt/' },
  { en: 'A cold drink sounds good.', id: 'Minuman dingin terdengar enak.', ipa: '/ə koʊld drɪŋk saʊndz ɡʊd/' },
  { en: 'Please add ice.', id: 'Tolong tambahkan es.', ipa: '/pliz æd aɪs/' },
  { en: 'Honey tea helps my throat.', id: 'Teh madu membantu tenggorokan saya.', ipa: '/ˈhʌni ti hɛlps maɪ θroʊt/' },
  { en: 'I drink ginger tea when I am sick.', id: 'Saya minum teh jahe saat saya sakit.', ipa: '/aɪ drɪŋk ˈdʒɪndʒɚ ti wɛn aɪ æm sɪk/' },
  { en: 'She likes bubble tea.', id: 'Dia suka bubble tea.', ipa: '/ʃi laɪks ˈbʌbəl ti/' },
  { en: 'This matcha tastes bitter.', id: 'Matcha ini rasanya pahit.', ipa: '/ðɪs ˈmætʃə teɪsts ˈbɪtɚ/' },
  { en: 'He ordered a single espresso.', id: 'Dia memesan satu espresso.', ipa: '/hi ˈɔrdɚd ə ˈsɪŋɡəl ɛˈsprɛsoʊ/' },
  { en: 'I prefer an americano.', id: 'Saya lebih suka americano.', ipa: '/aɪ prɪˈfɝ ən əˌmɛrɪˈkɑnoʊ/' },
  { en: 'Hot chocolate is perfect in rain.', id: 'Cokelat panas pas saat hujan.', ipa: '/hɑt ˈtʃɔklət ɪz ˈpɝfɪkt ɪn reɪn/' },
  { en: 'Add a little syrup.', id: 'Tambahkan sedikit sirup.', ipa: '/æd ə ˈlɪtəl ˈsɪrəp/' },
  { en: 'This drink is too sweet.', id: 'Minuman ini terlalu manis.', ipa: '/ðɪs drɪŋk ɪz tu swit/' },
  { en: 'Black coffee is bitter.', id: 'Kopi hitam itu pahit.', ipa: '/blæk ˈkɔfi ɪz ˈbɪtɚ/' },
  { en: 'I want something fresh.', id: 'Saya ingin sesuatu yang segar.', ipa: '/aɪ wɑnt ˈsʌmθɪŋ frɛʃ/' },
  { en: 'I am thirsty after walking.', id: 'Saya haus setelah berjalan kaki.', ipa: '/aɪ æm ˈθɝsti ˈæftɚ ˈwɔkɪŋ/' },
  { en: 'I carry a water bottle.', id: 'Saya membawa botol minum.', ipa: '/aɪ ˈkæri ə ˈwɔtɚ ˈbɑtəl/' },
  { en: 'A cup of tea, please.', id: 'Secangkir teh, tolong.', ipa: '/ə kʌp əv ti pliz/' },
  { en: 'Can I have a glass of water?', id: 'Boleh saya minta segelas air?', ipa: '/kæn aɪ hæv ə ɡlæs əv ˈwɔtɚ/' },
  { en: 'He bought a can of soda.', id: 'Dia membeli satu kaleng soda.', ipa: '/hi bɔt ə kæn əv ˈsoʊdə/' },
  { en: 'Do you need a straw?', id: 'Kamu perlu sedotan?', ipa: '/du ju nid ə strɔ/' },
  { en: 'Take a small sip first.', id: 'Coba seruput sedikit dulu.', ipa: '/teɪk ə smɔl sɪp fɝst/' },
  { en: 'Can I get a refill?', id: 'Boleh saya minta isi ulang?', ipa: '/kæn aɪ ɡɛt ə ˈrifɪl/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(DRINKS_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing DRINKS_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Drinks topic: ${examples.length} translations + IPA`);
