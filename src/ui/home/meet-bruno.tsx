'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '~/components/ui/button'

export default function MeetBruno() {
  const [toogleViewMore, setToogleViewMore] = useState(false)
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px]">
            <Image
              src="/images/Bruno.jpg"
              alt="Bruno Ocampo González"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6">Conoce a Bruno</h2>
            <h3 className="text-xl font-semibold mb-4">
              Fundador y CEO de VOLTOP
            </h3>
            <article className="text-gray-700 space-y-4 text-lg leading-relaxed mb-6">
              <p>
                Bruno Ocampo González es un emprendedor pionero enfocado en
                avanzar la movilidad sostenible en América Latina. Comenzó su
                carrera profesional en Wall Street, donde estuvo involucrado en
                transacciones financieras que superan los USD 3 mil millones.
                Actualmente, usa su experiencia para ayudar a diseñar las
                iniciativas en estrategias de negocios de impacto regional.
              </p>
              {toogleViewMore && (
                <div className="space-y-4">
                  <p>
                    En 2023, Bruno fundó VOLTOP con la misión de acelerar la
                    transición de la región hacia los vehículos eléctricos,
                    reflejando su compromiso con la sostenibilidad ambiental y
                    el desarrollo de soluciones energéticas innovadoras.
                    Anteriormente, en 2015, Bruno fundó Mi Águila,
                    transformándola en una empresa líder en movilidad
                    corporativa en Colombia. Durante la pandemia, lideró el
                    desarrollo de un software de comercio electrónico para
                    supermercados, facilitando la venta de más de 20 millones de
                    productos y la entrega de más de 500,000 paquetes de
                    alimentos.
                  </p>
                  <p>
                    En 2019, en alianza con Richard Branson, Bruno creó
                    Venezuela Aid Live, un evento que reunió a figuras globales
                    para apoyar a las comunidades venezolanas en crisis. Este
                    evento histórico llevó a la creación de la Fundación Aid
                    Live, dedicada a proporcionar asistencia humanitaria y apoyo
                    a los más necesitados.
                  </p>
                  <p>
                    Graduado con honores en Finanzas e Inversiones del Baruch
                    College Zicklin School of Business en Nueva York, Bruno ha
                    sido reconocido por la Kairos Society y la revista Inc. como
                    uno de los 50 jóvenes emprendedores con potencial para
                    cambiar el mundo.
                  </p>
                </div>
              )}
            </article>
            <Button
              variant="outline"
              className="bg-primary text-secondary hover:bg-secondary border-none"
              onClick={() => setToogleViewMore(!toogleViewMore)}
            >
              {toogleViewMore ? 'Ver menos' : 'Ver más'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
