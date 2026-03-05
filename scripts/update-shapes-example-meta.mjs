import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/shapes.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const SHAPES_ROWS = [
  { en: 'What shape is this object?', id: 'Benda ini bentuknya apa?', ipa: '/wʌt ʃeɪp ɪz ðɪs ˈɑbdʒɛkt/' },
  { en: 'Draw one straight line.', id: 'Gambar satu garis lurus.', ipa: '/drɔ wʌn streɪt laɪn/' },
  { en: 'Use a ruler for a straight line.', id: 'Pakai penggaris untuk membuat garis lurus.', ipa: '/juz ə ˈrulər fɔr ə streɪt laɪn/' },
  { en: 'The letter S has a curved line.', id: 'Huruf S punya garis lengkung.', ipa: '/ðə ˈlɛtər ɛs hæz ə kɝvd laɪn/' },
  { en: 'Mark one point on the paper.', id: 'Tandai satu titik di kertas.', ipa: '/mɑrk wʌn pɔɪnt ɑn ðə ˈpeɪpər/' },
  { en: 'Put a small dot here.', id: 'Beri titik kecil di sini.', ipa: '/pʊt ə smɔl dɑt hɪr/' },
  { en: 'This angle is very sharp.', id: 'Sudut ini sangat lancip.', ipa: '/ðɪs ˈæŋɡəl ɪz ˈvɛri ʃɑrp/' },
  { en: 'A square has four right angles.', id: 'Persegi punya empat sudut siku-siku.', ipa: '/ə skwɛr hæz fɔr raɪt ˈæŋɡəlz/' },
  { en: 'This acute angle is less than ninety degrees.', id: 'Sudut lancip ini kurang dari sembilan puluh derajat.', ipa: '/ðɪs əˈkjut ˈæŋɡəl ɪz lɛs ðæn ˈnaɪnti dɪˈɡriz/' },
  { en: 'An obtuse angle is more than ninety degrees.', id: 'Sudut tumpul lebih dari sembilan puluh derajat.', ipa: '/æn ɑbˈtus ˈæŋɡəl ɪz mɔr ðæn ˈnaɪnti dɪˈɡriz/' },
  { en: 'Draw a big circle.', id: 'Gambar lingkaran besar.', ipa: '/drɔ ə bɪɡ ˈsɝkəl/' },
  { en: 'Cut the paper into a semicircle.', id: 'Potong kertas menjadi setengah lingkaran.', ipa: '/kʌt ðə ˈpeɪpər ˈɪntu ə ˈsɛmiˌsɝkəl/' },
  { en: 'An egg is usually oval.', id: 'Telur biasanya berbentuk oval.', ipa: '/æn ɛɡ ɪz ˈjuʒuəli ˈoʊvəl/' },
  { en: 'The orbit is an ellipse.', id: 'Orbit itu berbentuk elips.', ipa: '/ði ˈɔrbət ɪz ən ɪˈlɪps/' },
  { en: 'This sign is a triangle.', id: 'Tanda ini berbentuk segitiga.', ipa: '/ðɪs saɪn ɪz ə ˈtraɪˌæŋɡəl/' },
  { en: 'An equilateral triangle has three equal sides.', id: 'Segitiga sama sisi memiliki tiga sisi yang sama.', ipa: '/æn ˌikwəˈlætərəl ˈtraɪˌæŋɡəl hæz θri ˈikwəl saɪdz/' },
  { en: 'This is an isosceles triangle.', id: 'Ini segitiga sama kaki.', ipa: '/ðɪs ɪz ən aɪˈsɑsəˌliz ˈtraɪˌæŋɡəl/' },
  { en: 'A right triangle has one right angle.', id: 'Segitiga siku-siku punya satu sudut siku-siku.', ipa: '/ə raɪt ˈtraɪˌæŋɡəl hæz wʌn raɪt ˈæŋɡəl/' },
  { en: 'The box top is a square.', id: 'Bagian atas kotak berbentuk persegi.', ipa: '/ðə bɑks tɑp ɪz ə skwɛr/' },
  { en: 'The table is a rectangle.', id: 'Meja ini berbentuk persegi panjang.', ipa: '/ðə ˈteɪbəl ɪz ə ˈrɛkˌtæŋɡəl/' },
  { en: 'A parallelogram has opposite sides parallel.', id: 'Jajar genjang punya sisi berhadapan yang sejajar.', ipa: '/ə ˌpɛrəˈlɛləˌɡræm hæz ˈɑpəzət saɪdz ˈpɛrəˌlɛl/' },
  { en: 'This roof shape is a trapezoid.', id: 'Bentuk atap ini adalah trapesium.', ipa: '/ðɪs ruf ʃeɪp ɪz ə ˈtræpəˌzɔɪd/' },
  { en: 'A rhombus has four equal sides.', id: 'Belah ketupat punya empat sisi sama panjang.', ipa: '/ə ˈrɑmbəs hæz fɔr ˈikwəl saɪdz/' },
  { en: 'The traffic sign has a diamond shape.', id: 'Rambu lalu lintas itu berbentuk berlian.', ipa: '/ðə ˈtræfɪk saɪn hæz ə ˈdaɪmənd ʃeɪp/' },
  { en: 'A pentagon has five sides.', id: 'Segi lima memiliki lima sisi.', ipa: '/ə ˈpɛntəˌɡɑn hæz faɪv saɪdz/' },
  { en: 'A honeycomb cell is a hexagon.', id: 'Sel sarang lebah berbentuk segi enam.', ipa: '/ə ˈhʌniˌkoʊm sɛl ɪz ə ˈhɛksəˌɡɑn/' },
  { en: 'A heptagon has seven sides.', id: 'Segi tujuh memiliki tujuh sisi.', ipa: '/ə ˈhɛptəˌɡɑn hæz ˈsɛvən saɪdz/' },
  { en: 'A stop sign is an octagon.', id: 'Rambu stop berbentuk segi delapan.', ipa: '/ə stɑp saɪn ɪz ən ˈɑktəˌɡɑn/' },
  { en: 'A nonagon has nine sides.', id: 'Segi sembilan memiliki sembilan sisi.', ipa: '/ə ˈnɑnəˌɡɑn hæz naɪn saɪdz/' },
  { en: 'A decagon has ten sides.', id: 'Segi sepuluh memiliki sepuluh sisi.', ipa: '/ə ˈdɛkəˌɡɑn hæz tɛn saɪdz/' },
  { en: 'Draw a star in the corner.', id: 'Gambar bintang di pojok.', ipa: '/drɔ ə stɑr ɪn ðə ˈkɔrnər/' },
  { en: 'She cut the paper into a heart shape.', id: 'Dia memotong kertas jadi bentuk hati.', ipa: '/ʃi kʌt ðə ˈpeɪpər ˈɪntu ə hɑrt ʃeɪp/' },
  { en: 'The moon looks like a crescent.', id: 'Bulan terlihat seperti sabit.', ipa: '/ðə mun lʊks laɪk ə ˈkrɛsənt/' },
  { en: 'Mark the wrong answer with a cross.', id: 'Tandai jawaban salah dengan tanda silang.', ipa: '/mɑrk ðə rɔŋ ˈænsər wɪð ə krɔs/' },
  { en: 'This symbol has an arrow shape.', id: 'Simbol ini berbentuk panah.', ipa: '/ðɪs ˈsɪmbəl hæz ən ˈæroʊ ʃeɪp/' },
  { en: 'The design has a spiral pattern.', id: 'Desain ini punya pola spiral.', ipa: '/ðə dɪˈzaɪn hæz ə ˈspaɪrəl ˈpætərn/' },
  { en: 'Draw a wave line across the page.', id: 'Gambar garis bergelombang melintasi halaman.', ipa: '/drɔ ə weɪv laɪn əˈkrɔs ðə peɪdʒ/' },
  { en: 'The path makes a zigzag shape.', id: 'Jalurnya membentuk zigzag.', ipa: '/ðə pæθ meɪks ə ˈzɪɡˌzæɡ ʃeɪp/' },
  { en: 'An ice cream cone is a cone.', id: 'Cone es krim berbentuk kerucut.', ipa: '/æn aɪs krim koʊn ɪz ə koʊn/' },
  { en: 'A dice is a cube.', id: 'Dadu berbentuk kubus.', ipa: '/ə daɪs ɪz ə kjub/' },
  { en: 'The ball is a sphere.', id: 'Bola berbentuk sphere.', ipa: '/ðə bɔl ɪz ə sfɪr/' },
  { en: 'A can is a cylinder.', id: 'Kaleng berbentuk silinder.', ipa: '/ə kæn ɪz ə ˈsɪləndər/' },
  { en: 'The model is shaped like a pyramid.', id: 'Model itu berbentuk seperti piramida.', ipa: '/ðə ˈmɑdəl ɪz ʃeɪpt laɪk ə ˈpɪrəmɪd/' },
  { en: 'The glass prism splits light.', id: 'Prisma kaca memecah cahaya.', ipa: '/ðə ɡlæs ˈprɪzəm splɪts laɪt/' },
  { en: 'Draw a ring, not a full circle.', id: 'Gambar lingkaran kosong, bukan lingkaran penuh.', ipa: '/drɔ ə rɪŋ nɑt ə fʊl ˈsɝkəl/' },
  { en: 'Draw an arc between two points.', id: 'Gambar busur di antara dua titik.', ipa: '/drɔ ən ɑrk bɪˈtwin tu pɔɪnts/' },
  { en: 'The edge of the box is sharp.', id: 'Tepi kotak ini tajam.', ipa: '/ði ɛdʒ əv ðə bɑks ɪz ʃɑrp/' },
  { en: 'Put your name in the top corner.', id: 'Tulis namamu di pojok atas.', ipa: '/pʊt jʊr neɪm ɪn ðə tɑp ˈkɔrnər/' },
  { en: 'A square has four sides.', id: 'Persegi memiliki empat sisi.', ipa: '/ə skwɛr hæz fɔr saɪdz/' },
  { en: 'This butterfly has beautiful symmetry.', id: 'Kupu-kupu ini punya simetri yang indah.', ipa: '/ðɪs ˈbʌtərˌflaɪ hæz ˈbjutəfəl ˈsɪmətri/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(SHAPES_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing SHAPES_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Shapes topic: ${examples.length} translations + IPA`);
