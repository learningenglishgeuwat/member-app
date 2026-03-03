import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/transport.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const TRANSPORT_ROWS = [
  { en: 'Public transport is cheap here.', id: 'Transportasi umum di sini murah.', ipa: '/ˈpʌblɪk ˈtrænspɔrt ɪz tʃip hɪr/' },
  { en: 'This vehicle is very old.', id: 'Kendaraan ini sangat tua.', ipa: '/ðɪs ˈviəkəl ɪz ˈvɛri oʊld/' },
  { en: 'I go to work by car.', id: 'Saya pergi kerja naik mobil.', ipa: '/aɪ ɡoʊ tə wɝk baɪ kɑr/' },
  { en: 'We took a taxi to the hotel.', id: 'Kami naik taksi ke hotel.', ipa: '/wi tʊk ə ˈtæksi tə ðə hoʊˈtɛl/' },
  { en: 'The bus comes every ten minutes.', id: 'Busnya datang tiap sepuluh menit.', ipa: '/ðə bʌs kʌmz ˈɛvri tɛn ˈmɪnɪts/' },
  { en: 'A minibus stops near my house.', id: 'Minibus berhenti dekat rumah saya.', ipa: '/ə ˈmɪniˌbʌs stɑps nɪr maɪ haʊs/' },
  { en: 'I take the train to the city.', id: 'Saya naik kereta ke kota.', ipa: '/aɪ teɪk ðə treɪn tə ðə ˈsɪti/' },
  { en: 'The subway is fast in the morning.', id: 'Kereta bawah tanah cepat di pagi hari.', ipa: '/ðə ˈsʌbweɪ ɪz fæst ɪn ðə ˈmɔrnɪŋ/' },
  { en: 'The tram stops in front of the mall.', id: 'Trem berhenti di depan mal.', ipa: '/ðə træm stɑps ɪn frʌnt əv ðə mɔl/' },
  { en: 'He rides a motorcycle to campus.', id: 'Dia naik motor ke kampus.', ipa: '/hi raɪdz ə ˈmoʊtɚˌsaɪkəl tə ˈkæmpəs/' },
  { en: 'I go to school by bike.', id: 'Saya pergi ke sekolah naik sepeda.', ipa: '/aɪ ɡoʊ tə skul baɪ baɪk/' },
  { en: 'She bought a new scooter.', id: 'Dia membeli skuter baru.', ipa: '/ʃi bɔt ə nu ˈskutɚ/' },
  { en: 'A van delivers the packages.', id: 'Sebuah van mengantar paket-paket.', ipa: '/ə væn dɪˈlɪvɚz ðə ˈpækɪdʒɪz/' },
  { en: 'The truck carries heavy boxes.', id: 'Truk itu membawa kotak-kotak berat.', ipa: '/ðə trʌk ˈkæriz ˈhɛvi ˈbɑksɪz/' },
  { en: 'The ship leaves at noon.', id: 'Kapalnya berangkat tengah hari.', ipa: '/ðə ʃɪp livz æt nun/' },
  { en: 'We crossed the river by boat.', id: 'Kami menyeberangi sungai naik perahu.', ipa: '/wi krɔst ðə ˈrɪvɚ baɪ boʊt/' },
  { en: 'The ferry is full today.', id: 'Feri penuh hari ini.', ipa: '/ðə ˈfɛri ɪz fʊl təˈdeɪ/' },
  { en: 'Our plane is on time.', id: 'Pesawat kami tepat waktu.', ipa: '/aʊɚ pleɪn ɪz ɑn taɪm/' },
  { en: 'We arrived at the airport early.', id: 'Kami tiba di bandara lebih awal.', ipa: '/wi əˈraɪvd æt ði ˈɛrˌpɔrt ˈɝli/' },
  { en: 'Meet me at the station.', id: 'Temui saya di stasiun.', ipa: '/mit mi æt ðə ˈsteɪʃən/' },
  { en: 'The bus terminal is very crowded.', id: 'Terminal busnya sangat ramai.', ipa: '/ðə bʌs ˈtɝmənəl ɪz ˈvɛri ˈkraʊdəd/' },
  { en: 'The cargo is at the port.', id: 'Kargonya ada di pelabuhan.', ipa: '/ðə ˈkɑrɡoʊ ɪz æt ðə pɔrt/' },
  { en: 'The train is at platform two.', id: 'Kereta ada di peron dua.', ipa: '/ðə treɪn ɪz æt ˈplætfɔrm tu/' },
  { en: 'Wait for me at the bus stop.', id: 'Tunggu saya di halte bus.', ipa: '/weɪt fɔr mi æt ðə ˈbʌs stɑp/' },
  { en: 'I bought a train ticket online.', id: 'Saya beli tiket kereta secara online.', ipa: '/aɪ bɔt ə treɪn ˈtɪkət ˈɔnˌlaɪn/' },
  { en: 'The bus fare is cheap.', id: 'Tarif busnya murah.', ipa: '/ðə bʌs fɛr ɪz tʃip/' },
  { en: 'Check the bus schedule first.', id: 'Cek jadwal bus dulu.', ipa: '/tʃɛk ðə bʌs ˈskɛdʒuːl fɝst/' },
  { en: 'This route is faster.', id: 'Rute ini lebih cepat.', ipa: '/ðɪs rut ɪz ˈfæstɚ/' },
  { en: 'Look at the subway map.', id: 'Lihat peta subway-nya.', ipa: '/lʊk æt ðə ˈsʌbweɪ mæp/' },
  { en: 'You need one transfer downtown.', id: 'Kamu perlu satu kali transit ke pusat kota.', ipa: '/ju nid wʌn trænsˈfɝ ˈdaʊnˌtaʊn/' },
  { en: 'The driver is very helpful.', id: 'Sopirnya sangat membantu.', ipa: '/ðə ˈdraɪvɚ ɪz ˈvɛri ˈhɛlpfəl/' },
  { en: 'Every passenger needs a ticket.', id: 'Setiap penumpang butuh tiket.', ipa: '/ˈɛvri ˈpæsəndʒɚ nidz ə ˈtɪkət/' },
  { en: 'Is this seat free?', id: 'Kursi ini kosong?', ipa: '/ɪz ðɪs sit fri/' },
  { en: 'Traffic is bad this morning.', id: 'Lalu lintas pagi ini macet.', ipa: '/ˈtræfɪk ɪz bæd ðɪs ˈmɔrnɪŋ/' },
  { en: 'We are stuck in a jam.', id: 'Kami terjebak macet.', ipa: '/wi ɑr stʌk ɪn ə dʒæm/' },
  { en: 'The road is wet.', id: 'Jalannya basah.', ipa: '/ðə roʊd ɪz wɛt/' },
  { en: 'Turn left at the next street.', id: 'Belok kiri di jalan berikutnya.', ipa: '/tɝn lɛft æt ðə nɛkst strit/' },
  { en: 'Cross the bridge and go straight.', id: 'Seberangi jembatan lalu jalan lurus.', ipa: '/krɔs ðə brɪdʒ ənd ɡoʊ streɪt/' },
  { en: 'Use the crosswalk to cross safely.', id: 'Gunakan zebra cross agar menyeberang dengan aman.', ipa: '/juz ðə ˈkrɔsˌwɔk tə krɔs ˈseɪfli/' },
  { en: 'Stop at the red signal.', id: 'Berhenti di lampu merah.', ipa: '/stɑp æt ðə rɛd ˈsɪɡnəl/' },
  { en: 'Parking is full here.', id: 'Parkir di sini penuh.', ipa: '/ˈpɑrkɪŋ ɪz fʊl hɪr/' },
  { en: 'The car is in the garage.', id: 'Mobilnya ada di garasi.', ipa: '/ðə kɑr ɪz ɪn ðə ɡəˈrɑʒ/' },
  { en: 'We stopped at a gas station.', id: 'Kami berhenti di pom bensin.', ipa: '/wi stɑpt æt ə ɡæs ˈsteɪʃən/' },
  { en: 'Do you have a driver license?', id: 'Kamu punya SIM?', ipa: '/du ju hæv ə ˈdraɪvɚ ˈlaɪsəns/' },
  { en: 'Wear your helmet when riding.', id: 'Pakai helm saat berkendara.', ipa: '/wɛr jʊr ˈhɛlmət wɛn ˈraɪdɪŋ/' },
  { en: 'What time will you arrive?', id: 'Kamu akan tiba jam berapa?', ipa: '/wʌt taɪm wɪl ju əˈraɪv/' },
  { en: 'The train will depart at six.', id: 'Kereta akan berangkat jam enam.', ipa: '/ðə treɪn wɪl dɪˈpɑrt æt sɪks/' },
  { en: 'Our flight has a delay.', id: 'Penerbangan kami mengalami keterlambatan.', ipa: '/aʊɚ flaɪt hæz ə dɪˈleɪ/' },
  { en: 'Please come early to the station.', id: 'Tolong datang lebih awal ke stasiun.', ipa: '/pliz kʌm ˈɝli tə ðə ˈsteɪʃən/' },
  { en: 'The bus is late again.', id: 'Busnya terlambat lagi.', ipa: '/ðə bʌs ɪz leɪt əˈɡɛn/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(TRANSPORT_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing TRANSPORT_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Transport topic: ${examples.length} translations + IPA`);
