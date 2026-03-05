import type { VocabularyTopicId, VocabularyTopicMeta } from './types';

const VOCABULARY_TOPICS_BASE: VocabularyTopicMeta[] = [
  {
    topicId: 'color',
    title: 'Color',
    subtitle: 'Nama warna yang paling sering dipakai sehari-hari.',
    description:
      'Fokus ke kosakata warna dasar untuk deskripsi benda, pakaian, dan suasana.',
  },
  {
    topicId: 'size',
    title: 'Size',
    subtitle: 'Kata ukuran umum untuk membandingkan benda.',
    description:
      'Dipakai untuk ngobrol soal bentuk, jarak, berat, dan proporsi secara sederhana.',
  },
  {
    topicId: 'body-parts',
    title: 'Parts of the Body',
    subtitle: 'Kosakata bagian tubuh dasar untuk percakapan harian.',
    description:
      'Berguna untuk konteks kesehatan ringan, instruksi sederhana, dan aktivitas fisik.',
  },
  {
    topicId: 'family',
    title: 'Family',
    subtitle: 'Kosakata keluarga inti sampai keluarga besar.',
    description:
      'Dipakai untuk perkenalan, ngobrol soal hubungan keluarga, dan cerita aktivitas rumah.',
  },
  {
    topicId: 'daily-routines',
    title: 'Daily Routines',
    subtitle: 'Kosakata aktivitas dari pagi sampai malam.',
    description:
      'Berguna untuk bercerita tentang kebiasaan harian, jadwal pribadi, dan kegiatan rumah.',
  },
  {
    topicId: 'home',
    title: 'Home',
    subtitle: 'Kosakata ruangan, benda, dan perlengkapan rumah.',
    description:
      'Dipakai untuk ngobrol tentang tempat tinggal, aktivitas di rumah, dan kebutuhan sehari-hari.',
  },
  {
    topicId: 'time-date',
    title: 'Time & Date',
    subtitle: 'Kosakata jam, hari, tanggal, dan frekuensi.',
    description:
      'Berguna untuk membuat janji, membahas jadwal, dan menceritakan rutinitas dengan waktu yang jelas.',
  },
  {
    topicId: 'number',
    title: 'Cardinal Number',
    subtitle: 'Kosakata angka kardinal bertahap + operasi hitung dasar (tambah, kurang, kali, bagi, sama dengan).',
    description:
      'Dipakai untuk menyebut umur, nomor telepon, jumlah barang, waktu, harga, dan angka besar bertahap dari satuan sampai triliun.',
  },
  {
    topicId: 'ordinal-number',
    title: 'Ordinal Number',
    subtitle: 'Kosakata angka urutan untuk tanggal, posisi, ranking, dan urutan langkah.',
    description:
      'Dipakai untuk menyebut urutan seperti first, second, third, sampai bentuk lebih tinggi seperti hundredth dan thousandth.',
  },
  {
    topicId: 'feelings',
    title: 'Feelings',
    subtitle: 'Kosakata emosi dan perasaan untuk percakapan sehari-hari.',
    description:
      'Dipakai untuk menyampaikan kondisi emosi seperti happy, sad, worried, relieved, dan respons perasaan saat ngobrol.',
  },
  {
    topicId: 'transport',
    title: 'Transport',
    subtitle: 'Kosakata transportasi umum, kendaraan pribadi, dan perjalanan harian.',
    description:
      'Dipakai untuk ngobrol tentang arah, jadwal, tiket, stasiun, kemacetan, dan aktivitas berangkat-pulang.',
  },
  {
    topicId: 'places',
    title: 'Places',
    subtitle: 'Kosakata tempat umum, lokasi kota, dan lingkungan sekitar.',
    description:
      'Dipakai untuk tanya arah, jelaskan lokasi, dan ngobrol tentang tempat sehari-hari seperti school, market, hospital, dan city center.',
  },
  {
    topicId: 'clothes',
    title: 'Clothes',
    subtitle: 'Kosakata pakaian, aksesori, ukuran, dan kondisi pakaian sehari-hari.',
    description:
      'Dipakai untuk belanja pakaian, tanya ukuran, jelaskan style, dan ngobrol tentang apa yang kamu pakai.',
  },
  {
    topicId: 'food',
    title: 'Food',
    subtitle: 'Kosakata makanan harian, bahan dasar, dan rasa makanan.',
    description:
      'Dipakai untuk pesan makanan, ngobrol soal menu favorit, bahan masak, dan rasa seperti sweet atau spicy.',
  },
  {
    topicId: 'drinks',
    title: 'Drinks',
    subtitle: 'Kosakata minuman harian dari water, tea, coffee sampai minuman dingin.',
    description:
      'Dipakai untuk memesan minuman, menyebut jenis minuman, rasa, suhu, dan kebutuhan seperti refill.',
  },
  {
    topicId: 'weather',
    title: 'Weather',
    subtitle: 'Kosakata cuaca harian seperti sunny, rainy, windy, dan forecast.',
    description:
      'Dipakai untuk membahas kondisi cuaca, suhu, hujan, angin, dan rencana aktivitas harian.',
  },
  {
    topicId: 'taste',
    title: 'Taste',
    subtitle: 'Kosakata rasa makanan dan minuman: sweet, salty, sour, bitter, spicy.',
    description:
      'Dipakai untuk mendeskripsikan rasa, menilai makanan/minuman, dan memberi feedback sederhana seperti too salty atau not sweet enough.',
  },
  {
    topicId: 'vegetables',
    title: 'Vegetables',
    subtitle: 'Kosakata sayuran harian, bumbu dasar, dan cara memasak sederhana.',
    description:
      'Dipakai untuk belanja bahan masak, menyebut nama sayuran, dan ngobrol soal masakan rumahan sehari-hari.',
  },
  {
    topicId: 'fruit',
    title: 'Fruit',
    subtitle: 'Kosakata buah-buahan harian, tingkat kematangan, dan karakter rasa buah.',
    description:
      'Dipakai untuk belanja buah, menyebut jenis buah, dan ngobrol soal rasa seperti sweet, sour, atau juicy.',
  },
  {
    topicId: 'school',
    title: 'School',
    subtitle: 'Kosakata kegiatan belajar, ruang kelas, orang di sekolah, dan perlengkapan belajar.',
    description:
      'Dipakai untuk ngobrol tentang pelajaran, tugas, jadwal sekolah, kegiatan kelas, dan komunikasi sehari-hari di lingkungan sekolah.',
  },
  {
    topicId: 'personal-information',
    title: 'Personal Information',
    subtitle: 'Kosakata untuk memperkenalkan diri, isi formulir, dan konfirmasi data pribadi.',
    description:
      'Dipakai untuk menyebut nama, umur, alamat, kontak, identitas dasar, dan detail pribadi sederhana dalam situasi harian.',
  },
  {
    topicId: 'physical-appearance',
    title: 'Physical Appearance',
    subtitle: 'Kosakata deskripsi penampilan fisik seperti tinggi, bentuk tubuh, rambut, wajah, dan gaya.',
    description:
      'Dipakai untuk mendeskripsikan ciri fisik seseorang secara sopan dalam perkenalan, identifikasi orang, dan percakapan harian.',
  },
  {
    topicId: 'hobbies-interests',
    title: 'Hobbies & Interests',
    subtitle: 'Kosakata hobi, aktivitas waktu luang, serta minat pribadi sehari-hari.',
    description:
      'Dipakai untuk ngobrol tentang kesukaan, kebiasaan santai, komunitas, dan aktivitas yang sering dilakukan saat free time.',
  },
  {
    topicId: 'sports',
    title: 'Sports',
    subtitle: 'Kosakata olahraga, perlengkapan, posisi pemain, dan aksi saat bermain.',
    description:
      'Dipakai untuk ngobrol tentang jenis olahraga, latihan, pertandingan, skor, tim, dan aktivitas fisik harian.',
  },
  {
    topicId: 'games',
    title: 'Games',
    subtitle: 'Kosakata permainan digital dan non-digital, termasuk aksi bermain, strategi, dan hasil permainan.',
    description:
      'Dipakai untuk ngobrol tentang game favorit, aturan dasar, peran pemain, dan aktivitas main bareng teman.',
  },
  {
    topicId: 'entertainment-media',
    title: 'Entertainment & Media',
    subtitle: 'Kosakata hiburan dan media seperti film, musik, TV, konten digital, dan platform online.',
    description:
      'Dipakai untuk ngobrol tentang tontonan, lagu favorit, konten media sosial, berita, dan kebiasaan konsumsi media sehari-hari.',
  },
  {
    topicId: 'education',
    title: 'Education',
    subtitle: 'Kosakata pendidikan umum: proses belajar, jenjang, sistem kelas, dan aktivitas akademik.',
    description:
      'Dipakai untuk ngobrol tentang sekolah, kuliah, mata pelajaran, ujian, tugas, dan perkembangan belajar secara umum.',
  },
  {
    topicId: 'shapes',
    title: 'Shapes',
    subtitle: 'Kosakata bentuk geometri dasar sampai bentuk visual yang sering dipakai sehari-hari.',
    description:
      'Dipakai untuk mendeskripsikan bentuk benda, posisi visual, desain, dan instruksi sederhana terkait bentuk.',
  },
  {
    topicId: 'electronics',
    title: 'Electronics',
    subtitle: 'Kosakata perangkat elektronik harian, aksesori, fitur, dan masalah teknis sederhana.',
    description:
      'Dipakai untuk ngobrol tentang gadget, penggunaan perangkat, pengisian daya, koneksi, dan troubleshooting dasar.',
  },
  {
    topicId: 'shopping',
    title: 'Shopping',
    subtitle: 'Kosakata belanja harian: barang, harga, pembayaran, diskon, dan layanan toko.',
    description:
      'Dipakai untuk tanya harga, pilih produk, negosiasi sederhana, metode pembayaran, dan komunikasi saat belanja online maupun offline.',
  },
  {
    topicId: 'bathroom',
    title: 'Bathroom',
    subtitle: 'Kosakata benda, aktivitas, dan kebersihan di kamar mandi sehari-hari.',
    description:
      'Dipakai untuk ngobrol tentang peralatan mandi, rutinitas kebersihan, perlengkapan pribadi, dan instruksi dasar di kamar mandi.',
  },
  {
    topicId: 'kitchen',
    title: 'Kitchen',
    subtitle: 'Kosakata area dapur, peralatan masak, bahan, dan aktivitas memasak harian.',
    description:
      'Dipakai untuk ngobrol tentang perlengkapan dapur, resep sederhana, proses memasak, dan kegiatan makan di rumah.',
  },
  {
    topicId: 'social-media',
    title: 'Social Media',
    subtitle: 'Kosakata platform media sosial, aktivitas online, interaksi akun, dan konten digital.',
    description:
      'Dipakai untuk ngobrol tentang posting, komentar, followers, privasi akun, dan kebiasaan penggunaan media sosial sehari-hari.',
  },
];

