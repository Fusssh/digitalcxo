import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital CXOS — Leadership Beyond Boundaries | CXO Platform",
  description:
    "An exclusive, high-trust platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to exchange insights, ignite innovation and address the industry's most critical challenges.",
  keywords: [
    "Digital CXOS",
    "CXO Community India",
    "CIO",
    "CISO",
    "CTO",
    "CDO",
    "Enterprise Technology",
    "Cybersecurity Leadership",
    "Digital Transformation"
  ],
  authors: [{ name: "Digital CXOS Private Limited" }],
  openGraph: {
    title: "Digital CXOS — Leadership Beyond Boundaries",
    description:
      "A purpose-driven platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to shape India's digital future.",
    url: "https://www.digitalcxos.com",
    siteName: "Digital CXOS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital CXOS — Leadership Beyond Boundaries",
    description:
      "A strategic movement redefining enterprise leadership for India's next digital chapter.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${archivo.variable} ${sourceSerif.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#181818] text-neutral-100 font-sans antialiased selection:bg-[#C9A227] selection:text-neutral-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
