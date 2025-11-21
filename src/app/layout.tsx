// app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

// Police principale - Plus Jakarta Sans (ultra-fluide et moderne)
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'YSG Transport - Jordan',
  description: 'Application de transport pour Jordan',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#004170',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YSG Transport" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#004170" />
      </head>
      <body className={`${plusJakarta.variable} font-jakarta bg-gray-50 antialiased text-rendering-optimized`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}