import { usePathname } from "next/navigation";
import ListingsPage from "@/app/components/ListContent/Listings";
import { fetchListings } from "@/api/listings/api";
import { Metadata } from "next";

// Modify the `generateMetadata` function to fetch and return metadata
export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = "public/favicon.ico";

  const response = await fetchListings({});

  const metaTitle = response?.seo?.metatitle || "Caravan Listings";
  const metaDescription =
    response?.seo?.metadescription ||
    "Browse all available caravans across Australia.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl, // Add image URL inside an array
          width: 1200, // Optional: specify the image width
          height: 630, // Optional: specify the image height
          alt: "Caravan Listings", // Optional: specify alt text
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl, // Add image URL inside an array
          width: 1200, // Optional: specify the image width
          height: 630, // Optional: specify the image height
          alt: "Caravan Listings", // Optional: specify alt text
        },
      ],
    },
  };
}

// Listings component now accepts metaTitle and metaDescription as props
const Listings = ({
  metaTitle,
  metaDescription,
}: {
  metaTitle: string;
  metaDescription: string;
}) => {
  const pathname = usePathname();

  const pathParts = pathname?.split("/").filter(Boolean);
  const slug1 = pathParts?.[1];
  const slug2 = pathParts?.[2];

  const category = slug1?.endsWith("-category")
    ? slug1.replace("-category", "")
    : undefined;
  const location = (slug2 ?? (slug1?.endsWith("-state") ? slug1 : undefined))
    ?.replace("-state", "")
    ?.replace(/-/g, " ");

  return (
    <ListingsPage
      category={category}
      location={location}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
    />
  );
};

export default Listings;
