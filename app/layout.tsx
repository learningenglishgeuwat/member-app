import type { Metadata } from "next";
import { Noto_Sans, Orbitron } from 'next/font/google';
import "./globals.css";
import "./styles/scrollbar.css";
import AppClientShell from "@/app/components/AppClientShell";

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
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
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
      <body className="font-sans antialiased">
        <AppClientShell>{children}</AppClientShell>
      </body>
    </html>
  );
}
