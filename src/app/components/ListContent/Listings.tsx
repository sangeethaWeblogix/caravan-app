"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { fetchListings } from "../../../api/listings/api";
import Listing from "./LisitingContent";
import CaravanFilter from "../CaravanFilter";
import SkeletonListing from "../skelton";
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
  slug?: string;
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
  orderby?: string;
  radius_kms?: number | string; // <- allow both
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
  const DEFAULT_RADIUS = 50 as const;

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
  // const [metaImage, setMetaImage] = useState("/favicon.ico"); // Default fallback image

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

  console.log("orderby", filters.radius_kms);
  const asNumber = (v: unknown): number | undefined => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };

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

  console.log("✅ Filters about to be applied:", filtersRef.current);

  const loadListings = useCallback(
    async (page = 1, appliedFilters: Filters = filtersRef.current) => {
      if (noResultsRedirectingRef.current) return; // ✅ Avoid duplicate calls after redirect

      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        // inside loadListings, just before calling fetchListings
        const radiusNum = asNumber(appliedFilters.radius_kms);
        const radiusParam =
          typeof radiusNum === "number" && radiusNum !== DEFAULT_RADIUS
            ? String(radiusNum) // API as string
            : undefined;

        const response = await fetchListings({
          ...appliedFilters,
          page,
          condition: appliedFilters.condition,
          minKg: appliedFilters.minKg?.toString(),
          maxKg: appliedFilters.maxKg?.toString(),
          sleeps: appliedFilters.sleeps,
          from_price: appliedFilters.from_price?.toString(),
          to_price: appliedFilters.to_price?.toString(),
          acustom_fromyears: appliedFilters.from_year?.toString(),
          acustom_toyears: appliedFilters.to_year?.toString(),
          from_length: appliedFilters.from_length?.toString(),
          to_length: appliedFilters.to_length?.toString(),
          make: appliedFilters.make,
          model: appliedFilters.model,
          state: appliedFilters.state,
          region: appliedFilters.region,
          suburb: appliedFilters.suburb,
          pincode: appliedFilters.pincode,
          orderby: appliedFilters.orderby,
          radius_kms: radiusParam,
        });
        console.log("appl", appliedFilters);
        const hasFilters = Object.values(appliedFilters).some(
          (val) => val !== undefined && val !== null && val !== ""
        );

        const productsFound = response?.data?.products?.length > 0;
        console.log("productsFound", products);
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
          // setMetaImage(response.seo?.metaimage || "/favicon.ico");
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
          setPagination((prev) => ({
            current_page: 1,
            total_pages: 1,
            per_page: prev.per_page, // ✅ no stale closure
            total_products: 0,
          }));
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
  console.log("data pr", categories);

  // after
  useEffect(() => {
    if (!hasSearched && filtersReady) {
      filtersRef.current = { ...initialFilters, ...incomingFilters };
      setFilters(filtersRef.current);
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      loadListings(currentPage, filtersRef.current);
      setHasSearched(true);
    }
  }, [
    filtersReady,
    hasSearched,
    initialFilters,
    incomingFilters,
    searchParams,
    loadListings, // ✅ include everything used
  ]);

  useEffect(() => {
    // ✅ Force ready on first render
    setFiltersReady(true);
  }, []);
  console.log("Orderby filter:", filters.radius_kms);
  const handleFilterChange = useCallback((newFilters: Filters) => {
    console.log("order", newFilters);
    const mergedFilters = { ...filtersRef.current, ...newFilters };
    console.log("🔗 Merging filters", mergedFilters);
    if (
      "orderby" in newFilters &&
      (newFilters.orderby === undefined || newFilters.orderby === "")
    ) {
      delete mergedFilters.orderby;
    }
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
    updateURLWithFilters(mergedFilters, pageFromURL);
    // loadListings(pageFromURL, mergedFilters);
    console.log("🔗 calling updateURLWithFilters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateURLWithFilters = useCallback(
    (filters: Filters, page: number) => {
      const slug = buildSlugFromFilters(filters); // no ?page=1 inside it
      const query = new URLSearchParams();
      if (filters.orderby) query.set("orderby", String(filters.orderby)); // ✅ add this
      if (filters.from_year)
        query.set("acustom_fromyears", filters.from_year.toString());
      if (filters.to_year)
        query.set("acustom_toyears", filters.to_year.toString());
      // ✅ Only add page if greater than 1
      const r = Number(filters.radius_kms);
      if (!Number.isNaN(r) && r !== DEFAULT_RADIUS) {
        query.set("radius_kms", String(r));
      }
      if (page > 1) {
        query.set("page", page.toString());
      }

      const finalURL = query.toString() ? `${slug}?${query}` : slug;
      router.push(finalURL);
    },
    [router]
  ); // ✅ include router
  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      console.log("🟢 Triggering updateURLWithFilters with page:", nextPage);
      updateURLWithFilters(filtersRef.current, nextPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      const prevPage = pagination.current_page - 1;
      updateURLWithFilters(filtersRef.current, prevPage);
    }
  };
  const noResultsRedirectingRef = useRef(false);

  useEffect(() => {
    if (!filtersInitializedRef.current) return;

    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const slugParts = path.split("/listings/")[1]?.split("/") || [];
    const parsedFromURL = parseSlugToFilters(slugParts);

    // ✅ read query params (orderby, years, etc.)
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
    const orderbyQP = searchParams.get("orderby") || undefined;
    const radiusQP = searchParams.get("radius_kms");
    const radiusFromURL = radiusQP
      ? Math.max(5, parseInt(radiusQP, 10))
      : undefined;
    // const fromYearsQP = searchParams.get("acustom_fromyears") || undefined;
    // const toYearsQP = searchParams.get("acustom_toyears") || undefined;

    // ✅ include them in filtersRef/current
    filtersRef.current = {
      ...parsedFromURL,
      ...incomingFilters,
      orderby: orderbyQP,
      radius_kms:
        typeof radiusFromURL === "number" && radiusFromURL !== DEFAULT_RADIUS
          ? radiusFromURL
          : undefined, // ✅ crucial: makes requestKey change
      // from_year: fromYearsQP ?? parsedFromURL.from_year,
      // to_year: toYearsQP ?? parsedFromURL.to_year,
    };
    setFilters(filtersRef.current);

    const requestKey = JSON.stringify({
      page: pageFromURL,
      filters: filtersRef.current, // now includes orderby
    });

    if (
      lastRequestKeyRef.current === requestKey ||
      inFlightKeyRef.current === requestKey
    ) {
      return;
    }

    lastRequestKeyRef.current = requestKey;
    inFlightKeyRef.current = requestKey;

    setPagination((prev) => ({ ...prev, current_page: pageFromURL }));

    loadListings(pageFromURL, filtersRef.current)
      .catch(() => {})
      .finally(() => {
        if (inFlightKeyRef.current === requestKey) inFlightKeyRef.current = "";
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
  const mobileFiltersRef = useRef<HTMLDivElement>(null);
  const [draftFilters, setDraftFilters] = useState<Filters>({});

  useEffect(() => {
    // load Bootstrap JS once
    import("bootstrap/js/dist/offcanvas").catch(() => {});
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

      <section className="services product_listing bg-gray-100 section-padding pb-30 style-1">
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

            {/* Desktop grid: 3/9 split. On mobile, listings go full width */}
            <div className="row ">
              {/* Desktop sidebar filters */}
              <div className="col-lg-3 d-none d-lg-block">
                <div className="filter">
                  <Suspense fallback={<div>Loading filters...</div>}>
                    <CaravanFilter
                      categories={categories}
                      makes={makes}
                      models={models}
                      states={stateOptions}
                      onFilterChange={(partial) => {
                        handleFilterChange(partial); // <-- live update (fetch + URL)
                      }}
                      currentFilters={filters}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Listings area */}

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
                  onFilterChange={handleFilterChange}
                  currentFilters={filters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Offcanvas lives OUTSIDE the grid to avoid layout issues */}
      <div
        ref={mobileFiltersRef}
        id="mobileFilters"
        className="offcanvas offcanvas-end d-lg-none"
        tabIndex={-1}
        aria-labelledby="mobileFiltersLabel"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        style={{ maxHeight: "100dvh" }}
      >
        <div className="offcanvas-header mobile_filter_xs sticky-top bg-white">
          <h5 className="offcanvas-title mb-0" id="mobileFiltersLabel">
            Filters
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body pt-2">
          <Suspense fallback={<div>Loading filters...</div>}>
            <CaravanFilter
              categories={categories}
              makes={makes}
              models={models}
              states={stateOptions}
              currentFilters={draftFilters}
              onFilterChange={(partial) => {
                setDraftFilters((prev) => ({ ...prev, ...partial }));
              }}
            />
          </Suspense>
        </div>

        {/* <div className="p-3 border-top bg-white position-sticky bottom-0">
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary flex-grow-1"
              onClick={() => handleFilterChange({} as Filters)} // clear all, live
            >
              Clear
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
}
