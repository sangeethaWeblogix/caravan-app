const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

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
}

export const fetchListings = async (filters: Filters = {}) => {
  const {
    page = 1,
    category,
    make,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    from_length,
    to_length,
    condition,
    state,
    region,
    suburb,
    postcode,
  } = filters;

  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (category) params.append("category", category);
  if (make) params.append("make", make);
  if (postcode) params.append("pincode", postcode);

  if (state) params.append("state", state);
  if (region) params.append("region", region);
  if (suburb) params.append("suburb", suburb);
  if (minPrice) params.append("from_price", `${minPrice}`);
  if (maxPrice) params.append("to_price", `${maxPrice}`);
  if (minKg) params.append("from_atm", `${minKg}kg`);
  if (maxKg) params.append("to_atm", `${maxKg}kg`);
  if (from_length) params.append("from_length", `${from_length}`);
  if (to_length) params.append("to_length", `${to_length}`);

  if (filters.acustom_fromyears)
    params.append("acustom_fromyears", filters.acustom_fromyears);
  if (filters.acustom_toyears)
    params.append("acustom_toyears", filters.acustom_toyears);
  if (filters.model) params.append("model", filters.model); // ✅ Add this
  if (condition)
    params.append("condition", condition.toLowerCase().replace(/\s+/g, "-"));
  if (filters.sleeps) params.append("sleep", filters.sleeps);

  const res = await fetch(`${API_BASE}/new-list?${params.toString()}`);

  if (!res.ok) throw new Error("API failed");

  const data = await res.json();
  return data;
};
