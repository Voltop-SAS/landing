/**
 * CANONICAL EXTERNAL LINKS
 *
 * One single place for the URLs that leave the domain. They used to live
 * duplicated across the FAQ content and the header, and a duplicated URL is a
 * URL that one day changes in one place and not the other.
 *
 * Social networks stay in the shared copy file because the footer walks them as
 * a list with their visible name; the ones linked one by one live here.
 */

export const externalLinks = {
  /**
   * App download.
   *
   * STILL TO VERIFY BEFORE LAUNCH: when this was wired up (2026-09-02) it
   * returned 503 across three attempts, with a browser user-agent and over both
   * HTTP and HTTPS, while `voltop.co` answered 200 — so the subdomain, not the
   * domain. §15 does not allow a link with no real destination: this has to be
   * checked before the site goes live.
   */
  app: 'https://app.voltop.co/',

  /**
   * Direct store listings (delivered 2026-09-02). The badges point here rather
   * than at the dynamic link: each badge states which store it goes to, so
   * sending it to a redirector that decides on its own contradicts what the
   * badge itself promises.
   *
   * Apple: the COLOMBIAN listing (`/co/`) is used, not the Mexican one that came
   * in the original link. Both answer 200, but the storefront determines
   * currency and availability, and this is a Colombian site.
   *
   * Google: without `pcampaignid`, which is a campaign parameter from the share
   * button and does not belong in the canonical URL.
   */
  appStore: 'https://apps.apple.com/co/app/voltop/id6759729784',
  googlePlay: 'https://play.google.com/store/apps/details?id=co.voltop.charging',

  /**
   * Support. The number is a WhatsApp line answered through Freshchat, so it is
   * linked with `wa.me` and NOT with `tel:`: a `tel:` would place a phone call
   * instead of opening the conversation.
   */
  whatsapp: 'https://wa.me/573159864931',

  /**
   * Support email. It comes from the Data Processing Policy, where VOLTOP
   * S.A.S. declares it as its contact address — not from an assumption.
   */
  support: 'mailto:soporte@voltop.co',
} as const

/** The address as text, to display alongside the link. */
export const supportEmail = 'soporte@voltop.co'

/**
 * Recipients for commercial leads (agreed 2026-09-02).
 *
 * WARNING: publishing addresses in the HTML exposes them to spam harvesters.
 * That is the price of having no server. The real fix is a form service — or a
 * single alias such as `comercial@voltop.co` — and then this list disappears
 * from the client entirely.
 */
export const leadRecipients = [
  'bruno@voltop.co',
  'juan.ocampo@voltop.co',
  'camilo.guzman@voltop.co',
] as const
