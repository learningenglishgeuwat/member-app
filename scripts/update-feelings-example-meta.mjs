import fs from 'fs';

const WORDS_PATH = 'app/skill/vocabulary/topic/data/words/feelings.ts';
const META_PATH = 'app/skill/vocabulary/topic/data/example-meta.ts';

const FEELINGS_ROWS = [
  { en: 'I feel happy today.', id: 'Saya merasa senang hari ini.', ipa: '/aɪ fil ˈhæpi təˈdeɪ/' },
  { en: 'He looks sad.', id: 'Dia terlihat sedih.', ipa: '/hi lʊks sæd/' },
  { en: 'She is angry now.', id: 'Dia sedang marah sekarang.', ipa: '/ʃi ɪz ˈæŋɡri naʊ/' },
  { en: 'I am tired after work.', id: 'Saya lelah setelah kerja.', ipa: '/aɪ æm taɪɚd ˈæftɚ wɝk/' },
  { en: 'The baby is sleepy.', id: 'Bayinya mengantuk.', ipa: '/ðə ˈbeɪbi ɪz ˈslipi/' },
  { en: 'I am hungry.', id: 'Saya lapar.', ipa: '/aɪ æm ˈhʌŋɡri/' },
  { en: 'I am thirsty.', id: 'Saya haus.', ipa: '/aɪ æm ˈθɝsti/' },
  { en: 'The child is scared.', id: 'Anak itu ketakutan.', ipa: '/ðə tʃaɪld ɪz skɛrd/' },
  { en: 'She is afraid of dogs.', id: 'Dia takut anjing.', ipa: '/ʃi ɪz əˈfreɪd əv dɔɡz/' },
  { en: 'I feel nervous before the test.', id: 'Saya gugup sebelum ujian.', ipa: '/aɪ fil ˈnɝvəs bɪˈfɔr ðə tɛst/' },
  { en: 'Take a deep breath and stay calm.', id: 'Tarik napas dalam dan tetap tenang.', ipa: '/teɪk ə dip brɛθ ənd steɪ kɑm/' },
  { en: 'We are excited about the trip.', id: 'Kami bersemangat untuk perjalanan ini.', ipa: '/wi ɑr ɪkˈsaɪtɪd əˈbaʊt ðə trɪp/' },
  { en: 'He feels bored in class.', id: 'Dia bosan di kelas.', ipa: '/hi filz bɔrd ɪn klæs/' },
  { en: 'She is worried about her exam.', id: 'Dia khawatir tentang ujiannya.', ipa: '/ʃi ɪz ˈwɝid əˈbaʊt hɚ ɪɡˈzæm/' },
  { en: 'I feel stressed this week.', id: 'Minggu ini saya merasa stres.', ipa: '/aɪ fil strɛst ðɪs wik/' },
  { en: 'After yoga, I feel relaxed.', id: 'Setelah yoga, saya merasa rileks.', ipa: '/ˈæftɚ ˈjoʊɡə aɪ fil rɪˈlækst/' },
  { en: 'I was surprised by the news.', id: 'Saya terkejut dengan kabar itu.', ipa: '/aɪ wəz sɚˈpraɪzd baɪ ðə nuz/' },
  { en: 'I am confused by this question.', id: 'Saya bingung dengan pertanyaan ini.', ipa: '/aɪ æm kənˈfjuzd baɪ ðɪs ˈkwɛstʃən/' },
  { en: 'He is shy in new groups.', id: 'Dia pemalu di kelompok baru.', ipa: '/hi ɪz ʃaɪ ɪn nu ɡrups/' },
  { en: 'Your parents are proud of you.', id: 'Orang tua kamu bangga sama kamu.', ipa: '/jʊr ˈpɛrənts ɑr praʊd əv ju/' },
  { en: 'I feel embarrassed about my mistake.', id: 'Saya malu dengan kesalahan saya.', ipa: '/aɪ fil ɪmˈbɛrəst əˈbaʊt maɪ mɪˈsteɪk/' },
  { en: 'She is disappointed with the result.', id: 'Dia kecewa dengan hasilnya.', ipa: '/ʃi ɪz ˌdɪsəˈpɔɪntɪd wɪð ðə rɪˈzʌlt/' },
  { en: 'He feels lonely at night.', id: 'Dia merasa kesepian di malam hari.', ipa: '/hi filz ˈloʊnli æt naɪt/' },
  { en: 'I am grateful for your help.', id: 'Saya bersyukur atas bantuanmu.', ipa: '/aɪ æm ˈɡreɪtfəl fɔr jʊr hɛlp/' },
  { en: 'I am thankful for your support.', id: 'Saya berterima kasih atas dukunganmu.', ipa: '/aɪ æm ˈθæŋkfəl fɔr jʊr səˈpɔrt/' },
  { en: 'She is hopeful about the future.', id: 'Dia punya harapan untuk masa depan.', ipa: '/ʃi ɪz ˈhoʊpfəl əˈbaʊt ðə ˈfjutʃɚ/' },
  { en: 'I am upset about that message.', id: 'Saya kesal dengan pesan itu.', ipa: '/aɪ æm ʌpˈsɛt əˈbaʊt ðæt ˈmɛsɪdʒ/' },
  { en: 'He is annoyed by the noise.', id: 'Dia terganggu oleh kebisingan itu.', ipa: '/hi ɪz əˈnɔɪd baɪ ðə nɔɪz/' },
  { en: 'She feels jealous sometimes.', id: 'Dia kadang merasa cemburu.', ipa: '/ʃi filz ˈdʒɛləs ˈsʌmˌtaɪmz/' },
  { en: 'He felt guilty after lying.', id: 'Dia merasa bersalah setelah berbohong.', ipa: '/hi fɛlt ˈɡɪlti ˈæftɚ ˈlaɪɪŋ/' },
  { en: 'I feel relieved now.', id: 'Sekarang saya merasa lega.', ipa: '/aɪ fil rɪˈlivd naʊ/' },
  { en: 'We were shocked by the accident.', id: 'Kami kaget dengan kecelakaan itu.', ipa: '/wi wɚ ʃɑkt baɪ ði ˈæksɪdənt/' },
  { en: 'She sounds confident in interviews.', id: 'Dia terdengar percaya diri saat wawancara.', ipa: '/ʃi saʊndz ˈkɑnfɪdənt ɪn ˈɪntɚˌvjuz/' },
  { en: 'I feel comfortable here.', id: 'Saya merasa nyaman di sini.', ipa: '/aɪ fil ˈkʌmftɚbəl hɪr/' },
  { en: 'These shoes are uncomfortable.', id: 'Sepatu ini tidak nyaman.', ipa: '/ðiz ʃuz ɑr ʌnˈkʌmftɚbəl/' },
  { en: 'My arm is hurt.', id: 'Lengan saya sakit.', ipa: '/maɪ ɑrm ɪz hɝt/' },
  { en: 'I have pain in my back.', id: 'Saya merasa sakit di punggung.', ipa: '/aɪ hæv peɪn ɪn maɪ bæk/' },
  { en: 'I love my family.', id: 'Saya sayang keluarga saya.', ipa: '/aɪ lʌv maɪ ˈfæməli/' },
  { en: 'I hate waiting in long lines.', id: 'Saya benci menunggu di antrean panjang.', ipa: '/aɪ heɪt ˈweɪtɪŋ ɪn lɔŋ laɪnz/' },
  { en: 'I miss my hometown.', id: 'Saya kangen kampung halaman saya.', ipa: '/aɪ mɪs maɪ ˈhoʊmˌtaʊn/' },
  { en: 'I am interested in music.', id: 'Saya tertarik dengan musik.', ipa: '/aɪ æm ˈɪntrəstɪd ɪn ˈmjuzɪk/' },
  { en: 'He is curious about science.', id: 'Dia penasaran tentang sains.', ipa: '/hi ɪz ˈkjʊriəs əˈbaʊt ˈsaɪəns/' },
  { en: 'I am fine now.', id: 'Saya baik-baik saja sekarang.', ipa: '/aɪ æm faɪn naʊ/' },
  { en: 'Okay, I understand.', id: 'Oke, saya paham.', ipa: '/oʊˈkeɪ aɪ ˌʌndɚˈstænd/' },
  { en: 'He is sick today.', id: 'Dia sakit hari ini.', ipa: '/hi ɪz sɪk təˈdeɪ/' },
  { en: 'I feel better now.', id: 'Sekarang saya merasa lebih baik.', ipa: '/aɪ fil ˈbɛtɚ naʊ/' },
];

const wordsContent = fs.readFileSync(WORDS_PATH, 'utf8');
const examples = [...wordsContent.matchAll(/exampleEn:\s*'([^']+)'/g)].map((m) => m[1]);
const rowMap = new Map(FEELINGS_ROWS.map((row) => [row.en, row]));

const missingRows = examples.filter((example) => !rowMap.has(example));
if (missingRows.length > 0) {
  throw new Error(`Missing FEELINGS_ROWS mappings for: ${missingRows.join(' | ')}`);
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
console.log(`Updated Feelings topic: ${examples.length} translations + IPA`);
