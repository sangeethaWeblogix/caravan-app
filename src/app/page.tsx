// app/listings/[...slug]/page.tsx
import type { Metadata } from "next";
import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { metaFromSlug } from "@/utils/seo/metaFromSlug";

type Params = { slug?: string[] };
type SearchParams = { [k: string]: string | string[] | undefined };

// ✅ Await params in generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  return metaFromSlug(slug);
}

export default async function Listings({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  // ✅ Resolve both in parallel
  const [{ slug = [] }, sp] = await Promise.all([params, searchParams]);

  const filters = parseSlugToFilters(slug);

  const paged = Array.isArray(sp?.paged)
    ? (sp!.paged[0] as string)
    : (sp?.paged as string) ?? "1";

  return <ListingsPage {...filters} page={paged} />;
}
