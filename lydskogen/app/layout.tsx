import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lydskog - Profesjonell lyd- og designtjenester",
    template: "%s | Lydskog"
  },
  description: "Profesjonell musikkproduksjon, miksing & mastering, visuell design og helhetlige prosjekter for artister og skapere.",
  keywords: ["musikkproduksjon", "miksing", "mastering", "albumcover", "artist", "lyddesign", "ambient", "hip-hop", "lo-fi"],
  authors: [{ name: "Lydskog" }],
  creator: "Lydskog",
  publisher: "Lydskog",
  metadataBase: new URL("https://lydskog.no"),
  openGraph: {
    type: "website",
    locale: "no_NO",
    siteName: "Lydskog",
    title: "Lydskog - Profesjonell lyd- og designtjenester", 
    description: "Profesjonell musikkproduksjon, miksing & mastering, visuell design og helhetlige prosjekter for artister og skapere.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lydskog - Profesjonell lyd- og designtjenester",
    description: "Profesjonell musikkproduksjon, miksing & mastering, visuell design og helhetlige prosjekter for artister og skapere.",
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
      <body className={`${inter.variable} font-sans antialiased text-white`}>
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
