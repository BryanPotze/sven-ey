import "./globals.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Tiebo ey counter",
  description: "A Next.js app with Firebase Firestore",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-image min-h-screen bg-neutral-900`}>
        <div className="min-h-screen bg-black/30 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </div>
      </body>
    </html>
  )
}