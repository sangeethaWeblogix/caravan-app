// app/listings/[...slug]/page.tsx or listings.tsx
"use client";
import { usePathname } from "next/navigation";
import ListingsPage from "@/app/components/ListContent/Listings";

const Listings = ({
  metaTitle,
  metaDescription,
}: {
  metaTitle: string;
  metaDescription: string;
}) => {
  const pathname = usePathname();

  const pathParts = pathname?.split("/").filter(Boolean);
  const slug1 = pathParts?.[1];
  const slug2 = pathParts?.[2];

  const category = slug1?.endsWith("-category")
    ? slug1.replace("-category", "")
    : undefined;
  const location = (slug2 ?? (slug1?.endsWith("-state") ? slug1 : undefined))
    ?.replace("-state", "")
    ?.replace(/-/g, " ");

  return (
    <ListingsPage
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      category={category}
      location={location}
    />
  );
};

export default Listings;
