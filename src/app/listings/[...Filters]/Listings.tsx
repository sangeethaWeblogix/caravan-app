// ✅ FILE: src/app/listings/[...Filters]/page.tsx
import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { useMemo } from "react";

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
