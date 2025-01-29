import './globals.css'
import { getLocale, getTranslations } from 'next-intl/server'
import NavBar from '~/ui/common/nav-bar'
import Footer from '~/ui/common/footer'

export async function generateMetadata() {
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
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
