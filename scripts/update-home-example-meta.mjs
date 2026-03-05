import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/home.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const HOME_ROWS = [
  { en: 'I am at home now.', id: 'Saya sedang di rumah sekarang.', ipa: '/aɪ æm æt hoʊm naʊ/' },
  { en: 'They live in a small house.', id: 'Mereka tinggal di rumah kecil.', ipa: '/ðeɪ lɪv ɪn ə smɔl haʊs/' },
  { en: 'She rents an apartment downtown.', id: 'Dia menyewa apartemen di pusat kota.', ipa: '/ʃi rɛnts ən əˈpɑrtmənt ˈdaʊnˌtaʊn/' },
  { en: 'This room is clean.', id: 'Ruangan ini bersih.', ipa: '/ðɪs rum ɪz klin/' },
  { en: 'My bedroom is upstairs.', id: 'Kamar tidur saya ada di lantai atas.', ipa: '/maɪ ˈbɛdrum ɪz ˌʌpˈstɛrz/' },
  { en: 'The bathroom is next to the kitchen.', id: 'Kamar mandi ada di sebelah dapur.', ipa: '/ðə ˈbæθrum ɪz nɛkst tə ðə ˈkɪtʃən/' },
  { en: 'My mother is in the kitchen.', id: 'Ibu saya ada di dapur.', ipa: '/maɪ ˈmʌðɚ ɪz ɪn ðə ˈkɪtʃən/' },
  { en: 'We watch TV in the living room.', id: 'Kami menonton TV di ruang tamu.', ipa: '/wi wɑtʃ ˌtiˈvi ɪn ðə ˈlɪvɪŋ rum/' },
  { en: 'Dinner is in the dining room.', id: 'Makan malam disajikan di ruang makan.', ipa: '/ˈdɪnɚ ɪz ɪn ðə ˈdaɪnɪŋ rum/' },
  { en: 'His bike is in the garage.', id: 'Sepedanya ada di garasi.', ipa: '/hɪz baɪk ɪz ɪn ðə ɡəˈrɑʒ/' },
  { en: 'She waters plants on the balcony.', id: 'Dia menyiram tanaman di balkon.', ipa: '/ʃi ˈwɔtɚz plænts ɑn ðə ˈbælkəni/' },
  { en: 'The children play in the yard.', id: 'Anak-anak bermain di halaman.', ipa: '/ðə ˈtʃɪldrən pleɪ ɪn ðə jɑrd/' },
  { en: 'Our garden has many flowers.', id: 'Taman kami punya banyak bunga.', ipa: '/aʊr ˈɡɑrdən hæz ˈmɛni ˈflaʊɚz/' },
  { en: 'The fence is white.', id: 'Pagarnya berwarna putih.', ipa: '/ðə fɛns ɪz waɪt/' },
  { en: 'The roof needs repair.', id: 'Atapnya perlu diperbaiki.', ipa: '/ðə ruf nidz rɪˈpɛr/' },
  { en: 'The ceiling is high.', id: 'Langit-langitnya tinggi.', ipa: '/ðə ˈsilɪŋ ɪz haɪ/' },
  { en: 'Please clean the floor.', id: 'Tolong bersihkan lantainya.', ipa: '/pliz klin ðə flɔr/' },
  { en: 'The wall is blue.', id: 'Dindingnya berwarna biru.', ipa: '/ðə wɔl ɪz blu/' },
  { en: 'Close the door, please.', id: 'Tolong tutup pintunya.', ipa: '/kloʊz ðə dɔr pliz/' },
  { en: 'Open the window.', id: 'Buka jendelanya.', ipa: '/ˈoʊpən ðə ˈwɪndoʊ/' },
  { en: 'Be careful on the stairs.', id: 'Hati-hati di tangga.', ipa: '/bi ˈkɛrfəl ɑn ðə stɛrz/' },
  { en: 'The hallway is narrow.', id: 'Lorongnya sempit.', ipa: '/ðə ˈhɔlˌweɪ ɪz ˈnæroʊ/' },
  { en: 'Please close the gate.', id: 'Tolong tutup gerbangnya.', ipa: '/pliz kloʊz ðə ɡeɪt/' },
  { en: 'I cannot find my key.', id: 'Saya tidak bisa menemukan kunci saya.', ipa: '/aɪ ˈkænɑt faɪnd maɪ ki/' },
  { en: 'The lock is broken.', id: 'Kunci pengamannya rusak.', ipa: '/ðə lɑk ɪz ˈbroʊkən/' },
  { en: 'The lamp is on the desk.', id: 'Lampunya ada di meja.', ipa: '/ðə læmp ɪz ɑn ðə dɛsk/' },
  { en: 'Turn on the light switch.', id: 'Nyalakan saklar lampunya.', ipa: '/tɝn ɑn ðə laɪt swɪtʃ/' },
  { en: 'The sofa is very comfortable.', id: 'Sofanya sangat nyaman.', ipa: '/ðə ˈsoʊfə ɪz ˈvɛri ˈkʌmfɚtəbəl/' },
  { en: 'Sit on the chair.', id: 'Duduk di kursinya.', ipa: '/sɪt ɑn ðə tʃɛr/' },
  { en: 'Put the book on the table.', id: 'Taruh bukunya di atas meja.', ipa: '/pʊt ðə bʊk ɑn ðə ˈteɪbəl/' },
  { en: 'The bed is soft.', id: 'Tempat tidurnya empuk.', ipa: '/ðə bɛd ɪz sɔft/' },
  { en: 'I need a new pillow.', id: 'Saya butuh bantal baru.', ipa: '/aɪ nid ə nu ˈpɪloʊ/' },
  { en: 'This blanket is warm.', id: 'Selimut ini hangat.', ipa: '/ðɪs ˈblæŋkət ɪz wɔrm/' },
  { en: 'My clothes are in the wardrobe.', id: 'Baju saya ada di lemari pakaian.', ipa: '/maɪ kloʊðz ɑr ɪn ðə ˈwɔrˌdroʊb/' },
  { en: 'The closet is full.', id: 'Lemarinya penuh.', ipa: '/ðə ˈklɑzɪt ɪz fʊl/' },
  { en: 'The books are on the shelf.', id: 'Buku-bukunya ada di rak.', ipa: '/ðə bʊks ɑr ɑn ðə ʃɛlf/' },
  { en: 'Open the top drawer.', id: 'Buka laci paling atas.', ipa: '/ˈoʊpən ðə tɑp drɔr/' },
  { en: 'She looks in the mirror.', id: 'Dia bercermin.', ipa: '/ʃi lʊks ɪn ðə ˈmɪrɚ/' },
  { en: 'The dishes are in the sink.', id: 'Piring kotornya ada di bak cuci.', ipa: '/ðə ˈdɪʃɪz ɑr ɪn ðə sɪŋk/' },
  { en: 'The shower is in the bathroom.', id: 'Pancurannya ada di kamar mandi.', ipa: '/ðə ˈʃaʊɚ ɪz ɪn ðə ˈbæθrum/' },
  { en: 'The toilet is clean.', id: 'Toiletnya bersih.', ipa: '/ðə ˈtɔɪlət ɪz klin/' },
  { en: 'The baby is in the bathtub.', id: 'Bayinya ada di bak mandi.', ipa: '/ðə ˈbeɪbi ɪz ɪn ðə ˈbæθˌtʌb/' },
  { en: 'Turn off the stove.', id: 'Matikan kompornya.', ipa: '/tɝn ɔf ðə stoʊv/' },
  { en: 'The cake is in the oven.', id: 'Kuenya ada di oven.', ipa: '/ðə keɪk ɪz ɪn ði ˈʌvən/' },
  { en: 'The milk is in the fridge.', id: 'Susunya ada di kulkas.', ipa: '/ðə mɪlk ɪz ɪn ðə frɪdʒ/' },
  { en: 'Put the meat in the freezer.', id: 'Taruh dagingnya di freezer.', ipa: '/pʊt ðə mit ɪn ðə ˈfrizɚ/' },
  { en: 'Heat the food in the microwave.', id: 'Panaskan makanannya di microwave.', ipa: '/hit ðə fud ɪn ðə ˈmaɪkroʊˌweɪv/' },
  { en: 'The washing machine is running.', id: 'Mesin cucinya sedang berjalan.', ipa: '/ðə ˈwɑʃɪŋ məˌʃin ɪz ˈrʌnɪŋ/' },
  { en: 'Turn on the fan.', id: 'Nyalakan kipasnya.', ipa: '/tɝn ɑn ðə fæn/' },
  { en: 'The air conditioner is cold.', id: 'AC-nya dingin.', ipa: '/ði ɛr kənˈdɪʃənɚ ɪz koʊld/' },
  { en: 'The curtain is green.', id: 'Tirainya berwarna hijau.', ipa: '/ðə ˈkɝtən ɪz ɡrin/' },
  { en: 'The carpet is soft.', id: 'Karpetnya empuk.', ipa: '/ðə ˈkɑrpət ɪz sɔft/' },
  { en: 'Leave your shoes on the doormat.', id: 'Taruh sepatu kamu di keset.', ipa: '/liv jʊr ʃuz ɑn ðə ˈdɔrˌmæt/' },
  { en: 'Throw it in the trash can.', id: 'Buang itu ke tempat sampah.', ipa: '/θroʊ ɪt ɪn ðə træʃ kæn/' },
  { en: 'The broom is behind the door.', id: 'Sapunya ada di belakang pintu.', ipa: '/ðə brum ɪz bɪˈhaɪnd ðə dɔr/' },
  { en: 'Use the mop after sweeping.', id: 'Pakai pel setelah menyapu.', ipa: '/juz ðə mɑp ˈæftɚ ˈswipɪŋ/' },
  { en: 'Fill the bucket with water.', id: 'Isi embernya dengan air.', ipa: '/fɪl ðə ˈbʌkɪt wɪð ˈwɔtɚ/' },
  { en: 'Put your clothes in the laundry basket.', id: 'Taruh bajumu di keranjang cucian.', ipa: '/pʊt jʊr kloʊðz ɪn ðə ˈlɔndri ˈbæskɪt/' },
  { en: 'The kettle is boiling.', id: 'Ketelnya sedang mendidih.', ipa: '/ðə ˈkɛtəl ɪz ˈbɔɪlɪŋ/' },
  { en: 'The rice cooker is on the counter.', id: 'Rice cooker-nya ada di meja dapur.', ipa: '/ðə raɪs ˈkʊkɚ ɪz ɑn ðə ˈkaʊntɚ/' },
  { en: 'The dishwasher is full.', id: 'Mesin pencuci piringnya penuh.', ipa: '/ðə ˈdɪʃˌwɑʃɚ ɪz fʊl/' },
  { en: 'Use the vacuum cleaner in the living room.', id: 'Gunakan penyedot debu di ruang tamu.', ipa: '/juz ðə ˈvækjum ˈklinɚ ɪn ðə ˈlɪvɪŋ rum/' },
  { en: 'Her books are on the bookshelf.', id: 'Buku-bukunya ada di rak buku.', ipa: '/hɚ bʊks ɑr ɑn ðə ˈbʊkˌʃɛlf/' },
  { en: 'My laptop is on the desk.', id: 'Laptop saya ada di meja kerja.', ipa: '/maɪ ˈlæpˌtɑp ɪz ɑn ðə dɛsk/' },
  { en: 'Put the lamp on the bedside table.', id: 'Taruh lampunya di meja samping tempat tidur.', ipa: '/pʊt ðə læmp ɑn ðə ˈbɛdˌsaɪd ˈteɪbəl/' },
  { en: 'The clock is above the door.', id: 'Jam dindingnya ada di atas pintu.', ipa: '/ðə klɑk ɪz əˈbʌv ðə dɔr/' },
  { en: 'My alarm clock rings at five.', id: 'Jam alarm saya berbunyi pukul lima.', ipa: '/maɪ əˈlɑrm klɑk rɪŋz æt faɪv/' },
  { en: 'This picture frame is from Bali.', id: 'Bingkai foto ini dari Bali.', ipa: '/ðɪs ˈpɪktʃɚ freɪm ɪz frəm ˈbɑli/' },
  { en: 'The television is in the living room.', id: 'Televisinya ada di ruang tamu.', ipa: '/ðə ˈtɛləˌvɪʒən ɪz ɪn ðə ˈlɪvɪŋ rum/' },
  { en: 'Where is the remote control?', id: 'Di mana remote-nya?', ipa: '/wɛr ɪz ðə rɪˈmoʊt kənˈtroʊl/' },
  { en: 'The wifi router is near the desk.', id: 'Router wifi-nya ada dekat meja.', ipa: '/ðə ˈwaɪˌfaɪ ˈraʊtɚ ɪz nɪr ðə dɛsk/' },
  { en: 'Plug it into the extension cord.', id: 'Colokkan ke kabel ekstensi.', ipa: '/plʌɡ ɪt ˈɪntu ði ɪkˈstɛnʃən kɔrd/' },
  { en: 'My phone charger is in the bedroom.', id: 'Charger ponsel saya ada di kamar tidur.', ipa: '/maɪ foʊn ˈtʃɑrdʒɚ ɪz ɪn ðə ˈbɛdrum/' },
  { en: 'There is a power outlet near the sofa.', id: 'Ada stop kontak di dekat sofa.', ipa: '/ðɛr ɪz ə ˈpaʊɚ ˈaʊtˌlɛt nɪr ðə ˈsoʊfə/' },
  { en: 'Please turn off the faucet.', id: 'Tolong matikan kerannya.', ipa: '/pliz tɝn ɔf ðə ˈfɔsɪt/' },
  { en: 'We need more soap.', id: 'Kita butuh sabun lagi.', ipa: '/wi nid mɔr soʊp/' },
  { en: 'Put your toothbrush in the cup.', id: 'Taruh sikat gigimu di cangkir.', ipa: '/pʊt jʊr ˈtuθˌbrʌʃ ɪn ðə kʌp/' },
  { en: 'I bought new toothpaste.', id: 'Saya beli pasta gigi baru.', ipa: '/aɪ bɔt nu ˈtuθˌpeɪst/' },
  { en: 'The shampoo is in the bathroom.', id: 'Sampo-nya ada di kamar mandi.', ipa: '/ðə ʃæmˈpu ɪz ɪn ðə ˈbæθrum/' },
  { en: 'Use body wash in the shower.', id: 'Pakai sabun mandi cair saat mandi.', ipa: '/juz ˈbɑdi wɑʃ ɪn ðə ˈʃaʊɚ/' },
  { en: 'Add detergent to the washing machine.', id: 'Tambahkan deterjen ke mesin cuci.', ipa: '/æd dɪˈtɝdʒənt tə ðə ˈwɑʃɪŋ məˌʃin/' },
  { en: 'Use a sponge to clean the sink.', id: 'Gunakan spons untuk membersihkan bak cuci.', ipa: '/juz ə spʌndʒ tə klin ðə sɪŋk/' },
  { en: 'Put the plates on the dish rack.', id: 'Taruh piringnya di rak piring.', ipa: '/pʊt ðə pleɪts ɑn ðə dɪʃ ræk/' },
  { en: 'Use the cutting board for vegetables.', id: 'Gunakan talenan untuk memotong sayur.', ipa: '/juz ðə ˈkʌtɪŋ bɔrd fər ˈvɛdʒtəbəlz/' },
  { en: 'This knife is very sharp.', id: 'Pisau ini sangat tajam.', ipa: '/ðɪs naɪf ɪz ˈvɛri ʃɑrp/' },
  { en: 'I need a fork for salad.', id: 'Saya butuh garpu untuk salad.', ipa: '/aɪ nid ə fɔrk fər ˈsæləd/' },
  { en: 'Take a spoon from the drawer.', id: 'Ambil sendok dari laci.', ipa: '/teɪk ə spun frəm ðə drɔr/' },
  { en: 'The plate is on the table.', id: 'Piringnya ada di atas meja.', ipa: '/ðə pleɪt ɪz ɑn ðə ˈteɪbəl/' },
  { en: 'Soup is in the bowl.', id: 'Supnya ada di mangkuk.', ipa: '/sup ɪz ɪn ðə boʊl/' },
  { en: 'She drinks tea from a cup.', id: 'Dia minum teh dari cangkir.', ipa: '/ʃi drɪŋks ti frəm ə kʌp/' },
  { en: 'This mug is my favorite.', id: 'Mug ini favorit saya.', ipa: '/ðɪs mʌɡ ɪz maɪ ˈfeɪvərɪt/' },
  { en: 'Fill the glass with water.', id: 'Isi gelasnya dengan air.', ipa: '/fɪl ðə ɡlæs wɪð ˈwɔtɚ/' },
  { en: 'My water bottle is in the kitchen.', id: 'Botol minum saya ada di dapur.', ipa: '/maɪ ˈwɔtɚ ˈbɑtəl ɪz ɪn ðə ˈkɪtʃən/' },
  { en: 'Heat oil in the pan.', id: 'Panaskan minyak di wajan.', ipa: '/hit ɔɪl ɪn ðə pæn/' },
  { en: 'The soup is in the pot.', id: 'Supnya ada di panci.', ipa: '/ðə sup ɪz ɪn ðə pɑt/' },
  { en: 'Put the lid on the pot.', id: 'Pasang tutupnya di panci.', ipa: '/pʊt ðə lɪd ɑn ðə pɑt/' },
  { en: 'Put the fruit on the counter.', id: 'Taruh buahnya di meja dapur.', ipa: '/pʊt ðə frut ɑn ðə ˈkaʊntɚ/' },
  { en: 'Use a paper towel to dry your hands.', id: 'Pakai tisu dapur untuk mengeringkan tangan.', ipa: '/juz ə ˈpeɪpɚ ˈtaʊəl tə draɪ jʊr hændz/' },
  { en: 'Replace the trash bag, please.', id: 'Tolong ganti kantong sampahnya.', ipa: '/rɪˈpleɪs ðə træʃ bæɡ pliz/' },
  { en: 'Use cleaning spray on the table.', id: 'Gunakan cairan pembersih semprot di meja.', ipa: '/juz ˈklinɪŋ spreɪ ɑn ðə ˈteɪbəl/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(HOME_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing HOME_ROWS mappings for: ${missingRows.join(' | ')}`);
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
    const value = valueFactory(rowMap.get(example));
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
console.log(`Updated Home topic: ${examples.length} translations + IPA`);
