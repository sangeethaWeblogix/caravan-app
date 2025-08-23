const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

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
  pincode?: string;
  orderby?: string;
  slug?: string;
  radius_kms?: string;
  search?: string;
  keyword?: string;
}

export const fetchListings = async (filters: Filters = {}) => {
  const {
    page = 1,
    category,
    make,
    from_price,
    to_price,
    minKg,
    maxKg,
    from_length,
    to_length,
    condition,
    state,
    region,
    suburb,
    pincode,
    orderby,
    slug,
    radius_kms,
    search,
    keyword,
  } = filters;

  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (category) params.append("category", category);
  if (radius_kms) params.append("radius_kms", radius_kms);
  if (slug) params.append("category", slug);
  if (make) params.append("make", make);
  if (pincode) params.append("pincode", pincode);
  if (state) params.append("state", state);
  if (region) params.append("region", region);
  if (suburb) params.append("suburb", suburb);
  if (from_price) params.append("from_price", `${from_price}`);
  if (to_price) params.append("to_price", `${to_price}`);
  if (minKg) params.append("from_atm", `${minKg}kg`);
  if (maxKg) params.append("to_atm", `${maxKg}kg`);
  if (from_length) params.append("from_length", `${from_length}`);
  if (to_length) params.append("to_length", `${to_length}`);
  if (filters.acustom_fromyears)
    params.append("acustom_fromyears", filters.acustom_fromyears);
  if (filters.acustom_toyears)
    params.append("acustom_toyears", filters.acustom_toyears);
  if (filters.model) params.append("model", filters.model);
  if (condition)
    params.append("condition", condition.toLowerCase().replace(/\s+/g, "-"));
  if (filters.sleeps) params.append("sleep", filters.sleeps);
  if (orderby) params.append("orderby", orderby);

  // normalize search/keyword: convert "+" -> space, collapse spaces
  const normalizeQuery = (s?: string) =>
    (s ?? "").replace(/\+/g, " ").trim().replace(/\s+/g, " ");
  const s = normalizeQuery(search);
  if (s) params.append("search", s);
  const k = normalizeQuery(keyword);
  if (k) params.append("keyword", k);

  const res = await fetch(`${API_BASE}/new-list?${params.toString()}`);
  if (!res.ok) throw new Error("API failed");

  const json = await res.json();

  // ---------- interleave exclusives without duplicates ----------
  type Item = any;
  const all: Item[] = json?.data?.products ?? [];
  const exFromApi: Item[] = json?.data?.exclusive_products ?? [];

  const keyOf = (x: any) => String(x?.id ?? x?.slug ?? x?.link);

  // IDs that are exclusive (from API list + flagged items inside products)
  const exIdSet = new Set<string>(exFromApi.map(keyOf));
  all.forEach((p) => {
    if (
      p?.is_exclusive === 1 ||
      p?.is_exclusive === "1" ||
      p?.is_exclusive === true
    ) {
      exIdSet.add(keyOf(p));
    }
  });

  // Build exclusive pool (unique, preserve API order; include flagged ones if missing)
  const exMap = new Map<string, Item>();
  exFromApi.forEach((p) => exMap.set(keyOf(p), p));
  all.forEach((p) => {
    const k = keyOf(p);
    if (exIdSet.has(k) && !exMap.has(k)) exMap.set(k, p);
  });
  const exclusivePool: Item[] = Array.from(exMap.values());

  // Normals = remove exclusives from the main pool
  const normals: Item[] = all.filter((p) => !exIdSet.has(keyOf(p)));

  // Pattern: 4N - E - 4N - E - 2N  (12 normals + up to 2 exclusives)
  const NORMAL_TARGET = 12;
  const pattern: (number | "E")[] = [4, "E", 4, "E", 2];

  const arranged: Item[] = [];
  let ni = 0,
    ei = 0,
    nAdded = 0;

  for (const slot of pattern) {
    if (slot === "E") {
      if (ei < exclusivePool.length) arranged.push(exclusivePool[ei++]);
    } else {
      for (
        let i = 0;
        i < slot && nAdded < NORMAL_TARGET && ni < normals.length;
        i++
      ) {
        arranged.push(normals[ni++]);
        nAdded++;
      }
    }
  }
  // Top-up normals to reach 12 if fewer exclusives
  while (nAdded < NORMAL_TARGET && ni < normals.length) {
    arranged.push(normals[ni++]);
    nAdded++;
  }

  // Final de-dupe (safety) + tag is_exclusive properly
  const seen = new Set<string>();
  const arrangedUnique = arranged
    .filter((p) => {
      const k = keyOf(p);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((p) => ({
      ...p,
      is_exclusive: exIdSet.has(keyOf(p)) ? 1 : 0,
    }));

  return {
    ...json,
    data: {
      ...json.data,
      products: arrangedUnique,
      exclusive_products: json.data?.exclusive_products ?? [],
    },
  };
};
