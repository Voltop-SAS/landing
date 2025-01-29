import VideoPlayer from '../common/video-palyer'

export default function VideoSection() {
  return (
    <section className="pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg mb-8">
            Descubre cómo <span className="font-bold">VOLTOP</span> está
            liderando la revolución de la movilidad eléctrica en América Latina.
            Únete a nosotros en la construcción de un futuro más limpio y
            sostenible.
          </p>
        </div>
        <VideoPlayer
          src="/videos/MANIFIESTO-VOLTOP.mp4"
          poster="/images/video-cover.jpg"
          type="mp4"
        />
      </div>
    </section>
  )
}
