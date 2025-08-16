// src/app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "./home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import React from "react";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: { default: "Caravan Listings", template: "%s " },
  description: "Browse all available caravans.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} flex flex-col min-h-screen`}>
        {" "}
        <Navbar />
        <main className="product-page style-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
