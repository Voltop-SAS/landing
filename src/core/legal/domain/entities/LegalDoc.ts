export type LegalBlock = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] }

export type LegalSection = {
  /** Stable anchor: the table of contents uses it. */
  id: string
  heading: string
  body: LegalBlock[]
}

export type LegalDoc = {
  title: string
  /** The date exactly as the legal team issued it. */
  updated: string
  /** ISO, for `<time dateTime>` and for the sitemap. */
  updatedISO: string
  sections: LegalSection[]
}
