// ✅ FILE: app/listings/[...slug]/page.tsx
import ListingsPage from "@/app/components/ListContent/Listings";
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";

interface Filters {
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

function parseSlugToFilters(slugParts: string[]): Filters {
  const filters: Filters = {};
  slugParts.forEach((part) => {
    if (part.endsWith("-category")) {
      filters.category = part.replace("-category", "");
    } else if (part.endsWith("-condition")) {
      const conditionSlug = part.replace("-condition", "").toLowerCase();
      const conditionMap: Record<string, string> = {
        new: "New",
        used: "Used",
        "near-new": "Near New",
      };
      filters.condition = conditionMap[conditionSlug] || conditionSlug;
    } else if (part.endsWith("-state")) {
      filters.state = part.replace("-state", "").replace(/-/g, " ");
    } else if (part.endsWith("-region")) {
      filters.region = part.replace("-region", "").replace(/-/g, " ");
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
    } else if (/over-(\d+)-people-sleeping-capacity/.test(part)) {
      const match = part.match(/over-(\d+)-people/);
      if (match) {
        filters.sleeps = `${match[1]}-people`;
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
    } else {
      // fallback for make/model slugs (must be non-numeric and valid)
      if (!filters.make && isNaN(Number(part)) && !part.includes("-")) {
        filters.make = part;
      } else if (!filters.model && isNaN(Number(part)) && !part.includes("-")) {
        filters.model = part;
      }
    }
  });

  return filters;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { paged?: string };
}): Promise<Metadata> {
  const slugParts = params.slug || [];
  const filters = parseSlugToFilters(slugParts);
  const page = parseInt(searchParams?.paged || "1", 10);

  const response = await fetchListings({ ...filters, page });

  return {
    title: response?.seo?.metatitle || "Caravan Listings",
    description: response?.seo?.metadescription || "Browse caravans for sale",
    openGraph: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [
        {
          url: response?.seo?.metaimage || "/favicon.ico",
        },
      ],
    },
    twitter: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [response?.seo?.metaimage || "/favicon.ico"],
    },
  };
}

export default function Listings({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { paged?: string };
}) {
  const slugParts = params.slug || [];
  const filters = parseSlugToFilters(slugParts);
  return <ListingsPage {...filters} paged={searchParams?.paged || "1"} />;
}
