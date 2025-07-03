 "use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
  minPrice?: string;
  maxPrice?: string;
  minKg?: string;
  maxKg?: string;
  condition?: string;
  sleeps?: string;
  states?: string;
}

interface Props {
  category?: string;
  location?: string;
}

export default function ListingsPage({ category, location }: Props) {
  const parsedCategory = category?.replace("-category", "") || undefined;
  const parsedLocation = location?.replace("-state", "")?.replace(/-/g, " ") || undefined;

  const initialFilters: Filters = {
    ...(parsedCategory && { category: parsedCategory }),
    ...(parsedLocation && { location: parsedLocation }),
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
  const initialPage = parseInt(searchParams.get("page") || "1", 12); // ✅ define early

  const [pagination, setPagination] = useState<Pagination>({
    current_page: initialPage,
    total_pages: 1,
    total_items: 0,
    per_page: 12,
    total_products: 0,
  });

useEffect(() => {
  if (!hasSearched) {
    const parsedCategory = category?.replace("-category", "") || undefined;
    const parsedLocation = location?.replace("-state", "")?.replace(/-/g, " ") || undefined;

    const defaultFilters: Filters = {
      ...(parsedCategory && { category: parsedCategory }),
      ...(parsedLocation && { location: parsedLocation }),
    };

    setFilters(defaultFilters);
    filtersRef.current = defaultFilters;
    setHasSearched(true);

    // ✅ Read from URL page (initialPage)
    loadListings(initialPage, defaultFilters);
  }
}, [category, location]);

useEffect(() => {
  const page = parseInt(searchParams.get("page") || "1");
  setPagination((prev) => {
    if (prev.current_page !== page) {
      return {
        ...prev,
        current_page: page,
      };
    }
    return prev;
  });
}, [searchParams]);


  useEffect(() => {
    setHasSearched(true);
  }, [hasSearched]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (hasSearched) {
      loadListings(pagination.current_page, filtersRef.current);
    }
  }, [pagination.current_page]);

  const loadListings = async (page = 1, appliedFilters: Filters = filters) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const response = await fetchListings({
        ...appliedFilters,
        page,
        state: appliedFilters.location,
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
          per_page: 12,
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

  const buildSlugPath = () => {
    const slugParts: string[] = [];
    if (filters.category) slugParts.push(`${filters.category}-category`);
    if (filters.location) slugParts.push(`${filters.location.replace(/\s+/g, "-")}-state`);
    return `/listings/${slugParts.join("/")}`;
  };

 const updateURLWithFilters = (page: number) => {
  const current = new URLSearchParams(searchParams.toString());
  current.set("page", page.toString());

  // Only add filters not already present in the path
  Object.entries(filters).forEach(([key, value]) => {
    if (value && key !== "category" && key !== "location") {
      current.set(key, value);
    } else {
      current.delete(key); // Clean up old values
    }
  });

  router.push(`${buildSlugPath()}?${current.toString()}`);
};


  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      const nextPage = pagination.current_page + 1;
      window.scrollTo({ top: 0, behavior: "instant" });
      setPagination((prev) => ({ ...prev, current_page: nextPage }));
      updateURLWithFilters(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      const prevPage = pagination.current_page - 1;
      setPagination((prev) => ({ ...prev, current_page: prevPage }));
      updateURLWithFilters(prevPage);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setHasSearched(true);
    setFilters(newFilters);
    setPagination({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      per_page: 12,
      total_products: 0,
    });
    loadListings(1, newFilters);
  };

  return (
    <section className="services section-padding pb-30 style-1">
      <div className="container">
        <div className="content">
          <div className="text-sm text-gray-600 header">
            <Link href="/" className="hover:underline">Home</Link> &gt;
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
