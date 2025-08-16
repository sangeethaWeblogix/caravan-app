// app/blog/page/[page]/page.tsx  (Server Component)
import Blogs from "./blogs";

export const revalidate = 60; // ISR: refresh every 60s

export default async function BlogPage() {
  // Fetch current + next to decide Next visibility

  // Optional: if first page has no posts, you can throw 404
  // if (!posts.length) notFound();

  return (
    // <Blogs
    //   blogPosts={posts as BlogPost[]}
    //   currentPage={currentPage}
    //   hasPrev={hasPrev}
    //   hasNext={hasNext}
    // />
    <Blogs />
  );
}
