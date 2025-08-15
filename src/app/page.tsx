import React from "react";
import Home from "./home";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Caravan For Sale ";
  const metaDescription = "Browse all available caravans across Australia.";
export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Caravan For Sale ";
  const metaDescription = "Browse all available caravans across Australia.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

const page = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default page;
