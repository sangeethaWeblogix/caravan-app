 // src/app/layout.tsx
import './globals.css'
import Navbar from './navbar/Navbar'
import Footer from './footer/Footer'
import React from 'react'

export const metadata = {
  title: 'Caravan',
  description: 'Find caravans for sale'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
