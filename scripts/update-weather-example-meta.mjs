import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/weather.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const WEATHER_ROWS = [
  { en: 'The weather is nice today.', id: 'Cuacanya enak hari ini.', ipa: '/ðə ˈwɛðər ɪz naɪs təˈdeɪ/' },
  { en: 'The temperature is very high.', id: 'Suhunya sangat tinggi.', ipa: '/ðə ˈtɛmprətʃər ɪz ˈvɛri haɪ/' },
  { en: 'Check the forecast before you travel.', id: 'Cek prakiraan cuaca sebelum kamu bepergian.', ipa: '/tʃɛk ðə ˈfɔrkæst bɪˈfɔr ju ˈtrævəl/' },
  { en: 'The climate here is humid.', id: 'Iklim di sini lembap.', ipa: '/ðə ˈklaɪmət hɪr ɪz ˈhjumɪd/' },
  { en: 'My favorite season is spring.', id: 'Musim favorit saya musim semi.', ipa: '/maɪ ˈfeɪvərɪt ˈsizən ɪz sprɪŋ/' },
  { en: 'It is sunny this morning.', id: 'Pagi ini cerah.', ipa: '/ɪt ɪz ˈsʌni ðɪs ˈmɔrnɪŋ/' },
  { en: 'The sky is cloudy now.', id: 'Langit sekarang berawan.', ipa: '/ðə skaɪ ɪz ˈklaʊdi naʊ/' },
  { en: 'It is windy near the beach.', id: 'Di dekat pantai berangin.', ipa: '/ɪt ɪz ˈwɪndi nɪr ðə bitʃ/' },
  { en: 'Today is rainy.', id: 'Hari ini hujan.', ipa: '/təˈdeɪ ɪz ˈreɪni/' },
  { en: 'The sea is stormy tonight.', id: 'Laut sedang bergelora malam ini.', ipa: '/ðə si ɪz ˈstɔrmi təˈnaɪt/' },
  { en: 'The road is foggy in the morning.', id: 'Jalanan berkabut di pagi hari.', ipa: '/ðə roʊd ɪz ˈfɔɡi ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'It feels humid today.', id: 'Hari ini terasa lembap.', ipa: '/ɪt filz ˈhjumɪd təˈdeɪ/' },
  { en: 'The air is very dry.', id: 'Udaranya sangat kering.', ipa: '/ði ɛr ɪz ˈvɛri draɪ/' },
  { en: 'It is hot outside.', id: 'Di luar panas.', ipa: '/ɪt ɪz hɑt aʊtˈsaɪd/' },
  { en: 'The afternoon is warm.', id: 'Sore ini hangat.', ipa: '/ði ˌæftərˈnun ɪz wɔrm/' },
  { en: 'The evening is cool.', id: 'Malam ini sejuk.', ipa: '/ði ˈivnɪŋ ɪz kul/' },
  { en: 'It is cold at night.', id: 'Malam hari dingin.', ipa: '/ɪt ɪz koʊld æt naɪt/' },
  { en: 'It is freezing this morning.', id: 'Pagi ini dinginnya menusuk.', ipa: '/ɪt ɪz ˈfrizɪŋ ðɪs ˈmɔrnɪŋ/' },
  { en: 'We saw snow last winter.', id: 'Kami melihat salju musim dingin lalu.', ipa: '/wi sɔ snoʊ læst ˈwɪntər/' },
  { en: 'Heavy rain starts at night.', id: 'Hujan deras mulai malam hari.', ipa: '/ˈhɛvi reɪn stɑrts æt naɪt/' },
  { en: 'It is only drizzle now.', id: 'Sekarang cuma gerimis.', ipa: '/ɪt ɪz ˈoʊnli ˈdrɪzəl naʊ/' },
  { en: 'A shower may come this afternoon.', id: 'Sore ini mungkin turun hujan sebentar.', ipa: '/ə ˈʃaʊər meɪ kʌm ðɪs ˌæftərˈnun/' },
  { en: 'I heard thunder at midnight.', id: 'Saya dengar guntur tengah malam.', ipa: '/aɪ hɝd ˈθʌndər æt mɪdˈnaɪt/' },
  { en: 'Lightning is very bright.', id: 'Kilatnya sangat terang.', ipa: '/ˈlaɪtnɪŋ ɪz ˈvɛri braɪt/' },
  { en: 'A storm is coming tonight.', id: 'Badai akan datang malam ini.', ipa: '/ə stɔrm ɪz ˈkʌmɪŋ təˈnaɪt/' },
  { en: 'The wind is strong today.', id: 'Anginnya kencang hari ini.', ipa: '/ðə wɪnd ɪz strɔŋ təˈdeɪ/' },
  { en: 'A cool breeze comes from the sea.', id: 'Angin sepoi-sepoi yang sejuk datang dari laut.', ipa: '/ə kul briz kʌmz frəm ðə si/' },
  { en: 'A gust moved the door.', id: 'Hembusan angin kencang menggerakkan pintu.', ipa: '/ə ɡʌst muvd ðə dɔr/' },
  { en: 'The hurricane warning is serious.', id: 'Peringatan badai topan ini serius.', ipa: '/ðə ˈhɝɪˌkeɪn ˈwɔrnɪŋ ɪz ˈsɪriəs/' },
  { en: 'The village had a flood.', id: 'Desa itu mengalami banjir.', ipa: '/ðə ˈvɪlɪdʒ hæd ə flʌd/' },
  { en: 'The area suffers from drought.', id: 'Daerah itu mengalami kekeringan.', ipa: '/ði ˈɛriə ˈsʌfərz frəm draʊt/' },
  { en: 'The sun is very bright.', id: 'Mataharinya sangat terik.', ipa: '/ðə sʌn ɪz ˈvɛri braɪt/' },
  { en: 'Open the window for sunlight.', id: 'Buka jendela supaya sinar matahari masuk.', ipa: '/ˈoʊpən ðə ˈwɪndoʊ fɔr ˈsʌnlaɪt/' },
  { en: 'We watched the sunrise together.', id: 'Kami melihat matahari terbit bersama.', ipa: '/wi wɑtʃt ðə ˈsʌnˌraɪz təˈɡɛðər/' },
  { en: 'The sunset is beautiful.', id: 'Matahari terbenamnya indah.', ipa: '/ðə ˈsʌnˌsɛt ɪz ˈbjutəfəl/' },
  { en: 'Dark cloud covers the sky.', id: 'Awan gelap menutupi langit.', ipa: '/dɑrk klaʊd ˈkʌvərz ðə skaɪ/' },
  { en: 'The sky looks clear now.', id: 'Langit terlihat cerah sekarang.', ipa: '/ðə skaɪ lʊks klɪr naʊ/' },
  { en: 'Morning mist covers the field.', id: 'Kabut tipis pagi menutupi lapangan.', ipa: '/ˈmɔrnɪŋ mɪst ˈkʌvərz ðə fild/' },
  { en: 'There is ice on the road.', id: 'Ada es di jalan.', ipa: '/ðɛr ɪz aɪs ɑn ðə roʊd/' },
  { en: 'Frost appears in winter.', id: 'Embun beku muncul saat musim dingin.', ipa: '/frɔst əˈpɪrz ɪn ˈwɪntər/' },
  { en: 'I check a weather app every morning.', id: 'Saya cek aplikasi cuaca setiap pagi.', ipa: '/aɪ tʃɛk ə ˈwɛðər æp ˈɛvri ˈmɔrnɪŋ/' },
  { en: 'It is thirty degrees today.', id: 'Hari ini suhunya tiga puluh derajat.', ipa: '/ɪt ɪz ˈθɝti dɪˈɡriz təˈdeɪ/' },
  { en: 'Today is twenty-eight Celsius.', id: 'Hari ini dua puluh delapan derajat Celsius.', ipa: '/təˈdeɪ ɪz ˈtwɛnti eɪt ˈsɛlsiəs/' },
  { en: 'Bring an umbrella, please.', id: 'Tolong bawa payung.', ipa: '/brɪŋ ən ʌmˈbrɛlə pliz/' },
  { en: 'He wears a raincoat in heavy rain.', id: 'Dia pakai jas hujan saat hujan deras.', ipa: '/hi wɛrz ə ˈreɪnˌkoʊt ɪn ˈhɛvi reɪn/' },
  { en: 'The sky is clear tonight.', id: 'Langit cerah malam ini.', ipa: '/ðə skaɪ ɪz klɪr təˈnaɪt/' },
  { en: 'The weather can change quickly.', id: 'Cuaca bisa berubah cepat.', ipa: '/ðə ˈwɛðər kən tʃeɪndʒ ˈkwɪkli/' },
  { en: 'A sudden rain surprised us.', id: 'Hujan mendadak membuat kami kaget.', ipa: '/ə ˈsʌdən reɪn sərˈpraɪzd ʌs/' },
  { en: 'It is windy outside.', id: 'Di luar berangin.', ipa: '/ɪt ɪz ˈwɪndi aʊtˈsaɪd/' },
  { en: 'Stay inside during the storm.', id: 'Tetap di dalam saat badai.', ipa: '/steɪ ɪnˈsaɪd ˈdʊrɪŋ ðə stɔrm/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(WEATHER_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing WEATHER_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Weather topic: ${examples.length} translations + IPA`);
