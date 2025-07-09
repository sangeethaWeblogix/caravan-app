const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

interface Filters {
  page?: number;
  category?: string;
  make?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minKg?: string;
  maxKg?: string;
  condition?: string;
  sleeps?: string;
  state?: string;
}

export const fetchListings = async (filters: Filters = {}) => {
  const {
    page = 1,
    category,
    make,
    location,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    condition,
    sleeps,
    state,
  } = filters;

  const params = new URLSearchParams();
  params.append("paged", page.toString());

  if (category) params.append("category", category);
  if (make) params.append("make", make);
  if (state) params.append("state", state);
  if (location) params.append("location", location);
  if (minPrice) params.append("from_price", `${minPrice}`);
  if (maxPrice) params.append("to_price", `${maxPrice}`);
  if (minKg) params.append("from_atm", `${minKg}kg`);
  if (maxKg) params.append("to_atm", `${maxKg}kg`);

  if (condition) params.append("condition", condition);
  if (sleeps) params.append("sleeps", sleeps);
  const res = await fetch(`${API_BASE}/new-list?${params.toString()}`);

  if (!res.ok) throw new Error("API failed");

  const data = await res.json();
  return data;
};
