import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Trust } from "@/components/home/Trust";
import { BrandVision } from "@/components/home/BrandVision";

export const metadata: Metadata = {
  title: "Nosotros · Voltop",
  description: "La historia, la escala, el liderazgo y el impacto de Voltop: infraestructura de carga para Colombia.",
};

export default function NosotrosPage() {
  return (
    <main>
      <PageHero
        eyebrow={{ es: "Nosotros", en: "Company" }}
        title={{ es: "Construimos la red que mueve a Colombia", en: "We build the network that moves Colombia" }}
        intro={{
          es: "Infraestructura + tecnología para acelerar la movilidad eléctrica del país.",
          en: "Infrastructure + technology to accelerate the country's electric mobility.",
        }}
      />
      <Trust />
      <BrandVision />
    </main>
  );
}
