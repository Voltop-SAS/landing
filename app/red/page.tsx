import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Network } from "@/components/home/Network";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata: Metadata = {
  title: "Red · Voltop",
  description: "Encuentra dónde cargar tu vehículo eléctrico en la red Voltop en Colombia.",
};

export default function RedPage() {
  return (
    <main>
      <PageHero
        eyebrow={{ es: "La Red", en: "The Network" }}
        title={{ es: "Encuentra dónde cargar", en: "Find where to charge" }}
        intro={{
          es: "Explora la red Voltop: estaciones, disponibilidad, conectores y potencia en todo el país.",
          en: "Explore the Voltop network: stations, availability, connectors and power across the country.",
        }}
      />
      <Network />
      <HowItWorks />
    </main>
  );
}
