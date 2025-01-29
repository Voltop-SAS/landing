'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const slides = [
  {
    title: 'Creando un futuro sostenible:',
    subtitle:
      'VOLTOP la Primera Red de estaciones de carga eléctrica en Latinoamérica',
    image: '/banners/banner-1.jpg',
  },
  {
    title: 'Pioneros en la movilidad eléctrica en América latina',
    subtitle:
      ' Una amplia conectividad de red y soporte para la administración dinámica de cargas, lo que permite la instalación eficiente ubicaciones de alto tráfico',
    image: '/banners/banner-2.jpg',
  },
  {
    title: '',
    subtitle: '',
    image: '/banners/banner-3.jpg',
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent z-10" />
              <Image
                src={slide.image || '/placeholder.svg'}
                alt="Hero background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {slides[currentSlide].subtitle}
          </p>
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-primary transition-colors"
      >
        <ChevronLeft size={48} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-primary transition-colors"
      >
        <ChevronRight size={48} />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
