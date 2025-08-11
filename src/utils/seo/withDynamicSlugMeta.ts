import { metaFromSlug } from "./metaFromSlug";
import type { Metadata } from "next";

export function withDynamicSlugMeta() {
  return async function generateMetadata({
    params,
  }: {
    params: { slug?: string[] };
  }): Promise<Metadata> {
    return metaFromSlug(params.slug ?? []);
  };
}
