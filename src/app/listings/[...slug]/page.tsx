import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { metaFromSlug } from "../../../utils/seo/metaFromSlug";
import type { Metadata } from "next";

type Params = { slug?: string[] };
type SearchParams = Record<string, string | string[] | undefined>;

// Generate metadata (SEO)
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  // slug comes from dynamic catch-all route [...slug]
  const { slug = [] } = params;

  // merge slug + query params inside metaFromSlug
  return metaFromSlug(slug, searchParams);
}

// Main Listings page
export default async function Listings({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug = [] } = params;
  const filters = parseSlugToFilters(slug, searchParams);

  // Pagination param
  const paged = Array.isArray(searchParams?.paged)
    ? searchParams.paged[0]
    : searchParams?.paged ?? "1";

  return <ListingsPage {...filters} page={paged} />;
}
