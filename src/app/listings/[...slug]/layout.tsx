import type { Metadata } from "next";
import { ReactNode } from "react";

// Filters Interface
interface Filters {
  page?: number;
  category?: string;
  make?: string;
  minPrice?: string;
  maxPrice?: string;
  minKg?: string;
  maxKg?: string;
  condition?: string;
  sleeps?: string;
  state?: string;
  region?: string;
  suburb?: string;
  acustom_fromyears?: string;
  acustom_toyears?: string;
  from_length?: string;
  to_length?: string;
  model?: string;
  postcode?: string;
  orderby?: string;
  atm?: string;
}

// Function to fetch and generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  // Await the params to make sure they are fully resolved
  const { slug } = await params; // Await params to resolve the slug

  const [
    categorySlug,
    makeSlug,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    condition,
    sleeps,
    state,
    region,
    suburb,
    acustom_fromyears,
    acustom_toyears,
    from_length,
    to_length,
    model,
    postcode,
    orderby,
    atm,
  ] = slug; // Destructure the slug after awaiting params

  const filters: Filters = {
    page: 1, // Default page number
    category: categorySlug,
    make: makeSlug,
    minPrice,
    maxPrice,
    minKg,
    maxKg,
    condition,
    sleeps,
    state,
    region,
    suburb,
    acustom_fromyears,
    acustom_toyears,
    from_length,
    to_length,
    model,
    postcode,
    orderby,
    atm,
  };

  try {
    const params = new URLSearchParams();
    params.append("page", filters.page?.toString() || "1");

    if (filters.category) params.append("category", filters.category);
    if (filters.make) params.append("make", filters.make);
    if (filters.orderby) params.append("orderby", filters.orderby);
    if (filters.postcode) params.append("pincode", filters.postcode);
    if (filters.state) params.append("state", filters.state);
    if (filters.region) params.append("region", filters.region);
    if (filters.suburb) params.append("suburb", filters.suburb);
    if (filters.minPrice) params.append("from_price", `${filters.minPrice}`);
    if (filters.maxPrice) params.append("to_price", `${filters.maxPrice}`);
    if (filters.minKg) params.append("from_atm", `${filters.minKg}kg`);
    if (filters.maxKg) params.append("to_atm", `${filters.maxKg}kg`);
    if (filters.from_length)
      params.append("from_length", `${filters.from_length}`);
    if (filters.to_length) params.append("to_length", `${filters.to_length}`);
    if (filters.acustom_fromyears)
      params.append("acustom_fromyears", filters.acustom_fromyears);
    if (filters.acustom_toyears)
      params.append("acustom_toyears", filters.acustom_toyears);
    if (filters.model) params.append("model", filters.model);
    if (filters.condition)
      params.append(
        "condition",
        filters.condition.toLowerCase().replace(/\s+/g, "-")
      );
    if (filters.sleeps) params.append("sleep", filters.sleeps);

    const groupResponse = await fetch(
      `https://www.caravansforsale.com.au/wp-json/cfs/v1/new-list?${params.toString()}`
    );

    // Log response status
    console.log("Response Status:", groupResponse);

    if (!groupResponse.ok) {
      throw new Error(
        `Failed to fetch data with status: ${groupResponse.status}`
      );
    }

    const groupData = await groupResponse.json();
    console.log("Fetched Group Data:", groupData);

    const groups = groupData?.seo || {};
    console.log("Fetched Group SEO Data:", groups);

    // Use fallback values if `seo` data is missing or incomplete
    const title = groups.metatitle || "Default Title - Caravans for Sale";
    const description =
      groups.metadescription ||
      "Browse the latest caravans available for sale.";
    const keywords =
      groups.metakeyword || "caravans, trailers, new caravans, used caravans";

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: [
          {
            url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg", // Fallback image
          },
        ],
      },
    };
  } catch (error) {
    console.error("Failed to fetch data", error);

    return {
      title: "Default Title - Caravans for Sale",
      description: "Browse the latest caravans available for sale.",
      keywords: "caravans, trailers, new caravans, used caravans",
      openGraph: {
        title: "Default Title",
        description: "Browse our latest caravans for sale.",
        images: [
          {
            url: "/default-image.jpg", // Default fallback image
          },
        ],
      },
    };
  }
}

// Layout component
export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
