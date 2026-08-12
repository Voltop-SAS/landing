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
  },
};

export default nextConfig;
