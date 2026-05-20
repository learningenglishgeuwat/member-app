# TODO: Font Orbitron untuk judul card (tanpa ganggu teks IPA)

- [x] Tetapkan kelas khusus untuk judul card (mis. `.orbitron-card-title`) supaya hanya memengaruhi judul, tidak ke elemen `[data-ipa]`.

- [ ] Pastikan font Orbitron sudah tersedia via `next/font/google` (sudah ada di `app/layout.tsx` sebagai `--font-display`).
- [x] Update komponen card yang dimaksud (`app/skill/pronunciation/components/TopicCard.tsx`) untuk memakai kelas `.orbitron-card-title`.

- [ ] Tambahkan CSS guard: seluruh elemen `[data-ipa]` (atau `.font-ipa`) harus tetap memakai `--font-ipa`.
- [ ] Jalankan `npm test`/lint bila ada dan build untuk memastikan tidak ada error.

