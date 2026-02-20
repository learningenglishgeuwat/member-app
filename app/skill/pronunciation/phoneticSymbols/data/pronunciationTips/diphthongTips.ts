// Diphthong pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const diphthongTips: SymbolPronunciationTips = {
  'a\u026A': [
    { tip: 'Mulai dari /a/: lidah rendah dan rahang cukup terbuka.', category: 'mouth' },
    { tip: 'Luncurkan lidah ke depan-atas menuju /\u026A/ tanpa berhenti.', category: 'tongue' },
    { tip: 'Bibir dari netral ke sedikit melebar saat mendekati akhir.', category: 'lips' },
    { tip: 'Cek cepat: ucapkan dalam satu napas, jangan dipecah jadi dua suku kata.', category: 'general' },
  ],
  'a\u028A': [
    { tip: 'Mulai dari /a/ dengan rahang terbuka.', category: 'mouth' },
    { tip: 'Geser lidah ke belakang-atas menuju /\u028A/.', category: 'tongue' },
    { tip: 'Bibir berubah dari netral menjadi agak membulat di akhir.', category: 'lips' },
    { tip: 'Cek cepat: pastikan ada gerak meluncur, bukan dua bunyi terpisah.', category: 'general' },
  ],
  'e\u026A': [
    { tip: 'Awali dari /e/ dengan lidah depan-menengah.', category: 'tongue' },
    { tip: 'Naikkan lidah perlahan ke arah /\u026A/.', category: 'tongue' },
    { tip: 'Rahang sedikit menutup saat menuju elemen kedua.', category: 'mouth' },
    { tip: 'Cek cepat: jangan berhenti di /e/ saja; harus terdengar glide.', category: 'general' },
  ],
  '\u0254\u026A': [
    { tip: 'Mulai dari /\u0254/ (lidah belakang-menengah, bibir agak bulat).', category: 'mouth' },
    { tip: 'Gerakkan lidah ke depan-atas menuju /\u026A/.', category: 'tongue' },
    { tip: 'Kurangi pembulatan bibir saat mendekati bagian akhir.', category: 'lips' },
    { tip: 'Cek cepat: bunyi harus mengalir mulus dalam satu tarikan suara.', category: 'airflow' },
  ],
  'o\u028A': [
    { tip: 'Mulai dari /o/ dengan lidah belakang-menengah.', category: 'tongue' },
    { tip: 'Luncurkan ke /\u028A/ dengan gerak kecil ke belakang-atas.', category: 'tongue' },
    { tip: 'Bibir tetap bulat lalu lebih rileks di akhir.', category: 'lips' },
    { tip: 'Cek cepat: jangan jadikan vokal datar /o/; harus terdengar bergerak.', category: 'general' },
  ],
  'e\u0259': [
    { tip: 'Mulai dari /e/ dengan posisi depan-menengah.', category: 'tongue' },
    { tip: 'Rilekskan lidah menuju schwa /\u0259/ di akhir.', category: 'tongue' },
    { tip: 'Rahang dan bibir bergerak kecil menuju posisi netral.', category: 'mouth' },
    { tip: 'Cek cepat: bagian akhir dibuat lebih ringan, jangan diberi tekanan besar.', category: 'general' },
  ],
  '\u026A\u0259': [
    { tip: 'Awali dari /\u026A/ yang singkat dan ringan.', category: 'tongue' },
    { tip: 'Luncurkan ke /\u0259/ tanpa jeda.', category: 'tongue' },
    { tip: 'Bibir tetap santai, rahang bergerak minimal.', category: 'mouth' },
    { tip: 'Cek cepat: pastikan glide tetap halus, bukan dua vokal terpisah.', category: 'general' },
  ],
  '\u028A\u0259': [
    { tip: 'Mulai dari /\u028A/ dengan bibir agak bulat.', category: 'lips' },
    { tip: 'Gerakkan lidah menuju posisi netral /\u0259/.', category: 'tongue' },
    { tip: 'Bibir dari bulat menjadi netral pada akhir bunyi.', category: 'lips' },
    { tip: 'Cek cepat: bunyi diucapkan satu aliran, jangan dipotong di tengah.', category: 'airflow' },
  ],
};
