import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GSoC 2026 · Sprint Tracker',
  description: 'Personal GSoC 2026 sprint tracker — ML4SCI, Kubeflow, Apache Airflow',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  )
}