// app/listings/page.tsx
import React, { Suspense } from "react";
import Listing from "../components/ListContent/Listings"; // Path to your Listing component
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";
import Head from "next/head";

// This function will run server-side to dynamically generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = "public/favicon.ico";

  const response = await fetchListings({});

  const metaTitle = response?.seo?.metatitle || "Caravan Listings";
  const metaDescription =
    response?.seo?.metadescription ||
    "Browse all available caravans across Australia.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl, // Add image URL inside an array
          width: 1200, // Optional: specify the image width
          height: 630, // Optional: specify the image height
          alt: "Caravan Listings", // Optional: specify alt text
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl, // Add image URL inside an array
          width: 1200, // Optional: specify the image width
          height: 630, // Optional: specify the image height
          alt: "Caravan Listings", // Optional: specify alt text
        },
      ],
    },
  };
}

// Main component to render the page content

const ListingsPage = ({
  metaTitle,
  metaDescription,
}: {
  metaTitle: string;
  metaDescription: string;
}) => {
  console.log(
    "Generating metadata for listings page",
    metaTitle,
    metaDescription
  );
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <Suspense fallback={<div>Loading listings...</div>}>
        <Listing metaTitle={metaTitle} metaDescription={metaDescription} />
      </Suspense>
    </>
  );
};

export default ListingsPage;
