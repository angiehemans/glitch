import type { Metadata } from 'next'
import { Inter, Jacquard_12 } from 'next/font/google'

import { SessionProvider } from './components/SessionProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const jacquard12 = Jacquard_12({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A simple blog with authentication',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="My Blog RSS Feed"
          href="/rss.xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} style={{ '--jacquard-font': jacquard12.style.fontFamily } as React.CSSProperties}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
