 // src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import './home.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './navbar/Navbar'
import Footer from './footer/Footer'
import React from 'react';

export const metadata = {
  title: 'Caravan',
  description: 'Find caravans for sale'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="product-page style-5">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
