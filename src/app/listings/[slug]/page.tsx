 "use client";
import { useParams } from "next/navigation";
import ListingsPage from "../page"; // ✅ use the actual listings page

export default function SlugPage() {
  const params = useParams();
  const slugParts = Array.isArray(params?.slug) ? params.slug : [params?.slug];
  const [category, location] = slugParts;

  return <ListingsPage category={category} location={location} />;
}
