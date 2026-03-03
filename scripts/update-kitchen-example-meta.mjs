import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/kitchen.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const KITCHEN_ROWS = [
  { en: 'The kitchen is clean today.', id: 'Dapurnya bersih hari ini.', ipa: '/ðə ˈkɪtʃən ɪz klin təˈdeɪ/' },
  { en: 'Turn off the stove after cooking.', id: 'Matikan kompor setelah memasak.', ipa: '/tɝn ɔf ðə stoʊv ˈæftɚ ˈkʊkɪŋ/' },
  { en: 'We use a gas stove at home.', id: 'Kami memakai kompor gas di rumah.', ipa: '/wi juz ə ɡæs stoʊv æt hoʊm/' },
  { en: 'The electric stove heats up quickly.', id: 'Kompor listrik cepat panas.', ipa: '/ði ɪˈlɛktrɪk stoʊv hits ʌp ˈkwɪkli/' },
  { en: 'Put the cake in the oven.', id: 'Masukkan kuenya ke oven.', ipa: '/pʊt ðə keɪk ɪn ði ˈʌvən/' },
  { en: 'Heat the food in the microwave.', id: 'Panaskan makanannya di microwave.', ipa: '/hit ðə fud ɪn ðə ˈmaɪkroʊweɪv/' },
  { en: 'Milk is in the refrigerator.', id: 'Susunya ada di kulkas.', ipa: '/mɪlk ɪz ɪn ðə rɪˈfrɪdʒəˌreɪtɚ/' },
  { en: 'Keep the ice cream in the freezer.', id: 'Simpan es krim di freezer.', ipa: '/kip ði aɪs krim ɪn ðə ˈfrizɚ/' },
  { en: 'Please wash dishes in the sink.', id: 'Tolong cuci piring di bak cuci.', ipa: '/pliz wɑʃ ˈdɪʃɪz ɪn ðə sɪŋk/' },
  { en: 'The faucet is leaking.', id: 'Kerannya bocor.', ipa: '/ðə ˈfɔsət ɪz ˈlikɪŋ/' },
  { en: 'Put the vegetables on the counter.', id: 'Taruh sayurnya di meja dapur.', ipa: '/pʊt ðə ˈvɛdʒtəbəlz ɑn ðə ˈkaʊntɚ/' },
  { en: 'The plates are in the cabinet.', id: 'Piring-piringnya ada di lemari dapur.', ipa: '/ðə pleɪts ɑr ɪn ðə ˈkæbənət/' },
  { en: 'The spices are on the top shelf.', id: 'Bumbu-bumbunya ada di rak paling atas.', ipa: '/ðə ˈspaɪsɪz ɑr ɑn ðə tɑp ʃɛlf/' },
  { en: 'The spoon is in the drawer.', id: 'Sendoknya ada di laci.', ipa: '/ðə spun ɪz ɪn ðə drɔr/' },
  { en: 'This dish is very tasty.', id: 'Hidangan ini enak sekali.', ipa: '/ðɪs dɪʃ ɪz ˈvɛri ˈteɪsti/' },
  { en: 'Take one clean plate.', id: 'Ambil satu piring yang bersih.', ipa: '/teɪk wʌn klin pleɪt/' },
  { en: 'Put soup in this bowl.', id: 'Taruh sup di mangkuk ini.', ipa: '/pʊt sup ɪn ðɪs boʊl/' },
  { en: 'I need a cup of tea.', id: 'Saya butuh secangkir teh.', ipa: '/aɪ nid ə kʌp əv ti/' },
  { en: 'Fill the glass with water.', id: 'Isi gelasnya dengan air.', ipa: '/fɪl ðə ɡlæs wɪð ˈwɔtɚ/' },
  { en: 'My coffee is in a mug.', id: 'Kopi saya ada di mug.', ipa: '/maɪ ˈkɔfi ɪz ɪn ə mʌɡ/' },
  { en: 'Use a spoon for the soup.', id: 'Pakai sendok untuk supnya.', ipa: '/juz ə spun fɚ ðə sup/' },
  { en: 'Take a fork and a knife.', id: 'Ambil garpu dan pisau.', ipa: '/teɪk ə fɔrk ænd ə naɪf/' },
  { en: 'This knife is very sharp.', id: 'Pisau ini sangat tajam.', ipa: '/ðɪs naɪf ɪz ˈvɛri ʃɑrp/' },
  { en: 'Can you use chopsticks?', id: 'Kamu bisa pakai sumpit?', ipa: '/kæn ju juz ˈtʃɑpˌstɪks/' },
  { en: 'Heat oil in the pan.', id: 'Panaskan minyak di wajan.', ipa: '/hit ɔɪl ɪn ðə pæn/' },
  { en: 'Boil water in a pot.', id: 'Rebus air di panci.', ipa: '/bɔɪl ˈwɔtɚ ɪn ə pɑt/' },
  { en: 'Put the lid on the pot.', id: 'Pasang tutupnya di panci.', ipa: '/pʊt ðə lɪd ɑn ðə pɑt/' },
  { en: 'Use a cutting board for onions.', id: 'Pakai talenan untuk memotong bawang.', ipa: '/juz ə ˈkʌtɪŋ bɔrd fɚ ˈʌnjənz/' },
  { en: 'Flip the egg with a spatula.', id: 'Balik telurnya pakai spatula.', ipa: '/flɪp ði ɛɡ wɪð ə ˈspætʃələ/' },
  { en: 'Use a ladle for the soup.', id: 'Pakai sendok sayur untuk sup.', ipa: '/juz ə ˈleɪdəl fɚ ðə sup/' },
  { en: 'Use tongs for hot food.', id: 'Pakai penjepit untuk makanan panas.', ipa: '/juz tɔŋz fɚ hɑt fud/' },
  { en: 'This peeler is easy to use.', id: 'Pengupas ini mudah dipakai.', ipa: '/ðɪs ˈpilɚ ɪz ˈizi tə juz/' },
  { en: 'I need a grater for cheese.', id: 'Saya butuh parutan untuk keju.', ipa: '/aɪ nid ə ˈɡreɪtɚ fɚ tʃiz/' },
  { en: 'Use a strainer for pasta.', id: 'Pakai saringan untuk pasta.', ipa: '/juz ə ˈstreɪnɚ fɚ ˈpɑstə/' },
  { en: 'The blender makes smoothies quickly.', id: 'Blender ini bikin smoothie dengan cepat.', ipa: '/ðə ˈblɛndɚ meɪks ˈsmuziz ˈkwɪkli/' },
  { en: 'Rice is in the rice cooker.', id: 'Nasinya ada di rice cooker.', ipa: '/raɪs ɪz ɪn ðə raɪs ˈkʊkɚ/' },
  { en: 'Boil water in the kettle.', id: 'Rebus air di ketel.', ipa: '/bɔɪl ˈwɔtɚ ɪn ðə ˈkɛtəl/' },
  { en: 'Put bread in the toaster.', id: 'Masukkan roti ke pemanggang roti.', ipa: '/pʊt brɛd ɪn ðə ˈtoʊstɚ/' },
  { en: 'We need fresh ingredients.', id: 'Kita butuh bahan-bahan yang segar.', ipa: '/wi nid frɛʃ ɪnˈɡridiənts/' },
  { en: 'This recipe is simple.', id: 'Resep ini sederhana.', ipa: '/ðɪs ˈrɛsəpi ɪz ˈsɪmpəl/' },
  { en: 'I cook dinner every evening.', id: 'Saya masak makan malam setiap sore.', ipa: '/aɪ kʊk ˈdɪnɚ ˈɛvri ˈivnɪŋ/' },
  { en: 'Fry the chicken for ten minutes.', id: 'Goreng ayamnya selama sepuluh menit.', ipa: '/fraɪ ðə ˈtʃɪkən fɚ tɛn ˈmɪnəts/' },
  { en: 'Boil the eggs first.', id: 'Rebus telurnya dulu.', ipa: '/bɔɪl ði ɛɡz fɝst/' },
  { en: 'Steam the vegetables lightly.', id: 'Kukus sayurnya sebentar.', ipa: '/stim ðə ˈvɛdʒtəbəlz ˈlaɪtli/' },
  { en: 'Bake the cake for thirty minutes.', id: 'Panggang kuenya selama tiga puluh menit.', ipa: '/beɪk ðə keɪk fɚ ˈθɝti ˈmɪnəts/' },
  { en: 'Chop the garlic finely.', id: 'Cincang bawangnya halus.', ipa: '/tʃɑp ðə ˈɡɑrlɪk ˈfaɪnli/' },
  { en: 'Slice the tomatoes thinly.', id: 'Iris tomatnya tipis-tipis.', ipa: '/slaɪs ðə təˈmeɪtoʊz ˈθɪnli/' },
  { en: 'Mix all ingredients well.', id: 'Aduk semua bahan sampai rata.', ipa: '/mɪks ɔl ɪnˈɡridiənts wɛl/' },
  { en: 'Serve the soup while hot.', id: 'Sajikan supnya saat masih panas.', ipa: '/sɝv ðə sup waɪl hɑt/' },
  { en: 'Please wash dishes after dinner.', id: 'Tolong cuci piring setelah makan malam.', ipa: '/pliz wɑʃ ˈdɪʃɪz ˈæftɚ ˈdɪnɚ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(KITCHEN_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing KITCHEN_ROWS mappings for: ${missingRows.join(' | ')}`);
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
    const keyPattern = JSON.stringify(example).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`(\\n\\s*${keyPattern}:\\s*)"(?:\\\\.|[^"])*"(,?)`);
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
console.log(`Updated Kitchen topic: ${examples.length} translations + IPA`);
