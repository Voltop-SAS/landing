import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { routes, absoluteUrl } from "@/lib/i18n/routes";
import { getStations, getCities } from "@/lib/data";

/**
 * SITEMAP generado desde los datos (§29).
 * Añadir una estación o una ciudad la incluye automáticamente, con sus
 * alternativas de idioma. Cero mantenimiento manual.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number }[] = [
    { path: routes.home, priority: 1 },
    { path: routes.red, priority: 0.9 },
    { path: routes.empresas, priority: 0.9 },
    { path: routes.nosotros, priority: 0.7 },
    ...getCities().map((c) => ({ path: routes.city(c.slug), priority: 0.8 })),
    ...getStations().map((s) => ({ path: routes.station(s.slug), priority: 0.6 })),
  ];

  return paths.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: absoluteUrl(lang, path),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])),
      },
    }))
  );
}
