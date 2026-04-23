import type { Metadata } from 'next'
import { Poppins, Open_Sans } from 'next/font/google'
import '@fontsource/delicious-handrawn'
import './globals.css'

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const delicious = 'Delicious Handrawn'

export const metadata: Metadata = {
  title: 'PHOTOIZZM Photography',
  description: 'Book your convocation photography slot with PHOTOIZZM Photography. Preconvo Classic, Postconvo Classic & Forever Us packages available.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms" className={`${poppins.variable} ${openSans.variable}`} style={{ '--font-script': 'Delicious Handrawn, cursive' } as React.CSSProperties}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
