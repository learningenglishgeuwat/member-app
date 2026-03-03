import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/electronics.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const ELECTRONICS_ROWS = [
  { en: 'I like learning about electronics.', id: 'Saya suka belajar tentang elektronik.', ipa: '/aɪ laɪk ˈlɝnɪŋ əˈbaʊt ɪˌlɛkˈtrɑnɪks/' },
  { en: 'This device is very useful.', id: 'Perangkat ini sangat berguna.', ipa: '/ðɪs dɪˈvaɪs ɪz ˈvɛri ˈjusfəl/' },
  { en: 'He bought a new gadget.', id: 'Dia membeli gadget baru.', ipa: '/hi bɔt ə nu ˈɡædʒət/' },
  { en: 'This machine works fast.', id: 'Mesin ini bekerja cepat.', ipa: '/ðɪs məˈʃin wɝks fæst/' },
  { en: 'This appliance saves time.', id: 'Alat ini menghemat waktu.', ipa: '/ðɪs əˈplaɪəns seɪvz taɪm/' },
  { en: 'My phone battery is low.', id: 'Baterai ponsel saya tinggal sedikit.', ipa: '/maɪ foʊn ˈbætəri ɪz loʊ/' },
  { en: 'She uses a smartphone for work.', id: 'Dia memakai smartphone untuk kerja.', ipa: '/ʃi ˈjuzɪz ə ˈsmɑrtˌfoʊn fɔr wɝk/' },
  { en: 'I forgot my mobile phone at home.', id: 'Saya lupa bawa ponsel di rumah.', ipa: '/aɪ fərˈɡɑt maɪ ˈmoʊbəɪl foʊn æt hoʊm/' },
  { en: 'My son studies with a tablet.', id: 'Anak saya belajar pakai tablet.', ipa: '/maɪ sʌn ˈstʌdiz wɪð ə ˈtæblət/' },
  { en: 'I bring my laptop to class.', id: 'Saya membawa laptop ke kelas.', ipa: '/aɪ brɪŋ maɪ ˈlæpˌtɑp tə klæs/' },
  { en: 'The computer is very slow.', id: 'Komputernya sangat lambat.', ipa: '/ðə kəmˈpjutər ɪz ˈvɛri sloʊ/' },
  { en: 'He uses a desktop at the office.', id: 'Dia memakai komputer desktop di kantor.', ipa: '/hi ˈjuzɪz ə ˈdɛsktɑp æt ði ˈɔfəs/' },
  { en: 'The monitor is too bright.', id: 'Monitornya terlalu terang.', ipa: '/ðə ˈmɑnətər ɪz tu braɪt/' },
  { en: 'My screen is cracked.', id: 'Layar saya retak.', ipa: '/maɪ skrin ɪz krækt/' },
  { en: 'This keyboard is comfortable.', id: 'Keyboard ini nyaman dipakai.', ipa: '/ðɪs ˈkibɔrd ɪz ˈkʌmftərbəl/' },
  { en: 'I need a wireless mouse.', id: 'Saya butuh mouse nirkabel.', ipa: '/aɪ nid ə ˈwaɪərləs maʊs/' },
  { en: 'The printer has no paper.', id: 'Printer-nya kehabisan kertas.', ipa: '/ðə ˈprɪntər hæz noʊ ˈpeɪpər/' },
  { en: 'Please use the scanner first.', id: 'Tolong pakai scanner dulu.', ipa: '/pliz juz ðə ˈskænər fɝst/' },
  { en: 'This camera takes clear photos.', id: 'Kamera ini menghasilkan foto yang jelas.', ipa: '/ðɪs ˈkæmərə teɪks klɪr ˈfoʊtoʊz/' },
  { en: 'Turn on your webcam during the meeting.', id: 'Nyalakan webcam saat rapat.', ipa: '/tɝn ɑn jʊr ˈwɛbˌkæm ˈdʊrɪŋ ðə ˈmitɪŋ/' },
  { en: 'Your microphone is muted.', id: 'Mikrofonmu sedang mute.', ipa: '/jʊr ˈmaɪkrəˌfoʊn ɪz ˈmjutəd/' },
  { en: 'The speaker sound is loud.', id: 'Suara speakernya keras.', ipa: '/ðə ˈspikər saʊnd ɪz laʊd/' },
  { en: 'I use headphones when studying.', id: 'Saya pakai headphone saat belajar.', ipa: '/aɪ juz ˈhɛdˌfoʊnz wɛn ˈstʌdiɪŋ/' },
  { en: 'My earphones are in my bag.', id: 'Earphone saya ada di tas.', ipa: '/maɪ ˈɪrˌfoʊnz ɑr ɪn maɪ bæɡ/' },
  { en: 'Where is my phone charger?', id: 'Di mana charger ponsel saya?', ipa: '/wɛr ɪz maɪ foʊn ˈtʃɑrdʒər/' },
  { en: 'This charging cable is broken.', id: 'Kabel chargernya rusak.', ipa: '/ðɪs ˈtʃɑrdʒɪŋ ˈkeɪbəl ɪz ˈbroʊkən/' },
  { en: 'The battery is almost empty.', id: 'Baterainya hampir habis.', ipa: '/ðə ˈbætəri ɪz ˈɔlmoʊst ˈɛmpti/' },
  { en: 'I always carry a power bank.', id: 'Saya selalu membawa power bank.', ipa: '/aɪ ˈɔlweɪz ˈkæri ə ˈpaʊər bæŋk/' },
  { en: 'Plug it into the socket.', id: 'Colokkan ke stopkontak.', ipa: '/plʌɡ ɪt ˈɪntu ðə ˈsɑkət/' },
  { en: 'The plug is loose.', id: 'Colokannya longgar.', ipa: '/ðə plʌɡ ɪz lus/' },
  { en: 'Turn the switch off.', id: 'Matikan saklarnya.', ipa: '/tɝn ðə swɪtʃ ɔf/' },
  { en: 'I cannot find the remote control.', id: 'Saya tidak bisa menemukan remote.', ipa: '/aɪ ˈkænɑt faɪnd ðə rɪˈmoʊt kənˈtroʊl/' },
  { en: 'The television is in the living room.', id: 'Televisinya ada di ruang tamu.', ipa: '/ðə ˈtɛləˌvɪʒən ɪz ɪn ðə ˈlɪvɪŋ rum/' },
  { en: 'We watch movies on a smart TV.', id: 'Kami menonton film di smart TV.', ipa: '/wi wɑtʃ ˈmuviz ɑn ə smɑrt ˌtiˈvi/' },
  { en: 'My grandfather listens to the radio.', id: 'Kakek saya mendengarkan radio.', ipa: '/maɪ ˈɡrændˌfɑðər ˈlɪsənz tə ðə ˈreɪdioʊ/' },
  { en: 'Restart the router, please.', id: 'Restart routernya dulu, ya.', ipa: '/riˈstɑrt ðə ˈraʊtər pliz/' },
  { en: 'The Wi-Fi is unstable today.', id: 'Wi-Fi-nya tidak stabil hari ini.', ipa: '/ðə ˈwaɪˌfaɪ ɪz ʌnˈsteɪbəl təˈdeɪ/' },
  { en: 'Turn on Bluetooth first.', id: 'Nyalakan Bluetooth dulu.', ipa: '/tɝn ɑn ˈbluˌtuθ fɝst/' },
  { en: 'Save the file to your USB drive.', id: 'Simpan file ke flashdiskmu.', ipa: '/seɪv ðə faɪl tə jʊr ˌju ɛs ˈbi draɪv/' },
  { en: 'My hard drive is full.', id: 'Hard disk saya penuh.', ipa: '/maɪ hɑrd draɪv ɪz fʊl/' },
  { en: 'Insert the memory card carefully.', id: 'Masukkan kartu memori dengan hati-hati.', ipa: '/ɪnˈsɝt ðə ˈmɛməri kɑrd ˈkɛrfəli/' },
  { en: 'Please update the software.', id: 'Tolong perbarui softwarenya.', ipa: '/pliz ʌpˈdeɪt ðə ˈsɔftˌwɛr/' },
  { en: 'I downloaded a new app.', id: 'Saya mengunduh aplikasi baru.', ipa: '/aɪ ˌdaʊnˈloʊdəd ə nu æp/' },
  { en: 'You need to update your phone.', id: 'Kamu perlu memperbarui ponselmu.', ipa: '/ju nid tə ʌpˈdeɪt jʊr foʊn/' },
  { en: 'The file is ready to download.', id: 'Filenya siap diunduh.', ipa: '/ðə faɪl ɪz ˈrɛdi tə ˈdaʊnˌloʊd/' },
  { en: 'Please upload your document.', id: 'Tolong unggah dokumenmu.', ipa: '/pliz ˈʌpˌloʊd jʊr ˈdɑkjəmənt/' },
  { en: 'Connect the device to Wi-Fi.', id: 'Hubungkan perangkat ke Wi-Fi.', ipa: '/kəˈnɛkt ðə dɪˈvaɪs tə ˈwaɪˌfaɪ/' },
  { en: 'Disconnect the cable first.', id: 'Lepaskan kabelnya dulu.', ipa: '/ˌdɪskəˈnɛkt ðə ˈkeɪbəl fɝst/' },
  { en: 'I need to repair my laptop.', id: 'Saya perlu memperbaiki laptop saya.', ipa: '/aɪ nid tə rɪˈpɛr maɪ ˈlæpˌtɑp/' },
  { en: 'My old phone is broken.', id: 'Ponsel lama saya rusak.', ipa: '/maɪ oʊld foʊn ɪz ˈbroʊkən/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(ELECTRONICS_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing ELECTRONICS_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Electronics topic: ${examples.length} translations + IPA`);
