# Refactor TODO — `app/skill/pronunciation/phoneticSymbols/[symbol]/page.tsx`

## Prinsip
- Lakukan refactor secara bertahap.
- Setiap perubahan dikunci dengan `npm run build`.
- Jika `build` berhasil, beri centang dan lanjut ke tugas berikut.
- Jika gagal, perbaiki dulu sebelum melanjutkan.

## Tahap 1 — Pisahkan data / lookup
- [x] Buat file `app/skill/pronunciation/phoneticSymbols/[symbol]/data/symbolLookups.ts`
- [x] Pindahkan:
  - `COMMON_LETTER_SYMBOL_ALIASES`
  - `BRITISH_NOTE_COUNTERPARTS`
  - `VOWEL_LAX_SYMBOLS`
  - `VOWEL_TENSE_SYMBOLS`
  - `CONSONANT_VOICELESS_SYMBOLS`
  - `CONSONANT_VOICED_SYMBOLS`
  - `DIPHTHONG_SYMBOLS`
  - `BRITISH_NOTES_BY_SYMBOL`
- [x] Update impor di `page.tsx`
- [x] Jalankan `npm run build`

## Tahap 2 — Pisahkan helper utilitas
- [x] Buat file `app/skill/pronunciation/phoneticSymbols/[symbol]/utils.ts`
- [x] Pindahkan fungsi:
  - `toTourToken`
  - `getBaseGroup`
  - `getSymbolNavGroups`
  - `formatIpaSymbolForPrompt`
  - `buildAccentEvaluationPrompt`
  - `getDefaultSymbolDetailData`
  - `getSymbolDetailData`
- [x] Update impor di `page.tsx`
- [x] Jalankan `npm run build`

## Tahap 3 — Pisahkan highlight rendering
- [x] Buat file `app/skill/pronunciation/phoneticSymbols/[symbol]/helpers/highlightHelpers.ts`
- [x] Pindahkan fungsi:
  - `isIndexBasedOverride`
  - `renderIndexBasedWord`
  - `renderHighlightedWord`
  - `renderWord`
  - `renderBritishNoteWord`
  - `renderIpa`
- [x] Update impor di `page.tsx`
- [x] Jalankan `npm run build`

## Tahap 4 — Extract playback / speech hook
- [x] Buat hook `app/skill/pronunciation/phoneticSymbols/[symbol]/hooks/useSymbolPlayback.ts`
- [x] Pindahkan logika:
  - `stopPlayAllWords`
  - `handlePlayAllWords`
  - `handlePlayAllBritishNotes`
  - `handlePlayWord`
  - `handlePlayBritishNoteWord`
- [x] Update `page.tsx` untuk menggunakan hook
- [x] Jalankan `npm run build`

## Tahap 5 — Extract progress persistence
- [x] Buat hook `app/skill/pronunciation/phoneticSymbols/[symbol]/hooks/useSymbolProgress.ts`
- [x] Pindahkan:
  - `handleSaveProgress`
  - `handleUnsaveProgress`
  - penyimpanan localStorage symbol progress
  - section state hydration dan penyimpanan
- [x] Update impor di `page.tsx`
- [x] Jalankan `npm run build`

## Tahap 6 — Extract clipboard / copy logic
- [x] Buat hook `app/skill/pronunciation/phoneticSymbols/[symbol]/hooks/useClipboardCopy.ts`
- [x] Pindahkan:
  - `handleCopyMission`
  - `handleCopyPrompt`
  - `handleCopyWordExamples`
- [x] Update impor di `page.tsx`
- [x] Jalankan `npm run build`

## Tahap 7 — Extract modal / common letters loader
- [x] Buat hook `app/skill/pronunciation/phoneticSymbols/[symbol]/hooks/useCommonLetters.ts`
- [x] Pindahkan:
  - `openCommonLettersModal`
  - `commonLetters` state
  - `commonLettersLoading`
  - `commonLettersError`
- [x] Update `page.tsx`
- [x] Jalankan `npm run build`

## Tahap opsional — Pisahkan section UI ke komponen
- [x] `SymbolWordGrid`
- [x] `BritishNotePanel`
- [x] `SymbolTipsPanel`
- [x] `SymbolVideoSection`
- [x] `SymbolPromptSection`
- [x] `SymbolHelpModal`
- [x] `app/skill/pronunciation/phoneticSymbols/[symbol]/components/`
- [x] Jalankan `npm run build`

## Catatan
- Gunakan file / folder terpisah untuk setiap modul baru.
- Isi `page.tsx` hanya dengan state, hook pemanggilan, dan JSX.
- Simpan setiap perubahan kecil, lalu build.
