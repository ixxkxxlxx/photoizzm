import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'PHOTOIZZM Photography – Booking Form',
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
    <html lang="ms" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
