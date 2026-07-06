import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Michroma, Rajdhani } from "next/font/google";
import "./globals.css";
import { ArchiveProvider } from "@/lib/archive-context";
import BootSequence from "@/components/BootSequence";
import SceneBackdrop from "@/components/SceneBackdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${geistSans.variable} ${plexMono.variable} ${michroma.variable} ${rajdhani.variable} h-full antialiased`}
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
        <SceneBackdrop />
        <ArchiveProvider>
          <BootSequence />
          {children}
        </ArchiveProvider>
      </body>
    </html>
  );
}
