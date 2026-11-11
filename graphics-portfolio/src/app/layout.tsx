import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, Space_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

// Siklab/68 type system: Inter Tight (mega/body) · Archivo wdth 62–125 (wide + condensed) · Space Mono (labels)
const grot = Inter_Tight({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"], variable: "--ff-grot", display: "swap" });
const wide = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--ff-wide", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--ff-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — Design Archive`, template: `%s // ${site.name}` },
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F0EB" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grot.variable} ${wide.variable} ${mono.variable}`} data-scale="90" suppressHydrationWarning>
      <head>
        {/* Applies saved / OS theme, accent mode and 90% / 100% scale before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preload" href="/fonts/rx09-baybayin-700.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <div className="frame">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
