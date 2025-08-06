// utils/parseFilters.ts

export interface Filters {
  category?: string;
  condition?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string;
  to_price?: string;
  minKg?: string;
  maxKg?: string;
  from_length?: string;
  to_length?: string;
  sleeps?: string;
  make?: string;
  model?: string;
}

const conditionMap: Record<string, string> = {
  new: "New",
  used: "Used",
  "near-new": "Near New",
};

export function parseSlugToFilters(slugParts: string[]): Filters {
  const filters: Filters = {};

  slugParts.forEach((part) => {
    if (part.endsWith("-category")) {
      filters.category = part.replace("-category", "");
    } else if (part.endsWith("-condition")) {
      const slug = part.replace("-condition", "").toLowerCase();
      filters.condition = conditionMap[slug] || slug;
    } else if (part.endsWith("-state")) {
      filters.state = part
        .replace("-state", "")
        .replace(/-/g, " ")
        .toLowerCase();
    } else if (part.endsWith("-region")) {
      filters.region = part
        .replace("-region", "") // remove the suffix
        .replace(/-/g, " ") // convert hyphens to spaces
        .toLowerCase(); // make all lowercase
    } else if (part.endsWith("-suburb")) {
      filters.suburb = part.replace("-suburb", "").replace(/-/g, " ");
    } else if (/^\d{4}$/.test(part)) {
      filters.pincode = part;
    } else if (part.includes("-kg-atm")) {
      if (part.startsWith("between-")) {
        const match = part.match(/between-(\d+)-kg-(\d+)-kg-atm/);
        if (match) {
          filters.minKg = match[1];
          filters.maxKg = match[2];
        }
      } else if (part.startsWith("over-")) {
        filters.minKg = part.replace("over-", "").replace("-kg-atm", "");
      } else if (part.startsWith("under-")) {
        filters.maxKg = part.replace("under-", "").replace("-kg-atm", "");
      }
    } else if (part.includes("length-in-feet")) {
      if (part.startsWith("between-")) {
        const match = part.match(/between-(\d+)-(\d+)-length-in-feet/);
        if (match) {
          filters.from_length = match[1];
          filters.to_length = match[2];
        }
      } else if (part.startsWith("over-")) {
        filters.from_length = part
          .replace("over-", "")
          .replace("-length-in-feet", "");
      } else if (part.startsWith("under-")) {
        filters.to_length = part
          .replace("under-", "")
          .replace("-length-in-feet", "");
      }
    } else if (part.includes("-people-sleeping-capacity")) {
      if (/^between-\d+-and-\d+-people-sleeping-capacity$/.test(part)) {
        const match = part.match(
          /between-(\d+)-and-(\d+)-people-sleeping-capacity/
        );
        if (match) {
          filters.sleeps = `${match[1]}-people`;
        }
      } else {
        const raw = part.replace("-people-sleeping-capacity", "");
        const cleaned = raw.replace(/^over-/, "").replace(/^under-/, "");
        if (!isNaN(Number(cleaned))) {
          filters.sleeps = `${cleaned}-people`;
        }
      }
    } else if (/^over-\d+$/.test(part)) {
      filters.from_price = part.replace("over-", "");
    } else if (/^under-\d+$/.test(part)) {
      filters.to_price = part.replace("under-", "");
    } else if (/^between-\d+-\d+$/.test(part)) {
      const match = part.match(/between-(\d+)-(\d+)/);
      if (match) {
        filters.from_price = match[1];
        filters.to_price = match[2];
      }
    } else if (!filters.make && isNaN(Number(part))) {
      filters.make = part;
    } else if (!filters.model && isNaN(Number(part))) {
      filters.model = part;
    }
  });

  return filters;
}

export function parsePathnameToFilters(pathname: string): Filters {
  const slugParts = pathname.split("/listings/")[1]?.split("/") || [];
  return parseSlugToFilters(slugParts);
}

export function refineMakeModel(
  filters: Filters,
  knownMakes: string[],
  knownModels: string[]
): Filters {
  const refined = { ...filters };

  if (refined.make && !knownMakes.includes(refined.make)) {
    refined.make = undefined;
  }
  if (refined.model && !knownModels.includes(refined.model)) {
    refined.model = undefined;
  }

  return refined;
}
