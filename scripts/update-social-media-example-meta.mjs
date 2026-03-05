import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/social-media.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const SOCIAL_MEDIA_ROWS = [
  { en: 'I use social media every day.', id: 'Saya pakai media sosial setiap hari.', ipa: '/aɪ juz ˈsoʊʃəl ˈmidiə ˈɛvri deɪ/' },
  { en: 'This platform is easy to use.', id: 'Platform ini mudah dipakai.', ipa: '/ðɪs ˈplætˌfɔrm ɪz ˈizi tə juz/' },
  { en: 'I created a new account.', id: 'Saya membuat akun baru.', ipa: '/aɪ kriˈeɪtɪd ə nu əˈkaʊnt/' },
  { en: 'Please update your profile photo.', id: 'Tolong perbarui foto profilmu.', ipa: '/pliz ʌpˈdeɪt jʊr ˈproʊfaɪl ˈfoʊtoʊ/' },
  { en: 'My username is easy to remember.', id: 'Nama pengguna saya mudah diingat.', ipa: '/maɪ ˈjuzɚˌneɪm ɪz ˈizi tə rɪˈmɛmbɚ/' },
  { en: 'Never share your password.', id: 'Jangan pernah membagikan kata sandimu.', ipa: '/ˈnɛvɚ ʃɛr jʊr ˈpæsˌwɝd/' },
  { en: 'I cannot login to my account.', id: 'Saya tidak bisa masuk ke akun saya.', ipa: '/aɪ ˈkænɑt ˈlɔɡˌɪn tə maɪ əˈkaʊnt/' },
  { en: 'Please logout on public devices.', id: 'Tolong keluar akun di perangkat umum.', ipa: '/pliz ˈlɔɡˌaʊt ɑn ˈpʌblɪk dɪˈvaɪsɪz/' },
  { en: 'She posted a new picture.', id: 'Dia mengunggah foto baru.', ipa: '/ʃi ˈpoʊstɪd ə nu ˈpɪktʃɚ/' },
  { en: 'I will upload the video tonight.', id: 'Saya akan mengunggah videonya malam ini.', ipa: '/aɪ wɪl ʌpˈloʊd ðə ˈvɪdioʊ təˈnaɪt/' },
  { en: 'You can download this file.', id: 'Kamu bisa mengunduh file ini.', ipa: '/ju kæn ˌdaʊnˈloʊd ðɪs faɪl/' },
  { en: 'This content is educational.', id: 'Konten ini bersifat edukatif.', ipa: '/ðɪs ˈkɑntɛnt ɪz ˌɛdʒəˈkeɪʃənəl/' },
  { en: 'He is a popular content creator.', id: 'Dia kreator konten yang populer.', ipa: '/hi ɪz ə ˈpɑpjələr ˈkɑntɛnt kriˈeɪtɚ/' },
  { en: 'She has many followers.', id: 'Dia punya banyak pengikut.', ipa: '/ʃi hæz ˈmɛni ˈfɑloʊɚz/' },
  { en: 'I am following that account.', id: 'Saya mengikuti akun itu.', ipa: '/aɪ æm ˈfɑloʊɪŋ ðæt əˈkaʊnt/' },
  { en: 'His channel has many subscribers.', id: 'Channelnya punya banyak subscriber.', ipa: '/hɪz ˈtʃænəl hæz ˈmɛni səbˈskraɪbɚz/' },
  { en: 'I sent you a friend request.', id: 'Saya mengirim permintaan pertemanan ke kamu.', ipa: '/aɪ sɛnt ju ə frɛnd rɪˈkwɛst/' },
  { en: 'Please like my post.', id: 'Tolong like postingan saya.', ipa: '/pliz laɪk maɪ poʊst/' },
  { en: 'Leave a comment below.', id: 'Tinggalkan komentar di bawah.', ipa: '/liv ə ˈkɑmɛnt bɪˈloʊ/' },
  { en: 'She replied to my comment.', id: 'Dia membalas komentar saya.', ipa: '/ʃi rɪˈplaɪd tə maɪ ˈkɑmɛnt/' },
  { en: 'Can you share this post?', id: 'Bisa bantu bagikan postingan ini?', ipa: '/kæn ju ʃɛr ðɪs poʊst/' },
  { en: 'He reposted the announcement.', id: 'Dia mengunggah ulang pengumuman itu.', ipa: '/hi riˈpoʊstɪd ði əˈnaʊnsmənt/' },
  { en: 'I posted a story this morning.', id: 'Saya membuat story pagi ini.', ipa: '/aɪ ˈpoʊstɪd ə ˈstɔri ðɪs ˈmɔrnɪŋ/' },
  { en: 'She started a live stream.', id: 'Dia memulai siaran langsung.', ipa: '/ʃi ˈstɑrtɪd ə laɪv strim/' },
  { en: 'This video is very short.', id: 'Video ini sangat singkat.', ipa: '/ðɪs ˈvɪdioʊ ɪz ˈvɛri ʃɔrt/' },
  { en: 'I uploaded a family photo.', id: 'Saya mengunggah foto keluarga.', ipa: '/aɪ ʌpˈloʊdɪd ə ˈfæməli ˈfoʊtoʊ/' },
  { en: 'Write a simple caption.', id: 'Tulis caption yang sederhana.', ipa: '/raɪt ə ˈsɪmpəl ˈkæpʃən/' },
  { en: 'Use a relevant hashtag.', id: 'Gunakan hashtag yang relevan.', ipa: '/juz ə ˈrɛləvənt ˈhæʃˌtæɡ/' },
  { en: 'Tag me in your post.', id: 'Tandai saya di postinganmu.', ipa: '/tæɡ mi ɪn jʊr poʊst/' },
  { en: 'Please mention our page.', id: 'Tolong mention halaman kami.', ipa: '/pliz ˈmɛnʃən ˈaʊɚ peɪdʒ/' },
  { en: 'I got a new notification.', id: 'Saya mendapat notifikasi baru.', ipa: '/aɪ ɡɑt ə nu ˌnoʊtəfəˈkeɪʃən/' },
  { en: 'I sent you a message.', id: 'Saya sudah kirim pesan ke kamu.', ipa: '/aɪ sɛnt ju ə ˈmɛsɪdʒ/' },
  { en: 'Send me a direct message.', id: 'Kirim saya pesan langsung.', ipa: '/sɛnd mi ə dəˈrɛkt ˈmɛsɪdʒ/' },
  { en: 'We had a quick chat online.', id: 'Kami sempat chat singkat online.', ipa: '/wi hæd ə kwɪk tʃæt ˌɑnˈlaɪn/' },
  { en: 'Join our study group.', id: 'Gabung ke grup belajar kami.', ipa: '/dʒɔɪn ˈaʊɚ ˈstʌdi ɡrup/' },
  { en: 'This community is very active.', id: 'Komunitas ini sangat aktif.', ipa: '/ðɪs kəˈmjunəti ɪz ˈvɛri ˈæktɪv/' },
  { en: 'Her video went viral.', id: 'Videonya jadi viral.', ipa: '/hɚ ˈvɪdioʊ wɛnt ˈvaɪrəl/' },
  { en: 'This topic is trending now.', id: 'Topik ini sedang tren sekarang.', ipa: '/ðɪs ˈtɑpɪk ɪz ˈtrɛndɪŋ naʊ/' },
  { en: 'The algorithm changed this week.', id: 'Algoritmanya berubah minggu ini.', ipa: '/ði ˈælɡəˌrɪðəm tʃeɪndʒd ðɪs wik/' },
  { en: 'This post has high engagement.', id: 'Postingan ini punya engagement tinggi.', ipa: '/ðɪs poʊst hæz haɪ ɪnˈɡeɪdʒmənt/' },
  { en: 'Your reach is improving.', id: 'Jangkauan akunmu makin bagus.', ipa: '/jʊr ritʃ ɪz ɪmˈpruvɪŋ/' },
  { en: 'Check your privacy settings.', id: 'Cek pengaturan privasimu.', ipa: '/tʃɛk jʊr ˈpraɪvəsi ˈsɛtɪŋz/' },
  { en: 'Open the settings menu.', id: 'Buka menu pengaturan.', ipa: '/ˈoʊpən ðə ˈsɛtɪŋz ˈmɛnju/' },
  { en: 'Her account is public.', id: 'Akunnya bersifat publik.', ipa: '/hɚ əˈkaʊnt ɪz ˈpʌblɪk/' },
  { en: 'My account is private.', id: 'Akun saya privat.', ipa: '/maɪ əˈkaʊnt ɪz ˈpraɪvət/' },
  { en: 'I had to block that user.', id: 'Saya terpaksa memblokir pengguna itu.', ipa: '/aɪ hæd tə blɑk ðæt ˈjuzɚ/' },
  { en: 'Report spam accounts quickly.', id: 'Segera laporkan akun spam.', ipa: '/rɪˈpɔrt spæm əˈkaʊnts ˈkwɪkli/' },
  { en: 'I received many spam messages.', id: 'Saya menerima banyak pesan spam.', ipa: '/aɪ rɪˈsivd ˈmɛni spæm ˈmɛsɪdʒɪz/' },
  { en: 'That profile is verified.', id: 'Profil itu sudah terverifikasi.', ipa: '/ðæt ˈproʊfaɪl ɪz ˈvɛrəˌfaɪd/' },
  { en: 'He wants to be an influencer.', id: 'Dia ingin jadi influencer.', ipa: '/hi wɑnts tə bi ən ˈɪnfluənsɚ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'((?:\\'|[^'])*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);
const rowMap = new Map(SOCIAL_MEDIA_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing SOCIAL_MEDIA_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Social Media topic: ${examples.length} translations + IPA`);
