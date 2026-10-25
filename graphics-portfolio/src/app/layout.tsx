import type { Metadata, Viewport } from "next";
import { Rubik_Mono_One, Space_Grotesk, Space_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

const display = Rubik_Mono_One({ weight: "400", subsets: ["latin"], variable: "--ff-display", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--ff-mono", display: "swap" });
const sans = Space_Grotesk({ subsets: ["latin"], variable: "--ff-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — Design Archive`, template: `%s // ${site.name}` },
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0E0F" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies saved / OS theme before first paint */}
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
