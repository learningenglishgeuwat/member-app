import type { Metadata } from "next";
import { Noto_Sans, Orbitron, DM_Sans, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import "./styles/scrollbar.css";
import { AuthProvider } from "@/contexts/MemberAuthContext";
import { TourGuideMount } from "@/app/bot-tourguide";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import SkillThemeSync from "@/app/components/SkillThemeSync";
import { GlobalHaptic } from "@/app/components/haptic";

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-noto', // variable baru, tidak tabrak --font-ipa
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-ui',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-tech',
});

export const metadata: Metadata = {
  title: "GEUWAT Member - Learn English",
  description: "Personalized English learning dashboard for GEUWAT members",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${orbitron.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <GlobalHaptic>
            {children}
            <SkillThemeSync />
            <MobileBottomNav />
            <TourGuideMount />
          </GlobalHaptic>
        </AuthProvider>
      </body>
    </html>
  );
}
