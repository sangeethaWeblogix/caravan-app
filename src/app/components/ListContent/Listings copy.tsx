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
  pincode?: string;
}

interface Props {
  category?: string;
  condition?: string;
  location?: string;
  metaTitle?: string;
  metaDescription?: string;
  make?: string;
  model?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string | number;
  to_price?: string | number;
  minKg?: string | number;
  maxKg?: string | number;
  from_length?: string | number;
  to_length?: string | number;
  from_year?: string | number;
  to_year?: string | number;
  sleeps?: string;
  paged?: string | number;
}

export default function ListingsPage({
  category,
  condition,
  make,
  model,
  state,
  region,
  suburb,
  pincode,
  from_price,
  to_price,
  minKg,
  maxKg,
  from_length,
  to_length,
  from_year,
  to_year,
  sleeps,
  paged,
}: Props) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const initialFilters: Filters = useMemo(() => {
    const slugParts = pathname.split("/listings/")[1]?.split("/") || [];

    const statePart = slugParts.find((part) => part.endsWith("-state"));
    const regionPart = slugParts.find((part) => part.endsWith("-region"));
    const suburbPart = slugParts.find((part) => part.endsWith("-suburb"));
    const postcodePart = slugParts.find((part) => /^\d{4}$/.test(part));
    const categoryPart = slugParts.find((part) => part.includes("-category"));
    const conditionPart = slugParts.find((part) => part.includes("-condition"));

    const knownSlugs = [
      statePart,
      regionPart,
      suburbPart,
      postcodePart,
      categoryPart,
      conditionPart,
    ].filter(Boolean);
    const unknownSlugs = slugParts.filter((slug) => !knownSlugs.includes(slug));

    const parsedSleepMatch = pathname.match(
      /over-(\d+)-people-sleeping-capacity/
    );
    const parsedSleep = parsedSleepMatch
      ? `${parsedSleepMatch[1]}-people`
      : undefined;

    const parsedCategory =
      category || categoryPart?.replace("-category", "") || undefined;
    const parsedCondition =
      condition || conditionPart?.replace("-condition", "") || undefined;
    const parsedState =
      state || statePart?.replace("-state", "").replace(/-/g, " ");
    const parsedRegion =
      region || regionPart?.replace("-region", "").replace(/-/g, " ");
    const parsedSuburb =
      suburb || suburbPart?.replace("-suburb", "").replace(/-/g, " ");
    const parsedPostcode = pincode || postcodePart;

    // ✅ Safely assign make and model from unknownSlugs
    const isValidSlug = (s?: string) =>
      !!s && isNaN(Number(s)) && !s.includes("-");

    const finalMake =
      make || (isValidSlug(unknownSlugs[0]) ? unknownSlugs[0] : undefined);
    const finalModel =
      model || (isValidSlug(unknownSlugs[1]) ? unknownSlugs[1] : undefined);

    // ✅ Init all filters
    let from_price_final = from_price?.toString();
    let to_price_final = to_price?.toString();
    let minKg_final = minKg?.toString();
    let maxKg_final = maxKg?.toString();
    let from_length_final = from_length?.toString();
    let to_length_final = to_length?.toString();

    slugParts.forEach((slug) => {
      // ✅ ATM weight parser
      if (slug.includes("-kg-atm")) {
        if (slug.startsWith("between-")) {
          const match = slug.match(/between-(\d+)-kg-(\d+)-kg-atm/);
          if (match) {
            minKg_final ||= match[1];
            maxKg_final ||= match[2];
          }
        } else if (slug.startsWith("over-")) {
          minKg_final ||= slug.replace("over-", "").replace("-kg-atm", "");
        } else if (slug.startsWith("under-")) {
          maxKg_final ||= slug.replace("under-", "").replace("-kg-atm", "");
        }
        return;
      }

      // ✅ Price parser
      if (/^over-\d+$/.test(slug)) {
        from_price_final ||= slug.replace("over-", "");
      } else if (/^under-\d+$/.test(slug)) {
        to_price_final ||= slug.replace("under-", "");
      } else if (/^between-\d+-\d+$/.test(slug)) {
        const match = slug.match(/between-(\d+)-(\d+)/);
        if (match) {
          from_price_final ||= match[1];
          to_price_final ||= match[2];
        }
      }

      // ✅ Length parser
      if (slug.includes("length-in-feet")) {
        if (slug.startsWith("between-")) {
          const match = slug.match(/between-(\d+)-(\d+)-length-in-feet/);
          if (match) {
            from_length_final ||= match[1];
            to_length_final ||= match[2];
          }
        } else if (slug.startsWith("over-")) {
          from_length_final ||= slug
            .replace("over-", "")
            .replace("-length-in-feet", "");
        } else if (slug.startsWith("under-")) {
          to_length_final ||= slug
            .replace("under-", "")
            .replace("-length-in-feet", "");
        }
      }
    });

    return {
      make: finalMake,
      model: finalModel,
      category: parsedCategory,
      condition: parsedCondition,
      sleeps: sleeps || parsedSleep,
      state: parsedState,
      region: parsedRegion,
      suburb: parsedSuburb,
      pincode: parsedPostcode,
      from_price: from_price_final,
      to_price: to_price_final,
      minKg: minKg_final,
      maxKg: maxKg_final,
      from_length: from_length_final,
      to_length: to_length_final,
      from_year,
      to_year,
    };
  }, [
    pathname,
    category,
    condition,
    make,
    model,
    state,
    region,
    suburb,
    pincode,
    from_price,
    to_price,
    minKg,
    maxKg,
    from_length,
    to_length,
    from_year,
    to_year,
    sleeps,
  ]);

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
  // const initialPage = parseInt(searchParams.get("paged") || "1", 10);
  const initialPage = parseInt(paged?.toString() || "1", 10);
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

  console.log("✅ Filters about to be applied:", filtersRef.current);

  const loadListings = useCallback(
    async (page = 1, appliedFilters: Filters = filtersRef.current) => {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const response = await fetchListings({
          ...appliedFilters,
          page,
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
          postcode: appliedFilters.pincode,
        });

        const hasFilters = Object.values(appliedFilters).some(
          (val) => val !== undefined && val !== null && val !== ""
        );

        const productsFound = response?.data?.products?.length > 0;

        if (productsFound && response?.pagination) {
          setProducts(response.data.products);
          setCategories(response.data.all_categories);
          setMakes(response.data.make_options);
          setStateOptions(response.data.states ?? []);
          setModels(response.data.model_options ?? []);
          setPageTitle(response.title ?? "Caravan Listings");
          setPagination(response.pagination);
          setMetaDescription(response.seo?.metadescription);
          setMetaTitle(response.seo?.metatitle);
          setMetaImage(response.seo?.metaimage || "/favicon.ico");
        } else if (hasFilters) {
          const fallbackResponse = await fetchListings({ page: 1 });

          setProducts(fallbackResponse?.data?.products || []);
          setPagination(
            fallbackResponse?.pagination || {
              current_page: 1,
              total_pages: 1,
              per_page: pagination.per_page,
              total_products: 0,
            }
          );
          setCategories(fallbackResponse?.data?.all_categories || []);
          setMakes(fallbackResponse?.data?.make_options || []);
          setModels(fallbackResponse?.data?.model_options || []);
          setStateOptions(fallbackResponse?.data?.states || []);
          setPageTitle(fallbackResponse?.title ?? "Caravan Listings");
          setMetaTitle(fallbackResponse?.seo?.metatitle ?? "");
          setMetaDescription(fallbackResponse?.seo?.metadescription ?? "");
          setMetaImage(fallbackResponse?.seo?.metaimage || "/favicon.ico");
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
    [] // ✅ fixed dependency
  );

  useEffect(() => {
    if (!hasSearched && filtersReady) {
      filtersRef.current = initialFilters;
      setFilters(initialFilters); // ✅ sync filter state
      // loadListings(initialPage, initialFilters); // ✅ call even if no filters
      setHasSearched(true); // ✅ avoid re-fetching
    }
  }, [filtersReady, hasSearched]);

  useEffect(() => {
    // ✅ Force ready on first render
    setFiltersReady(true);
  }, []);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    console.log("🚚 got from CaravanFilter →", minKg); // 👈 should contain sleeps
    const mergedFilters: Filters = {
      ...filtersRef.current,
      ...newFilters,
      category: newFilters.category || filtersRef.current.category,
      condition: newFilters.condition || filtersRef.current.condition,
      sleeps: newFilters.sleeps || filtersRef.current.sleeps,
      make: newFilters.make || filtersRef.current.make,
      model: newFilters.model || filtersRef.current.model,
      state: newFilters.state || filtersRef.current.state,
      region: newFilters.region || filtersRef.current.region,
      suburb: newFilters.suburb || filtersRef.current.suburb,
      pincode: newFilters.pincode || filtersRef.current.pincode,
      from_price: newFilters.from_price || filtersRef.current.from_price,
      to_price: newFilters.to_price || filtersRef.current.to_price,
      minKg: newFilters.minKg || filtersRef.current.minKg,
      maxKg: newFilters.maxKg || filtersRef.current.maxKg,
      from_length: newFilters.from_length || filtersRef.current.from_length,
      to_length: newFilters.to_length || filtersRef.current.to_length,
      from_year: newFilters.from_year || filtersRef.current.from_year,
      to_year: newFilters.to_year || filtersRef.current.to_year,
    };
    console.log("🔗 Merging filters", mergedFilters);
    setHasSearched(true);
    setFilters(mergedFilters);
    filtersRef.current = mergedFilters;
    const pageFromURL = parseInt(searchParams.get("paged") || "1", 10);
    setPagination({
      current_page: pageFromURL,
      total_pages: 1,
      total_items: 0,
      per_page: 12,
      total_products: 0,
    });
    setFiltersReady(true);
    loadListings(pageFromURL, mergedFilters);
    console.log("🔗 calling updateURLWithFilters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const slugify = (value: string | null | undefined) =>
    value?.toLowerCase().replace(/\s+/g, "-").trim() || "";
  const buildSlugPath = () => {
    const slugParts: string[] = [];
    alert("build");
    // Make and Model Filters
    if (filters.make) {
      slugParts.push(filters.make);
      if (filters.model && filters.model !== filters.make) {
        slugParts.push(filters.model); // Ensure model is only added if it is different from make
      }
    }

    // Category and Condition Filters
    if (filters.category) slugParts.push(`${filters.category}-category`);
    if (filters.condition)
      slugParts.push(`${filters.condition.toLowerCase()}-condition`);

    // Location Filters: State → Region → Suburb → Postcode
    if (filters.state) {
      slugParts.push(
        `${filters.state.toLowerCase().replace(/\s+/g, "-")}-state`
      );
    }

    if (filters.region && filters.state) {
      slugParts.push(
        `${filters.region.toLowerCase().replace(/\s+/g, "-")}-region`
      );
    }

    if (filters.suburb) {
      slugParts.push(`${slugify(filters.suburb)}-suburb`);
      if (filters.state) {
        slugParts.push(`${slugify(filters.state)}-state`);
      }
      if (filters.pincode) {
        slugParts.push(filters.pincode);
      }
    } else {
      // ✅ Else: State → Region
      if (filters.state) {
        slugParts.push(`${slugify(filters.state)}-state`);
      }
      if (filters.region) {
        slugParts.push(`${slugify(filters.region)}-region`);
      }
    }

    // Price and ATM Filters
    if (filters.from_price && filters.to_price) {
      slugParts.push(`between-${filters.from_price}-${filters.to_price}`);
    } else if (filters.from_price) {
      slugParts.push(`over-${filters.from_price}`);
    } else if (filters.to_price) {
      slugParts.push(`under-${filters.to_price}`);
    }

    // Weight (ATM) Range Filters
    if (filters.minKg && filters.maxKg) {
      slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
    } else if (filters.minKg) {
      slugParts.push(`over-${filters.minKg}-kg-atm`);
    } else if (filters.maxKg) {
      slugParts.push(`under-${filters.maxKg}-kg-atm`);
    }

    // Sleeping Capacity Filter
    if (filters.sleeps) {
      const num = filters.sleeps.split("-")[0]; // Extract number of people
      slugParts.push(`over-${num}-people-sleeping-capacity`);
    }

    // Length Filters
    if (filters.from_length && filters.to_length) {
      slugParts.push(
        `between-${filters.from_length}-${filters.to_length}-length-in-feet`
      );
    } else if (filters.from_length) {
      slugParts.push(`over-${filters.from_length}-length-in-feet`);
    } else if (filters.to_length) {
      slugParts.push(`under-${filters.to_length}-length-in-feet`);
    }

    // Combine filters into the URL
    return `/listings/${slugParts.join("/")}`;
  };

  // ✨ Add this useEffect at the bottom of your component
  useEffect(() => {
    console.log("Updating meta tags", metaTitle);
    console.log("Updating meta des", metaDescription);
    console.log(
      "Updating meta image",

      metaImage
    );

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
  useEffect(() => {
    loadListings(1);
  }, []);

  console.log("metaaa", metaTitle);
  return (
    <>
      <Head>
        <title>{metaTitle || "Default Title"}</title>

        <meta
          name="description"
          content={metaDescription || "Default Description"}
        />
        <meta property="og:title" content={metaTitle || "Default Title"} />
        <meta
          property="og:description"
          content={metaDescription || "Default Description"}
        />
        <meta name="twitter:title" content={metaTitle || "Default Title"} />
        <meta
          name="twitter:description"
          content={metaDescription || "Default Description"}
        />
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
