"use client";

import { useLang, type Localized } from "@/lib/i18n";
import { impactMetrics } from "@/content/site";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

type Link = { label: Localized; href: string };

/** Footer = capa de profundidad y navegación secundaria (ordenada, no megafooter). */
export function Footer() {
  const { lang, setLang, t } = useLang();

  const cols: { title: Localized; links: Link[] }[] = [
    {
      title: { es: "Red", en: "Network" },
      links: [
        { label: { es: "Encontrar cargador", en: "Find a charger" }, href: "/red" },
        { label: { es: "Cómo cargar", en: "How to charge" }, href: "/red" },
        { label: { es: "Descargar app", en: "Download app" }, href: "#" },
        { label: { es: "Hospedar una estación", en: "Host a station" }, href: "/empresas" },
      ],
    },
    {
      title: { es: "Empresas", en: "Business" },
      links: [
        { label: { es: "Empresas", en: "Companies" }, href: "/empresas" },
        { label: { es: "Flotas", en: "Fleets" }, href: "/empresas" },
        { label: { es: "Espacios comerciales", en: "Properties" }, href: "/empresas" },
        { label: { es: "Partners", en: "Partners" }, href: "/empresas" },
      ],
    },
    {
      title: { es: "Compañía", en: "Company" },
      links: [
        { label: { es: "Nosotros", en: "About" }, href: "/nosotros" },
        { label: { es: "Impacto", en: "Impact" }, href: "/nosotros" },
        { label: { es: "Inversionistas y prensa", en: "Investors & press" }, href: "/nosotros" },
      ],
    },
    {
      title: { es: "Soporte", en: "Support" },
      links: [
        { label: { es: "Contacto", en: "Contact" }, href: "/empresas" },
        { label: { es: "Ayuda", en: "Help" }, href: "#" },
      ],
    },
    {
      title: { es: "Legal", en: "Legal" },
      links: [
        { label: { es: "Términos y condiciones", en: "Terms" }, href: "#" },
        { label: { es: "Privacidad y datos", en: "Privacy & data" }, href: "#" },
      ],
    },
  ];

  const socials = ["IG", "IN", "X", "YT"];

  return (
    <footer className="border-t border-line bg-surface-1">
      <Container className="py-16">
        {/* Resumen de impacto (placeholders XX) */}
        <div className="grid grid-cols-2 gap-6 border-b border-line pb-12 md:grid-cols-4">
          {impactMetrics.map((m) => (
            <div key={m.label.es}>
              <div className="font-display text-3xl font-semibold brand-text">{m.value}</div>
              <div className="mt-1 text-sm text-ink-3">{t(m.label)}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-6">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-[7px] brand-gradient text-on-brand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold">Voltop</span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-ink-3">
              {t({ es: "Infraestructura de carga para la movilidad eléctrica de Colombia.", en: "Charging infrastructure for Colombia's electric mobility." })}
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title.es}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink-3">{t(col.title)}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label.es}>
                    <a href={l.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                      {t(l.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Base: idioma · redes · copyright */}
        <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-line p-0.5 font-mono text-xs">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn("rounded-full px-2 py-1 uppercase transition-colors", lang === l ? "bg-surface-3 text-ink" : "text-ink-3 hover:text-ink-2")}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {socials.map((s) => (
                <span key={s} className="grid size-8 place-items-center rounded-full border border-line font-mono text-[10px] text-ink-3" title="Red social pendiente">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-ink-3 md:flex-row md:gap-4">
            <span>© {new Date().getFullYear()} Voltop.</span>
            <span className="font-mono">{t({ es: "Prototipo · contenido provisional", en: "Prototype · placeholder content" })}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
