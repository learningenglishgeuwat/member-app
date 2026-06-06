import type { Metadata } from "next";
import { Noto_Sans, Orbitron } from 'next/font/google';
import "./globals.css";
import "./styles/base/scrollbar.css";
import AppClientShell from "@/app/components/AppClientShell";
import TTSInitButton from "@/app/components/TTSInitButton";

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-noto', // variable baru, tidak tabrak --font-ipa
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
});



export const metadata: Metadata = {
  title: "GEUWAT Member - Learn English",
  description: "Personalized English learning dashboard for GEUWAT members",
  icons: {
    icon: [
      { url: '/icon.webp', type: 'image/webp' },
      { url: '/favicon.webp', sizes: '32x32', type: 'image/webp' },
    ],
    shortcut: '/icon.webp',
    apple: '/apple-icon.webp',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased bg-black text-slate-200">
        <AppClientShell>{children}</AppClientShell>
        <TTSInitButton />
      </body>
    </html>
  );
}
