import { Hero } from "@/components/home/Hero";
import { MedellinSignature } from "@/components/home/MedellinSignature";
import { RedPreview } from "@/components/home/RedPreview";
import { EmpresasPreview } from "@/components/home/EmpresasPreview";
import { CasoEAN } from "@/components/home/CasoEAN";
import { VisionCEO } from "@/components/home/VisionCEO";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <main>
      {/* Home v3 · 7 beats · Home presenta, internas profundizan */}
      <Hero />                {/* 1 · digital → físico */}
      <MedellinSignature />   {/* 2 · infraestructura real (signature) */}
      <RedPreview />          {/* 3 · Red preview → /red */}
      <EmpresasPreview />     {/* 4 · Empresas preview → /empresas */}
      <CasoEAN />             {/* 5 · caso real EAN + escala/impacto */}
      <VisionCEO />           {/* 6 · visión / CEO → /nosotros */}
      <FinalCta />            {/* 7 · cierre / CTA */}
    </main>
  );
}
