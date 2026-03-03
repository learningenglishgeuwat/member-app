import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/places.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const PLACES_ROWS = [
  { en: 'This place is very quiet.', id: 'Tempat ini sangat tenang.', ipa: '/ðɪs pleɪs ɪz ˈvɛri ˈkwaɪət/' },
  { en: 'I live in a big city.', id: 'Saya tinggal di kota besar.', ipa: '/aɪ lɪv ɪn ə bɪɡ ˈsɪti/' },
  { en: 'My town is near the beach.', id: 'Kota kecil saya dekat pantai.', ipa: '/maɪ taʊn ɪz nɪr ðə bitʃ/' },
  { en: 'Her grandparents live in a village.', id: 'Kakek-neneknya tinggal di desa.', ipa: '/hɚ ˈɡrænˌpɛrənts lɪv ɪn ə ˈvɪlɪdʒ/' },
  { en: 'Indonesia is a beautiful country.', id: 'Indonesia adalah negara yang indah.', ipa: '/ˌɪndoʊˈniʒə ɪz ə ˈbjutəfəl ˈkʌntri/' },
  { en: 'Jakarta is the capital city.', id: 'Jakarta adalah ibu kota.', ipa: '/dʒəˈkɑrtə ɪz ðə ˈkæpətəl ˈsɪti/' },
  { en: 'This area is very busy.', id: 'Area ini sangat ramai.', ipa: '/ðɪs ˈɛriə ɪz ˈvɛri ˈbɪzi/' },
  { en: 'My neighborhood is safe.', id: 'Lingkungan saya aman.', ipa: '/maɪ ˈneɪbɚˌhʊd ɪz seɪf/' },
  { en: 'Their house is on this street.', id: 'Rumah mereka ada di jalan ini.', ipa: '/ðɛr haʊs ɪz ɑn ðɪs strit/' },
  { en: 'The road is wet after rain.', id: 'Jalan rayanya basah setelah hujan.', ipa: '/ðə roʊd ɪz wɛt ˈæftɚ reɪn/' },
  { en: 'Children play in the park.', id: 'Anak-anak bermain di taman.', ipa: '/ˈtʃɪldrən pleɪ ɪn ðə pɑrk/' },
  { en: 'My mother works in the garden.', id: 'Ibu saya berkebun di kebun.', ipa: '/maɪ ˈmʌðɚ wɝks ɪn ðə ˈɡɑrdən/' },
  { en: 'Let us meet at the town square.', id: 'Ayo ketemu di alun-alun kota.', ipa: '/lɛt ʌs mit æt ðə taʊn skwɛr/' },
  { en: 'I buy vegetables at the market.', id: 'Saya beli sayur di pasar.', ipa: '/aɪ baɪ ˈvɛdʒtəbəlz æt ðə ˈmɑrkət/' },
  { en: 'We go to the mall on weekends.', id: 'Kami pergi ke mal saat akhir pekan.', ipa: '/wi ɡoʊ tə ðə mɔl ɑn ˈwikˌɛndz/' },
  { en: 'That shop sells cheap shoes.', id: 'Toko itu menjual sepatu murah.', ipa: '/ðæt ʃɑp sɛlz tʃip ʃuz/' },
  { en: 'The store closes at nine.', id: 'Toko itu tutup jam sembilan.', ipa: '/ðə stɔr ˈkloʊzɪz æt naɪn/' },
  { en: 'This restaurant serves local food.', id: 'Restoran ini menyajikan makanan lokal.', ipa: '/ðɪs ˈrɛstərənt sɝvz ˈloʊkəl fud/' },
  { en: 'We studied in a cafe.', id: 'Kami belajar di kafe.', ipa: '/wi ˈstʌdid ɪn ə kæˈfeɪ/' },
  { en: 'They stayed at a hotel downtown.', id: 'Mereka menginap di hotel di pusat kota.', ipa: '/ðeɪ steɪd æt ə hoʊˈtɛl ˈdaʊnˌtaʊn/' },
  { en: 'She lives in an apartment.', id: 'Dia tinggal di apartemen.', ipa: '/ʃi lɪvz ɪn ən əˈpɑrtmənt/' },
  { en: 'Their house is near the station.', id: 'Rumah mereka dekat stasiun.', ipa: '/ðɛr haʊs ɪz nɪr ðə ˈsteɪʃən/' },
  { en: 'My office is on the third floor.', id: 'Kantor saya ada di lantai tiga.', ipa: '/maɪ ˈɔfɪs ɪz ɑn ðə θɝd flɔr/' },
  { en: 'The school starts at seven.', id: 'Sekolah mulai jam tujuh.', ipa: '/ðə skul stɑrts æt ˈsɛvən/' },
  { en: 'His campus is far from home.', id: 'Kampusnya jauh dari rumah.', ipa: '/hɪz ˈkæmpəs ɪz fɑr frʌm hoʊm/' },
  { en: 'I read books in the library.', id: 'Saya membaca buku di perpustakaan.', ipa: '/aɪ rid bʊks ɪn ðə ˈlaɪˌbrɛri/' },
  { en: 'She works at the hospital.', id: 'Dia bekerja di rumah sakit.', ipa: '/ʃi wɝks æt ðə ˈhɑspɪtəl/' },
  { en: 'The clinic opens at eight.', id: 'Kliniknya buka jam delapan.', ipa: '/ðə ˈklɪnɪk ˈoʊpənz æt eɪt/' },
  { en: 'Buy medicine at the pharmacy.', id: 'Beli obat di apotek.', ipa: '/baɪ ˈmɛdəsən æt ðə ˈfɑrməsi/' },
  { en: 'I need to go to the bank.', id: 'Saya perlu pergi ke bank.', ipa: '/aɪ nid tə ɡoʊ tə ðə bæŋk/' },
  { en: 'The post office is next to the bank.', id: 'Kantor pos ada di sebelah bank.', ipa: '/ðə poʊst ˈɔfɪs ɪz nɛkst tə ðə bæŋk/' },
  { en: 'Ask at the police station.', id: 'Tanya di kantor polisi.', ipa: '/æsk æt ðə pəˈlis ˈsteɪʃən/' },
  { en: 'The airport is very crowded today.', id: 'Bandara sangat ramai hari ini.', ipa: '/ði ˈɛrˌpɔrt ɪz ˈvɛri ˈkraʊdəd təˈdeɪ/' },
  { en: 'Meet me at the station.', id: 'Temui saya di stasiun.', ipa: '/mit mi æt ðə ˈsteɪʃən/' },
  { en: 'The bus terminal is far from here.', id: 'Terminal busnya jauh dari sini.', ipa: '/ðə bʌs ˈtɝmənəl ɪz fɑr frʌm hɪr/' },
  { en: 'Many ships stop at the harbor.', id: 'Banyak kapal berhenti di pelabuhan.', ipa: '/ˈmɛni ʃɪps stɑp æt ðə ˈhɑrbɚ/' },
  { en: 'We walked along the beach.', id: 'Kami berjalan menyusuri pantai.', ipa: '/wi wɔkt əˈlɔŋ ðə bitʃ/' },
  { en: 'The mountain is very high.', id: 'Gunung itu sangat tinggi.', ipa: '/ðə ˈmaʊntən ɪz ˈvɛri haɪ/' },
  { en: 'There is a river near my house.', id: 'Ada sungai dekat rumah saya.', ipa: '/ðɛr ɪz ə ˈrɪvɚ nɪr maɪ haʊs/' },
  { en: 'We had a picnic by the lake.', id: 'Kami piknik di tepi danau.', ipa: '/wi hæd ə ˈpɪknɪk baɪ ðə leɪk/' },
  { en: 'Bali is a famous island.', id: 'Bali adalah pulau yang terkenal.', ipa: '/ˈbɑli ɪz ə ˈfeɪməs ˈaɪlənd/' },
  { en: 'The forest is very quiet.', id: 'Hutannya sangat tenang.', ipa: '/ðə ˈfɔrɪst ɪz ˈvɛri ˈkwaɪət/' },
  { en: 'Cross the bridge and turn right.', id: 'Seberangi jembatan lalu belok kanan.', ipa: '/krɔs ðə brɪdʒ ənd tɝn raɪt/' },
  { en: 'The cafe is on the corner.', id: 'Kafenya ada di sudut jalan.', ipa: '/ðə kæˈfeɪ ɪz ɑn ðə ˈkɔrnɚ/' },
  { en: 'Turn left at the intersection.', id: 'Belok kiri di persimpangan.', ipa: '/tɝn lɛft æt ði ˌɪntɚˈsɛkʃən/' },
  { en: 'Her office is downtown.', id: 'Kantornya ada di pusat kota.', ipa: '/hɚ ˈɔfɪs ɪz ˈdaʊnˌtaʊn/' },
  { en: 'They live in the suburb.', id: 'Mereka tinggal di pinggiran kota.', ipa: '/ðeɪ lɪv ɪn ðə ˈsʌbɝb/' },
  { en: 'The city is in the north.', id: 'Kota itu ada di utara.', ipa: '/ðə ˈsɪti ɪz ɪn ðə nɔrθ/' },
  { en: 'My office is in the south area.', id: 'Kantor saya ada di area selatan.', ipa: '/maɪ ˈɔfɪs ɪz ɪn ðə saʊθ ˈɛriə/' },
  { en: 'The city center is always busy.', id: 'Pusat kota selalu ramai.', ipa: '/ðə ˈsɪti ˈsɛntɚ ɪz ˈɔlweɪz ˈbɪzi/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(PLACES_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing PLACES_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Places topic: ${examples.length} translations + IPA`);
