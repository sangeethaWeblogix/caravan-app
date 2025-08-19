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
function parsePricePair(minPrice?: string, maxPrice?: string) {
  const norm = (s?: string) => (s ?? "").toString().trim().toLowerCase();

  const mp = norm(minPrice);
  const xp = norm(maxPrice);

  let from_price: string | undefined;
  let to_price: string | undefined;

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
    // over-X
    if (mp.startsWith("over-")) from_price = num(mp);
    // under-X
    if (mp.startsWith("under-")) to_price = num(mp);
    // plain number
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
    value: isNoindex ? "noindex" : "index",
    isNoindex,
  };
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
    atm, // unused but kept for slot compatibility
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
    if (filters.radius_kms !== undefined && filters.radius_kms !== "")
      qs.append("radius_kms", String(filters.radius_kms));
    if (filters.make) qs.append("make", filters.make);
    if (filters.orderby) qs.append("orderby", filters.orderby);
    if (filters.postcode) qs.append("pincode", filters.postcode);
    if (filters.state) qs.append("state", filters.state);
    if (filters.region) qs.append("region", filters.region);
    if (filters.suburb) qs.append("suburb", filters.suburb);

    // ✅ robust price parsing (fixes "Invalid from_price/to_price")
    const { from_price, to_price } = parsePricePair(
      filters.minPrice,
      filters.maxPrice
    );
    if (from_price) qs.append("from_price", from_price);
    if (to_price) qs.append("to_price", to_price);

    // ✅ robust ATM parsing
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

    const url = `https://www.caravansforsale.com.au/wp-json/cfs/v1/new-list?${qs.toString()}`;

    const groupResponse = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const statusInfo = `${groupResponse.status} ${groupResponse.statusText}`;
    const raw = await groupResponse.text();

    console.log("SEO fetch URL:", url);
    console.log("Status:", statusInfo);
    console.log("Content:", groupResponse);
    console.log("Body preview:", raw.slice(0, 180));

    if (!groupResponse.ok) {
      throw new Error(`HTTP error: ${statusInfo}`);
    }

    const groupData = parseJsonSafe(raw) as ApiResp | null;
    if (!groupData) throw new Error("Endpoint did not return JSON");

    if (!groupData.success) {
      console.warn(
        "API returned error:",
        (groupData as ApiErr).errors || (groupData as ApiErr).message
      );
    }
    console.log("seoBlock1", groupData);
    const seoBlock: SEOBlock = groupData ? (groupData as ApiOk).seo ?? {} : {};
    console.log("Seo", seoBlock);
    const idx = normalizeIndexValue(seoBlock.index);
    const title = seoBlock.metatitle || "Default Title - Caravans for Sale";
    const description =
      seoBlock.metadescription ||
      "Browse the latest caravans available for sale.";

    console.log("idxv", idx.value);
    // robots mapping: noindex → follow (as requested)
    const robots =
      idx.value == "noindex"
        ? { index: false, follow: false } // noindex → noindex, nofollow
        : { index: true, follow: true }; // index → index, follow
    console.log("idxv3", idx.value);
    console.log("idx2", robots);

    return {
      // you can optionally set metadataBase to remove that Next.js warning in dev/prod
      // metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      title: { absolute: title },
      description,
      robots,
      openGraph: { title, description },
      twitter: { card: "summary_large_image", title, description },
      other: {
        "cfs-seo-index": idx.value, // "index" | "noindex"
        "cfs-seo-title": title,
        "cfs-seo-description": description,
        "cfs-seo-source-url": url,
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
