import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorTrailGate } from "@/components/ui/CursorTrailGate";
import { profile } from "@/content/profile";
import { cn, siteUrl } from "@/lib/utils";
import "@/components/ui/cursor-trail.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: `${profile.headline} ${profile.intro}`,
  openGraph: {
    type: "website",
    siteName: profile.name,
  },
};

// Runs before paint: enables reveal styles only when JS runs and motion is allowed.
// Falls back to fully visible content if the motion code never boots.
const motionScript = `(function(){var d=document.documentElement;if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion-ok");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("motion-ok")},4000)}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(bricolage.variable, geistMono.variable, "h-full antialiased")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="cursor-trail-region cursor-trail-region--viewport flex min-h-full flex-col bg-ink font-sans text-bone">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <CursorTrailGate />
        <div className="cursor-trail-content flex flex-1 flex-col">
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
        <SmoothScroll />
      </body>
    </html>
  );
}
