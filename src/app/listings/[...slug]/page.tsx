import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { withDynamicSlugMeta } from "../../../utils/seo/withDynamicSlugMeta";

// ✅ This wires dynamic metadata into <head>
export const generateMetadata = withDynamicSlugMeta();

export default function Listings({
  params,
  searchParams,
}: {
  params: { slug?: string[] }; // ← use `slug` (matches [[...slug]])
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const slugParts = params.slug ?? []; // ← not Filters
  const filters = parseSlugToFilters(slugParts);

  const paged = Array.isArray(searchParams?.paged)
    ? (searchParams!.paged[0] as string)
    : (searchParams?.paged as string) ?? "1";

  return <ListingsPage {...filters} page={paged} />;
}
