// src/api/homeSearch/api.ts
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

export type HomeSearchItem = Record<string, unknown>;

function extractList(payload: any): HomeSearchItem[] {
  if (!payload) return [];
  const d = payload.data ?? payload;

  // try the most likely shapes first
  if (Array.isArray(d?.home_search)) return d.home_search;
  if (Array.isArray(d?.items)) return d.items;

  // fallback: first array found under `data` (or root)
  const firstArrayUnderData = d && Object.values(d).find(Array.isArray);
  if (Array.isArray(firstArrayUnderData)) return firstArrayUnderData as any[];

  const firstArrayAtRoot = Object.values(payload).find(Array.isArray);
  return (firstArrayAtRoot as any[]) ?? [];
}

export async function fetchHomeSearchList(): Promise<HomeSearchItem[]> {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_CFS_API_BASE");

  const url = `${API_BASE}/home_search`;
  if (typeof window !== "undefined") console.log("[HomeSearch API] GET", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HomeSearch API failed: ${res.status}`);

  const json = await res.json();
  return extractList(json);
}

export async function fetchKeywordSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<string[]> {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_CFS_API_BASE");
  const url = `${API_BASE}/home_search/?keyword=${encodeURIComponent(query)}`;

  const res = await fetch(url, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`Keyword API failed: ${res.status}`);

  const json = (await res.json()) as {
    success?: boolean;
    data?: { keyword?: string }[];
  };

  const arr = Array.isArray(json?.data) ? json!.data! : [];
  return arr.map((x) => String(x?.keyword ?? "")).filter(Boolean);
}
