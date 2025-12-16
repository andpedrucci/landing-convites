import type { Metadata } from 'next'
import { Playfair_Display, Raleway } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const raleway = Raleway({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Momentos Únicos - Convites Digitais Personalizados',
  description: 'Convites digitais lindos para chá revelação, aniversários e momentos especiais. Personalizados com carinho.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
