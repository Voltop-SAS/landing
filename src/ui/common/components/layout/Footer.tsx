import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { footer, brand, a11y } from '~/core/common/domain/consts/copy'
import { Container } from '@ui/common/components/ui/LayoutPrimitives'
import { Logo } from '@ui/common/components/layout/Logo'
import { SocialLinks } from '@ui/common/components/layout/SocialLinks'
import { externalLinks, supportEmail } from '~/core/common/domain/consts/links'

/**
 * FOOTER · Server Component
 * See docs/MASTER-PROJECT-DEFINITION.md §15.
 *
 * Three columns with REAL destinations. Removed:
 * - the metrics block (it duplicated the page's own),
 * - links pointing at the same destination under different labels,
 * - `#` links with no destination,
 * - non-interactive social media icons.
 *
 * A link without a real destination is not published. App, help, legal and
 * social links are
 */
export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()

  return (
    /* Extra `pb` on mobile: at the bottom of the document there is no scroll
       left to move the floating bar out of the way, so it permanently covered
       the legal links. Reserving the space is the only real fix — hiding the
       bar down there would remove it exactly where most decisions are made.

       The value was recalculated when the bar went to two rows: it measures
       126px at 390px and 145px at 320px, plus 12px of separation from the
       edge. With the previous 5.5rem — sized for the single-row bar, 70px —
       the legal links ended at 707px and the bar started at 706: ONE PIXEL
       apart, and any longer language pushed them underneath. It is now 11rem
       (176px), which covers the worst case with room to spare.

       It disappears at `lg`, where the floater is a card in the corner and
       does not cross the footer. */
    <footer className="border-t border-line bg-surface-1 pb-[calc(11rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Container className="py-(--spacing-section-tight)">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-8">
          <div>
            <Link
              href={href(locale, routes.home)}
              className="inline-flex min-h-11 items-center gap-2.5"
              aria-label={t(a11y.goHome, locale)}
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-body-s text-ink-3">{t(brand.footerBlurb, locale)}</p>
            {/* The support email, visible and as text. It is declared in the
                Data Processing Policy as VOLTOP S.A.S.'s contact detail, so it
                is the official channel and deserves to be where people look
                for it: the footer. It is shown IN FULL rather than hidden
                behind a "Contact us", because an email you can copy at a
                glance saves a click and a form. */}
            <a
              href={externalLinks.support}
              className="mt-5 inline-flex min-h-11 items-center font-mono text-mono text-ink-2 transition-colors hover:text-brand"
            >
              {supportEmail}
            </a>
            <SocialLinks locale={locale} />
          </div>

          <nav
            className="contents"
            aria-label={t(a11y.footerNav, locale)}
          >
            {footer.columns.map((col) => (
              <div key={col.title.es}>
                {/* A label, not a heading. As a 12px `<h2>` it entered the
                    document outline at the same level as the content `h2`s and
                    dwarfed them. The footer navigation is already announced by
                    the `<nav>`'s `aria-label`. */}
                <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                  {t(col.title, locale)}
                </p>
                <ul className="mt-4 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label.es}>
                      <Link
                        href={href(locale, link.href)}
                        className="inline-flex min-h-11 items-center text-body-s text-ink-2 transition-colors hover:text-ink"
                      >
                        {t(link.label, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 text-caption text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. {t(footer.rights, locale)}
          </p>
          <div className="flex flex-wrap items-center gap-x-6">
            <Link
              href={href(locale, routes.terms)}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            >
              {t(footer.terms, locale)}
            </Link>
            <Link
              href={href(locale, routes.privacy)}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            >
              {t(footer.privacy, locale)}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
