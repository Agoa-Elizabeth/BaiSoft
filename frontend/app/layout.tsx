import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Marketplace',
  description: 'Business product management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
