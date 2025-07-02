 "use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { fetchListings } from "../../api/listings/api";
import Listing from "../../app/components/LisitingContent";
import CaravanFilter from "../../app/components/CaravanFilter";
import SkeletonListing from "../../app/components/skelton";
import Footer from "../../app/components/Footer";
import Link from "next/link";

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
  const [atmOptions, setAtmOptions] = useState<number[]>([]);
  const [priceOptions, setPriceOptions] = useState<number[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [lengthOptions, setLengthOptions] = useState<number[]>([]);
  const [sleepOptions, setSleepOptions] = useState<number[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    total_products: 0,
    per_page: 12,
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
    loadListings(1, defaultFilters);
  }
      
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [category, location]);


  // First fetch on load
  useEffect(() => {
    setHasSearched(true);
   }, [hasSearched]);

  // Keep filtersRef up to date
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Load on pagination change
  useEffect(() => {
    if (hasSearched) {
      loadListings(pagination.current_page, filtersRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page]);



 const loadListings = async (page = 1, appliedFilters: Filters = filters) => {
  setIsLoading(true);
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const response = await fetchListings({
      ...appliedFilters,
      page,
      state: appliedFilters.location,  
      location: undefined,            
    });
    if (response?.data?.products && response?.pagination) {
      setProducts(response.data.products);
      setCategories(response.data.all_categories);
      setMakes(response.data.make_options);
      setAtmOptions(response.data.atm ?? []);
      setPriceOptions(response.data.price ?? []);
      setYearOptions(response.data.years ?? []);
      setLengthOptions(response.data.length ?? []);
      setSleepOptions(response.data.sleep ?? []);
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


  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      setPagination((prev) => ({
        ...prev,
        current_page: prev.current_page + 1,
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      setPagination((prev) => ({
        ...prev,
        current_page: prev.current_page - 1,
      }));
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
                  year={yearOptions}
                  price={priceOptions}
                  length={lengthOptions}
                  atm={atmOptions}
                  sleep={sleepOptions}
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
