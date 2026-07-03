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
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-text font-sans">
        {/* Runs before the rest of <body> is parsed: hides the boot overlay
            pre-paint on repeat visits so returning visitors get no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("ri_boot_seen")==="1")document.documentElement.setAttribute("data-boot-seen","")}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`#boot-overlay{display:none}`}</style>
        </noscript>
        <ArchiveProvider>
          <BootSequence />
          {children}
        </ArchiveProvider>
      </body>
    </html>
  );
}
