import { metaFromSlug } from "./metaFromSlug";
import type { Metadata } from "next";

type Params = { slug?: string[] };

export function withDynamicSlugMeta() {
  return async ({ params }: { params: Promise<Params> }) => {
    const resolvedParams = await params;
    return metaFromSlug(resolvedParams.slug ?? []);
  };
}
