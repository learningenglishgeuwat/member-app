# Letter-to-IPA Mappings untuk Tongue Twisters

## Status Implementasi

### ✅ Sudah Ada Mapping (2/7 yang memiliki IPA):
1. **she-sells** - "She Sells Sea Shells" (3 lines, lengkap)
2. **i-thought-a-thought** - "I Thought a Thought" (3 lines, lengkap)

### ⏳ Belum Ada Mapping (5/7 yang memiliki IPA):
3. **peter-piper** - "Peter Piper" (3 lines)
4. **betty-botter** - "Betty Botter" (3 lines)
5. **woodchuck** - "Woodchuck" (2 lines)
6. **red-lorry** - "Red Lorry Yellow Lorry" (4 lines)
7. **thirty-three-thieves** - "Thirty-Three Thieves" (2 lines)

### ❌ Tidak Ada IPA (38 tongue twisters):
Tongue twisters tanpa `ipaLines` tidak memerlukan mapping karena tidak ada IPA untuk di-highlight.

## Cara Menambahkan Mapping Baru

### 1. Struktur Data

Setiap mapping adalah array of objects dengan format:

```typescript
{
  letters: string;      // Huruf/karakter di text
  positions: number[];  // Posisi karakter (0-indexed)
  ipa: string;         // IPA symbol yang dihasilkan
}
```

### 2. Langkah-Langkah Manual

#### Step 1: Siapkan Text dan IPA
```
Text: "She sells seashells"
IPA:  /ʃiː sɛlz ˈsiːʃɛlz/
```

#### Step 2: Align Karakter dengan IPA
```
Position: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
Text:     S  h  e     s  e  l  l  s     s  e  a  s  h  e  l  l  s
IPA:      ʃ  ʃ  iː    s  ɛ  l  l  z     s  iː iː ʃ  ʃ  ɛ  l  l  z
```

#### Step 3: Buat Mapping
```typescript
[
  { letters: 'Sh', positions: [0, 1], ipa: 'ʃ' },
  { letters: 'e', positions: [2], ipa: 'iː' },
  { letters: ' ', positions: [3], ipa: ' ' },
  { letters: 's', positions: [4], ipa: 's' },  // ← /s/ ✓
  { letters: 'e', positions: [5], ipa: 'ɛ' },
  { letters: 'll', positions: [6, 7], ipa: 'l' },
  { letters: 's', positions: [8], ipa: 'z' },  // ← /z/ NOT /s/!
  // ... dst
]
```

### 3. Hal-Hal Penting

#### ⚠️ Perhatikan Suara yang Berbeda untuk Huruf yang Sama

**Contoh 1: Huruf "s"**
- "**s**ells" (posisi 4) → /s/ ✓ (voiceless)
- "sell**s**" (posisi 8) → /z/ ✗ (voiced)
- "**s**eashells" (posisi 10) → /s/ ✓ (voiceless)
- "seashell**s**" (posisi 18) → /z/ ✗ (voiced)

**Contoh 2: Huruf "th"**
- "**th**ought" → /θ/ (voiceless)
- "**th**e" → /ð/ (voiced)

**Contoh 3: Huruf "gh"**
- "thou**gh**t" → silent (tidak ada suara)
- "enou**gh**" → /f/
- "**gh**ost" → /g/

#### ✅ Mapping Harus Akurat

Jika mapping salah, highlighting akan salah. Contoh kesalahan:

```typescript
// ❌ SALAH - semua "s" dipetakan ke /s/
{ letters: 's', positions: [8], ipa: 's' }  // Seharusnya /z/!

// ✅ BENAR - sesuai dengan IPA yang sebenarnya
{ letters: 's', positions: [8], ipa: 'z' }
```

### 4. Template untuk Mapping Baru

```typescript
// Di file letterMappingsComplete.ts

'tongue-twister-id': [
  // Line 1: "Text line 1"
  // IPA: /IPA transcription/
  [
    { letters: 'X', positions: [0], ipa: 'x' },
    { letters: ' ', positions: [1], ipa: ' ' },
    // ... mapping lengkap untuk line 1
  ],
  // Line 2: "Text line 2"
  // IPA: /IPA transcription/
  [
    // ... mapping lengkap untuk line 2
  ],
  // ... dst untuk semua lines
],
```

### 5. Testing

Setelah menambahkan mapping:

1. **Jalankan aplikasi** dan buka tongue twister yang baru ditambahkan
2. **Pilih focus sound** yang sesuai
3. **Verifikasi highlighting**:
   - Apakah huruf yang di-highlight benar-benar bersuara sesuai focus?
   - Apakah ada huruf yang seharusnya di-highlight tapi tidak?
   - Apakah ada huruf yang tidak seharusnya di-highlight tapi ter-highlight?

### 6. Tools yang Bisa Membantu

#### Online IPA Tools:
- **IPA Reader**: https://www.ipareader.com/
- **ToPhonetics**: https://tophonetics.com/
- **Cambridge Dictionary**: https://dictionary.cambridge.org/ (untuk verifikasi per-kata)

#### Catatan:
- Tools otomatis tidak 100% akurat
- Selalu verifikasi dengan dictionary atau native speaker
- Perhatikan variasi aksen (US vs UK)

## Prioritas Mapping

Jika ingin menambahkan mapping secara bertahap, prioritaskan berdasarkan:

1. **Tingkat kesulitan** (Beginner > Intermediate > Advanced)
2. **Popularitas** (yang paling sering digunakan)
3. **Kompleksitas IPA** (yang memiliki banyak focus sounds berbeda)

### Rekomendasi Urutan:

1. ✅ **she-sells** (Beginner, /s/ vs /ʃ/) - DONE
2. ✅ **i-thought-a-thought** (Intermediate, /θ/ and /t/) - DONE
3. ⏳ **peter-piper** (Beginner, /p/ and /k/)
4. ⏳ **betty-botter** (Intermediate, /b/ and /t/)
5. ⏳ **thirty-three-thieves** (Advanced, /θ/ and /ð/)
6. ⏳ **woodchuck** (Advanced, /w/ and /tʃ/)
7. ⏳ **red-lorry** (Intermediate, /r/ and /l/)

## Estimasi Waktu

- **Per line sederhana** (10-20 kata): ~15-30 menit
- **Per line kompleks** (30+ kata): ~30-60 menit
- **Per tongue twister** (2-3 lines): ~1-2 jam
- **Semua 7 tongue twister dengan IPA**: ~10-15 jam

## Kontribusi

Jika Anda ingin menambahkan mapping untuk tongue twister lainnya:

1. Fork repository
2. Tambahkan mapping di `letterMappingsComplete.ts`
3. Test dengan teliti
4. Submit pull request dengan deskripsi lengkap

## Troubleshooting

### Masalah: Highlighting tidak muncul
- **Cek**: Apakah `letterMappings` sudah ditambahkan ke tongue twister di `tongueTwisters.ts`?
- **Cek**: Apakah ID di `LETTER_MAPPINGS` sama dengan ID tongue twister?

### Masalah: Highlighting salah
- **Cek**: Apakah posisi karakter sudah benar? (0-indexed)
- **Cek**: Apakah IPA symbol sesuai dengan IPA transcription?
- **Cek**: Apakah ada typo di huruf atau IPA?

### Masalah: Error saat compile
- **Cek**: Apakah format TypeScript sudah benar?
- **Cek**: Apakah semua bracket dan comma sudah lengkap?
- **Cek**: Apakah import statement sudah benar?
