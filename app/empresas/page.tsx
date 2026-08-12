import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Business } from "@/components/home/Business";

export const metadata: Metadata = {
  title: "Empresas · Voltop",
  description: "Soluciones de infraestructura de carga para empresas, flotas, espacios comerciales y partners.",
};

export default function EmpresasPage() {
  return (
    <main>
      <PageHero
        eyebrow={{ es: "Empresas y espacios", en: "Business & spaces" }}
        title={{ es: "Infraestructura de carga para tu negocio", en: "Charging infrastructure for your business" }}
        intro={{
          es: "Confiable, tecnológica y gestionada de principio a fin. Elige tu caso y te mostramos cómo.",
          en: "Reliable, technological and managed end to end. Pick your case and we'll show you how.",
        }}
      />
      <Business />
    </main>
  );
}
