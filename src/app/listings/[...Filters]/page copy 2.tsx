import ListingsPage from "../../components/ListContent/Listings";
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";
import { headers } from "next/headers";

// ✅ Generate SEO metadata for social previews
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const url = new URL(referer);
  const searchParams = url.searchParams;
  const pathParts = url.pathname.split("/listings/")[1]?.split("/") || [];

  const categorySlug = pathParts.find((p) => p.includes("category"));
  const conditionSlug = pathParts.find((p) => p.includes("condition"));
  const stateSlug = pathParts.find((p) => p.endsWith("-state"));

  const category = categorySlug?.replace("-category", "");
  const condition = conditionSlug?.replace("-condition", "");
  const state = stateSlug?.replace("-state", "");

  const first = pathParts[0];
  const second = pathParts[1];

  const make =
    first !== categorySlug && first !== conditionSlug && first !== stateSlug
      ? first
      : undefined;

  const model =
    make &&
    second !== categorySlug &&
    second !== conditionSlug &&
    second !== stateSlug
      ? second
      : undefined;

  const filters = {
    make,
    model,
    category,
    condition,
    state,
    sleeps: searchParams.get("sleeps") || undefined,
    minKg: searchParams.get("minKg") || undefined,
    maxKg: searchParams.get("maxKg") || undefined,
    from_price: searchParams.get("from_price") || undefined,
    to_price: searchParams.get("to_price") || undefined,
    from_year: searchParams.get("acustom_fromyears") || undefined,
    to_year: searchParams.get("acustom_toyears") || undefined,
    from_length: searchParams.get("from_length") || undefined,
    to_length: searchParams.get("to_length") || undefined,
    suburb: searchParams.get("suburb") || undefined,
    region: searchParams.get("region") || undefined,
    postcode: searchParams.get("postcode") || undefined,
  };

  console.log("🧠 Generating metadata for listings page with filters", filters);

  const res = await fetchListings({ ...filters, page: 1 });

  if (!res || res.success === false || !res.seo) {
    console.warn(
      "❌ Metadata fetch failed or seo object missing",
      res?.message
    );
    return {
      title: "Caravans for Sale",
      description: "Explore caravans in Australia",
    };
  }

  console.log("✅ SEO meta", res.seo.metatitle, res.seo.metadescription);
  return {
    title: res.seo.metatitle || "Caravans for Sale",
    description: res.seo.metadescription || "Explore caravans in Australia",
    openGraph: {
      title: res.seo.metatitle || "",
      description: res.seo.metadescription || "",
      images: res.seo.metaimage ? [{ url: res.seo.metaimage }] : [],
    },
    twitter: {
      title: res.seo.metatitle || "",
      description: res.seo.metadescription || "",
      images: res.seo.metaimage ? [res.seo.metaimage] : [],
    },
  };
}

// ✅ Main listings page component with dynamic filters
export default function Page({
  params,
  searchParams,
}: {
  params: { filters?: string[] };
  searchParams: { [key: string]: string };
}) {
  const filters = params.filters || [];

  const category = filters
    .find((p) => p.includes("category"))
    ?.replace("-category", "");
  const condition = filters
    .find((p) => p.includes("condition"))
    ?.replace("-condition", "");
  const state = filters
    .find((p) => p.endsWith("-state"))
    ?.replace("-state", "");

  const knownSlugs = filters.filter(
    (p) =>
      p.includes("category") || p.includes("condition") || p.endsWith("-state")
  );
  const remainingSlugs = filters.filter((p) => !knownSlugs.includes(p));

  const make = remainingSlugs[0];
  const model = remainingSlugs[1];

  return (
    <ListingsPage
      category={category}
      condition={condition}
      location={state}
      make={make}
      model={model}
      searchParams={searchParams} // if needed
    />
  );
}
