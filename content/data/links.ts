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
  app: "https://app.voltop.co/",

  /**
   * Soporte. El número es de WhatsApp y se atiende vía Freshchat, así que se
   * enlaza con `wa.me` y NO con `tel:`: un `tel:` lanzaría una llamada
   * telefónica en lugar de abrir la conversación.
   */
  whatsapp: "https://wa.me/573159864931",

  /**
   * Correo de soporte. Sale de la Política de Tratamiento de Datos, donde
   * VOLTOP S.A.S. lo declara como su dato de contacto — no de una suposición.
   */
  soporte: "mailto:soporte@voltop.co",
} as const;

/** El correo en texto, para mostrarlo además de enlazarlo. */
export const soporteEmail = "soporte@voltop.co";
