import type { Metadata } from "next";
import "./globals.css";
import "./styles/scrollbar.css";
import { AuthProvider } from "@/contexts/MemberAuthContext";
import { TourGuideMount } from "@/app/bot-tourguide";

export const metadata: Metadata = {
  title: "GEUWAT Member - Learn English",
  description: "Personalized English learning dashboard for GEUWAT members",
  icons: {
    icon: '/favicon.ico',
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
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <TourGuideMount />
        </AuthProvider>
      </body>
    </html>
  );
}
