// Diphthong pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const diphthongTips: SymbolPronunciationTips = {
  // 1. /aɪ/
  aɪ: [
    { tip: 'Mulai dari /a/: lidah rendah dan rahang cukup terbuka.', category: 'mouth' },
    { tip: 'Luncurkan lidah ke depan-atas menuju /ɪ/ tanpa berhenti.', category: 'tongue' },
    { tip: 'Bibir dari netral ke sedikit melebar saat mendekati akhir.', category: 'lips' },
    { tip: 'Cek cepat: ucapkan dalam satu napas, jangan dipecah jadi dua suku kata.', category: 'general' },
  ],

  // 2. /eɪ/
  eɪ: [
    { tip: 'Awali dari /e/ dengan lidah depan-menengah.', category: 'tongue' },
    { tip: 'Naikkan lidah perlahan ke arah /ɪ/.', category: 'tongue' },
    { tip: 'Rahang sedikit menutup saat menuju elemen kedua.', category: 'mouth' },
    { tip: 'Cek cepat: jangan berhenti di /e/ saja; harus terdengar glide.', category: 'general' },
  ],

  // 3. /ɔɪ/
  ɔɪ: [
    { tip: 'Mulai dari /ɔ/ (lidah belakang-menengah, bibir agak bulat).', category: 'mouth' },
    { tip: 'Gerakkan lidah ke depan-atas menuju /ɪ/.', category: 'tongue' },
    { tip: 'Kurangi pembulatan bibir saat mendekati bagian akhir.', category: 'lips' },
    { tip: 'Cek cepat: bunyi harus mengalir mulus dalam satu tarikan suara.', category: 'airflow' },
  ],

  // 4. /ɪə/ (Sesuai posisi /ɪr/ pada tabel master)
  ɪə: [
    { tip: 'Awali dari /ɪ/ yang singkat dan ringan.', category: 'tongue' },
    { tip: 'Luncurkan ke /ə/ tanpa jeda.', category: 'tongue' },
    { tip: 'Bibir tetap santai, rahang bergerak minimal.', category: 'mouth' },
    { tip: 'Cek cepat: pastikan glide tetap halus, bukan dua vokal terpisah.', category: 'general' },
  ],

  // 5. /eə/ (Sesuai posisi /ɛr/ pada tabel master)
  eə: [
    { tip: 'Mulai dari /e/ dengan posisi depan-menengah.', category: 'tongue' },
    { tip: 'Rilekskan lidah menuju schwa /ə/ di akhir.', category: 'tongue' },
    { tip: 'Rahang dan bibir bergerak kecil menuju posisi netral.', category: 'mouth' },
    { tip: 'Cek cepat: bagian akhir dibuat lebih ringan, jangan diberi tekanan besar.', category: 'general' },
  ],

  // 6. /ʊə/ (Sesuai posisi /ʊr/ pada tabel master)
  ʊə: [
    { tip: 'Mulai dari /ʊ/ dengan bibir agak bulat.', category: 'lips' },
    { tip: 'Gerakkan lidah menuju posisi netral /ə/.', category: 'tongue' },
    { tip: 'Bibir dari bulat menjadi netral pada akhir bunyi.', category: 'lips' },
    { tip: 'Cek cepat: bunyi diucapkan satu aliran, jangan dipotong di tengah.', category: 'airflow' },
  ],

  // 7. /oʊ/
  oʊ: [
    { tip: 'Mulai dari /o/ dengan lidah belakang-menengah.', category: 'tongue' },
    { tip: 'Luncurkan ke /ʊ/ dengan gerak kecil ke belakang-atas.', category: 'tongue' },
    { tip: 'Bibir tetap bulat lalu lebih rileks di akhir.', category: 'lips' },
    { tip: 'Cek cepat: jangan jadikan vokal datar /o/; harus terdengar bergerak.', category: 'general' },
  ],

  // 8. /aʊ/
  aʊ: [
    { tip: 'Mulai dari /a/ dengan rahang terbuka.', category: 'mouth' },
    { tip: 'Geser lidah ke belakang-atas menuju /ʊ/.', category: 'tongue' },
    { tip: 'Bibir berubah dari netral menjadi agak membulat di akhir.', category: 'lips' },
    { tip: 'Cek cepat: pastikan ada gerak meluncur, bukan dua bunyi terpisah.', category: 'general' },
  ],
};