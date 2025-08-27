// utils/seo/metaFromSlug.ts
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import type { Metadata } from "next";

export async function metaFromSlug(
  filters: string[] = [],
  searchParams: Record<string, string | string[] | undefined> = {}
): Promise<Metadata> {
  // slug → object
  const slugFilters = parseSlugToFilters(filters);

  // query → object
  const queryFilters: Record<string, string | string[]> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      queryFilters[key] = value;
    } else if (value !== undefined) {
      queryFilters[key] = value;
    }
  });

  // ✅ merge: query overrides slug
  const finalFilters = { ...slugFilters, ...queryFilters, page: 1 };

  console.log("Final filters:", queryFilters);

  const res = await fetchListings(finalFilters);

  const title = res?.seo?.metatitle || "Caravan Listings";
  const description =
    res?.seo?.metadescription || "Browse all available caravans.";
  const rawIndex = (res?.seo?.index ?? "").toLowerCase().trim();

  const robots =
    rawIndex === "noindex"
      ? { index: false, follow: false }
      : { index: true, follow: true };

  return {
    title,
    description,
    robots,
    openGraph: { title, description, images: [{ url: "/favicon.ico" }] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/favicon.ico"],
    },
  };
}