const VOCABULARY_TOPIC_LEARNING_ORDER: VocabularyTopicId[] = [
  'personal-information',
  'family',
  'body-parts',
  'physical-appearance',
  'feelings',
  'daily-routines',
  'time-date',
  'number',
  'ordinal-number',
  'home',
  'bathroom',
  'kitchen',
  'food',
  'drinks',
  'taste',
  'fruit',
  'vegetables',
  'clothes',
  'color',
  'size',
  'shapes',
  'places',
  'transport',
  'weather',
  'school',
  'education',
  'hobbies-interests',
  'sports',
  'games',
  'entertainment-media',
  'social-media',
  'shopping',
  'electronics',
];

const VOCABULARY_TOPIC_ORDER_INDEX = new Map<VocabularyTopicId, number>(
  VOCABULARY_TOPIC_LEARNING_ORDER.map((topicId, index) => [topicId, index]),
);

export const VOCABULARY_TOPICS: VocabularyTopicMeta[] = [...VOCABULARY_TOPICS_BASE].sort(
  (a, b) => {
    const aOrder = VOCABULARY_TOPIC_ORDER_INDEX.get(a.topicId) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = VOCABULARY_TOPIC_ORDER_INDEX.get(b.topicId) ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.title.localeCompare(b.title);
  },
);

export const VOCABULARY_TOPIC_ID_SET = new Set<VocabularyTopicId>(
  VOCABULARY_TOPICS.map((topic) => topic.topicId),
);

export function isVocabularyTopicId(value: string): value is VocabularyTopicId {
  return VOCABULARY_TOPIC_ID_SET.has(value as VocabularyTopicId);
}

export const VOCABULARY_TOPIC_MAP: Record<VocabularyTopicId, VocabularyTopicMeta> =
  Object.fromEntries(
    VOCABULARY_TOPICS.map((topic) => [topic.topicId, topic]),
  ) as Record<VocabularyTopicId, VocabularyTopicMeta>;

export function getVocabularyTopicById(topicId: VocabularyTopicId): VocabularyTopicMeta {
  return VOCABULARY_TOPIC_MAP[topicId];
}
