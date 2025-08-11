import ListingsPage from "@/app/components/ListContent/Listings";
import { parseSlugToFilters } from "../../components/urlBuilder";
import { metaFromSlug } from "../../../utils/seo/metaFromSlug";
import { Metadata } from "next";

type Params = { slug?: string[] };
type SearchParams = { [k: string]: string | string[] | undefined };

// Use async and await the params
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // Await the resolved value of params
  const { slug = [] } = await params;
  return metaFromSlug(slug); // Pass the slug to your helper function
}

export default async function Listings({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  // Await both params and searchParams before using them
  const [{ slug = [] }, sp] = await Promise.all([params, searchParams]);

  const filters = parseSlugToFilters(slug);

  const paged = Array.isArray(sp?.paged)
    ? (sp!.paged[0] as string)
    : (sp?.paged as string) ?? "1";

  return <ListingsPage {...filters} page={paged} />;
}
