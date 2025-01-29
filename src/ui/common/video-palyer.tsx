'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

type VideoPlayerProps = {
  src: string
  poster: string
  type: string
}

export default function VideoPlayer({ src, poster, type }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play()
      videoRef.current.setAttribute('controls', 'true')
      setHasStarted(true)
    }
  }
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-secondary/20" />
        <video
          ref={videoRef}
          poster={poster}
          className="w-full h-full object-cover"
        >
          <source
            src={src}
            type={`video/${type}`}
          />
        </video>
        {!hasStarted && (
          <button
            onClick={handleStart}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-secondary ml-1" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
