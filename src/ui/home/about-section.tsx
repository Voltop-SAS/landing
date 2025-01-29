import Image from 'next/image'

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              ¿Qué es <span className="text-secondary">VOLTOP</span>?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-bold">VOLTOP</span> es una empresa líder que
              está dando forma al futuro de la movilidad sostenible en América
              Latina. Estamos comprometidos con la transformación hacia un
              transporte más limpio y eficiente, proporcionando soluciones de
              carga eléctrica innovadoras y accesibles.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/home-1.jpg"
              alt="About VOLTOP"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
