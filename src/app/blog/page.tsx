import Blogs from "./blogs";
import "./blog.css";

export const revalidate = 60; // ISR: refresh every 60s

export default async function BlogPage() {
  return <Blogs />;
}
