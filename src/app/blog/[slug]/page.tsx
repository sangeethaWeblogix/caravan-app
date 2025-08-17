import Details from "./details";
import FaqSection from "./FaqSection";
import "./details.css";

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> }; // ✅ params is a Promise
async function fetchBlogDetail(slug: string) {
  const res = await fetch(
    `https://www.caravansforsale.com.au/wp-json/cfs/v1/blog-detail/${encodeURIComponent(
      slug
    )}`,
    { cache: "no-store", headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("Failed to load product detail");
  return res.json(); // <- type this if you have a response interface
}

export default async function ProductBlogPage({ params }: PageProps) {
  const { slug } = await params; // ✅ must await
  const data = await fetchBlogDetail(slug);
  console.log("pdata", data);
  return (
    <main className="container mx-auto p-4">
      <Details data={data} />
      <FaqSection />{" "}
    </main>
  );
}
