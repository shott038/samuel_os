import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ArchiveProvider } from "@/lib/archive-context";
import BootSequence from "@/components/BootSequence";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samuel Operating System",
  description: "The personal operating system of Samuel Schoettker. Explore work, capabilities, and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text font-sans">
        <ArchiveProvider>
          <BootSequence />
          {children}
        </ArchiveProvider>
      </body>
    </html>
  );
}
