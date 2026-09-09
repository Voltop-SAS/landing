export type City = {
  slug: string
  /** Proper noun: not translated. */
  name: string
  region: string
  /** Local context. Never carries unvalidated figures. */
  featured?: boolean
}
