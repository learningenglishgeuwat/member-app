import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/bathroom.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const BATHROOM_IPA_ROWS = [
  { en: 'The bathroom is next to my bedroom.', ipa: '/ðə ˈbæθˌrum ɪz nɛkst tə maɪ ˈbɛdˌrum/' },
  { en: 'Please clean the toilet.', ipa: '/pliz klin ðə ˈtɔɪlət/' },
  { en: 'Where is the restroom?', ipa: '/wɛr ɪz ðə ˈrɛsˌtrum/' },
  { en: 'The washroom is downstairs.', ipa: '/ðə ˈwɑʃˌrum ɪz ˌdaʊnˈstɛrz/' },
  { en: 'The sink is full of water.', ipa: '/ðə sɪŋk ɪz fʊl əv ˈwɔtər/' },
  { en: 'Turn off the faucet.', ipa: '/tɝn ɔf ðə ˈfɔsət/' },
  { en: 'The tap is leaking.', ipa: '/ðə tæp ɪz ˈlikɪŋ/' },
  { en: 'I take a shower every morning.', ipa: '/aɪ teɪk ə ˈʃaʊər ˈɛvri ˈmɔrnɪŋ/' },
  { en: 'The bathtub is very clean.', ipa: '/ðə ˈbæθˌtʌb ɪz ˈvɛri klin/' },
  { en: 'Fill the bucket with water.', ipa: '/fɪl ðə ˈbʌkət wɪð ˈwɔtər/' },
  { en: 'Use the dipper carefully.', ipa: '/juz ðə ˈdɪpər ˈkɛrfəli/' },
  { en: 'The drain is blocked.', ipa: '/ðə dreɪn ɪz blɑkt/' },
  { en: 'I looked in the mirror.', ipa: '/aɪ lʊkt ɪn ðə ˈmɪrər/' },
  { en: 'My toothbrush is blue.', ipa: '/maɪ ˈtuθˌbrʌʃ ɪz blu/' },
  { en: 'I need new toothpaste.', ipa: '/aɪ nid nu ˈtuθˌpeɪst/' },
  { en: 'Use dental floss every night.', ipa: '/juz ˈdɛntəl flɔs ˈɛvri naɪt/' },
  { en: 'I use mouthwash after brushing.', ipa: '/aɪ juz ˈmaʊθˌwɑʃ ˈæftər ˈbrʌʃɪŋ/' },
  { en: 'This soap smells good.', ipa: '/ðɪs soʊp smɛlz ɡʊd/' },
  { en: 'I bought a new shampoo.', ipa: '/aɪ bɔt ə nu ʃæmˈpu/' },
  { en: 'Use conditioner after shampoo.', ipa: '/juz kənˈdɪʃənər ˈæftər ʃæmˈpu/' },
  { en: 'She prefers body wash.', ipa: '/ʃi prɪˈfɝz ˈbɑdi wɑʃ/' },
  { en: 'Use face wash before bed.', ipa: '/juz feɪs wɑʃ bɪˈfɔr bɛd/' },
  { en: 'Apply lotion after showering.', ipa: '/əˈplaɪ ˈloʊʃən ˈæftər ˈʃaʊərɪŋ/' },
  { en: 'I use deodorant every day.', ipa: '/aɪ juz diˈoʊdərənt ˈɛvri deɪ/' },
  { en: 'This perfume is light and fresh.', ipa: '/ðɪs pərˈfjum ɪz laɪt ænd frɛʃ/' },
  { en: 'Please hang the towel.', ipa: '/pliz hæŋ ðə ˈtaʊəl/' },
  { en: 'The hand towel is dry.', ipa: '/ðə hænd ˈtaʊəl ɪz draɪ/' },
  { en: 'Stand on the bath mat.', ipa: '/stænd ɑn ðə bæθ mæt/' },
  { en: 'We need more toilet paper.', ipa: '/wi nid mɔr ˈtɔɪlət ˈpeɪpər/' },
  { en: 'Take one tissue, please.', ipa: '/teɪk wʌn ˈtɪʃu pliz/' },
  { en: 'Put it in the trash bin.', ipa: '/pʊt ɪt ɪn ðə træʃ bɪn/' },
  { en: 'The soap is on the shelf.', ipa: '/ðə soʊp ɪz ɑn ðə ʃɛlf/' },
  { en: 'Medicine is in the cabinet.', ipa: '/ˈmɛdəsən ɪz ɪn ðə ˈkæbənət/' },
  { en: 'Use bathroom cleaner for the floor.', ipa: '/juz ˈbæθˌrum ˈklinər fɔr ðə flɔr/' },
  { en: 'Spray disinfectant on the sink.', ipa: '/spreɪ ˌdɪsɪnˈfɛktənt ɑn ðə sɪŋk/' },
  { en: 'Use a brush to clean the floor.', ipa: '/juz ə brʌʃ tə klin ðə flɔr/' },
  { en: 'This sponge is soft.', ipa: '/ðɪs spʌndʒ ɪz sɔft/' },
  { en: 'Please mop the bathroom floor.', ipa: '/pliz mɑp ðə ˈbæθˌrum flɔr/' },
  { en: 'Wipe the mirror with a cloth.', ipa: '/waɪp ðə ˈmɪrər wɪð ə klɔθ/' },
  { en: 'Do not forget to flush.', ipa: '/du nɑt fərˈɡɛt tə flʌʃ/' },
  { en: 'Wash your hands with soap.', ipa: '/wɑʃ jʊr hændz wɪð soʊp/' },
  { en: 'Rinse your face with water.', ipa: '/rɪns jʊr feɪs wɪð ˈwɔtər/' },
  { en: 'Dry your hands after washing.', ipa: '/draɪ jʊr hændz ˈæftər ˈwɑʃɪŋ/' },
  { en: 'I brush my teeth twice a day.', ipa: '/aɪ brʌʃ maɪ tiθ twaɪs ə deɪ/' },
  { en: 'He shaves in the morning.', ipa: '/hi ʃeɪvz ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'Comb your hair before going out.', ipa: '/koʊm jʊr hɛr bɪˈfɔr ˈɡoʊɪŋ aʊt/' },
  { en: 'I prefer hot water at night.', ipa: '/aɪ prɪˈfɝ hɑt ˈwɔtər æt naɪt/' },
  { en: 'The cold water is refreshing.', ipa: '/ðə koʊld ˈwɔtər ɪz rɪˈfrɛʃɪŋ/' },
  { en: 'The water heater is broken.', ipa: '/ðə ˈwɔtər ˈhitər ɪz ˈbroʊkən/' },
  { en: 'Be careful, the floor is slippery.', ipa: '/bi ˈkɛrfəl ðə flɔr ɪz ˈslɪpəri/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(BATHROOM_IPA_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing BATHROOM_IPA_ROWS mappings for: ${missingRows.join(' | ')}`);
}

let source = fs.readFileSync(META_PATH, 'utf8');
const sectionName = 'VOCAB_EXAMPLE_IPA_BY_EN';
const startMarker = `export const ${sectionName}: Record<string, string> = {`;
const start = source.indexOf(startMarker);
if (start < 0) throw new Error(`Section start not found: ${sectionName}`);
const bodyStart = start + startMarker.length;
const end = source.indexOf('\n};', bodyStart);
if (end < 0) throw new Error(`Section end not found: ${sectionName}`);
let body = source.slice(bodyStart, end);

for (const example of examples) {
  const row = rowMap.get(example);
  const value = row.ipa;
  const keyPattern = JSON.stringify(example).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRegex = new RegExp(`(\\n\\s*${keyPattern}:\\s*)\"(?:\\\\.|[^\"])*\"(,?)`);
  if (lineRegex.test(body)) {
    body = body.replace(lineRegex, `$1${JSON.stringify(value)}$2`);
  } else {
    body += `\n  ${JSON.stringify(example)}: ${JSON.stringify(value)},`;
  }
}

source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated Bathroom topic IPA: ${examples.length} rows`);
