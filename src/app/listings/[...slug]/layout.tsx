// src/app/listings/[...slug]/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";

/* ---------------------------------- Types --------------------------------- */
interface Filters {
  page?: number;
  category?: string;
  make?: string;
  from_price?: string;
  to_price?: string;
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
  radius_kms?: number | string;
}

type SEOBlock = {
  metatitle?: string;
  metadescription?: string;
  index?: string | null;
};

type ApiOk = {
  success: true;
  title?: string;
  seo?: SEOBlock;
  [k: string]: any;
};
type ApiErr = {
  success: false;
  message?: string;
  errors?: string[];
};
type ApiResp = ApiOk | ApiErr;

/* ------------------------------ Helpers ----------------------------------- */
function parseJsonSafe(text: string) {
  if (!/^\s*[{[]/.test(text)) return null;
  try {
    return JSON.parse(text) as ApiResp;
  } catch {
    return null;
  }
}

// price slug → numbers
// accepts: "over-10000", "under-50000", "10000-to-30000", "15000", ""
function parsePricePair(from_price?: string, to_price?: string) {
  const norm = (s?: string) => (s ?? "").toString().trim().toLowerCase();
  const mp = norm(from_price);
  const xp = norm(to_price);

  const num = (s: string) => {
    const m = s.match(/\d+/g);
    return m ? m.join("") : "";
  };

  // explicit range "10000-to-30000"
  if (mp.includes("to") && /^\d/.test(mp)) {
    const [a, b] = mp.split("to").map((v) => num(v));
    if (a) from_price = a;
    if (b) to_price = b;
  } else {
    if (mp.startsWith("over-")) from_price = num(mp);
    if (mp.startsWith("under-")) to_price = num(mp);
    if (/^\d+$/g.test(mp)) from_price = mp;
  }

  // max side can still provide info
  if (xp) {
    if (xp.startsWith("under-")) to_price = num(xp);
    else if (/^\d+$/g.test(xp)) to_price = xp;
    else if (xp.includes("to") && /^\d/.test(xp)) {
      const [, b] = xp.split("to").map((v) => num(v));
      if (b) to_price = b;
    }
  }

  return { from_price, to_price };
}

// ATM slug → numbers (kg)
// accepts: "over-600-kg-atm", "under-3500-kg-atm", "600-to-3500-kg-atm", "600", ""
function parseAtmPair(minKg?: string, maxKg?: string) {
  const norm = (s?: string) => (s ?? "").toString().trim().toLowerCase();
  const mn = norm(minKg);
  const mx = norm(maxKg);

  const num = (s: string) => {
    const m = s.match(/\d+/g);
    return m ? m.join("") : "";
  };

  let from_atm: string | undefined;
  let to_atm: string | undefined;

  // "600-to-3500-kg-atm"
  if (mn.includes("to") && /\d/.test(mn)) {
    const [a, b] = mn.split("to").map((v) => num(v));
    if (a) from_atm = `${a}kg`;
    if (b) to_atm = `${b}kg`;
  } else {
    if (mn.startsWith("over-")) {
      const n = num(mn);
      if (n) from_atm = `${n}kg`;
    } else if (mn.startsWith("under-")) {
      const n = num(mn);
      if (n) to_atm = `${n}kg`;
    } else if (/^\d+$/g.test(mn)) {
      from_atm = `${mn}kg`;
    }
  }

  // max side
  if (mx) {
    if (mx.startsWith("under-")) {
      const n = num(mx);
      if (n) to_atm = `${n}kg`;
    } else if (/^\d+$/g.test(mx)) {
      to_atm = `${mx}kg`;
    } else if (mx.includes("to") && /\d/.test(mx)) {
      const [, b] = mx.split("to").map((v) => num(v));
      if (b) to_atm = `${b}kg`;
    }
  }

  return { from_atm, to_atm };
}

// Normalize "index" / "noindex" (handles "no index", "no-index", etc.)
function normalizeIndexValue(v?: string | null) {
  const raw = (v ?? "").toString().trim().toLowerCase();
  const squashed = raw.replace(/[^a-z]/g, ""); // "no index" / "no-index" → "noindex"
  const isNoindex = squashed === "noindex";
  return {
    raw, // original string from API
    value: isNoindex ? "noindex" : "index", // "index" | "noindex"
    isNoindex,
  };
}
// price slug → numbers (supports: over-10000, under-50000, 10000-to-30000,
// between-10000-30000, over-10k, under-50k, between-10k-30k, 15000, "")

/* ----------------------- Server: generate metadata ------------------------ */
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
  // ✅ layouts don’t receive this; make it optional
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: SP; // <-- optional
}): Promise<Metadata> {
  const { slug = [] } = params;

  const sp = (searchParams ?? {}) as SP;

  // ✅ use the safe object
  const get = (k: string) =>
    typeof sp[k] === "string" ? (sp[k] as string) : undefined;
  const or = (a?: string, b?: string) => a ?? b;

  const [
    categorySlug,
    makeSlug,
    from_priceSlug,
    to_priceSlug,
    minKgSlug,
    maxKgSlug,
    conditionSlug,
    sleepsSlug,
    stateSlug,
    regionSlug,
    suburbSlug,
    acustom_fromyearsSlug,
    acustom_toyearsSlug,
    from_lengthSlug,
    to_lengthSlug,
    modelSlug,
    postcodeSlug,
    orderbySlug,
    atmSlug,
    radius_kmsSlug,
  ] = slug;

  // Prefer query params over slug (UI filters usually write ?from_price=&to_price= etc.)

  const filters: Filters = {
    page: 1,
    category: or(get("category"), categorySlug),
    make: or(get("make"), makeSlug),
    from_price: or(get("from_price"), from_priceSlug),
    to_price: or(get("to_price"), to_priceSlug),
    minKg: or(get("minKg"), minKgSlug),
    maxKg: or(get("maxKg"), maxKgSlug),
    condition: or(get("condition"), conditionSlug),
    sleeps: or(get("sleeps"), sleepsSlug),
    state: or(get("state"), stateSlug),
    region: or(get("region"), regionSlug),
    suburb: or(get("suburb"), suburbSlug),
    acustom_fromyears: or(get("acustom_fromyears"), acustom_fromyearsSlug),
    acustom_toyears: or(get("acustom_toyears"), acustom_toyearsSlug),
    from_length: or(get("from_length"), from_lengthSlug),
    to_length: or(get("to_length"), to_lengthSlug),
    model: or(get("model"), modelSlug),
    postcode: or(get("postcode") ?? get("pincode"), postcodeSlug),
    orderby: or(get("orderby"), orderbySlug),
    atm: or(get("atm"), atmSlug),
    radius_kms: or(get("radius_kms") ?? get("radius"), radius_kmsSlug),
  };

  try {
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
    const { from_price, to_price } = parsePricePair(
      filters.from_price,
      filters.to_price
    );
    if (from_price) qs.append("from_price", from_price);
    if (to_price) qs.append("to_price", to_price);
    const { from_atm, to_atm } = parseAtmPair(filters.minKg, filters.maxKg);
    if (from_atm) qs.append("from_atm", from_atm);
    if (to_atm) qs.append("to_atm", to_atm);

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
    const makeReadable = (filters: Filters) => {
      const parts = [];
      if (filters.make) parts.push(filters.make);
      if (filters.state) parts.push(filters.state);
      if (filters.region) parts.push(filters.region);
      if (filters.suburb) parts.push(filters.suburb);
      if (filters.from_price || filters.to_price)
        parts.push(
          `Price ${filters.from_price ?? ""} - ${filters.to_price ?? ""}`
        );
      return parts.filter(Boolean).join(" | ");
    };

    const url = `https://www.caravansforsale.com.au/wp-json/cfs/v1/new-list?${qs.toString()}`;
    console.log("Fetching metadata from:", url);
    const groupResponse = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const statusInfo = `${groupResponse.status} ${groupResponse.statusText}`;
    const contentType = groupResponse.headers.get("content-type") || "";
    const raw = await groupResponse.text();

    // Non-OK → safe defaults
    if (!groupResponse.ok) {
      return {
        title: { absolute: "Default Title - Caravans for Sale" },
        description: "Browse the latest caravans available for sale.",
        robots: { index: true, follow: true },
        openGraph: {
          title: "Default Title",
          description: "Browse our latest caravans for sale.",
        },
        twitter: {
          card: "summary_large_image",
          title: "Default Title",
          description: "Browse our latest caravans for sale.",
        },
        other: {
          "cfs-seo-index": "index",
          "cfs-seo-title": "Default Title - Caravans for Sale",
          "cfs-seo-description":
            "Browse the latest caravans available for sale.",
          "cfs-seo-source-url": url,
          "cfs-seo-status": statusInfo,
        },
      };
    }

    let groupData: ApiResp | null = null;
    try {
      if (/application\/json/i.test(contentType) || /^\s*[{[]/.test(raw)) {
        groupData = JSON.parse(raw) as ApiResp;
      }
    } catch {}
    console.log("SEO API JSON:", groupData);
    const seoBlock: SEOBlock =
      groupData && (groupData as ApiOk).success && (groupData as ApiOk).seo
        ? (groupData as ApiOk).seo!
        : {};

    const idx = normalizeIndexValue(seoBlock.index);
    console.log("SEO block:", seoBlock, "Index:", idx);
    const title = seoBlock.metatitle || "Default Title - Caravans for Sale";
    const description =
      seoBlock.metadescription ||
      "Browse the latest caravans available for sale.";

    // IMPORTANT: noindex should still follow (noindex, follow)
    const robots =
      idx.value === "index"
        ? { index: true, follow: true }
        : { index: false, follow: false };

    return {
      title: { absolute: title },
      description,
      robots,
      openGraph: { title, description },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch (err) {
    console.error("Failed to build metadata:", err);
    return {
      title: { absolute: "Default Title - Caravans for Sale" },
      description: "Browse the latest caravans available for sale.",
      openGraph: {
        title: "Default Title",
        description: "Browse our latest caravans for sale.",
      },
      twitter: {
        card: "summary_large_image",
        title: "Default Title",
        description: "Browse our latest caravans for sale.",
      },
      robots: { index: true, follow: true },
      other: {
        "cfs-seo-index": "index",
        "cfs-seo-title": "Default Title - Caravans for Sale",
        "cfs-seo-description": "Browse the latest caravans available for sale.",
      },
    };
  }
}

/* --------------------------------- Layout --------------------------------- */
export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
