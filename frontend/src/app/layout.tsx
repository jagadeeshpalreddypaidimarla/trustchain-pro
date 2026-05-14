import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrustChain Pro — AI Scam & Fake News Detection',
  description: 'Advanced AI-powered platform to detect scams, fake news, phishing, and fraud. Paste any message for instant verification.',
  keywords: 'scam detection, fake news, AI verification, fraud detection, India',
  openGraph: {
    title: 'TrustChain Pro — Protect Yourself from Scams',
    description: 'Paste any message to instantly verify if it is real or a scam.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}