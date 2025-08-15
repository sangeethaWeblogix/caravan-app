// src/app/listings/[...slug]/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";

/* ---------------------------------- Types --------------------------------- */
interface Filters {
  page?: number;
  category?: string;
  make?: string;
  minPrice?: string;
  maxPrice?: string;
  minKg?: string;
  maxKg?: string;
  condition?: string;
  sleeps?: string;
  state?: string;
  region?: string;
  suburb?: string;
  acustom_fromyears?: string;
  acustom_toyears?: string;
  from_length?: string;
  to_length?: string;
  model?: string;
  postcode?: string;
  orderby?: string;
  atm?: string;
  radius_kms?: number | string; // <- allow both
}

/* ------------------------------ Helper: parse ----------------------------- */
function parseJsonSafe(text: string) {
  if (!/^\s*[{[]/.test(text)) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ----------------------- Server: generate metadata ------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;

  const [
    categorySlug,
    makeSlug,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    condition,
    sleeps,
    state,
    region,
    suburb,
    acustom_fromyears,
    acustom_toyears,
    from_length,
    to_length,
    model,
    postcode,
    orderby,
    atm,
    radius_kms,
  ] = slug;

  const filters: Filters = {
    page: 1,
    category: categorySlug,
    make: makeSlug,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    condition,
    sleeps,
    state,
    region,
    suburb,
    acustom_fromyears,
    acustom_toyears,
    from_length,
    to_length,
    model,
    postcode,
    orderby,
    atm,
    radius_kms,
  };

  try {
    const qs = new URLSearchParams();
    qs.append("page", String(filters.page ?? 1));
    if (filters.category) qs.append("category", filters.category);
    if (radius_kms) qs.append("radius_kms", radius_kms);

    if (filters.make) qs.append("make", filters.make);
    if (filters.orderby) qs.append("orderby", filters.orderby);
    if (filters.postcode) qs.append("pincode", filters.postcode);
    if (filters.state) qs.append("state", filters.state);
    if (filters.region) qs.append("region", filters.region);
    if (filters.suburb) qs.append("suburb", filters.suburb);
    if (filters.minPrice) qs.append("from_price", `${filters.minPrice}`);
    if (filters.maxPrice) qs.append("to_price", `${filters.maxPrice}`);
    if (filters.minKg) qs.append("from_atm", `${filters.minKg}kg`);
    if (filters.maxKg) qs.append("to_atm", `${filters.maxKg}kg`);
    if (filters.from_length) qs.append("from_length", `${filters.from_length}`);
    if (filters.to_length) qs.append("to_length", `${filters.to_length}`);
    if (filters.acustom_fromyears)
      qs.append("acustom_fromyears", filters.acustom_fromyears);
    if (filters.acustom_toyears)
      qs.append("acustom_toyears", filters.acustom_toyears);
    if (filters.model) qs.append("model", filters.model);
    if (filters.condition)
      qs.append(
        "condition",
        filters.condition.toLowerCase().replace(/\s+/g, "-")
      );
    if (filters.sleeps) qs.append("sleep", filters.sleeps);

    const url = `https://www.caravansforsale.com.au/wp-json/cfs/v1/new-list?${qs.toString()}`;

    const groupResponse = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const contentType = groupResponse.headers.get("content-type") || "";
    const statusInfo = `${groupResponse.status} ${groupResponse.statusText}`;
    const raw = await groupResponse.text();

    console.log("SEO fetch URL:", url);
    console.log("Status:", statusInfo);
    console.log("Content-Type:", contentType);
    console.log("Body preview:", raw.slice(0, 180));

    if (!groupResponse.ok) {
      throw new Error(`HTTP error: ${statusInfo}`);
    }

    const groupData = parseJsonSafe(raw);
    if (!groupData) {
      throw new Error("Endpoint did not return JSON");
    }

    const groups = groupData?.seo ?? {};
    const title = groups.metatitle || "Default Title - Caravans for Sale";
    const description =
      groups.metadescription ||
      "Browse the latest caravans available for sale.";

    // ✅ Make title absolute so it doesn’t append "| Caravan"
    return {
      title: { absolute: title },
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg",
          },
        ],
      },
    };
  } catch (err) {
    console.error("Failed to build metadata:", err);
    return {
      title: { absolute: "Default Title - Caravans for Sale" },
      description: "Browse the latest caravans available for sale.",
      keywords: "caravans, trailers, new caravans, used caravans",
      openGraph: {
        title: "Default Title",
        description: "Browse our latest caravans for sale.",
        images: [{ url: "/default-image.jpg" }],
      },
    };
  }
}

/* --------------------------------- Layout --------------------------------- */
export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
