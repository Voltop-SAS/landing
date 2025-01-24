import './globals.css'
import { Inter } from 'next/font/google'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Metadata, ResolvingMetadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tMetaData = await getTranslations('common.metadata')

  return {
    title: tMetaData('title'),
    description: tMetaData('description'),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
