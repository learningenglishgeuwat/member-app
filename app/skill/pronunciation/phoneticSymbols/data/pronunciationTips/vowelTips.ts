// Vowel pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const vowelTips: SymbolPronunciationTips = {
  // ==========================================
  // --- 1. VOWEL (LAX) - Urutan Sesuai Tabel ---
  // ==========================================
  ʌ: [
    { tip: 'Pusatkan lidah di tengah cenderung ke belakang.', category: 'tongue' },
    { tip: 'Bibir netral dan rahang buka sedang.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced, dorong udara stabil tanpa tekanan berlebih.', category: 'airflow' },
    { tip: 'Cek cepat: jaga bunyi tetap netral, tidak berubah menjadi /ɑ/.', category: 'general' },
  ],
  ɪ: [
    { tip: 'Posisikan lidah di depan-tinggi, tetapi lebih rendah dan lebih santai daripada /i/.', category: 'tongue' },
    { tip: 'Bibir netral, tidak perlu melebar kuat; rahang sedikit lebih terbuka daripada /i/.', category: 'mouth' },
    { tip: 'Nyalakan suara (voiced), tetapi ucapkan singkat dan ringan.', category: 'voice' },
    { tip: 'Cek cepat: /ɪ/ terdengar pendek, jangan dipanjangkan seperti /i/.', category: 'general' },
  ],
  ʊ: [
    { tip: 'Lidah berada di belakang-tinggi, tetapi lebih santai daripada /u/.', category: 'tongue' },
    { tip: 'Bibir membulat ringan, tidak serapat /u/.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dengan durasi pendek.', category: 'voice' },
    { tip: 'Cek cepat: /ʊ/ pendek dan santai, jangan ditahan lama.', category: 'general' },
  ],
  ɛ: [
    { tip: 'Turunkan lidah depan ke posisi menengah-rendah.', category: 'tongue' },
    { tip: 'Rahang dibuka sedikit lebih lebar daripada /e/, bibir tetap netral.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan durasi pendek.', category: 'voice' },
    { tip: 'Cek cepat: /ɛ/ harus lebih terbuka daripada /e/.', category: 'general' },
  ],
  ə: [
    { tip: 'Rilekskan lidah di posisi tengah-netral (schwa).', category: 'tongue' },
    { tip: 'Gerakan bibir dan rahang dibuat minimal.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced secara ringan dan sangat singkat.', category: 'voice' },
    { tip: 'Cek cepat: schwa biasanya muncul pada suku kata lemah/tak bertekanan.', category: 'general' },
  ],
  ɚ: [
    { tip: 'Mulai dari posisi schwa, lalu beri warna /r/ (r-colored vowel).', category: 'tongue' },
    { tip: 'Ujung lidah mendekat ke langit-langit tanpa menyentuh; bibir netral.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan aliran stabil.', category: 'voice' },
    { tip: 'Cek cepat: bunyi harus terasa satu unit, bukan dua suku kata terpisah.', category: 'general' },
  ],

  // ==========================================
  // --- 2. VOWEL (TENSE) - Urutan Sesuai Tabel --
  // ==========================================
  ɑ: [
    { tip: 'Geser lidah ke belakang dan turunkan ke posisi rendah.', category: 'tongue' },
    { tip: 'Buka rahang lebar, bibir tetap netral (tidak membulat).', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dan jaga resonansi tetap penuh.', category: 'voice' },
    { tip: 'Cek cepat: hindari pembulatan bibir agar tidak bergeser ke bunyi /ɔ/.', category: 'general' },
  ],
  i: [
    { tip: 'Angkat lidah bagian depan setinggi mungkin mendekati langit-langit keras, tanpa menyentuh.', category: 'tongue' },
    { tip: 'Tarik bibir sedikit melebar seperti senyum tipis; rahang tetap relatif tertutup.', category: 'lips' },
    { tip: 'Nyalakan suara (voiced) dan tahan bunyi sedikit lebih panjang.', category: 'voice' },
    { tip: 'Cek cepat: bandingkan dengan /ɪ/, bunyi /i/ harus lebih tegang dan lebih panjang.', category: 'general' },
  ],
  u: [
    { tip: 'Naikkan lidah belakang setinggi mungkin untuk bunyi /u/.', category: 'tongue' },
    { tip: 'Bibir dibulatkan lebih rapat daripada /ʊ/; rahang relatif tertutup.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dan tahan sedikit lebih panjang.', category: 'voice' },
    { tip: 'Cek cepat: /u/ harus terdengar tegang dan panjang, bukan pendek seperti /ʊ/.', category: 'general' },
  ],
  æ: [
    { tip: 'Turunkan lidah ke depan-bawah (lebih rendah dari /ɛ/).', category: 'tongue' },
    { tip: 'Buka rahang cukup lebar; bibir cenderung datar/melebar.', category: 'mouth' },
    { tip: 'Nyalakan suara voiced dengan energi jelas.', category: 'voice' },
    { tip: 'Cek cepat: jangan sempitkan bunyi menjadi /e/.', category: 'general' },
  ],
  ɔ: [
    { tip: 'Posisi lidah di belakang-menengah, tidak serendah /ɑ/.', category: 'tongue' },
    { tip: 'Bulatkan bibir ringan; rahang membuka sedang.', category: 'lips' },
    { tip: 'Nyalakan suara voiced dan pertahankan stabil.', category: 'voice' },
    { tip: 'Cek cepat: bunyi tetap tunggal, jangan meluncur ke /oʊ/.', category: 'general' },
  ],

  // ==========================================
  // --- 3. TAMBAHAN (Di luar tabel utama) ---
  // ==========================================
  e: [
    { tip: 'Tempatkan lidah di depan pada posisi menengah-tinggi.', category: 'tongue' },
    { tip: 'Bukaan rahang sedang dan bibir sedikit melebar.', category: 'mouth' },
    { tip: 'Alirkan suara voiced dengan stabil dalam satu kualitas vokal.', category: 'airflow' },
    { tip: 'Cek cepat: jangan meluncur ke /eɪ/, tetap bunyi tunggal /e/.', category: 'general' },
  ],
};