import { ImageResponse } from "next/og";
import { locales, isLocale, t, type Locale } from "@/lib/i18n/config";
import { brand } from "@/content/copy/common";

/** Se prerenderiza una imagen por idioma en lugar de generarla por petición. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Imagen Open Graph generada desde los tokens de marca.
 * No depende de assets externos, así que funciona desde ya y se sustituirá por
 * una composición con fotografía real cuando lleguen los archivos (§32).
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Voltop — infraestructura de carga para vehículos eléctricos en Colombia";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : "es";

  const headline =
    lang === "es" ? "La red que mueve a Colombia" : "The network that moves Colombia";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0f1c",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Acento de corriente: una sola línea, arriba */}
        <div
          style={{
            height: 6,
            width: 240,
            background: "linear-gradient(100deg, #45e0a8, #28c6e6)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#8b95a8", letterSpacing: 4, textTransform: "uppercase" }}>
            {lang === "es" ? "Red de carga eléctrica · Colombia" : "EV charging network · Colombia"}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#f2f5fa",
              fontWeight: 600,
              maxWidth: 940,
            }}
          >
            {headline}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a9b3c4", maxWidth: 820 }}>
            {t(brand.tagline, lang)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "linear-gradient(100deg, #45e0a8, #28c6e6)",
            }}
          />
          <div style={{ fontSize: 34, color: "#f2f5fa", fontWeight: 600 }}>{brand.name}</div>
        </div>
      </div>
    ),
    size
  );
}
