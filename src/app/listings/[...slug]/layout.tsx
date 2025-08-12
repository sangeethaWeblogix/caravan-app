import type { Metadata } from "next";
import { ReactNode } from "react";
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
}

// Function to fetch and generate metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  // Await the params to make sure they are fully resolved
  const { slug } = await params; // Await params to resolve the slug
  const filters: Filters = {};
  try {
    // Log the slug for debugging
    console.log("Slug from params:", slug);
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
    if (filters.model) params.append("model", filters.model); // ✅ Add this
    if (filters.condition)
      params.append(
        "condition",
        filters.condition.toLowerCase().replace(/\s+/g, "-")
      );
    if (filters.sleeps) params.append("sleep", filters.sleeps);
    // Fetch the API data using the slug if necessary
    const groupResponse = await fetch(
      `https://www.caravansforsale.com.au/wp-json/cfs/v1/new-list?${params.toString()}` // Assuming the API can filter based on `slug`
    );

    // Log the response status and the raw response data for debugging
    console.log("Response Status:", groupResponse);

    // Check if the response is OK before parsing
    if (!groupResponse.ok) {
      throw new Error(
        `Failed to fetch data with status: ${groupResponse.status}`
      );
    }

    // Parse the response as JSON
    const groupData = await groupResponse.json();

    // Log the actual data from the API
    console.log("Fetched Group Data:", groupData);

    const groups = groupData.seo; // Assuming `groupData.seo` contains SEO data
    console.log("Fetched Group SEO Data:", groups);

    // Return the metadata object
    return {
      title: groups.metatitle,
      description: groups.metadescription,
      keywords: groups.metakeyword,
      openGraph: {
        title: groups.metatitle,
        description: groups.metadescription,
        images: [
          {
            url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg", // Example image URL
          },
        ],
      },
    };
  } catch (error) {
    // Log any errors encountered during the fetch process
    console.error("Failed to fetch data", error);

    // Return default metadata in case of error
    return {
      title: "PeoplePlus - Latest Indian News, Trends, and Insights",
      description:
        "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
    };
  }
}

// Layout component
export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
