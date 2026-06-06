/**
 * components/IpaText.tsx
 *
 * Komponen reusable untuk SEMUA teks IPA di seluruh proyek.
 *
 * CARA PAKAI:
 *
 *   // Paling simpel
 *   <IpaText>/ʌ/</IpaText>
 *
 *   // Dengan kelas tambahan (ukuran, warna, dsb)
 *   <IpaText className="text-[#00f3ff] text-lg">
 *     /aɪ θɔːt ə θɔːt/
 *   </IpaText>
 *
 *   // Sebagai block (div), bukan inline (span)
 *   <IpaText as="div" className="mt-2">
 *     {line.ipa}
 *   </IpaText>
 *
 *   // Ganti inline style lama:
 *   // SEBELUM: <span style={{ fontFamily: 'Lucida Sans Unicode, ...' }}>
 *   // SESUDAH: <IpaText>
 *
 * AKSESIBILITAS:
 *   - lang="und-fonipa" menandai ini sebagai IPA untuk screen reader
 *   - aria-label otomatis dari children string (bisa di-override)
 */

import React from 'react';

type IpaTextProps = {
  children: React.ReactNode;

  /** Tag HTML yang dirender. Default: span (inline). Pakai 'div' untuk block. */
  as?: 'span' | 'div' | 'p';

  /** Class Tailwind tambahan. font-ipa sudah otomatis terpasang. */
  className?: string;

  /** Override aria-label. Otomatis diisi jika children adalah string. */
  'aria-label'?: string;

  /** Untuk event handler jika diperlukan */
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
};

export function IpaText({
  children,
  as: Tag = 'span',
  className = '',
  'aria-label': ariaLabel,
  onClick,
  style,
}: IpaTextProps) {
  const computedAriaLabel =
    ariaLabel ?? (typeof children === 'string' ? children : undefined);

  return (
    <Tag
      className={`font-ipa ${className}`.trim()}
      lang="und-fonipa"
      aria-label={computedAriaLabel}
      data-ipa
      onClick={onClick}
      style={style}
    >
      {children}
    </Tag>
  );
}

export default IpaText;
