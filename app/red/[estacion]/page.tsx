import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stations, getStation } from "@/content/site";
import { StationDetail } from "@/components/red/StationDetail";

type Params = { params: Promise<{ estacion: string }> };

/** Cada estación se prerenderiza desde datos (escalable: nueva estación = nuevo registro). */
export function generateStaticParams() {
  return stations.map((s) => ({ estacion: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { estacion } = await params;
  const station = getStation(estacion);
  if (!station) return { title: "Estación · Voltop" };
  return {
    title: `${station.name} · Voltop`,
    description: `Estación de carga Voltop en ${station.city}: ${station.powerKw} kW, ${station.connectors.join(", ")}.`,
  };
}

export default async function StationPage({ params }: Params) {
  const { estacion } = await params;
  const station = getStation(estacion);
  if (!station) notFound();
  return <StationDetail station={station} />;
}
