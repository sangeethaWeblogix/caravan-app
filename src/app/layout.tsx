// src/app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "./home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import React from "react";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://caravan-app-6c2f.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="product-page style-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
