import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isLocale, localeMeta, t, type Locale } from "@/lib/i18n/config";
import { href, routes, absoluteUrl, alternatesFor, SITE_URL } from "@/lib/i18n/routes";
import { novedades } from "@/content/copy/novedades";
import { a11y, brand } from "@/content/copy/common";
import { getPostsWithPage, getPost, getStation, getCity } from "@/lib/data";
import { Section, Container, Rule } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { PendingTag } from "@/components/ui/data";
import { PostBody } from "@/components/novedades/PostBody";
import { TrackView } from "@/components/analytics/TrackView";
import { formatDate } from "@/lib/dates";

type Props = { params: Promise<{ lang: string; slug: string }> };

/**
 * /NOVEDADES/[SLUG] · una entrada del registro.
 *
 * SOLO EXISTE PARA ENTRADAS CON CUERPO. `getPostsWithPage()` filtra las que
 * tienen `body` vacío, así que una apertura de dos líneas no genera una página
 * delgada que repita el texto del índice — ni compite con él en búsqueda.
 * Ver la cabecera de `content/data/posts.ts`.
 *
 * El pie devuelve al producto: la estación o la ciudad de las que habla la
 * entrada. Es donde paga la referencia del modelo y donde un lector que llegó
 * desde prensa o desde una búsqueda entra a la red en lugar de salirse.
 */

export const dynamicParams = false;

export async function generateStaticParams() {
  const withPage = await getPostsWithPage();
  return locales.flatMap((lang) => withPage.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: t(post.title, lang),
    description: t(post.summary, lang),
    alternates: alternatesFor(lang, routes.post(post.slug)),
    openGraph: {
      type: "article",
      publishedTime: post.date,
      title: t(post.title, lang),
      description: t(post.summary, lang),
      url: absoluteUrl(lang, routes.post(post.slug)),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const post = await getPost(slug);
  if (!post) notFound();

  const station = post.stationSlug ? getStation(post.stationSlug) : undefined;
  const city = post.citySlug ? getCity(post.citySlug) : undefined;

  /**
   * Datos estructurados de artículo (§29).
   *
   * `image` se emite SOLO si el archivo existe de verdad. Declarar una imagen
   * que no se ha entregado sería prometerle al buscador algo que la página no
   * sirve — la misma falta que inventar una métrica.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: t(post.title, lang),
    description: t(post.summary, lang),
    datePublished: post.date,
    inLanguage: localeMeta[lang].hreflang,
    url: absoluteUrl(lang, routes.post(post.slug)),
    author: { "@type": "Organization", name: brand.name, url: SITE_URL },
    publisher: { "@type": "Organization", name: brand.name, url: SITE_URL },
    ...(post.cover?.src ? { image: `${SITE_URL}${post.cover.src}` } : {}),
  };

  return (
    <TrackView event="novedad_vista" props={{ slug: post.slug, tipo: post.type }} threshold={0}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section space="none" className="pb-8 pt-32 md:pt-40">
        <Container width="narrow">
          <nav aria-label={t(a11y.breadcrumb, lang)} className="font-mono text-mono text-ink-3">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={href(lang, routes.novedades)}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                >
                  {t(novedades.eyebrow, lang)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-2">{t(novedades.types[post.type], lang)}</li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <time
              dateTime={post.date}
              className="font-mono text-mono uppercase tracking-wider text-ink-2"
            >
              {formatDate(post.date, lang)}
            </time>
            {post.dataStatus === "placeholder" && (
              <PendingTag>{t(novedades.provisionalTag, lang)}</PendingTag>
            )}
          </div>

          <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
            {t(post.title, lang)}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(post.summary, lang)}</p>

          {post.dataStatus === "placeholder" && (
            <p className="mt-4 measure text-body-s text-ink-3">
              {t(novedades.provisionalNote, lang)}
            </p>
          )}
        </Container>
      </Section>

      <Section space="none" className="pb-24 md:pb-32">
        <Container width="narrow">
          {post.cover && (
            <Media
              asset={post.cover}
              lang={lang}
              aspect="16/9"
              corner
              sizes="(min-width: 768px) 46rem, 100vw"
              priority
            />
          )}

          <PostBody blocks={post.body} lang={lang} />

          {/* Vuelta al producto: la entrada termina en la red, no en un final ciego. */}
          {(station || city) && (
            <>
              <Rule className="mt-16" />
              <div className="mt-8 flex flex-col gap-6">
                {station && (
                  <div>
                    <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                      {t(novedades.related.station, lang)}
                    </p>
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        size="s"
                        arrow
                        href={href(lang, routes.station(station.slug))}
                      >
                        {station.name}
                      </Button>
                    </div>
                  </div>
                )}
                {city && (
                  <Link
                    href={href(lang, routes.city(city.slug))}
                    className="inline-flex min-h-11 items-center self-start text-body-s text-ink-2 transition-colors hover:text-ink"
                  >
                    {t(novedades.related.city, lang)} — {city.name} →
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="mt-14">
            <Link
              href={href(lang, routes.novedades)}
              className="inline-flex min-h-11 items-center font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
            >
              ← {t(novedades.backToIndex, lang)}
            </Link>
          </div>
        </Container>
      </Section>
    </TrackView>
  );
}
