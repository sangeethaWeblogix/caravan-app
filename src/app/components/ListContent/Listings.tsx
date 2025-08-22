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
  acustom_fromyears?: number | string;
  acustom_toyears?: number | string;
  from_length?: string | number;
  to_length?: string | number;
  model?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  orderby?: string;
  search?: string;
  keyword?: string; // <- for keyword search
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
  acustom_fromyears?: string | number;
  acustom_toyears?: string | number;
  sleeps?: string;
  page?: string | number;
  serach?: string;
  keyword?: string;
  orderby?: string;
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
        const safeFilters = normalizeSearchFromMake(appliedFilters);
        console.log("Fetching listings :", safeFilters);
        // inside loadListings, just before calling fetchListings
        console.log("Fetching listings with filters:", safeFilters);

        const radiusNum = asNumber(safeFilters.radius_kms);
        const radiusParam =
          typeof radiusNum === "number" && radiusNum !== DEFAULT_RADIUS
            ? String(radiusNum) // API as string
            : undefined;
        console.log("Fetching listings with  :", radiusParam);

        const response = await fetchListings({
          ...safeFilters,
          page,
          condition: safeFilters.condition,
          minKg: safeFilters.minKg?.toString(),
          maxKg: safeFilters.maxKg?.toString(),
          sleeps: safeFilters.sleeps,
          from_price: safeFilters.from_price?.toString(),
          to_price: safeFilters.to_price?.toString(),
          acustom_fromyears: safeFilters.acustom_fromyears?.toString(),
          acustom_toyears: safeFilters.acustom_toyears?.toString(),
          from_length: safeFilters.from_length?.toString(),
          to_length: safeFilters.to_length?.toString(),
          make: safeFilters.make,
          model: safeFilters.model,
          state: safeFilters.state,
          region: safeFilters.region,
          suburb: safeFilters.suburb,
          pincode: safeFilters.pincode,
          orderby: safeFilters.orderby,
          search: safeFilters.search,
          keyword: safeFilters.keyword,
          radius_kms: radiusParam,
        });
        console.log("fetching appl", safeFilters);
        const hasFilters = Object.values(safeFilters).some(
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

  const normalizeSearchFromMake = (f: Filters): Filters => {
    if (!f?.make) return f;
    const decoded = decodeURIComponent(String(f.make));
    if (!decoded.includes("=")) return f;

    const [k, v = ""] = decoded.split("=", 2);
    if (k === "search" || k === "keyword") {
      const out: Filters = { ...f, [k]: v };
      delete out.make; // cleanly drop make
      if (out.keyword) out.search = undefined;
      return out;
    }
    return f;
  };

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
      console.log("updateURLWithFilters called with filters:", filters);
      const slug = buildSlugFromFilters(filters); // no ?page=1 inside it
      const query = new URLSearchParams();
      if (filters.orderby) query.set("orderby", String(filters.orderby)); // ✅ add this
      if (filters.acustom_fromyears)
        query.set("acustom_fromyears", filters.acustom_fromyears.toString());
      if (filters.acustom_toyears)
        query.set("acustom_toyears", filters.acustom_toyears.toString());
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
  // Make a stable key for query changes
  const searchKey = typeof window !== "undefined" ? window.location.search : "";

  // Keep a stable snapshot of incomingFilters values (optional if those never change)
  const incomingFiltersRef = useRef<Filters>(incomingFilters);
  useEffect(() => {
    // only update ref if values actually changed (cheap compare)
    const prev = JSON.stringify(incomingFiltersRef.current);
    const next = JSON.stringify(incomingFilters);
    if (prev !== next) incomingFiltersRef.current = incomingFilters;
  }, [incomingFilters]);

  useEffect(() => {
    if (!filtersInitializedRef.current) return;

    const path = typeof window !== "undefined" ? window.location.pathname : "";
    console.log("parsedFromURL path:", path);
    const slugParts = path.split("/listings/")[1]?.split("/") || [];
    const parsedFromURL = parseSlugToFilters(slugParts);
    console.log("parsedFromURL", parsedFromURL);
    const pageFromURL = parseInt(
      new URLSearchParams(searchKey).get("page") || "1",
      10
    );
    const orderbyQP =
      new URLSearchParams(searchKey).get("orderby") || undefined;
    const radiusQP = new URLSearchParams(searchKey).get("radius_kms");
    const radiusFromURL = radiusQP
      ? Math.max(5, parseInt(radiusQP, 10))
      : undefined;

    // Single merged filters (path + query + incoming snapshot)
    const merged: Filters = {
      ...parsedFromURL,
      ...incomingFiltersRef.current,
      orderby: orderbyQP,
      radius_kms:
        typeof radiusFromURL === "number" && radiusFromURL !== DEFAULT_RADIUS
          ? radiusFromURL
          : undefined,
    };
    console.log("parsedFrom", merged);

    // ✅ Only update state when it actually changed
    const prevFiltersJson = JSON.stringify(filtersRef.current);
    const nextFiltersJson = JSON.stringify(merged);

    if (prevFiltersJson !== nextFiltersJson) {
      filtersRef.current = merged;
      setFilters(merged);
    }

    // Only update pagination when page changed
    setPagination((prev) =>
      prev.current_page === pageFromURL
        ? prev
        : { ...prev, current_page: pageFromURL }
    );

    const requestKey = JSON.stringify({ page: pageFromURL, filters: merged });
    if (
      lastRequestKeyRef.current === requestKey ||
      inFlightKeyRef.current === requestKey
    ) {
      return;
    }

    lastRequestKeyRef.current = requestKey;
    inFlightKeyRef.current = requestKey;

    loadListings(pageFromURL, merged)
      .catch(() => {})
      .finally(() => {
        if (inFlightKeyRef.current === requestKey) inFlightKeyRef.current = "";
        setHasSearched(true);
      });
    // ⬇️ Depend on the stable string and nothing that changes every render
  }, [searchKey /* not incomingFilters, not loadListings */]);

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
