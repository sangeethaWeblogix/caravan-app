// src/api/blog/api.ts
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  link: string;
  image: string;
  date: string; // e.g. "2024-12-28 20:11:04"
}

export interface BlogApiResponse {
  data: {
    latest_blog_posts: {
      items: BlogPost[];
    };
  };
}

export const fetchBlogs = async (page: number = 1): Promise<BlogPost[]> => {
  const res = await fetch(`${API_BASE}/blog?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Blog API failed: ${res.status}`);
  }

  const data: BlogApiResponse = await res.json();
  return data.data.latest_blog_posts.items;
};
