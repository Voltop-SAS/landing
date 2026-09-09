/**
 * WHICH SPREADSHEET THE LEADS ARE WRITTEN TO.
 *
 * Same split as `email/leadDelivery.ts`, and for the same reason: the
 * environment says WHETHER this deployment can write — that is the service
 * account key, and it is a secret — while this file says WHERE, which is not a
 * secret and changes for reasons that are not technical.
 *
 * A spreadsheet id is not a credential. Anyone holding it still cannot open the
 * document unless the sheet is shared with them, so it does not belong in
 * Doppler, where changing it would mean a rebuild and a redeploy.
 *
 * SERVER-ONLY, like its sibling. Nothing on the client imports this.
 */
export const leadSheetTarget = {
  /** From the sheet's own URL: /spreadsheets/d/<this>/edit */
  spreadsheetId: '1Hf3yA3UO23AGs7CkgqmMPXOsfRVmX7NhSviBcSY4swU',

  /**
   * Where the rows go.
   *
   * THE TAB IS NAMED, and that is the point. A range with no sheet name targets
   * whatever tab happens to be first, so dragging a new one to the front would
   * silently start writing leads into it. Naming it costs nothing and removes
   * that failure entirely.
   *
   * `Sheet1` is the default name Google gave it, read from the document itself
   * on 2026-09-09. If someone renames the tab, this line has to follow — the
   * API answers 400 with "Unable to parse range", which is at least loud.
   *
   * The eight columns are the ones `buildRow` writes, in that order.
   */
  range: 'Sheet1!A:H',
} as const
