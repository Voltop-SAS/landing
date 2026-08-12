import Link from "next/link";
import { defaultLocale, t } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { states } from "@/content/copy/common";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";

/**
 * Página no encontrada.
 * Estado de error accionable: explica qué pasó y ofrece la siguiente acción (§10).
 *
 * Nota: `not-found` no recibe params, así que usa el idioma por defecto.
 */
export default function NotFound() {
  const lang = defaultLocale;

  return (
    <Container width="narrow" className="flex min-h-[70dvh] flex-col justify-center py-32">
      <p className="font-mono text-mono uppercase tracking-wider text-ink-3">404</p>
      <h1 className="mt-5 font-display text-display-l font-semibold text-ink">{t(states.notFound.title, lang)}</h1>
      <p className="mt-5 text-body-l text-ink-2">{t(states.notFound.body, lang)}</p>
      <div className="mt-10">
        <Button variant="primary" arrow href={href(lang, routes.red)}>
          {t(states.notFound.action, lang)}
        </Button>
      </div>
      <Link
        href={href(lang, routes.home)}
        className="mt-6 inline-flex min-h-11 w-fit items-center text-body-s text-ink-2 underline underline-offset-4 hover:text-ink"
      >
        Voltop
      </Link>
    </Container>
  );
}
