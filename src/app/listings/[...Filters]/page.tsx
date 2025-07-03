 // app/listings/[...slug]/page.tsx or listings.tsx
"use client";
import { usePathname, useSearchParams } from "next/navigation";
import ListingsPage from "@/app/components/Listings";

const Listings = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathParts = pathname?.split("/").filter(Boolean);
  const slug1 = pathParts?.[1];
  const slug2 = pathParts?.[2];

  const category = slug1?.endsWith("-category") ? slug1.replace("-category", "") : undefined;
  const location = (slug2 ?? (slug1?.endsWith("-state") ? slug1 : undefined))
    ?.replace("-state", "")
    ?.replace(/-/g, " ");

  const make = searchParams.get("make") || undefined;
  const condition = searchParams.get("condition") || undefined;
  const sleeps = searchParams.get("sleeps") || undefined;
    const page = Number(searchParams.get("page") || "1"); // ✅ Add this

  return (
    <ListingsPage
      category={category}
      location={location}
            page={page} // ✅ Pass to ListingsPage
      
    />
  );
};

export default Listings;
