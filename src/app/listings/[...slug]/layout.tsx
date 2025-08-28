import type { Metadata } from "next";
import { ReactNode } from "react";
import { parseSlugToFilters } from "@/app/components/urlBuilder"; // ✅ your helper
import { fetchListings } from "@/api/listings/api";

// simple querystring builder
function buildQuery(params: Record<string, any>) {
  return new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v != null && v !== "") acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  );
}

export async function metaFromSlug(
  filters: string[] = [],
  searchParams: Record<string, string | string[] | undefined> = {}
): Promise<Metadata> {
  const parsed = parseSlugToFilters(filters, searchParams);

  // ✅ page as number
  const finalFilters = {
    ...parsed,
    page: parsed.page ? Number(parsed.page) : 1,
  };

  console.log("Final filters:", finalFilters);

  // ✅ build querystring
  const qs = buildQuery(finalFilters);
  const url = `https://www.api.caravansforsale.com.au/wp-json/cfs/v1/new-list?${qs.toString()}`;

  // ✅ option 1: if fetchListings accepts full URL
  // const res = await fetchListings(url);

  // ✅ option 2: if fetchListings expects filters object (more likely)
  const res = await fetchListings(finalFilters);

  console.log("API response SEO:", res?.seo);

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

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
