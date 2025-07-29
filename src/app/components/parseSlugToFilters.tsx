type ParsedFilterResult = {
  make?: string;
  model?: string;
  category?: string;
  condition?: string;
  minKg?: number;
  maxKg?: number;
  from_price?: number;
  to_price?: number;
};

export function parseSlugToFilters(
  segments: string[],
  makes: { slug: string }[],
  models: { slug: string }[],
  categories: { slug: string }[]
): ParsedFilterResult {
  const filters: ParsedFilterResult = {};

  segments.forEach((part) => {
    if (part.endsWith("-category")) {
      filters.category = part.replace("-category", "");
    } else if (part.endsWith("-condition")) {
      filters.condition = part.replace("-condition", "");
    } else if (part.includes("-kg-atm")) {
      if (/^over-(\d+)-kg-atm$/.test(part)) {
        filters.minKg = parseInt(part.match(/^over-(\d+)-kg-atm$/)?.[1] || "0");
      } else if (/^under-(\d+)-kg-atm$/.test(part)) {
        filters.maxKg = parseInt(
          part.match(/^under-(\d+)-kg-atm$/)?.[1] || "0"
        );
      } else if (/^between-(\d+)-kg-(\d+)-kg-atm$/.test(part)) {
        const [, from, to] =
          part.match(/^between-(\d+)-kg-(\d+)-kg-atm$/) || [];
        filters.minKg = parseInt(from);
        filters.maxKg = parseInt(to);
      }
    } else if (/^over-(\d+)$/.test(part)) {
      filters.from_price = parseInt(part.replace("over-", ""));
    } else if (/^under-(\d+)$/.test(part)) {
      filters.to_price = parseInt(part.replace("under-", ""));
    } else if (/^between-(\d+)-(\d+)$/.test(part)) {
      const [, from, to] = part.match(/^between-(\d+)-(\d+)$/) || [];
      filters.from_price = parseInt(from);
      filters.to_price = parseInt(to);
    } else if (makes.some((m) => m.slug === part)) {
      filters.make = part;
    } else if (models.some((m) => m.slug === part)) {
      filters.model = part;
    }
  });

  return filters;
}
