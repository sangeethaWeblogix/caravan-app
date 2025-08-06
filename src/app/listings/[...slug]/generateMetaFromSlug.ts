// utils/seo/generateMetaFromSlug.ts
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { Metadata } from "next";

/**
 * Generate dynamic metadata from slug parts
 */
export async function generateMetaFromSlug(
  slugParts: string[] = []
): Promise<Metadata> {
  const filters = parseSlugToFilters(slugParts);
  const response = await fetchListings({ ...filters, page: 1 });
  console.log("server data", response);
  const metaTitle = response?.seo?.metatitle || "Caravan Listings";
  const metaDescription =
    response?.seo?.metadescription || "Browse all available caravans.";
  console.log("server meta", metaTitle);
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: "/favicon.ico",
          width: 1200,
          height: 630,
          alt: "Caravan Listings",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: "/favicon.ico",
          width: 1200,
          height: 630,
          alt: "Caravan Listings",
        },
      ],
    },
  };
}
