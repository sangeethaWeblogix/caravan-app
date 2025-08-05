// ✅ FILE: app/listings/[...slug]/page.tsx
import ListingsPage from "@/app/components/ListContent/Listings";
import { fetchListings } from "@/api/listings/api";
import { parseSlugToFilters } from "../../components/urlBuilder";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: { [key: string]: string };
}) {
  const slugParts = params.slug || [];
  const filters = parseSlugToFilters(slugParts);

  const page = searchParams?.paged ? parseInt(searchParams.paged, 10) : 1;

  const response = await fetchListings({ ...filters, page });

  const title = response?.metaTitle || "Listings";
  const description = response?.metaDescription || "Browse available listings.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function Listings({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { paged?: string };
}) {
  const slugParts = params.slug || [];
  console.log("Parsed filters", slugParts);
  const filters = parseSlugToFilters(slugParts);
  console.log("Parsed filters from slug:", filters);
  return <ListingsPage {...filters} paged={searchParams?.paged || "1"} />;
}
