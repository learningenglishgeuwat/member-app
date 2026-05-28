/**
 * lib/ipaFont.ts
 *
 * SUMBER KEBENARAN untuk font IPA di seluruh proyek.
 *
 * CARA PAKAI:
 *   - Di JSX/TSX: tambahkan className="font-ipa" atau data-ipa
 *   - File ini TIDAK perlu diimpor untuk styling biasa
 *   - Hanya impor jika butuh string font-family untuk inline style (kasus sangat jarang)
 *
 * ARSITEKTUR:
 *   Noto Sans di-load via next/font di layout.tsx → inject --font-noto ke <html>
 *   globals.css membaca --font-noto dan menyebarkannya via --font-ipa
 *   Tailwind mendaftarkan class font-ipa yang pakai --font-ipa
 *   Komponen cukup pakai className="font-ipa"
 *
 * TIDAK PERLU deteksi OS di runtime.
 * CSS font stack sudah handle fallback ke font sistem terbaik per-OS secara otomatis:
 *   Windows  → Segoe UI (built-in, coverage IPA baik)
 *   macOS    → San Francisco / Helvetica Neue (built-in)
 *   Android  → Roboto + Noto Sans (built-in)
 *   Linux    → DejaVu Sans / Liberation Sans (built-in)
 *   Semua    → Noto Sans via next/font (self-hosted, preloaded)
 */

/**
 * Font stack lengkap untuk IPA.
 * Urutan ini sudah dioptimasi: Noto Sans (cross-platform terbaik) dulu,
 * diikuti font sistem per-OS, diakhiri generic fallback.
 *
 * Gunakan ini HANYA jika terpaksa pakai inline style
 * (misalnya komponen third-party yang tidak bisa pakai className).
 */
export const IPA_FONT_FAMILY =
  '"Noto Sans", "Segoe UI", "Helvetica Neue", "DejaVu Sans", "Arial Unicode MS", sans-serif';

/**
 * Inline style object untuk IPA.
 * Gunakan spread: <span style={{ ...IPA_STYLE }}>
 *
 * Lebih disarankan pakai className="font-ipa" daripada ini.
 */
export const IPA_STYLE: React.CSSProperties = {
  fontFamily: IPA_FONT_FAMILY,
  lineHeight: 1.8,
  fontFeatureSettings: 'normal',
};
