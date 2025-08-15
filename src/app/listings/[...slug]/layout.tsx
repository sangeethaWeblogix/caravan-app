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
  postcode?: string; // maps to pincode in API
  orderby?: string;
  atm?: string;
  radius_kms?: number | string;
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
  params: { slug?: string[] };
}): Promise<Metadata> {
  // ✅ no await here
  const { slug = [] } = params;

  // Match your existing slug order
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

  // Build query string expected by your API
  const qs = new URLSearchParams();
  qs.append("page", String(filters.page ?? 1));

  if (filters.category) qs.append("category", filters.category);
  if (filters.radius_kms !== undefined && filters.radius_kms !== "")
    qs.append("radius_kms", String(filters.radius_kms));

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

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const statusInfo = `${res.status} ${res.statusText}`;
    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    // Helpful server logs while developing
    console.log("[SEO] URL:", url);
    console.log("[SEO] Status:", statusInfo);
    console.log("[SEO] Content-Type:", contentType);
    console.log("[SEO] Body preview:", raw.slice(0, 200));

    if (!res.ok) {
      throw new Error(`HTTP error: ${statusInfo}`);
    }

    const data = parseJsonSafe(raw);
    if (!data) {
      throw new Error("Endpoint did not return valid JSON");
    }

    const seo = data?.seo ?? {};
    const title = seo.metatitle || "Caravans for Sale";
    const description =
      seo.metadescription || "Browse the latest caravans available for sale.";

    // ✅ Make title absolute so it doesn’t append "| Caravan"
    return {
      title: { absolute: title }, // prevent global suffix
      description,
      openGraph: {
        title,
        description,
        // images: [{ url: "/default-image.jpg" }],
      },
      // Optionally add twitter meta if you want parity
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (err) {
    console.error("[SEO] Failed to build metadata:", err);
    // Sensible, consistent fallback
    const title = "Caravans for Sale";
    const description = "Browse the latest caravans available for sale.";
    return {
      title: { absolute: title },
      description,
      keywords: "caravans, trailers, new caravans, used caravans",
      openGraph: {
        title,
        description,
        images: [{ url: "/default-image.jpg" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }
}

/* --------------------------------- Layout --------------------------------- */
export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
