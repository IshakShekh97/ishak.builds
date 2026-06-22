import "@/app/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PixelPreloader from "@/components/PixelPreloader";
import { PreloaderProvider } from "@/components/PreloaderContext";
import TerminalBackground from "@/components/TerminalBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PreloaderProvider>
        <PixelPreloader />
        <Navbar />
        <TerminalBackground />
        {children}
        <Footer />
      </PreloaderProvider>
    </div>
  );
}
