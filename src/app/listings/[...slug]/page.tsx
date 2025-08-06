import Listing from "./Listings";
import { generateMetaFromSlug } from "./generateMetaFromSlug";
export async function generateMetadata() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const pathSegments = pathname?.split("/").filter(Boolean);

  return await generateMetaFromSlug(pathSegments);
}

// ✅ Page component
const Page = () => <Listing />;
export default Page;
