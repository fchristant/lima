import '@styles/global/reset.css'
import '@styles/global/globals.css'
import '@styles/global/layout.css'
import '@styles/global/typography.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Header from '@components/Page/Header/header'
import Footer from '@components/Page/Footer/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlackWhole'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <Header />
         <main className='layout-content'>  
            {children}
         </main>
         <Footer />
      </body>
    </html>
  )
}
