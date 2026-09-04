import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { StoreBadges } from '@ui/common/components/ui/StoreBadges'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'

/**
 * BEAT 8 · HOW CHARGING WORKS — Intensity: STANDARD
 * See docs/MASTER-PROJECT-DEFINITION.md §12 and §15.
 *
 * ── IT STOPPED BEING "THE APP SECTION" ────────────────────────────────────
 * This beat is the site's only answer to the majority audience's question:
 * "how do I charge?". That answer used to be ONE SENTENCE inside a block
 * labelled "La app", with three loose features below it. Labelling by the
 * product instead of by the task leaves the beat invisible to precisely the
 * people who need it, and a feature does not answer what a step answers.
 *
 * It is now four steps in order —find, scan, charge, done— plus a way out to
 * the network for anyone who wants to see where to charge without downloading
 * anything. The intensity stays STANDARD on purpose: it comes after the film's
 * signature moment and before the close. Impact is not what is wanted here;
 * being understood is.
 *
 * ── THE QR IS NOT DECORATION, IT SOLVES A CONCRETE PROBLEM ───────────────
 * This section is read mostly on desktop, and there the store badges are a
 * dead end: they lead to a listing that cannot be installed on the device in
 * front of you. The QR bridges that gap — you take out your phone and scan.
 * On mobile the opposite happens: the QR is redundant because the badges
 * already work, so it is HIDDEN below `md` rather than shrunk.
 *
 * ── WHY THE QR SITS ON WHITE ─────────────────────────────────────────────
 * A code reader expects dark modules on a light background. Inverting it so it
 * "matches" the dark canvas makes many phones fail, and a QR that does not
 * scan is worse than no QR at all. The asset also includes the 4-module quiet
 * zone the specification requires.
 *
 * ── COMPOSITION ──────────────────────────────────────────────────────────
 * Two asymmetric columns, not half and half: the text carries weight and the
 * QR is a small object. Splitting it down the middle would leave the QR
 * floating in a void and would repeat the symmetric split §12 forbids.
 */
export function AppDownload({ locale }: { locale: Locale }) {
  const c = home.app

  return (
    <Section
      space="base"
      className="border-t border-line"
      ariaLabelledby="app-title"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
          <div>
            <Eyebrow tone="brand">{t(c.eyebrow, locale)}</Eyebrow>
            <h2
              id="app-title"
              className="mt-4 max-w-[16ch] font-display text-display-l font-semibold text-balance text-ink"
            >
              {t(c.title, locale)}
            </h2>
            <p className="measure-narrow mt-5 text-body-l text-ink-2">{t(c.lead, locale)}</p>

            {/* FOUR STEPS, IN ORDER. A numbered list and not bullets: the
                number is information —it says there is a sequence and where in
                it you are— whereas a bullet only says "another item".

                The number is set in mono, in muted ink and with no coloured
                circle: it is a spec-sheet label, not a badge. §12 reserves the
                gradient for ONE action per view, and that action is the store
                badges that come right below. */}
            <ol className="mt-8">
              {c.steps.map((paso, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1.75rem_1fr] gap-x-4 border-t border-line py-4 last:border-b"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-mono tabular-nums text-ink-3"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="font-display text-body font-semibold text-ink">
                      {t(paso.label, locale)}
                    </span>
                    <span className="mt-1 block text-body-s text-ink-2">
                      {t(paso.body, locale)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            {/* Way out to the network: "where can I charge?" is answered on
                /red and does not require downloading anything first. It is a
                link and not a button so it does not compete with the badges,
                which are this beat's action.

                It reuses `actions.findCharger`, the same label as the Hero and
                the close: all three lead to /red, and having a third key with
                the same text only multiplies the places it can diverge. The
                dedicated `home.app.seeNetwork` key was removed for that
                reason. */}
            <div className="mt-7">
              <Button
                variant="link"
                arrow
                href={href(locale, routes.red)}
              >
                {t(actions.findCharger, locale)}
              </Button>
            </div>

            <StoreBadges
              locale={locale}
              className="mt-9"
            />
          </div>

          {/* Desktop only: see this file's header. */}
          <Reveal className="hidden md:block">
            <div className="flex flex-col items-center gap-4">
              {/* Glass frame with the code on white inside it: the effect
                  goes on the frame, never on the code. See `.glass` and the
                  note in `AppFloating`. */}
              <div className="glass relative rounded-(--radius-structural) p-3">
                <div className="rounded-[1.125rem] bg-white p-3.5 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.7)]">
                  <Image
                    src="/qr-descargar-app.svg"
                    alt={t(c.qrAlt, locale)}
                    width={168}
                    height={168}
                    /* A 1.2 KB SVG with exact geometry: running it through
                     the optimiser would only add a request and a risk of
                     resampling in a graphic where every module counts. */
                    unoptimized
                    className="block size-[10.5rem]"
                  />
                </div>
              </div>
              <p className="font-mono text-mono text-ink-3">{t(c.qrLabel, locale)}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
