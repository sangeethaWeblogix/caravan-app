// app/listings/[[...slug]]/generateMetaFromSlug.ts
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "../../app/components/urlBuilder";
import { Metadata } from "next";

function decodeEntities(text: string) {
  return text.replace(/&amp;/g, "&");
}

export async function generateMetaFromSlug(slugParts: string[] = []) {
  const filters = parseSlugToFilters(slugParts);
  const response = await fetchListings({ ...filters, page: 1 });

  let metaTitle = decodeEntities(
    response?.seo?.metatitle || "Caravan Listings"
  );
  let metaDescription = decodeEntities(
    response?.seo?.metadescription || "Browse all available caravans."
  );

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [{ url: "/favicon.ico" }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [{ url: "/favicon.ico" }],
    },
  };
}
