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

  // normalize search/keyword so spaces -> %20 and '+' stays as plus in UI terms
  const normalizeQuery = (s?: string) =>
    (s ?? "").replace(/\+/g, " ").trim().replace(/\s+/g, " ");

  const s = normalizeQuery(search);
  if (s) params.append("search", s);

  const k = normalizeQuery(keyword);
  if (k) params.append("keyword", k);

  const res = await fetch(`${API_BASE}/new-list?${params.toString()}`);
  if (!res.ok) throw new Error("API failed");

  const json = await res.json();

  // ---- interleave exclusives per your rule ----
  type Item = any;
  const products: Item[] = json?.data?.products ?? [];
  const exclusives: Item[] = json?.data?.exclusive_products ?? [];

  // pattern: 4N - E - 4N - E - 2N
  const NORMAL_TARGET = 12;
  const pattern: (number | "E")[] = [4, "E", 4, "E", 2];

  const arranged: Item[] = [];
  let p = 0; // normal idx
  let e = 0; // exclusive idx
  let normalsAdded = 0;

  for (const slot of pattern) {
    if (slot === "E") {
      if (e < exclusives.length) arranged.push(exclusives[e++]);
      // if no exclusive available, silently skip this slot
    } else {
      for (
        let i = 0;
        i < slot && normalsAdded < NORMAL_TARGET && p < products.length;
        i++
      ) {
        arranged.push(products[p++]);
        normalsAdded++;
      }
    }
  }

  // top up normals to reach 12 if the pattern loop didn't fill it (e.g., exclusives missing)
  while (normalsAdded < NORMAL_TARGET && p < products.length) {
    arranged.push(products[p++]);
    normalsAdded++;
  }

  // overwrite data.products for UI; keep pagination as-is from API
  return {
    ...json,
    data: {
      ...json.data,
      products: arranged,
      // keep exclusive_products if you still need it elsewhere; otherwise you could omit it
      exclusive_products: json.data?.exclusive_products ?? [],
    },
  };
};
