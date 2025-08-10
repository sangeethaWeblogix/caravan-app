// app/listings/[[...slug]]/generateMetaFromSlug.ts
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "../../app/components/urlBuilder";
import { Metadata } from "next";

export async function generateMetaFromSlug(
  slugParts: string[] = []
): Promise<Metadata> {
  const filters = parseSlugToFilters(slugParts);
  const response = await fetchListings({ ...filters, page: 1 });

  const title = response?.seo?.metatitle || "Caravan Listings";
  const description =
    response?.seo?.metadescription || "Browse all available caravans.";
  console.log("metaa", title, description);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
      title,
      description,
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
