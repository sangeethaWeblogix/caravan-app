"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchListings } from "../../../api/listings/api";
import Listing from "./LisitingContent";
import CaravanFilter from "../CaravanFilter";
import SkeletonListing from "../skelton";
import Footer from "../Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { Metadata } from "next";
interface Product {
  id: number;
  name: string;
  length: string;
  kg: string;
  regular_price: string;
  sale_price?: string;
  price_difference?: string;
  image: string;
  link: string;
  location?: string;
  condition: string;
  sleep?: string;
  categories?: string[];
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items?: number;
  per_page: number;
  total_products: number;
}

export interface Category {
  name: string;
  slug: string;
}

export interface StateOption {
  value: string;
  name: string;
}

export interface MakeOption {
  name: string;
  slug: string;
}

export interface Filters {
  category?: string;
  make?: string;
  location?: string | null;
  from_price?: string | number; // ✅ add this
  to_price?: string | number;
  condition?: string;
  sleeps?: string;
  states?: string;
  minKg?: string | number;
  maxKg?: string | number;
  from_year?: number | string;
  to_year?: number | string;
  from_length?: string | number;
  to_length?: string | number;
  model?: string;
  state?: string;
  region?: string;
  suburb?: string;
  postcode?: string;
}

interface Props {
  category?: string;
  condition?: string;
  location?: string;
}
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
export default function ListingsPage({ category, condition, location }: Props) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const initialFilters: Filters = useMemo(() => {
    const parsedCategory = category?.replace("-category", "") || undefined;
    const parsedCondition = condition?.replace("-condition", "") || undefined;
    const sleepMatch = pathname.match(/over-(\d+)-people-sleeping-capacity/);
    const parsedSleep = sleepMatch ? `${sleepMatch[1]}-people` : undefined;

    const slugParts = pathname.split("/listings/")[1]?.split("/") || [];

    // ✅ safely extract state
    const statePart = slugParts.find((part) => part.endsWith("-state"));
    const parsedState = statePart
      ? statePart.replace(/-state$/, "").replace(/-/g, " ")
      : undefined;

    // ✅ ignore state slug from being treated as make
    const filteredSlugParts = slugParts.filter(
      (part) => part !== statePart // remove state part from slug array
    );

    const make = filteredSlugParts[0];
    const model = filteredSlugParts[1];

    return {
      ...(make && { make }),
      ...(model && { model }),
      ...(parsedCategory && { category: parsedCategory }),
      ...(parsedCondition && { condition: parsedCondition }),
      ...(parsedSleep && { sleeps: parsedSleep }),
      ...(parsedState && { state: parsedState }), // ✅ now passed safely
    };
  }, [category, condition, pathname]);

  const [filtersReady, setFiltersReady] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const filtersRef = useRef<Filters>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<MakeOption[]>([]);
  const [models, setModels] = useState<MakeOption[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaImage, setMetaImage] = useState("/favicon.ico"); // Default fallback image

  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("paged") || "1", 10);

  const [pagination, setPagination] = useState<Pagination>({
    current_page: initialPage,
    total_pages: 1,
    total_items: 0,
    per_page: 12, // The number of items per page
    total_products: 0,
  });

  // Update pagination when page URL param changes
  useEffect(() => {
    const pageParam = searchParams.get("paged");
    const page = parseInt(pageParam || "1", 10);
    if (!filtersReady) return; // ✅ Prevent early fetch

    if (pagination.current_page === page) return;

    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));

    loadListings(page, filtersRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pagination, filtersReady]);
  console.log(location);

  const loadListings = useCallback(
    async (page = 1, appliedFilters: Filters = filters) => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const response = await fetchListings({
          ...appliedFilters,
          page, // Current page number
          condition: appliedFilters.condition,
          minKg: appliedFilters.minKg?.toString(),
          maxKg: appliedFilters.maxKg?.toString(),
          sleeps: appliedFilters.sleeps,
          minPrice: appliedFilters.from_price?.toString(),
          maxPrice: appliedFilters.to_price?.toString(),
          acustom_fromyears: appliedFilters.from_year?.toString(),
          acustom_toyears: appliedFilters.to_year?.toString(),
          from_length: appliedFilters.from_length?.toString(),
          to_length: appliedFilters.to_length?.toString(),
          make: appliedFilters.make,
          model: appliedFilters.model,
          state: appliedFilters.state,
          region: appliedFilters.region,
          suburb: appliedFilters.suburb,
        });

        if (response?.data?.products && response?.pagination) {
          setProducts(response.data.products);
          setCategories(response.data.all_categories);
          setMakes(response.data.make_options);
          setStateOptions(response.data.states ?? []);
          setModels(response.data.model_options ?? []);
          setPageTitle(response.title ?? "Caravan Listings");
          setPagination(response.pagination);
          setMetaDescription(response.seo?.metaDescription);
          setMetaTitle(response.seo?.metatitle);
          console.log("my", metaTitle);

          // Dynamically build the meta title and description using all filters
          setMetaImage(response.seo?.metaimage || "/favicon.ico");
        } else {
          setProducts([]);
          setPagination({
            current_page: 1,
            total_pages: 1,
            per_page: pagination.per_page,
            total_products: 0,
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch listings:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.per_page]
  );

  // useEffect(() => {
  //   if (
  //     hasSearched ||
  //     !filtersReady ||
  //     Object.keys(initialFilters).length === 0
  //   )
  //     return;

  //   const pageFromURL = parseInt(searchParams.get("paged") || "1", 10);

  //   filtersRef.current = initialFilters;

  //   setPagination((prev) => ({
  //     ...prev,
  //     current_page: pageFromURL,
  //   }));

  //   loadListings(pageFromURL, initialFilters);
  // }, [filtersReady, hasSearched, initialFilters, loadListings, searchParams]);

  useEffect(() => {
    if (
      !hasSearched &&
      filtersReady &&
      Object.keys(initialFilters).length > 0
    ) {
      filtersRef.current = initialFilters;
      loadListings(initialPage, initialFilters);
    }
  }, [filtersReady, hasSearched, initialFilters, initialPage, loadListings]);
  // Handle filter changes and update the page
  const handleFilterChange = useCallback((newFilters: Filters) => {
    console.log("🚚 got from CaravanFilter →", newFilters); // 👈 should contain sleeps
    setHasSearched(true);
    setFilters(newFilters);
    filtersRef.current = newFilters;

    setPagination({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      per_page: 12,
      total_products: 0,
    });
    setFiltersReady(true);
    loadListings(1, newFilters);
    console.log("🔗 calling updateURLWithFilters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildSlugPath = () => {
    const slugParts: string[] = [];
    if (filters.make) slugParts.push(filters.make); // ✅ ADD THIS LINE
    if (filters.model && filters.model !== filters.make) {
      slugParts.push(filters.model);
    }
    if (filters.category) slugParts.push(`${filters.category}-category`);
    if (filters.condition)
      slugParts.push(`${filters.condition.toLowerCase()}-condition`);

    // 3. Build Location: State → Region → Suburb (with rules)
    if (filters.state && !filters.region && !filters.suburb) {
      // ✅ Only state
      slugParts.push(
        `${filters.state.toLowerCase().replace(/\s+/g, "-")}-state`
      );
    } else if (filters.state && filters.region && !filters.suburb) {
      // ✅ State + Region
      slugParts.push(
        `${filters.state.toLowerCase().replace(/\s+/g, "-")}-state`
      );
      slugParts.push(
        `${filters.region.toLowerCase().replace(/\s+/g, "-")}-region`
      );
    } else if (filters.state && filters.region && filters.suburb) {
      // ✅ Full: Suburb + State + Postcode
      slugParts.push(
        `${filters.suburb.toLowerCase().replace(/\s+/g, "-")}-suburb`
      );
      slugParts.push(
        `${filters.state.toLowerCase().replace(/\s+/g, "-")}-state`
      );
      if (filters.postcode) slugParts.push(filters.postcode);
    }

    console.log("🌐 Current Filters State:", filters.state);

    const minPrice = filters.from_price;
    const maxPrice = filters.to_price;

    if (minPrice && maxPrice) {
      slugParts.push(`between-${minPrice}-${maxPrice}`);
    } else if (minPrice) {
      slugParts.push(`over-${minPrice}`);
    } else if (maxPrice) {
      slugParts.push(`under-${maxPrice}`);
    }

    const minKg = filters.minKg;
    const maxKg = filters.maxKg;

    if (minKg && maxKg) {
      slugParts.push(`between-${minKg}-kg-${maxKg}-kg-atm`);
    } else if (minKg) {
      slugParts.push(`over-${minKg}-kg-atm`);
    } else if (maxKg) {
      slugParts.push(`under-${maxKg}-kg-atm`);
    }

    if (filters.sleeps) {
      const num = filters.sleeps.split("-")[0];
      slugParts.push(`over-${num}-people-sleeping-capacity`);
    }
    // ✅ Add this for length filtering
    const minLen = filters.from_length;
    const maxLen = filters.to_length;

    if (minLen && maxLen) {
      slugParts.push(`between-${minLen}-${maxLen}-length-in-feet`);
    } else if (minLen) {
      slugParts.push(`over-${minLen}-length-in-feet`);
    } else if (maxLen) {
      slugParts.push(`under-${maxLen}-length-in-feet`);
    }

    return `/listings/${slugParts.join("/")}`;
  };

  // ✨ Add this useEffect at the bottom of your component
  useEffect(() => {
    if (metaTitle) {
      document.title = metaTitle; // Update the page title dynamically
    }

    // Update description meta tag
    let descTag = document.querySelector("meta[name='description']");
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute(
      "content",
      metaDescription || "Browse caravans for sale"
    );

    // Update Open Graph meta tags
    let ogTitle = document.querySelector("meta[property='og:title']");
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", metaTitle || "");

    let ogDesc = document.querySelector("meta[property='og:description']");
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", metaDescription || "");

    // For og:image and twitter:image, use the current metaImage (fallback to /favicon.ico if not set)
    const imageUrl = metaImage || "/favicon.ico"; // This points to the favicon.ico in the public folder
    let ogImg = document.querySelector("meta[property='og:image']");
    if (!ogImg) {
      ogImg = document.createElement("meta");
      ogImg.setAttribute("property", "og:image");
      document.head.appendChild(ogImg);
    }
    ogImg.setAttribute("content", imageUrl);

    let twImg = document.querySelector("meta[name='twitter:image']");
    if (!twImg) {
      twImg = document.createElement("meta");
      twImg.setAttribute("name", "twitter:image");
      document.head.appendChild(twImg);
    }
    twImg.setAttribute("content", imageUrl); // Fallback image if not provided
  }, [metaTitle, metaDescription, metaImage]); // Trigger this useEffect whenever any of these values change

  const updateURLWithFilters = (page: number) => {
    console.log("✅ updateURLWithFilters CALLED with page:", page);
    const current = new URLSearchParams(searchParams.toString());
    current.set("paged", page.toString());
    console.log(
      "🧭 New URL will be:",
      `${buildSlugPath()}?${current.toString()}`
    );

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value &&
        ![
          "category",
          "location",
          "minKg",
          "maxKg",
          "from_price",
          "to_price",
          "sleeps",
          "condition",
          "from_year",
          "to_year",
          "from_length",
          "to_length",
          "make",
          "model",
          "state",
          "region",
          "suburb",
        ].includes(key)
      ) {
        current.set(key, value.toString());
      } else {
        current.delete(key);
      }
    });

    const finalUrl = `${buildSlugPath()}?${current.toString()}`;
    console.log("🚀 Updating URL to:", finalUrl);
    // 👇 Only update the URL. Let useEffect trigger the API
    router.push(finalUrl);
  };

  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      console.log("🟢 Triggering updateURLWithFilters with page:", nextPage);
      updateURLWithFilters(nextPage); // triggers useEffect to fetch correct page
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      const prevPage = pagination.current_page - 1;
      updateURLWithFilters(prevPage);
    }
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta name="twitter:image" content={metaImage} />
      </Head>
      <section className="services section-padding pb-30 style-1">
        <div className="container">
          <div className="content">
            <div className="text-sm text-gray-600 header">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              &gt;
              <span className="font-medium text-black"> Listings</span>
            </div>
            <h1 className="page-title">{pageTitle}</h1>

            <div className="row justify-content-center mt-8">
              <div className="col-lg-3 col-12 col-md-4">
                <div className="filter">
                  <Suspense fallback={<div>Loading filters...</div>}>
                    <CaravanFilter
                      categories={categories}
                      makes={makes}
                      models={models}
                      states={stateOptions}
                      onFilterChange={handleFilterChange}
                      currentFilters={filters}
                    />
                  </Suspense>
                </div>
              </div>

              {isLoading ? (
                <SkeletonListing />
              ) : (
                <Listing
                  products={products}
                  pagination={pagination}
                  onNext={handleNextPage}
                  onPrev={handlePrevPage}
                  metaDescription={metaDescription}
                  metaTitle={metaTitle}
                />
              )}

              <Footer />
              <div className="col-lg-3 rightbar-stick"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
