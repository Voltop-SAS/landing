import type { Metadata } from "next";
// NOTA: tipografías PLACEHOLDER (pendiente de fuentes de marca de Voltop).
// Display = Space Grotesk (carácter técnico/contemporáneo) · Sans = Inter · Mono = JetBrains Mono (datos).
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voltop — La red de carga que mueve a Colombia",
  description:
    "Infraestructura de carga para vehículos eléctricos en Colombia. Encuentra dónde cargar y descubre soluciones para empresas, flotas y espacios.",
  openGraph: {
    title: "Voltop — La red de carga que mueve a Colombia",
    description:
      "Infraestructura de carga para vehículos eléctricos en Colombia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang inicial ES; el LanguageProvider lo actualiza en cliente (arquitectura bilingüe ES/EN).
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <LanguageProvider>
          <SmoothScroll>
            <Header />
            {children}
            <Footer />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
