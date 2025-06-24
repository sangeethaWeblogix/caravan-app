const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

export const fetchHomePage = async () => {
  const res = await fetch(`${API_BASE}/home_page`);
   if (!res.ok) throw new Error('Failed to fetch home page data');
  return res.json();
};


