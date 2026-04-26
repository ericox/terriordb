import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TerriorDB",
  description: "Explore the genetic lineage, flavor traits, and authentication status of specialty coffee varieties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--border)] px-6 py-4">
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="text-lg font-semibold tracking-wide text-[var(--accent)]">
              TerriorDB
            </a>
            <div className="flex gap-6 text-sm text-[var(--muted)]">
              <a href="/varieties" className="hover:text-[var(--foreground)] transition-colors">Varieties</a>
              <a href="/tree" className="hover:text-[var(--foreground)] transition-colors">Family Tree</a>
              <a href="/matcher" className="hover:text-[var(--foreground)] transition-colors">SNP Matcher</a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] px-6 py-4 text-xs text-[var(--muted)] text-center">
          Genetic data sourced from{" "}
          <a href="https://worldcoffeeresearch.org" className="underline" target="_blank" rel="noreferrer">
            World Coffee Research
          </a>{" "}
          (CC0). Variety notes informed by{" "}
          <a href="https://seycoffee.com" className="underline" target="_blank" rel="noreferrer">
            SEY Coffee
          </a>.
        </footer>
      </body>
    </html>
  );
}
