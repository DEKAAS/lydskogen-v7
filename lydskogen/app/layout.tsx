import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { CartProvider } from "@/contexts/CartContext";
import ClientOverlays from "@/components/ClientOverlays";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Lydskog",
    template: "%s | Lydskog"
  },
  description: "Velkommen til Lydskog for soundscaping, artwork og behandling av lyd.",
  keywords: ["musikkproduksjon", "miksing", "mastering", "albumcover", "artist", "lyddesign", "ambient", "soundscape", "artwork"],
  authors: [{ name: "Lydskog" }],
  creator: "Lydskog",
  publisher: "Lydskog",
  metadataBase: new URL("https://lydskog.no"),
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "no_NO",
    siteName: "Lydskog",
    title: "Lydskog", 
    description: "Velkommen til Lydskog for soundscaping, artwork og behandling av lyd.",
    images: [
      {
        url: "/images/logo.png",
        width: 1024,
        height: 1024,
        alt: "Lydskog Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Lydskog",
    description: "Velkommen til Lydskog for soundscaping, artwork og behandling av lyd.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased text-white`}>
        <ClientOverlays />
        <CartProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <main>
              {children}
              </main>
            </AnalyticsProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
