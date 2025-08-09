import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { withDynamicSlugMeta } from "../../../utils/seo/withDynamicSlugMeta";
// app/listings/[[...slug]]/page.tsx   ← use [[...slug]] if you want /listings to work too

export const generateMetadata = withDynamicSlugMeta();

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug = [] } = await params;
  const sp = await searchParams;

  const filters = parseSlugToFilters(slug);
  const page = String(sp?.page ?? "1");

  return <ListingsPage {...filters} page={page} />;
}
