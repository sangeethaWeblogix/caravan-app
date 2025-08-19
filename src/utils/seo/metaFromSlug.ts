// utils/seo/metaFromSlug.ts
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import type { Metadata } from "next";

export async function metaFromSlug(
  slugParts: string[] = []
): Promise<Metadata> {
  const filters = parseSlugToFilters(slugParts);
  console.log("meta filt", filters);
  const res = await fetchListings({ ...filters, page: 1 });
  console.log("Meta from slug response:", res);
  const title = res?.seo?.metatitle || "Caravan Listings";
  const description =
    res?.seo?.metadescription || "Browse all available caravans.";
  const rawIndex = (res?.seo?.index ?? "").toLowerCase().trim();

  let robots: { index: boolean; follow: boolean };
  if (rawIndex === "noindex") {
    robots = { index: false, follow: false }; // noindex, nofollow
  } else {
    robots = { index: true, follow: true }; // index, follow
  }
  console.log("Meta robots:", robots);

  return {
    title,
    description,
    robots,
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
