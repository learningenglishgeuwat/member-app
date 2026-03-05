import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/physical-appearance.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const PHYSICAL_APPEARANCE_ROWS = [
  { en: 'Her appearance is neat and simple.', id: 'Penampilannya rapi dan sederhana.', ipa: '/hɝ əˈpɪrəns ɪz nit ænd ˈsɪmpəl/' },
  { en: 'He has a friendly look.', id: 'Dia punya tampilan yang ramah.', ipa: '/hi hæz ə ˈfrɛndli lʊk/' },
  { en: 'My brother is tall.', id: 'Saudara laki-laki saya tinggi.', ipa: '/maɪ ˈbrʌðər ɪz tɔl/' },
  { en: 'She is short but very active.', id: 'Dia pendek tapi sangat aktif.', ipa: '/ʃi ɪz ʃɔrt bʌt ˈvɛri ˈæktɪv/' },
  { en: 'He is of medium height.', id: 'Dia bertubuh tinggi sedang.', ipa: '/hi ɪz əv ˈmidiəm haɪt/' },
  { en: 'She has a slim body.', id: 'Dia bertubuh langsing.', ipa: '/ʃi hæz ə slɪm ˈbɑdi/' },
  { en: 'He is thin now.', id: 'Dia sekarang kurus.', ipa: '/hi ɪz θɪn naʊ/' },
  { en: 'He is slightly overweight.', id: 'Dia agak kelebihan berat badan.', ipa: '/hi ɪz ˈslaɪtli ˌoʊvərˈweɪt/' },
  { en: 'She looks fit and healthy.', id: 'Dia terlihat bugar dan sehat.', ipa: '/ʃi lʊks fɪt ænd ˈhɛlθi/' },
  { en: 'He has strong arms.', id: 'Lengannya kuat.', ipa: '/hi hæz strɔŋ ɑrmz/' },
  { en: 'They look very young.', id: 'Mereka terlihat sangat muda.', ipa: '/ðeɪ lʊk ˈvɛri jʌŋ/' },
  { en: 'That man looks old.', id: 'Pria itu terlihat tua.', ipa: '/ðæt mæn lʊks oʊld/' },
  { en: 'He is a handsome man.', id: 'Dia pria yang tampan.', ipa: '/hi ɪz ə ˈhænsəm mæn/' },
  { en: 'She is beautiful.', id: 'Dia cantik.', ipa: '/ʃi ɪz ˈbjutəfəl/' },
  { en: 'She has a pretty smile.', id: 'Dia punya senyum yang manis.', ipa: '/ʃi hæz ə ˈprɪti smaɪl/' },
  { en: 'The baby is cute.', id: 'Bayi itu lucu.', ipa: '/ðə ˈbeɪbi ɪz kjut/' },
  { en: 'He has an attractive face.', id: 'Wajahnya menarik.', ipa: '/hi hæz ən əˈtræktɪv feɪs/' },
  { en: 'Your hair looks great.', id: 'Rambutmu terlihat bagus.', ipa: '/jʊr hɛr lʊks ɡreɪt/' },
  { en: 'I have short hair.', id: 'Saya berambut pendek.', ipa: '/aɪ hæv ʃɔrt hɛr/' },
  { en: 'She has long hair.', id: 'Dia berambut panjang.', ipa: '/ʃi hæz lɔŋ hɛr/' },
  { en: 'Her straight hair is very shiny.', id: 'Rambut lurusnya sangat berkilau.', ipa: '/hɝ streɪt hɛr ɪz ˈvɛri ˈʃaɪni/' },
  { en: 'He has curly hair.', id: 'Dia berambut keriting.', ipa: '/hi hæz ˈkɝli hɛr/' },
  { en: 'She has wavy hair.', id: 'Dia berambut bergelombang.', ipa: '/ʃi hæz ˈweɪvi hɛr/' },
  { en: 'He has black hair.', id: 'Dia berambut hitam.', ipa: '/hi hæz blæk hɛr/' },
  { en: 'She has brown hair.', id: 'Dia berambut cokelat.', ipa: '/ʃi hæz braʊn hɛr/' },
  { en: 'She has blonde hair.', id: 'Dia berambut pirang.', ipa: '/ʃi hæz blɑnd hɛr/' },
  { en: 'My uncle is bald.', id: 'Paman saya botak.', ipa: '/maɪ ˈʌŋkəl ɪz bɔld/' },
  { en: 'He has a short beard.', id: 'Dia punya jenggot pendek.', ipa: '/hi hæz ə ʃɔrt bɪrd/' },
  { en: 'His mustache is thick.', id: 'Kumisnya tebal.', ipa: '/hɪz ˈmʌstæʃ ɪz θɪk/' },
  { en: 'Wash your face with clean water.', id: 'Cuci wajahmu dengan air bersih.', ipa: '/wɑʃ jʊr feɪs wɪð klin ˈwɔtər/' },
  { en: 'She has a round face.', id: 'Dia berwajah bulat.', ipa: '/ʃi hæz ə raʊnd feɪs/' },
  { en: 'He has an oval face.', id: 'Dia berwajah oval.', ipa: '/hi hæz ən ˈoʊvəl feɪs/' },
  { en: 'Her eyes are bright.', id: 'Matanya cerah.', ipa: '/hɝ aɪz ɑr braɪt/' },
  { en: 'He has blue eyes.', id: 'Dia bermata biru.', ipa: '/hi hæz blu aɪz/' },
  { en: 'She has brown eyes.', id: 'Dia bermata cokelat.', ipa: '/ʃi hæz braʊn aɪz/' },
  { en: 'He has dark eyes.', id: 'Dia bermata gelap.', ipa: '/hi hæz dɑrk aɪz/' },
  { en: 'His skin is very smooth.', id: 'Kulitnya sangat halus.', ipa: '/hɪz skɪn ɪz ˈvɛri smuð/' },
  { en: 'She has light skin.', id: 'Dia berkulit terang.', ipa: '/ʃi hæz laɪt skɪn/' },
  { en: 'He has dark skin.', id: 'Dia berkulit gelap.', ipa: '/hi hæz dɑrk skɪn/' },
  { en: 'She has a warm smile.', id: 'Dia punya senyum yang hangat.', ipa: '/ʃi hæz ə wɔrm smaɪl/' },
  { en: 'He wears glasses every day.', id: 'Dia memakai kacamata setiap hari.', ipa: '/hi wɛrz ˈɡlæsəz ˈɛvri deɪ/' },
  { en: 'She has freckles on her cheeks.', id: 'Dia punya bintik-bintik di pipinya.', ipa: '/ʃi hæz ˈfrɛkəlz ɑn hɝ tʃiks/' },
  { en: 'Her dimples are cute.', id: 'Lesung pipinya lucu.', ipa: '/hɝ ˈdɪmpəlz ɑr kjut/' },
  { en: 'What is your height?', id: 'Berapa tinggi badan Anda?', ipa: '/wʌt ɪz jʊr haɪt/' },
  { en: 'Her weight is normal.', id: 'Berat badannya normal.', ipa: '/hɝ weɪt ɪz ˈnɔrməl/' },
  { en: 'He has a strong body.', id: 'Dia bertubuh kuat.', ipa: '/hi hæz ə strɔŋ ˈbɑdi/' },
  { en: 'He has a pointed chin.', id: 'Dia punya dagu yang lancip.', ipa: '/hi hæz ə ˈpɔɪntəd tʃɪn/' },
  { en: 'Her cheek is red.', id: 'Pipinya merah.', ipa: '/hɝ tʃik ɪz rɛd/' },
  { en: 'He touched his forehead.', id: 'Dia menyentuh dahinya.', ipa: '/hi tʌtʃt hɪz ˈfɔrhɛd/' },
  { en: 'She has thin lips.', id: 'Dia memiliki bibir tipis.', ipa: '/ʃi hæz θɪn lɪps/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(PHYSICAL_APPEARANCE_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing PHYSICAL_APPEARANCE_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Physical Appearance topic: ${examples.length} translations + IPA`);
