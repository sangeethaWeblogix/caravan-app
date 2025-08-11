import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { metaFromSlug } from "../../../utils/seo/metaFromSlug";
import { Metadata } from "next";

// ✅ This wires dynamic metadata into <head>
type Params = { slug?: string[] };
type SearchParams = { [k: string]: string | string[] | undefined };

// ✅ Correct Next.js signature: no Promises here
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  return metaFromSlug(params.slug ?? []);
}

export default async function Listings({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slugParts = resolvedParams.slug ?? [];
  const filters = parseSlugToFilters(slugParts);

  const paged = Array.isArray(resolvedSearchParams?.paged)
    ? (resolvedSearchParams!.paged[0] as string)
    : (resolvedSearchParams?.paged as string) ?? "1";

  return <ListingsPage {...filters} page={paged} />;
}
