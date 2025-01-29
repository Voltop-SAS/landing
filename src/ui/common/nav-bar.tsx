'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '~/components/ui/button'

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/voltop-logo.svg"
              alt="VOLTOP Logo"
              width={150}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}
