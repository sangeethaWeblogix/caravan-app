import { generateMetaFromSlug } from "./generateMetaFromSlug";

export function withDynamicSlugMeta() {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug?: string[] }>;
  }) {
    const { slug = [] } = await params;
    return generateMetaFromSlug(slug);
  };
}
