import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/entertainment-media.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const ENTERTAINMENT_MEDIA_ROWS = [
  { en: 'I like entertainment shows at night.', id: 'Saya suka acara hiburan di malam hari.', ipa: '/aɪ laɪk ˌɛntərˈteɪnmənt ʃoʊz æt naɪt/' },
  { en: 'Social media is popular now.', id: 'Media sosial sedang populer sekarang.', ipa: '/ˈsoʊʃəl ˈmidiə ɪz ˈpɑpjələr naʊ/' },
  { en: 'We watched a movie last night.', id: 'Kami menonton film tadi malam.', ipa: '/wi wɑtʃt ə ˈmuvi læst naɪt/' },
  { en: 'That film is very interesting.', id: 'Film itu sangat menarik.', ipa: '/ðæt fɪlm ɪz ˈvɛri ˈɪntrəstɪŋ/' },
  { en: 'He is a famous actor.', id: 'Dia aktor yang terkenal.', ipa: '/hi ɪz ə ˈfeɪməs ˈæktər/' },
  { en: 'My sister likes that actress.', id: 'Saudari saya suka aktris itu.', ipa: '/maɪ ˈsɪstər laɪks ðæt ˈæktrəs/' },
  { en: 'The director made a great movie.', id: 'Sutradaranya membuat film yang bagus.', ipa: '/ðə dəˈrɛktər meɪd ə ɡreɪt ˈmuvi/' },
  { en: 'This scene is very funny.', id: 'Adegan ini sangat lucu.', ipa: '/ðɪs sin ɪz ˈvɛri ˈfʌni/' },
  { en: 'I watched one episode today.', id: 'Saya menonton satu episode hari ini.', ipa: '/aɪ wɑtʃt wʌn ˈɛpəˌsoʊd təˈdeɪ/' },
  { en: 'Season two is better.', id: 'Season dua lebih bagus.', ipa: '/ˈsizən tu ɪz ˈbɛtər/' },
  { en: 'This series is popular.', id: 'Serial ini populer.', ipa: '/ðɪs ˈsɪriz ɪz ˈpɑpjələr/' },
  { en: 'We watched a nature documentary.', id: 'Kami menonton dokumenter alam.', ipa: '/wi wɑtʃt ə ˈneɪtʃər ˌdɑkjuˈmɛntəri/' },
  { en: 'My nephew loves cartoons.', id: 'Keponakan saya suka kartun.', ipa: '/maɪ ˈnɛfju lʌvz kɑrˈtunz/' },
  { en: 'That animation looks amazing.', id: 'Animasi itu terlihat luar biasa.', ipa: '/ðæt ˌænəˈmeɪʃən lʊks əˈmeɪzɪŋ/' },
  { en: 'Did you watch the trailer?', id: 'Kamu sudah menonton trailernya?', ipa: '/dɪd ju wɑtʃ ðə ˈtreɪlər/' },
  { en: 'We met at the cinema.', id: 'Kami bertemu di bioskop.', ipa: '/wi mɛt æt ðə ˈsɪnəmə/' },
  { en: 'The theater is full tonight.', id: 'Teaternya penuh malam ini.', ipa: '/ðə ˈθiətər ɪz fʊl təˈnaɪt/' },
  { en: 'I bought two tickets.', id: 'Saya membeli dua tiket.', ipa: '/aɪ bɔt tu ˈtɪkəts/' },
  { en: 'The screen is very big.', id: 'Layarnya sangat besar.', ipa: '/ðə skrin ɪz ˈvɛri bɪɡ/' },
  { en: 'Please turn on the subtitles.', id: 'Tolong nyalakan subtitle.', ipa: '/pliz tɝn ɑn ðə ˈsʌbˌtaɪtəlz/' },
  { en: 'I listen to music daily.', id: 'Saya mendengarkan musik setiap hari.', ipa: '/aɪ ˈlɪsən tə ˈmjuzɪk ˈdeɪli/' },
  { en: 'This song is very calm.', id: 'Lagu ini sangat menenangkan.', ipa: '/ðɪs sɔŋ ɪz ˈvɛri kɑm/' },
  { en: 'She is my favorite singer.', id: 'Dia penyanyi favorit saya.', ipa: '/ʃi ɪz maɪ ˈfeɪvərɪt ˈsɪŋər/' },
  { en: 'That band is from Jakarta.', id: 'Band itu berasal dari Jakarta.', ipa: '/ðæt bænd ɪz frəm dʒəˈkɑrtə/' },
  { en: 'Their new album is out.', id: 'Album baru mereka sudah rilis.', ipa: '/ðɛr nu ˈælbəm ɪz aʊt/' },
  { en: 'I made a study playlist.', id: 'Saya membuat playlist untuk belajar.', ipa: '/aɪ meɪd ə ˈstʌdi ˈpleɪlɪst/' },
  { en: 'We went to a concert.', id: 'Kami pergi ke konser.', ipa: '/wi wɛnt tə ə ˈkɑnsərt/' },
  { en: 'I listen to a podcast on my way home.', id: 'Saya mendengarkan podcast saat perjalanan pulang.', ipa: '/aɪ ˈlɪsən tə ə ˈpɑdkæst ɑn maɪ weɪ hoʊm/' },
  { en: 'My dad listens to the radio.', id: 'Ayah saya mendengarkan radio.', ipa: '/maɪ dæd ˈlɪsənz tə ðə ˈreɪdioʊ/' },
  { en: 'That channel has good videos.', id: 'Kanal itu punya video yang bagus.', ipa: '/ðæt ˈtʃænəl hæz ɡʊd ˈvɪdioʊz/' },
  { en: 'We watched the news on television.', id: 'Kami menonton berita di televisi.', ipa: '/wi wɑtʃt ðə nuz ɑn ˈtɛləˌvɪʒən/' },
  { en: 'This show is very popular.', id: 'Acara ini sangat populer.', ipa: '/ðɪs ʃoʊ ɪz ˈvɛri ˈpɑpjələr/' },
  { en: 'The host asked good questions.', id: 'Pembawa acaranya mengajukan pertanyaan bagus.', ipa: '/ðə hoʊst æskt ɡʊd ˈkwɛstʃənz/' },
  { en: 'The audience clapped loudly.', id: 'Penontonnya bertepuk tangan keras.', ipa: '/ði ˈɔdiəns klæpt ˈlaʊdli/' },
  { en: 'I am a big fan of that show.', id: 'Saya penggemar berat acara itu.', ipa: '/aɪ æm ə bɪɡ fæn əv ðæt ʃoʊ/' },
  { en: 'I read a review before watching.', id: 'Saya membaca ulasan sebelum menonton.', ipa: '/aɪ rid ə rɪˈvju bɪˈfɔr ˈwɑtʃɪŋ/' },
  { en: 'This movie has a high rating.', id: 'Film ini punya rating tinggi.', ipa: '/ðɪs ˈmuvi hæz ə haɪ ˈreɪtɪŋ/' },
  { en: 'We stream music every day.', id: 'Kami streaming musik setiap hari.', ipa: '/wi strim ˈmjuzɪk ˈɛvri deɪ/' },
  { en: 'I use one streaming platform.', id: 'Saya pakai satu platform streaming.', ipa: '/aɪ juz wʌn ˈstrimɪŋ ˈplætfɔrm/' },
  { en: 'She uploaded a new video.', id: 'Dia mengunggah video baru.', ipa: '/ʃi ʌpˈloʊdəd ə nu ˈvɪdioʊ/' },
  { en: 'I watched a short clip.', id: 'Saya menonton klip pendek.', ipa: '/aɪ wɑtʃt ə ʃɔrt klɪp/' },
  { en: 'He makes travel vlogs.', id: 'Dia membuat vlog perjalanan.', ipa: '/hi meɪks ˈtrævəl vlɑɡz/' },
  { en: 'She is a food blogger.', id: 'Dia seorang food blogger.', ipa: '/ʃi ɪz ə fud ˈblɑɡər/' },
  { en: 'My friend is a content creator.', id: 'Teman saya adalah content creator.', ipa: '/maɪ frɛnd ɪz ə ˈkɑntɛnt kriˈeɪtər/' },
  { en: 'We use social media every day.', id: 'Kami menggunakan media sosial setiap hari.', ipa: '/wi juz ˈsoʊʃəl ˈmidiə ˈɛvri deɪ/' },
  { en: 'I posted a new photo.', id: 'Saya mengunggah foto baru.', ipa: '/aɪ ˈpoʊstəd ə nu ˈfoʊtoʊ/' },
  { en: 'Please leave a comment.', id: 'Tolong tinggalkan komentar.', ipa: '/pliz liv ə ˈkɑmɛnt/' },
  { en: 'Many people like this video.', id: 'Banyak orang menyukai video ini.', ipa: '/ˈmɛni ˈpipəl laɪk ðɪs ˈvɪdioʊ/' },
  { en: 'Can you share this post?', id: 'Bisa bagikan post ini?', ipa: '/kæn ju ʃɛr ðɪs poʊst/' },
  { en: 'This song is trending now.', id: 'Lagu ini sedang trending sekarang.', ipa: '/ðɪs sɔŋ ɪz ˈtrɛndɪŋ naʊ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(ENTERTAINMENT_MEDIA_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing ENTERTAINMENT_MEDIA_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Entertainment & Media topic: ${examples.length} translations + IPA`);
