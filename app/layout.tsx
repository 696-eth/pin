import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: '$PIN',
  description: 'Get your memes, ads or projects seen by thousands.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang='en' data-theme='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen`}
      >
        <ContextProvider cookies={cookies}>
          <div className='grid grid-rows-[auto_1fr_auto] h-screen'>
            <Header />
            <main className='px-8 pb-20 gap-16 sm:px-20'>{children}</main>
            <Footer />
          </div>
        </ContextProvider>
      </body>
    </html>
  )
}
