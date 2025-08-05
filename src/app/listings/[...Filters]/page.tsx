// ✅ FILE: src/app/listings/[...Filters]/page.tsx
// import { Metadata } from "next";
import ListingsPage from "@/app/components/ListContent/Listings";
// import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { useMemo } from "react";

// export async function generateMetadata({
//   params,
//   searchParams,
// }: {
//   params: { Filters?: string[] };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }): Promise<Metadata> {
//   const slugParts = params.Filters || [];
//   const filters = parseSlugToFilters(slugParts);
//   const page =
//     typeof searchParams?.paged === "string"
//       ? parseInt(searchParams.paged, 10)
//       : 1;

//   const response = await fetchListings({ ...filters, page });

//   return {
//     title: response?.metaTitle || "Listings",
//     description: response?.metaDescription || "Browse available listings.",
//     openGraph: {
//       title: response?.metaTitle || "Listings",
//       description: response?.metaDescription || "Browse available listings.",
//       images: ["/og-image.png"],
//     },
//   };
// }

// export default function Listings({ params, searchParams }: PageProps) {
//   const slugParts = params.Filters || [];
//   const filters = parseSlugToFilters(slugParts);

//   const paged = Array.isArray(searchParams?.paged)
//     ? searchParams.paged[0]
//     : searchParams?.paged || "1";

//   return <ListingsPage {...filters} paged={paged} />;
// }
export default function Listings() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const search = typeof window !== "undefined" ? window.location.search : "";

  const slugParts = useMemo(() => {
    const pathSegments = pathname?.split("/").filter(Boolean);
    const listingsIndex = pathSegments.indexOf("listings");
    return listingsIndex !== -1 ? pathSegments.slice(listingsIndex + 1) : [];
  }, [pathname]);

  const filters = useMemo(() => parseSlugToFilters(slugParts), [slugParts]);

  const params = new URLSearchParams(search);
  const paged = params.get("paged") || "1";

  return <ListingsPage {...filters} paged={paged} />;
}
