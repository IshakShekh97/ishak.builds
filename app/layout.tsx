import type { Metadata } from "next";
import { JetBrains_Mono, Lora, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PixelPreloader from "@/components/PixelPreloader";
import { PreloaderProvider } from "@/components/PreloaderContext";
import TerminalBackground from "@/components/TerminalBackground";
import SmoothScroll from "@/components/SmoothScroll";

const fontSans = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ishak.Builds",
  description: "Meet Ishak, the developer and designer who builds cool stuff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "antialiased",
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
      )}
    >
      <body
        className="min-h-full flex flex-col relative"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <PreloaderProvider>
            <SmoothScroll>
              <PixelPreloader />
              <TerminalBackground />
              <Navbar />
              {children}
              <Footer />
            </SmoothScroll>
          </PreloaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
