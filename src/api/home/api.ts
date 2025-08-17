// src/api/home/api.ts
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE!;

export type HomeProduct = {
  id?: number | string;
  title?: string;
  slug?: string;
  image?: string;
  link?: string;
  location?: string;
  regular_price?: string | number;
  sale_price?: string | number;
  price_difference?: string | number;
};

export type HomeBlogPost = {
  id?: number;
  title?: string;
  excerpt?: string;
  link?: string;
  image?: string;
  slug?: string;
  date?: string;
};

type AnyObj = Record<string, any>;

export type HomePageData = {
  featured: HomeProduct[];
  products: HomeProduct[];
  latest_posts: HomeBlogPost[];
};

const first = <T = any>(v: unknown): T | undefined =>
  Array.isArray(v) ? v[0] : undefined;

// unwrap common wrappers: array | {items: []} | {list: []} | {data: []}
function pickItems(obj: AnyObj | undefined): any[] {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (Array.isArray(obj.items)) return obj.items;
  if (Array.isArray(obj.list)) return obj.list;
  if (Array.isArray(obj.data)) return obj.data;
  return [];
}

function normalizeProduct(o: AnyObj = {}): HomeProduct {
  return {
    id: o.id ?? o.product_id,
    title: o.title ?? o.name,
    slug: o.slug,
    image: o.image ?? o.main_image ?? o.thumbnail,
    link: o.link ?? o.permalink,
    location: o.location,
    regular_price: o.regular_price,
    sale_price: o.sale_price,
    price_difference: o.price_difference ?? o.save,
  };
}

function normalizeBlog(o: AnyObj = {}): HomeBlogPost {
  return {
    id: o.id,
    title: o.title,
    excerpt: o.excerpt,
    link: o.link,
    image: o.image,
    slug: o.slug,
    date: o.date,
  };
}

export async function fetchHomePage(): Promise<HomePageData> {
  const url = `${API_BASE.replace(/\/$/, "")}/home_page`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Home API failed: ${res.status} ${res.statusText}`);

  const json = (await res.json()) as AnyObj;

  // ✅ Some environments wrap everything under `data`
  const root: AnyObj = json?.data ?? json;

  // Look for likely section keys on the *root*
  const featuredRaw =
    root.featured ??
    root.featured_products ??
    root.featured_caravans ??
    root.top;

  const productsRaw =
    root.products ??
    root.more_products ??
    root.latest_listings ??
    root.recommended;

  const postsRaw =
    root.latest_blog_posts ?? // ← most likely
    root.blog ??
    root.posts;

  const featured = pickItems(featuredRaw).map(normalizeProduct);
  const products = pickItems(productsRaw).map(normalizeProduct);
  const latest_posts = pickItems(postsRaw).map(normalizeBlog);

  // Debug (comment out after verifying)
  console.log("[home] keys:", Object.keys(root));
  console.log("[home] latest_posts sample:", first(latest_posts));

  return { featured, products, latest_posts };
}
