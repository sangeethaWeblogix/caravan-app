// ✅ FILE: src/app/listings/[...Filters]/page.tsx
import { Metadata } from "next";

import { fetchListings } from "@/api/listings/api";
import Listing from "./Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const slugParts = params.slug || [];

  const filters = parseSlugToFilters(slugParts);

  const page =
    typeof searchParams?.paged === "string"
      ? parseInt(searchParams.paged, 10)
      : 1;

  const response = await fetchListings({ ...filters, page });

  return {
    title: response?.metaTitle || "Listings",
    description: response?.metaDescription || "Browse available listings.",
    openGraph: {
      title: response?.metaTitle || "Listings",
      description: response?.metaDescription || "Browse available listings.",
      images: ["/og-image.png"],
    },
  };
}

const page = () => {
  return (
    <div>
      <Listing />
    </div>
  );
};

export default page;
