/**
 * WHO THE LEAD GOES TO, AND WHO IT COMES FROM.
 *
 * These were environment variables for about an hour, and they should not have
 * been. The rule this follows is the one already written down in the sibling
 * project (`g4c-web-app`, `core/donations/domain/emailSettings.ts`), and it
 * divides the two questions cleanly:
 *
 *   the environment says WHETHER mail can be sent — region and credentials;
 *   this file says FROM WHOM and TO WHOM.
 *
 * The reason for the split is that a sender changes for reasons that are not
 * technical: a domain gets verified, `no-reply@` becomes `hola@`, someone joins
 * or leaves the commercial team. While those lived in Doppler, each of those
 * changes meant editing a secret store, rebuilding the image and redeploying in
 * order to change twelve characters. The region cannot move here — it decides
 * which endpoint the client is built against when the process starts, and an
 * identity verified in `us-east-1` does not exist anywhere else — and the
 * credentials must not, because a secret somewhere an editor can read is worse
 * than a secret in the image.
 *
 * ── THIS FILE IS SERVER-ONLY, AND THAT IS LOAD-BEARING ────────────────────
 * The recipients used to sit in `domain/consts/links.ts`, which a client
 * component imported, which published all three addresses in the HTML of every
 * page view. They live under `infrastructure/email/` so that the only thing
 * that can reach them is the route handler. Do not import this from a
 * component, and do not move it to `content/`: everything there is written to
 * be read by pages.
 *
 * When `/admin` arrives, this is the file it replaces with an editable setting
 * — the same move the sibling project already made, and the reason the shape
 * here is a plain object and not three loose constants.
 */
export const leadDelivery = {
  /**
   * The SES region — the DEFAULT, not the last word.
   *
   * `AWS_REGION` in the environment wins when it is set, which is how it
   * arrives in production: from the GitHub secret `AWS_REGION_PRD`. This value
   * is what everything else falls back to — a laptop, staging, anything built
   * without that secret — and it exists so a missing variable degrades to the
   * right region instead of to an empty string that surfaces as a 502 on the
   * first real lead.
   *
   * Defaulting a region is normally a bad idea, because a wrong guess makes SES
   * answer that the sender is not a verified identity — true in the region it
   * was asked about, false where it matters, and it sends whoever reads it
   * looking in the wrong place. This one is not a guess: verified 2026-09-09
   * against the account the SES keys belong to, `212315285482`, where
   * `voltop.co` is verified in `us-east-1` and in no other region.
   */
  region: 'us-east-1',

  /**
   * The From address.
   *
   * `voltop.co` is verified as a DOMAIN in `us-east-1`, with DKIM signing
   * active, so any address at it works here without verifying it one by one —
   * and the mail goes out signed, which is what keeps Gmail and Outlook from
   * treating it as unauthenticated. This used to be a personal mailbox because
   * it was the only verified identity; it is not any more.
   *
   * The visitor's own address never goes here. It travels in `Reply-To`, which
   * is what makes hitting reply work, and which needs no verification. Putting
   * a stranger in `From` is what gets a domain marked as a spoofer.
   */
  sender: 'no-reply@voltop.co',

  /** The commercial team. Adding someone is a line here. */
  recipients: ['bruno@voltop.co', 'juan.ocampo@voltop.co', 'camilo.guzman@voltop.co'],

  /**
   * Optional, and worth setting once it exists. The SES account is shared with
   * other projects and reputation in SES is per account: a configuration set is
   * what lets this form's bounces and complaints be told apart from theirs.
   */
  configurationSet: undefined as string | undefined,
} as const
