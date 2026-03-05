// Vowel pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const vowelTips: SymbolPronunciationTips = {
  i: [
    { tip: 'Angkat lidah bagian depan setinggi mungkin mendekati langit-langit keras, tanpa menyentuh.', category: 'tongue' },
    { tip: 'Tarik bibir sedikit melebar seperti senyum tipis; rahang tetap relatif tertutup.', category: 'lips' },
    { tip: 'Nyalakan suara (voiced) dan tahan bunyi sedikit lebih panjang.', category: 'voice' },
    { tip: 'Cek cepat: bandingkan dengan /\u026A/, bunyi /i/ harus lebih tegang dan lebih panjang.', category: 'general' },
  ],
  '\u026A': [
    { tip: 'Posisikan lidah di depan-tinggi, tetapi lebih rendah dan lebih santai daripada /i/.', category: 'tongue' },
    { tip: 'Bibir netral, tidak perlu melebar kuat; rahang sedikit lebih terbuka daripada /i/.', category: 'mouth' },
    { tip: 'Nyalakan suara (voiced), tetapi ucapkan singkat dan ringan.', category: 'voice' },
    { tip: 'Cek cepat: /\u026A/ terdengar pendek, jangan dipanjangkan seperti /i/.', category: 'general' },
  ],
  e: [
    { tip: 'Tempatkan lidah di depan pada posisi menengah-tinggi.', category: 'tongue' },
    { tip: 'Bukaan rahang sedang dan bibir sedikit melebar.', category: 'mouth' },
    { tip: 'Alirkan suara voiced dengan stabil dalam satu kualitas vokal.', category: 'airflow' },
    { tip: 'Cek cepat: jangan meluncur ke /e\u026A/, tetap bunyi tunggal /e/.', category: 'general' },
  ],
  '\u025B': [
    { tip: 'Turunkan lidah depan ke posisi menengah-rendah.', category: 'tongue' },
    { tip: 'Rahang dibuka sedikit lebih lebar daripada /e/, bibir tetap netral.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan durasi pendek.', category: 'voice' },
    { tip: 'Cek cepat: /\u025B/ harus lebih terbuka daripada /e/.', category: 'general' },
  ],
  '\u00E6': [
    { tip: 'Turunkan lidah ke depan-bawah (lebih rendah dari /\u025B/).', category: 'tongue' },
    { tip: 'Buka rahang cukup lebar; bibir cenderung datar/melebar.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan energi jelas.', category: 'voice' },
    { tip: 'Cek cepat: jangan sempitkan bunyi menjadi /e/.', category: 'general' },
  ],
  '\u0251': [
    { tip: 'Geser lidah ke belakang dan turunkan ke posisi rendah.', category: 'tongue' },
    { tip: 'Buka rahang lebar, bibir tetap netral (tidak membulat).', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dan jaga resonansi tetap penuh.', category: 'voice' },
    { tip: 'Cek cepat: hindari pembulatan bibir agar tidak bergeser ke bunyi /\u0254/.', category: 'general' },
  ],
  '\u0254': [
    { tip: 'Posisi lidah di belakang-menengah, tidak serendah /\u0251/.', category: 'tongue' },
    { tip: 'Bulatkan bibir ringan; rahang membuka sedang.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dan pertahankan stabil.', category: 'voice' },
    { tip: 'Cek cepat: bunyi tetap tunggal, jangan meluncur ke /o\u028A/.', category: 'general' },
  ],
  '\u028A': [
    { tip: 'Lidah berada di belakang-tinggi, tetapi lebih santai daripada /u/.', category: 'tongue' },
    { tip: 'Bibir membulat ringan, tidak serapat /u/.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dengan durasi pendek.', category: 'voice' },
    { tip: 'Cek cepat: /\u028A/ pendek dan santai, jangan ditahan lama.', category: 'general' },
  ],
  '\u028C': [
    { tip: 'Pusatkan lidah di tengah cenderung ke belakang.', category: 'tongue' },
    { tip: 'Bibir netral dan rahang buka sedang.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced, dorong udara stabil tanpa tekanan berlebih.', category: 'airflow' },
    { tip: 'Cek cepat: jaga bunyi tetap netral, tidak berubah menjadi /\u0251/.', category: 'general' },
  ],
  '\u0259': [
    { tip: 'Rilekskan lidah di posisi tengah-netral (schwa).', category: 'tongue' },
    { tip: 'Gerakan bibir dan rahang dibuat minimal.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced secara ringan dan sangat singkat.', category: 'voice' },
    { tip: 'Cek cepat: schwa biasanya muncul pada suku kata lemah/tak bertekanan.', category: 'general' },
  ],
  '\u025A': [
    { tip: 'Mulai dari posisi schwa, lalu beri warna /r/ (r-colored vowel).', category: 'tongue' },
    { tip: 'Ujung lidah mendekat ke langit-langit tanpa menyentuh; bibir netral.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan aliran stabil.', category: 'voice' },
    { tip: 'Cek cepat: bunyi harus terasa satu unit, bukan dua suku kata terpisah.', category: 'general' },
  ],
  u: [
    { tip: 'Naikkan lidah belakang setinggi mungkin untuk bunyi /u/.', category: 'tongue' },
    { tip: 'Bibir dibulatkan lebih rapat daripada /\u028A/; rahang relatif tertutup.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dan tahan sedikit lebih panjang.', category: 'voice' },
    { tip: 'Cek cepat: /u/ harus terdengar tegang dan panjang, bukan pendek seperti /\u028A/.', category: 'general' },
  ],
};
