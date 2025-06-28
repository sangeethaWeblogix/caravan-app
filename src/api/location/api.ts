const API_LOCATION = process.env.NEXT_PUBLIC_CFS_API_BASE;

export const fetchLocations = async (keyword: string) => {
  if (!keyword || keyword.trim().length < 2) return [];

  const res = await fetch(`${API_LOCATION}/location-search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Location API failed');

  const data = await res.json();

  // ✅ Check if data is wrapped like { results: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;

  return []; // fallback
};

