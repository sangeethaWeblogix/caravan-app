import { withDynamicSlugMeta } from "./withDynamicSlugMeta";
import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { useMemo } from "react";

export const generateMetadata = withDynamicSlugMeta();

// ✅ Page component
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
  const page = params.get("page") || "1";

  return <ListingsPage {...filters} page={page} />;
}
