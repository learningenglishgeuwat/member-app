// Consonant pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const consonantTips: SymbolPronunciationTips = {
  p: [
    { tip: 'Tutup kedua bibir rapat untuk menahan udara sesaat.', category: 'lips' },
    { tip: 'Lepaskan bibir cepat hingga muncul letupan kecil.', category: 'airflow' },
    { tip: 'Jangan aktifkan getaran pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: letakkan kertas tipis di depan bibir, kertas harus terdorong saat /p/.', category: 'general' },
  ],
  b: [
    { tip: 'Posisi bibir sama seperti /p/: menutup rapat lalu dilepas.', category: 'lips' },
    { tip: 'Lepaskan udara lebih lembut daripada /p/.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara sejak awal bunyi (voiced).', category: 'voice' },
    { tip: 'Cek cepat: sentuh tenggorokan, harus terasa getaran saat /b/.', category: 'general' },
  ],
  t: [
    { tip: 'Tempelkan ujung lidah pada alveolar ridge (gusi atas belakang gigi).', category: 'tongue' },
    { tip: 'Tahan udara lalu lepaskan cepat menjadi letupan.', category: 'airflow' },
    { tip: 'Tanpa getaran pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: bunyi /t/ harus tegas dan bersih, bukan /d/.', category: 'general' },
  ],
  d: [
    { tip: 'Posisi lidah sama dengan /t/ di alveolar ridge.', category: 'tongue' },
    { tip: 'Lepaskan udara lebih halus daripada /t/.', category: 'airflow' },
    { tip: 'Aktifkan pita suara saat bunyi keluar (voiced).', category: 'voice' },
    { tip: 'Cek cepat: rasakan getaran tenggorokan agar tidak terdengar /t/.', category: 'general' },
  ],
  k: [
    { tip: 'Naikkan belakang lidah hingga menyentuh velum (langit-langit lunak).', category: 'tongue' },
    { tip: 'Tahan udara di belakang mulut lalu lepaskan cepat.', category: 'airflow' },
    { tip: 'Tanpa getaran pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: bunyi /k/ harus jelas dari belakang mulut, bukan di depan.', category: 'general' },
  ],
  g: [
    { tip: 'Posisi lidah sama seperti /k/ (kontak di velum).', category: 'tongue' },
    { tip: 'Lepaskan udara dengan letupan lembut.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: jika tidak ada getaran, bunyi bisa terdengar seperti /k/.', category: 'general' },
  ],
  f: [
    { tip: 'Sentuhkan gigi atas ke bibir bawah secara ringan.', category: 'mouth' },
    { tip: 'Dorong udara terus-menerus lewat celah sempit hingga terdengar gesekan.', category: 'airflow' },
    { tip: 'Jangan aktifkan pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: bunyi /f/ berupa desis bibir-gigi, bukan letupan /p/.', category: 'general' },
  ],
  v: [
    { tip: 'Posisi gigi-bibir sama dengan /f/.', category: 'mouth' },
    { tip: 'Pertahankan aliran udara gesek yang stabil.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: pegang tenggorokan, /v/ harus bergetar sedangkan /f/ tidak.', category: 'general' },
  ],
  '\u03B8': [
    { tip: 'Letakkan ujung lidah di antara gigi atau tepat di belakang gigi atas.', category: 'tongue' },
    { tip: 'Hembuskan udara lembut melalui celah lidah-gigi.', category: 'airflow' },
    { tip: 'Tanpa getaran pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: jangan gigit lidah terlalu keras agar tidak berubah jadi /t/ atau /s/.', category: 'general' },
  ],
  '\u00F0': [
    { tip: 'Posisi lidah sama seperti /\u03B8/: di antara gigi/di belakang gigi atas.', category: 'tongue' },
    { tip: 'Biarkan udara tetap mengalir lembut lewat celah.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: /\u00F0/ harus bergetar; jika tidak, bunyi sering berubah jadi /\u03B8/.', category: 'general' },
  ],
  s: [
    { tip: 'Dekatkan ujung lidah ke alveolar ridge tanpa menutup penuh.', category: 'tongue' },
    { tip: 'Buat alur udara sempit di tengah lidah untuk suara desis tajam.', category: 'airflow' },
    { tip: 'Tanpa getaran pita suara (voiceless).', category: 'voice' },
    { tip: 'Cek cepat: desis /s/ fokus di depan mulut, bukan di tenggorokan.', category: 'general' },
  ],
  z: [
    { tip: 'Posisi lidah sama seperti /s/.', category: 'tongue' },
    { tip: 'Pertahankan aliran udara sempit untuk desis kontinu.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: rasakan getaran tenggorokan untuk membedakan /z/ dari /s/.', category: 'general' },
  ],
  '\u0283': [
    { tip: 'Tarik lidah sedikit ke belakang dari posisi /s/.', category: 'tongue' },
    { tip: 'Bibir sedikit membulat agar resonansi /\u0283/ lebih jelas.', category: 'lips' },
    { tip: 'Alirkan udara gesek halus tanpa putus.', category: 'airflow' },
    { tip: 'Cek cepat: bunyi /\u0283/ lebih "tebal" daripada /s/.', category: 'general' },
  ],
  '\u0292': [
    { tip: 'Posisi mulut mirip /\u0283/ (lidah agak ke belakang, bibir sedikit bulat).', category: 'mouth' },
    { tip: 'Pertahankan gesekan lembut dan stabil.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: bandingkan /\u0283/ vs /\u0292/, bedanya utama ada getaran suara.', category: 'general' },
  ],
  h: [
    { tip: 'Buka glotis agar udara keluar seperti hembusan.', category: 'airflow' },
    { tip: 'Bentuk mulut mengikuti vokal setelah /h/.', category: 'mouth' },
    { tip: 'Tidak ada getaran pita suara pada bunyi /h/.', category: 'voice' },
    { tip: 'Cek cepat: /h/ terdengar napas halus, bukan gesekan kuat.', category: 'general' },
  ],
  '\u02A7': [
    { tip: 'Mulai dengan penutupan seperti /t/, lalu langsung lepas ke /\u0283/.', category: 'tongue' },
    { tip: 'Gabungkan letup + gesek dalam satu aliran bunyi (affricate).', category: 'airflow' },
    { tip: 'Tanpa getaran pita suara (voiceless affricate).', category: 'voice' },
    { tip: 'Cek cepat: jangan dipecah menjadi dua bunyi terpisah /t/ + /\u0283/.', category: 'general' },
  ],
  '\u02A4': [
    { tip: 'Mulai dengan penutupan seperti /d/, lalu lepas ke /\u0292/.', category: 'tongue' },
    { tip: 'Pertahankan transisi letup-ke-gesek tetap mulus.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara sepanjang bunyi (voiced affricate).', category: 'voice' },
    { tip: 'Cek cepat: /\u02A4/ harus terdengar satu unit, bukan /d/ lalu berhenti.', category: 'general' },
  ],
  m: [
    { tip: 'Tutup kedua bibir rapat.', category: 'lips' },
    { tip: 'Turunkan langit-langit lunak agar udara keluar lewat hidung.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced nasal).', category: 'voice' },
    { tip: 'Cek cepat: rasakan dengung di hidung saat /m/.', category: 'general' },
  ],
  n: [
    { tip: 'Tempelkan ujung lidah ke alveolar ridge.', category: 'tongue' },
    { tip: 'Alihkan udara ke rongga hidung, bukan lewat mulut.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced nasal).', category: 'voice' },
    { tip: 'Cek cepat: /n/ terdengar nasal dengan titik sentuh di depan mulut.', category: 'general' },
  ],
  '\u014B': [
    { tip: 'Naikkan belakang lidah ke velum (posisi seperti akhir kata sing).', category: 'tongue' },
    { tip: 'Udara keluar lewat hidung, bukan lewat mulut.', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced nasal).', category: 'voice' },
    { tip: 'Cek cepat: akhir kata cukup /\u014B/, jangan otomatis tambah /g/.', category: 'general' },
  ],
  l: [
    { tip: 'Sentuhkan ujung lidah ke alveolar ridge.', category: 'tongue' },
    { tip: 'Biarkan udara keluar dari sisi kiri-kanan lidah (lateral).', category: 'airflow' },
    { tip: 'Aktifkan getaran pita suara (voiced).', category: 'voice' },
    { tip: 'Cek cepat: bunyi /l/ jernih, tidak tertutup seperti /n/.', category: 'general' },
  ],
  r: [
    { tip: 'Angkat ujung lidah mendekat ke langit-langit tanpa menyentuh (American /r/).', category: 'tongue' },
    { tip: 'Bibir boleh sedikit membulat, terutama sebelum vokal belakang.', category: 'lips' },
    { tip: 'Aliran udara kontinu tanpa getaran gulung lidah.', category: 'airflow' },
    { tip: 'Cek cepat: hindari trill /r/ ala Indonesia; buat /r/ halus dan stabil.', category: 'general' },
  ],
  w: [
    { tip: 'Bulatkan bibir rapat di awal bunyi.', category: 'lips' },
    { tip: 'Belakang lidah naik mendekati velum, lalu cepat menuju vokal berikutnya.', category: 'tongue' },
    { tip: 'Aktifkan getaran pita suara (voiced glide).', category: 'voice' },
    { tip: 'Cek cepat: transisi harus cepat agar tidak terdengar seperti vokal /u/ panjang.', category: 'general' },
  ],
  j: [
    { tip: 'Naikkan bagian depan lidah mendekati langit-langit keras.', category: 'tongue' },
    { tip: 'Bibir netral sampai sedikit melebar.', category: 'lips' },
    { tip: 'Aktifkan getaran pita suara (voiced glide).', category: 'voice' },
    { tip: 'Cek cepat: bunyi meluncur cepat seperti y pada yes, bukan vokal panjang.', category: 'general' },
  ],
  y: [
    { tip: 'Naikkan bagian depan lidah mendekati langit-langit keras.', category: 'tongue' },
    { tip: 'Bibir netral sampai sedikit melebar.', category: 'lips' },
    { tip: 'Aktifkan getaran pita suara (voiced glide).', category: 'voice' },
    { tip: 'Cek cepat: bunyi meluncur cepat seperti y pada yes, bukan vokal panjang.', category: 'general' },
  ],
};
