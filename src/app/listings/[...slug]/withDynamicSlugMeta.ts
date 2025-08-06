// utils/seo/withDynamicSlugMeta.ts
import { generateMetaFromSlug } from "./generateMetaFromSlug";

/**
 * Safe wrapper to be used in dynamic App Router routes like [...slug]
 * Avoids TS build errors and supports metadata generation via slug
 */
export function withDynamicSlugMeta() {
  return async function generateMetadata(props: {
    params?: { slug?: string[] };
  }) {
    const slugParts = props.params?.slug || [];
    return await generateMetaFromSlug(slugParts);
  };
}
