import "@/app/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PixelPreloader from "@/components/PixelPreloader";
import { PreloaderProvider } from "@/components/PreloaderContext";

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
        {children}
        <Footer />
      </PreloaderProvider>
    </div>
  );
}
