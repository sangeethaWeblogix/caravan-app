// app/blog/page/[page]/page.tsx  (Server Component)
import { fetchBlogs } from "@/api/blog/api";
import Blogs from "./blogs";
import type { BlogPost } from "@/api/blog/api";

export const revalidate = 60; // ISR: refresh every 60s

type PageProps = { params: { page: string } };

export default async function BlogPage({ params }: PageProps) {
  const currentPageNum = Number(params.page);
  const currentPage =
    Number.isFinite(currentPageNum) && currentPageNum > 0 ? currentPageNum : 1;

  // Fetch current + next to decide Next visibility
  const [posts, nextPosts] = await Promise.all([
    fetchBlogs(currentPage),
    fetchBlogs(currentPage + 1),
  ]);

  const hasPrev = currentPage > 1;
  const hasNext = (nextPosts?.length ?? 0) > 0;

  // Optional: if first page has no posts, you can throw 404
  // if (!posts.length) notFound();

  return (
    <Blogs
      blogPosts={posts as BlogPost[]}
      currentPage={currentPage}
      hasPrev={hasPrev}
      hasNext={hasNext}
    />
  );
}
