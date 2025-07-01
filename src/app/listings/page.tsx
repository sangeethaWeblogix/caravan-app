 "use client";
import { useEffect, useState } from "react";
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
  const [filters, setFilters] = useState<Filters>({ category, location });
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
  const [filtersReady, setFiltersReady] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    total_products: 0,
    per_page: 12,
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadListings = async (page = 1, appliedFilters: Filters = filters) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const response = await fetchListings({ ...appliedFilters, page });
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
        setIsLoading(false);
      } else {
        setProducts([]);
        setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setProducts([]);
      setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0 });
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  loadListings(pagination.current_page, filters);
}, [filters, pagination.current_page]);

  useEffect(() => {
    if (filtersReady) {
      loadListings(pagination.current_page, filters);
    }
  }, [
    filters.category,
    filters.make,
    filters.location,
    filters.condition,
    filters.sleeps,
    filters.states,
    pagination.current_page,
    filtersReady,
  ]);

const handleNextPage = () => {
  if (pagination.current_page < pagination.total_pages) {
    loadListings(pagination.current_page + 1, filters); 
  }
};

const handlePrevPage = () => {
  if (pagination.current_page > 1) {
    loadListings(pagination.current_page - 1, filters); 
  }
};


  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    loadListings(1, newFilters);
        setFiltersReady(true);

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
