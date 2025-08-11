"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { fetchListings } from "../../../api/listings/api";
import Listing from "./LisitingContent";
import CaravanFilter from "../CaravanFilter";
import SkeletonListing from "../skelton";
import Footer from "../Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildSlugFromFilters } from "../slugBuilter";
import { parseSlugToFilters } from "../../components/urlBuilder";

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
  page?: string | number;
}
interface Props extends Filters {
  page?: string | number;
}

export default function ListingsPage({ page, ...incomingFilters }: Props) {
  const [initialFilters, setInitialFilters] = useState<Filters>({});
  const filtersInitializedRef = useRef(false);
  const lastRequestKeyRef = useRef<string>("");
  const inFlightKeyRef = useRef<string>("");

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
  // const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPage = parseInt(page?.toString() || "1", 10);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: initialPage,
    total_pages: 1,
    total_items: 0,
    per_page: 12, // The number of items per page
    total_products: 0,
  });
  useEffect(() => {
    if (!filtersInitializedRef.current && router) {
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      const slugParts = path.split("/listings/")[1]?.split("/") || [];
      const parsed = parseSlugToFilters(slugParts);
      setInitialFilters(parsed);
      filtersRef.current = parsed;
      filtersInitializedRef.current = true;
    }
  }, [router]);
  // Update pagination when page URL param changes
  // useEffect(() => {
  //   const pageParam = searchParams.get("page");
  //   const page = parseInt(pageParam || "1", 10);
  //   if (!filtersReady) return; // ✅ Prevent early fetch

  //   if (pagination.current_page === page) return;

  //   setPagination((prev) => ({
  //     ...prev,
  //     current_page: page,
  //   }));

  //   loadListings(page, filtersRef.current);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams, pagination, filtersReady]);

  console.log("✅ Filters about to be applied:", filtersRef.current);

  const loadListings = useCallback(
    async (page = 1, appliedFilters: Filters = filtersRef.current) => {
      if (noResultsRedirectingRef.current) return; // ✅ Avoid duplicate calls after redirect

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
          // ✅ No results found, show "no results" and redirect after delay
          setProducts([]);
          setPageTitle("No results found. Redirecting...");
          setMetaTitle("No listings found");
          setMetaDescription("We couldn’t find listings for your filters.");

          // ✅ Redirect to unfiltered listings after 2.5 seconds
          setTimeout(() => {
            noResultsRedirectingRef.current = true;
            const emptyFilters: Filters = {};
            setFilters(emptyFilters);
            filtersRef.current = emptyFilters;
            router.push("/listings");
          }, 2500);
        } else {
          // fallback for blank or broken filter
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
    [] // ✅ keep as-is
  );

  useEffect(() => {
    if (!hasSearched && filtersReady) {
      filtersRef.current = { ...initialFilters, ...incomingFilters };
      setFilters(filtersRef.current);
      // ✅ Call loadListings only on first render
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      loadListings(currentPage, filtersRef.current);

      setHasSearched(true);
    }
  }, [filtersReady, hasSearched]);

  useEffect(() => {
    // ✅ Force ready on first render
    setFiltersReady(true);
  }, []);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    const mergedFilters = { ...filtersRef.current, ...newFilters };
    console.log("🔗 Merging filters", mergedFilters);
    setHasSearched(true);
    setFiltersReady(true);
    setFilters(mergedFilters);
    filtersRef.current = mergedFilters;
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
    setPagination({
      current_page: pageFromURL,
      total_pages: 1,
      total_items: 0,
      per_page: 12,
      total_products: 0,
    });
    setFiltersReady(true);
    // loadListings(pageFromURL, mergedFilters);
    console.log("🔗 calling updateURLWithFilters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const updateURLWithFilters = (filters: Filters, page: number) => {
    const slug = buildSlugFromFilters(filters); // no ?page=1 inside it
    const query = new URLSearchParams();

    if (filters.from_year)
      query.set("acustom_fromyears", filters.from_year.toString());

    if (filters.to_year)
      query.set("acustom_toyears", filters.to_year.toString());

    // ✅ Only add page if greater than 1
    if (page > 1) {
      query.set("page", page.toString());
    }

    const finalURL = query.toString() ? `${slug}?${query}` : slug;
    router.push(finalURL);
  };

  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      console.log("🟢 Triggering updateURLWithFilters with page:", nextPage);
      updateURLWithFilters(filtersRef.current, nextPage); // triggers useEffect to fetch correct page
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      const prevPage = pagination.current_page - 1;
      updateURLWithFilters(filtersRef.current, prevPage);
    }
  };
  const noResultsRedirectingRef = useRef(false);
  // useEffect(() => {
  //   if (noResultsRedirectingRef.current) return; // ✅ Skip if just redirected
  //   if (filtersReady && hasSearched) {
  //     const currentPage = parseInt(searchParams.get("page") || "1", 10);
  //     loadListings(currentPage, filtersRef.current);
  //   }
  // }, [filters, hasSearched]);
  // ✅ single fetch trigger — runs when URL changes
  useEffect(() => {
    if (!filtersInitializedRef.current) return;

    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const slugParts = path.split("/listings/")[1]?.split("/") || [];
    const parsedFromURL = parseSlugToFilters(slugParts);

    // keep our refs in sync with the URL
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
    filtersRef.current = { ...parsedFromURL, ...incomingFilters };
    setFilters(filtersRef.current);

    // dedupe key (page + filters)
    const requestKey = JSON.stringify({
      page: pageFromURL,
      filters: filtersRef.current,
    });

    if (
      lastRequestKeyRef.current === requestKey ||
      inFlightKeyRef.current === requestKey
    ) {
      return; // already fetched / in flight for this exact state
    }

    lastRequestKeyRef.current = requestKey;
    inFlightKeyRef.current = requestKey;

    setPagination((prev) => ({
      ...prev,
      current_page: pageFromURL,
    }));

    loadListings(pageFromURL, filtersRef.current)
      .catch(() => {})
      .finally(() => {
        // clear inflight only if nothing else replaced the key
        if (inFlightKeyRef.current === requestKey) {
          inFlightKeyRef.current = "";
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  useEffect(() => {
    if (!filtersInitializedRef.current) {
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      const slugParts = path.split("/listings/")[1]?.split("/") || [];
      const parsed = parseSlugToFilters(slugParts);

      setInitialFilters(parsed);
      filtersRef.current = parsed;
      filtersInitializedRef.current = true;
      setFiltersReady(true); // let the URL watcher effect do the fetching
    }
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
