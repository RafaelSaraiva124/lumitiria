import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "A Lumitiria desenvolve soluções de caixilharia de alumínio, vidro e fachadas desde 1974, em Vila Nova de Famalicão.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "Lumitiria | Caixilharia, Vidro e Fachadas",
    template: "%s | Lumitiria",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "caixilharia",
    "caixilharia de alumínio",
    "fachadas",
    "vidro",
    "estores",
    "Vila Nova de Famalicão",
  ],
  authors: [{ name: "Lumitiria" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "Lumitiria",
    title: "Lumitiria | Caixilharia, Vidro e Fachadas",
    description: SITE_DESCRIPTION,
    images: ["/caixilharia.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumitiria | Caixilharia, Vidro e Fachadas",
    description: SITE_DESCRIPTION,
    images: ["/caixilharia.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
