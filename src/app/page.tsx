import NavBar from '@ui/common/nav-bar'
import AboutSection from '~/ui/home/about-section'
import Footer from '~/ui/common/footer'
import HeroSection from '~/ui/home/hero-section'
import MeetBruno from '~/ui/home/meet-bruno'
import VideoSection from '~/ui/home/video-section'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <MeetBruno />
      <VideoSection />
    </main>
  )
}
