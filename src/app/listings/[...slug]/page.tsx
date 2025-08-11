import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { withDynamicSlugMeta } from "../../../utils/seo/withDynamicSlugMeta";

// ✅ This wires dynamic metadata into <head>
export const generateMetadata = withDynamicSlugMeta();

type Params = { slug?: string[] };
type SearchParams = { [key: string]: string | string[] | undefined };

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
