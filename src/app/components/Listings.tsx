"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { fetchListings } from "../../api/listings/api";
import Listing from "../../app/components/LisitingContent";
import CaravanFilter from "../../app/components/CaravanFilter";
import SkeletonListing from "../../app/components/skelton";
import Footer from "../../app/components/Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  location?: string;
  from_price?: string | number;
  to_price?: string | number;
  minKg?: string | number;
  maxKg?: string | number;
  condition?: string;
  sleeps?: string;
  states?: string;
}

interface Props {
  category?: string;
  location?: string;
  condition?: string;
}

export default function ListingsPage({ category, location, condition }: Props) {
  const parsedCategory = category?.replace("-category", "") || undefined;
  const parsedLocation =
    location?.replace("-state", "")?.replace(/-/g, " ") || undefined;
  const parsedCondition = condition?.replace("-condition", "") || undefined;

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const initialFilters: Filters = {
    ...(parsedCategory && { category: parsedCategory }),
    ...(parsedLocation && { location: parsedLocation }),
    ...(parsedCondition && { condition: parsedCondition }),
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const filtersRef = useRef<Filters>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<MakeOption[]>([]);
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

    if (pagination.current_page !== page) {
      loadListings(page, filtersRef.current);
      setPagination((prev) => ({ ...prev, current_page: page }));
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!hasSearched && Object.keys(initialFilters).length > 0) {
      filtersRef.current = initialFilters; // ✅ set ref properly on first mount
      loadListings(initialPage, initialFilters);
    }
  }, []);

  const loadListings = async (page = 1, appliedFilters: Filters = filters) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetchListings({
        ...appliedFilters,
        page, // Current page number
        state: appliedFilters.location,
        condition: appliedFilters.condition,
        minKg: appliedFilters.minKg?.toString(),
        maxKg: appliedFilters.maxKg?.toString(),
        minPrice: appliedFilters.from_price?.toString(), // ✅ fixed
        maxPrice: appliedFilters.to_price?.toString(), // ✅ fixed
        location: undefined, // avoid duplication
      });

      if (response?.data?.products && response?.pagination) {
        setProducts(response.data.products);
        setCategories(response.data.all_categories);
        setMakes(response.data.make_options);
        setStateOptions(response.data.states ?? []);
        setPageTitle(response.title ?? "");
        setPagination(response.pagination);
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
  };

  // Handle filter changes and update the page
  const handleFilterChange = useCallback((newFilters: Filters) => {
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
    loadListings(1, newFilters);
  }, []);

  const buildSlugPath = () => {
    const slugParts: string[] = [];

    if (filters.category) slugParts.push(`${filters.category}-category`);
    if (filters.location)
      slugParts.push(`${filters.location.replace(/\s+/g, "-")}-state`);
    if (filters.condition)
      slugParts.push(`${filters.condition.toLowerCase()}-condition`);
    const minKg = filters.minKg;
    const maxKg = filters.maxKg;

    if (minKg && maxKg) {
      slugParts.push(`between-${minKg}-kg-${maxKg}-kg-atm`);
    } else if (minKg) {
      slugParts.push(`over-${minKg}-kg-atm`);
    } else if (maxKg) {
      slugParts.push(`under-${maxKg}-kg-atm`);
    }

    const minPrice = filters.from_price;
    const maxPrice = filters.to_price;

    if (minPrice && maxPrice) {
      slugParts.push(`between-${minPrice}-${maxPrice}`);
    } else if (minPrice) {
      slugParts.push(`over-${minPrice}`);
    } else if (maxPrice) {
      slugParts.push(`under-${maxPrice}`);
    }

    return `/listings/${slugParts.join("/")}`;
  };

  const updateURLWithFilters = (page: number) => {
    const current = new URLSearchParams(searchParams.toString());
    current.set("paged", page.toString());

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
          "condition",
        ].includes(key)
      ) {
        current.set(key, value.toString());
      } else {
        current.delete(key);
      }
    });

    router.push(`${buildSlugPath()}?${current.toString()}`);
  };

  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      updateURLWithFilters(nextPage); // triggers useEffect to fetch correct page
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      const prevPage = pagination.current_page - 1;
      updateURLWithFilters(prevPage);
      filtersRef.current && loadListings(prevPage, filtersRef.current);
      setPagination((prev) => ({ ...prev, current_page: prevPage }));
    }
  };

  return (
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
                    states={stateOptions}
                    onFilterChange={handleFilterChange}
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
              />
            )}

            <Footer />
            <div className="col-lg-3 rightbar-stick"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
