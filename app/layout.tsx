import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/MemberAuthContext";

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
        </AuthProvider>
      </body>
    </html>
  );
}
