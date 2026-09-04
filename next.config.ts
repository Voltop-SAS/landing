import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * El idioma vive en la URL (§28). La raíz redirige al idioma por defecto.
   * Se usa redirección temporal mientras el sitio no está publicado: cuando
   * lo esté, pasar a `permanent: true`.
   */
  async redirects() {
    return [{ source: "/", destination: "/es", permanent: false }];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * Next solo sirve las calidades declaradas aquí; cualquier otra devuelve
     * error. Se añade 70 para la fotografía del hero: es el elemento LCP y a
     * la calidad por defecto pesaba 332 KB en pantallas Retina, por encima del
     * presupuesto de 250 KB que fija §29, con el LCP a 2.44s contra un límite
     * de 2.5s. Bajar el máster no servía —de 330 a 318 KB—: quien manda es el
     * codificador AVIF, no el origen.
     */
    qualities: [70, 75],
  },
};

export default nextConfig;
