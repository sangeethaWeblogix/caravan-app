 const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

export const fetchListings = async (page = 1) => {
  const res = await fetch(`${API_BASE}/list?paged=${page}`);
  if (!res.ok) throw new Error('API failed');

  const data = await res.json();
  return data;
};
