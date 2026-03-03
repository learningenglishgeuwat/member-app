import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/number.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const rowRegex =
  /\{\s*id:\s*'([^']+)',\s*topicId:\s*'number',\s*word:\s*'([^']+)',\s*ipa:\s*'([^']+)',\s*meaningId:\s*'([^']+)',\s*exampleEn:\s*'([^']+)'\s*\}/g;

const rows = [];
let match;
while ((match = rowRegex.exec(wordsContent)) !== null) {
  rows.push({
    id: match[1],
    word: match[2],
    ipa: match[3],
    meaningId: match[4],
    exampleEn: match[5],
  });
}

if (rows.length === 0) {
  throw new Error('No number rows found');
}

const CUSTOM_TRANSLATIONS = {
  'Two plus three equals five.': 'Dua tambah tiga sama dengan lima.',
  'Nine minus four equals five.': 'Sembilan kurang empat sama dengan lima.',
  'Four times two equals eight.': 'Empat kali dua sama dengan delapan.',
  'Eight divided by two equals four.': 'Delapan dibagi dua sama dengan empat.',
  'Ten equals five plus five.': 'Sepuluh sama dengan lima tambah lima.',
};

const CUSTOM_IPA = {
  'Two plus three equals five.': '/tu plʌs θri ˈikwəlz faɪv/',
  'Nine minus four equals five.': '/naɪn ˈmaɪnəs fɔr ˈikwəlz faɪv/',
  'Four times two equals eight.': '/fɔr taɪmz tu ˈikwəlz eɪt/',
  'Eight divided by two equals four.': '/eɪt dɪˈvaɪdɪd baɪ tu ˈikwəlz fɔr/',
  'Ten equals five plus five.': '/tɛn ˈikwəlz faɪv plʌs faɪv/',
};

const getTranslation = (row) => {
  if (CUSTOM_TRANSLATIONS[row.exampleEn]) return CUSTOM_TRANSLATIONS[row.exampleEn];
  if (row.exampleEn.startsWith('The number is ')) return `Angkanya ${row.meaningId}.`;
  return row.meaningId;
};

const stripIpa = (ipa) => ipa.replace(/^\/+|\/+$/g, '').trim();
const getIpaSentence = (row) => {
  if (CUSTOM_IPA[row.exampleEn]) return CUSTOM_IPA[row.exampleEn];
  if (row.exampleEn.startsWith('The number is ')) return `/ðə ˈnʌmbɚ ɪz ${stripIpa(row.ipa)}/`;
  return `/${stripIpa(row.ipa)}/`;
};

let source = fs.readFileSync(META_PATH, 'utf8');

const updateMapSection = (sectionName, valueFactory) => {
  const startMarker = `export const ${sectionName}: Record<string, string> = {`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Section start not found: ${sectionName}`);
  const bodyStart = start + startMarker.length;
  const end = source.indexOf('\n};', bodyStart);
  if (end < 0) throw new Error(`Section end not found: ${sectionName}`);
  let body = source.slice(bodyStart, end);

  for (const row of rows) {
    const value = valueFactory(row);
    const keyPattern = row.exampleEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`(\\n\\s*\"${keyPattern}\":\\s*\")([^\"]*)(\",?)`);
    if (lineRegex.test(body)) {
      body = body.replace(lineRegex, `$1${value}$3`);
    } else {
      body += `\n  ${JSON.stringify(row.exampleEn)}: ${JSON.stringify(value)},`;
    }
  }

  source = `${source.slice(0, bodyStart)}${body}${source.slice(end)}`;
};

updateMapSection('VOCAB_EXAMPLE_TRANSLATION_BY_EN', (row) => getTranslation(row));
updateMapSection('VOCAB_EXAMPLE_IPA_BY_EN', (row) => getIpaSentence(row));

fs.writeFileSync(META_PATH, source, 'utf8');
console.log(`Updated Cardinal Number topic: ${rows.length} translations + IPA`);
