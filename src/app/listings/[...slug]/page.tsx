import { Metadata } from "next";
import { fetchListings } from "@/api/listings/api";
import Listing from "./Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";

// ✅ Correct type — NO `any`, NO `await`, NO ESLint error
export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const slugParts = params.slug || []; // ✅ no need to await
  const filters = parseSlugToFilters(slugParts);
  const response = await fetchListings({ ...filters, page: 1 });

  const metaTitle = response?.seo?.metatitle || "Caravan Listings";
  const metaDescription =
    response?.seo?.metadescription || "Browse all available caravans.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: "/favicon.ico",
          width: 1200,
          height: 630,
          alt: "Caravan Listings",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: "/favicon.ico",
          width: 1200,
          height: 630,
          alt: "Caravan Listings",
        },
      ],
    },
  };
}

// ✅ Page component
const Page = () => {
  return <Listing />;
};

export default Page;
