import './css/reset.css'
import './css/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Header from './home/header'
import Footer from './home/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Philips Hue Web App'
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
