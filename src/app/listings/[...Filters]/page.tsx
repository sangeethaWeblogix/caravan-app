// ✅ FILE: app/listings/[...slug]/page.tsx
import ListingsPage from "@/app/components/ListContent/Listings";
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";
import { parseSlugToFilters } from "../../components/urlBuilder";

interface Filters {
  category?: string;
  condition?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string;
  to_price?: string;
  minKg?: string;
  maxKg?: string;
  from_length?: string;
  to_length?: string;
  sleeps?: string;
  make?: string;
  model?: string;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { paged?: string };
}): Promise<Metadata> {
  const slugParts = params.slug || [];
  const filters = parseSlugToFilters(slugParts);
  const page = parseInt(searchParams?.paged || "1", 10);

  const response = await fetchListings({ ...filters, page });

  return {
    title: response?.seo?.metatitle || "Caravan Listings",
    description: response?.seo?.metadescription || "Browse caravans for sale",
    openGraph: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [
        {
          url: response?.seo?.metaimage || "/favicon.ico",
        },
      ],
    },
    twitter: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [response?.seo?.metaimage || "/favicon.ico"],
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
