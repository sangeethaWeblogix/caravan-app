import Details from "./details";
import "./details.css";

type PageProps = { params: { slug: string } };

async function fetchBlogDetail(slug: string) {
  const res = await fetch(
    `https://www.caravansforsale.com.au/wp-json/cfs/v1/blog-detail/${encodeURIComponent(
      slug
    )}`,
    { cache: "no-store", headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("Failed to load product detail");
  return res.json();
}

export default async function ProductBlogPage({ params }: PageProps) {
  const { slug } = params;
  const data = await fetchBlogDetail(slug);
  console.log("pdata", data);

  return (
    <div>
      <Details data={data} />
    </div>
  );
}
