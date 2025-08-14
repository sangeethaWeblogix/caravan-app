// app/product-details/[slug]/page.tsx
import ClientLogger from "./product";

type PageProps = { params: { slug: string } };
async function fetchProductDetail(slug: string) {
  const res = await fetch(
    `https://www.dev.caravansforsale.com.au/wp-json/cfs/v1/product-detail/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load product detail");
  return res.json();
}

export default async function ProductDetailPage({ params }: PageProps) {
  const data = await fetchProductDetail(params.slug);
  console.log("slu", data);
  const product = data;
  console.log("slu pr", product);

  return (
    <main className="container mx-auto p-4">
      {/* Logs in the BROWSER console */}
      <ClientLogger data={data} />
    </main>
  );
}
