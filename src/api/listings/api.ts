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
    sleeps
  } = filters;

  const params = new URLSearchParams();
  params.append('paged', page.toString());

  if (category) params.append('category', category);
  if (make) params.append('make', make);
  if (location) params.append('location', location);
  if (minPrice) params.append('min_price', minPrice);
  if (maxPrice) params.append('max_price', maxPrice);
  if (minKg) params.append('min_kg', minKg);
  if (maxKg) params.append('max_kg', maxKg);
  if (condition) params.append('condition', condition);
  if (sleeps) params.append('sleeps', sleeps);
   console.log("🔁 Fetching page", page, "with filters", filters); 
  const res = await fetch(`${API_BASE}/list?${params.toString()}`);

  if (!res.ok) throw new Error('API failed');

  const data = await res.json();
  console.log('data', data);
  return data;
};


