/**
 * ENLACES EXTERNOS CANÓNICOS
 *
 * Un solo sitio para las URLs que salen del dominio. Antes vivían repetidas
 * en `faq.ts` y en el header, y una URL repetida es una URL que algún día
 * cambia en un sitio y no en el otro.
 *
 * Las redes sociales siguen en `common.ts` porque el footer las recorre como
 * lista con su nombre visible; aquí van las que se enlazan una a una.
 */

export const externalLinks = {
  /**
   * Descarga de la app.
   *
   * PENDIENTE DE VERIFICAR ANTES DEL LANZAMIENTO: al integrarlo (2026-09-02)
   * devolvía 503 en tres intentos, con user-agent de navegador y por HTTP y
   * HTTPS, mientras `voltop.co` respondía 200 — el subdominio, no el dominio.
   * §15 no admite un enlace sin destino real: hay que comprobarlo antes de
   * publicar el sitio.
   */
  app: 'https://app.voltop.co/',

  /**
   * Fichas directas de cada tienda (entregadas 2026-09-02). Las insignias
   * apuntan aquí y no al enlace dinámico: cada insignia dice a qué tienda va,
   * así que mandarlas a un redirector que decide por su cuenta contradice lo
   * que la propia insignia promete.
   *
   * Apple: se usa la ficha de COLOMBIA (`/co/`), no la de México que venía en
   * el enlace original. Ambas responden 200, pero el storefront determina
   * moneda y disponibilidad, y el sitio es colombiano.
   *
   * Google: sin `pcampaignid`, que es un parámetro de campaña del botón de
   * compartir y no pertenece a la URL canónica.
   */
  appStore: 'https://apps.apple.com/co/app/voltop/id6759729784',
  googlePlay: 'https://play.google.com/store/apps/details?id=co.voltop.charging',

  /**
   * Soporte. El número es de WhatsApp y se atiende vía Freshchat, así que se
   * enlaza con `wa.me` y NO con `tel:`: un `tel:` lanzaría una llamada
   * telefónica en lugar de abrir la conversación.
   */
  whatsapp: 'https://wa.me/573159864931',

  /**
   * Correo de soporte. Sale de la Política de Tratamiento de Datos, donde
   * VOLTOP S.A.S. lo declara como su dato de contacto — no de una suposición.
   */
  soporte: 'mailto:soporte@voltop.co',
} as const

/** El correo en texto, para mostrarlo además de enlazarlo. */
export const soporteEmail = 'soporte@voltop.co'

/**
 * Destinatarios de los leads comerciales (definidos el 2026-09-02).
 *
 * ADVERTENCIA: publicar direcciones en el HTML las expone a rastreadores de
 * spam. Es el precio de no tener servidor. La solución real es un servicio de
 * formularios —o un alias único tipo `comercial@voltop.co`— y entonces esta
 * lista desaparece del cliente.
 */
export const leadRecipients = [
  'bruno@voltop.co',
  'juan.ocampo@voltop.co',
  'camilo.guzman@voltop.co',
] as const
