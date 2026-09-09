import type { MetadataRoute } from 'next'
import { SITE_URL } from '~/core/common/domain/i18n/routes'

export default function robots(): MetadataRoute.Robots {
  return {
    /* `/api/` is disallowed because it is not a page. The lead endpoint only
       answers POST, so a crawler would get a 405 anyway; saying so up front
       keeps it out of crawl budget and out of any report of broken URLs. */
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
