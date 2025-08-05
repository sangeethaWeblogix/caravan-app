"use client";

import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Listings() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugParts = useMemo(() => {
    const pathSegments = pathname?.split("/").filter(Boolean);
    const listingsIndex = pathSegments.indexOf("listings");
    return listingsIndex !== -1 ? pathSegments.slice(listingsIndex + 1) : [];
  }, [pathname]);

  const filters = useMemo(() => parseSlugToFilters(slugParts), [slugParts]);

  const paged = searchParams?.get("paged") || "1";

  return <ListingsPage {...filters} paged={paged} />;
}
