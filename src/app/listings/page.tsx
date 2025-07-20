// app/listings/page.tsx
import React, { Suspense } from "react";
import Listing from "../components/ListContent/Listings"; // Path to your Listing component
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";

// This function will run server-side to dynamically generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const response = await fetchListings({});

  // Assuming the response has 'meta' field with 'title' and 'description'
  const data = response || {};

  return {
    title: data?.seo?.metatitle || "Caravan Listings", // Fallback title
    description:
      data?.seo?.metadescription ||
      "Browse all available caravans across Australia.", // Fallback description
  };
}

// Main component to render the page content
export default async function ListingsPage() {
  return (
    <Suspense fallback={<div>Loading listings...</div>}>
      <Listing />
    </Suspense>
  );
}
