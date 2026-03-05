import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/clothes.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const CLOTHES_ROWS = [
  { en: 'I need clean clothes for tomorrow.', id: 'Saya butuh pakaian bersih untuk besok.', ipa: '/aɪ nid klin kloʊðz fɔr təˈmɑroʊ/' },
  { en: 'He is wearing a blue shirt.', id: 'Dia memakai kemeja biru.', ipa: '/hi ɪz ˈwɛrɪŋ ə blu ʃɝt/' },
  { en: 'I like this white T-shirt.', id: 'Saya suka kaos putih ini.', ipa: '/aɪ laɪk ðɪs waɪt ˈti ʃɝt/' },
  { en: 'She bought a new blouse.', id: 'Dia membeli blus baru.', ipa: '/ʃi bɔt ə nu blaʊs/' },
  { en: 'Take your jacket, it is cold.', id: 'Bawa jaketmu, cuacanya dingin.', ipa: '/teɪk jʊr ˈdʒækɪt ɪt ɪz koʊld/' },
  { en: 'His coat is very warm.', id: 'Mantelnya sangat hangat.', ipa: '/hɪz koʊt ɪz ˈvɛri wɔrm/' },
  { en: 'This sweater feels soft.', id: 'Sweter ini terasa lembut.', ipa: '/ðɪs swɛtɚ filz sɔft/' },
  { en: 'I wear a hoodie at night.', id: 'Saya pakai hoodie saat malam.', ipa: '/aɪ wɛr ə ˈhʊdi æt naɪt/' },
  { en: 'She is wearing a red dress.', id: 'Dia memakai gaun merah.', ipa: '/ʃi ɪz ˈwɛrɪŋ ə rɛd drɛs/' },
  { en: 'The skirt is too long for me.', id: 'Rok ini terlalu panjang buat saya.', ipa: '/ðə skɝt ɪz tu lɔŋ fɔr mi/' },
  { en: 'My jeans are dark blue.', id: 'Jeans saya berwarna biru tua.', ipa: '/maɪ dʒinz ɑr dɑrk blu/' },
  { en: 'These pants are comfortable.', id: 'Celana ini nyaman dipakai.', ipa: '/ðiz pænts ɑr ˈkʌmftɚbəl/' },
  { en: 'I wear shorts at home.', id: 'Saya pakai celana pendek di rumah.', ipa: '/aɪ wɛr ʃɔrts æt hoʊm/' },
  { en: 'I need clean socks.', id: 'Saya butuh kaus kaki yang bersih.', ipa: '/aɪ nid klin sɑks/' },
  { en: 'Your shoes look nice.', id: 'Sepatumu kelihatan bagus.', ipa: '/jʊr ʃuz lʊk naɪs/' },
  { en: 'He wears sneakers to school.', id: 'Dia pakai sneakers ke sekolah.', ipa: '/hi wɛrz ˈsnikɚz tə skul/' },
  { en: 'These boots are good for rain.', id: 'Sepatu bot ini bagus untuk hujan.', ipa: '/ðiz buts ɑr ɡʊd fɔr reɪn/' },
  { en: 'I use sandals in the house.', id: 'Saya pakai sandal di rumah.', ipa: '/aɪ juz ˈsændəlz ɪn ðə haʊs/' },
  { en: 'My slippers are near the door.', id: 'Sandal rumah saya ada di dekat pintu.', ipa: '/maɪ ˈslɪpɚz ɑr nɪr ðə dɔr/' },
  { en: 'Wear a hat in the sun.', id: 'Pakai topi saat di bawah matahari.', ipa: '/wɛr ə hæt ɪn ðə sʌn/' },
  { en: 'He always wears a black cap.', id: 'Dia selalu memakai topi cap hitam.', ipa: '/hi ˈɔlweɪz wɛrz ə blæk kæp/' },
  { en: 'She wrapped a scarf around her neck.', id: 'Dia melilitkan syal di lehernya.', ipa: '/ʃi ræpt ə skɑrf əˈraʊnd hɚ nɛk/' },
  { en: 'I need gloves for winter.', id: 'Saya butuh sarung tangan untuk musim dingin.', ipa: '/aɪ nid ɡlʌvz fɔr ˈwɪntɚ/' },
  { en: 'This belt is too tight.', id: 'Ikat pinggang ini terlalu ketat.', ipa: '/ðɪs bɛlt ɪz tu taɪt/' },
  { en: 'He wears a tie at work.', id: 'Dia pakai dasi saat kerja.', ipa: '/hi wɛrz ə taɪ æt wɝk/' },
  { en: 'He bought a suit for the wedding.', id: 'Dia membeli jas setelan untuk pernikahan.', ipa: '/hi bɔt ə sut fɔr ðə ˈwɛdɪŋ/' },
  { en: 'Students wear a uniform here.', id: 'Siswa di sini memakai seragam.', ipa: '/ˈstudənts wɛr ə ˈjunəˌfɔrm hɪr/' },
  { en: 'My pajamas are very soft.', id: 'Piyama saya sangat lembut.', ipa: '/maɪ pəˈdʒɑməz ɑr ˈvɛri sɔft/' },
  { en: 'Pack enough underwear for the trip.', id: 'Bawa pakaian dalam yang cukup untuk perjalanan.', ipa: '/pæk ɪˈnʌf ˈʌndɚˌwɛr fɔr ðə trɪp/' },
  { en: 'She bought a new bra.', id: 'Dia membeli bra baru.', ipa: '/ʃi bɔt ə nu brɑ/' },
  { en: 'My phone is in my pocket.', id: 'HP saya ada di saku saya.', ipa: '/maɪ foʊn ɪz ɪn maɪ ˈpɑkət/' },
  { en: 'The zipper is broken.', id: 'Ritsletingnya rusak.', ipa: '/ðə ˈzɪpɚ ɪz ˈbroʊkən/' },
  { en: 'One button is missing.', id: 'Satu kancing hilang.', ipa: '/wʌn ˈbʌtən ɪz ˈmɪsɪŋ/' },
  { en: 'The sleeve is too short.', id: 'Lengan bajunya terlalu pendek.', ipa: '/ðə sliv ɪz tu ʃɔrt/' },
  { en: 'The shirt collar is clean.', id: 'Kerah kemejanya bersih.', ipa: '/ðə ʃɝt ˈkɑlər ɪz klin/' },
  { en: 'What size do you wear?', id: 'Kamu pakai ukuran apa?', ipa: '/wʌt saɪz du ju wɛr/' },
  { en: 'This shirt is too small.', id: 'Kemeja ini terlalu kecil.', ipa: '/ðɪs ʃɝt ɪz tu smɔl/' },
  { en: 'I usually wear medium.', id: 'Saya biasanya pakai ukuran sedang.', ipa: '/aɪ ˈjuʒuəli wɛr ˈmidiəm/' },
  { en: 'Can I try a large size?', id: 'Boleh saya coba ukuran besar?', ipa: '/kæn aɪ traɪ ə lɑrdʒ saɪz/' },
  { en: 'These shoes fit well.', id: 'Sepatu ini pas dan nyaman.', ipa: '/ðiz ʃuz fɪt wɛl/' },
  { en: 'This jacket is too loose.', id: 'Jaket ini terlalu longgar.', ipa: '/ðɪs ˈdʒækɪt ɪz tu lus/' },
  { en: 'These pants feel tight.', id: 'Celana ini terasa ketat.', ipa: '/ðiz pænts fil taɪt/' },
  { en: 'Please wear clean clothes.', id: 'Tolong pakai pakaian yang bersih.', ipa: '/pliz wɛr klin kloʊðz/' },
  { en: 'My shoes are dirty.', id: 'Sepatu saya kotor.', ipa: '/maɪ ʃuz ɑr ˈdɝti/' },
  { en: 'I bought a new jacket.', id: 'Saya membeli jaket baru.', ipa: '/aɪ bɔt ə nu ˈdʒækɪt/' },
  { en: 'These old jeans are still good.', id: 'Jeans lama ini masih bagus.', ipa: '/ðiz oʊld dʒinz ɑr stɪl ɡʊd/' },
  { en: 'She has a fashionable style.', id: 'Dia punya gaya yang modis.', ipa: '/ʃi hæz ə ˈfæʃənəbəl staɪl/' },
  { en: 'Today I wear casual clothes.', id: 'Hari ini saya pakai pakaian kasual.', ipa: '/təˈdeɪ aɪ wɛr ˈkæʒuəl kloʊðz/' },
  { en: 'This meeting needs formal clothes.', id: 'Rapat ini butuh pakaian formal.', ipa: '/ðɪs ˈmitɪŋ nidz ˈfɔrməl kloʊðz/' },
  { en: 'I wear a white shirt to work.', id: 'Saya pakai kemeja putih ke kantor.', ipa: '/aɪ wɛr ə waɪt ʃɝt tə wɝk/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(CLOTHES_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing CLOTHES_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Clothes topic: ${examples.length} translations + IPA`);
