"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

import { fetchListings } from "@/api/listings/api"; // adjust path if needed
import Lisiting from "../Listing";
import CaravanFilter from "../CaravanFilter";
import Footer from "../Footer";
import SkeletonListing from "@/app/components/skelton";

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
  condition?: string;
  people?: string;
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
}

export default function ListingsSlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;

  const [filters, setFilters] = useState<Filters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<MakeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    total_products: 0,
    per_page: 12,
  });

  const loadListings = async (page = 1, appliedFilters: Filters = filters) => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetchListings({ ...appliedFilters, page });

      if (response?.data?.products && response?.pagination) {
        setProducts(response.data.products);
        setCategories(response.data.all_categories);
        setMakes(response.data.make_options);
        setPageTitle(response.title ?? slug ?? "Listings");
        setPagination(response.pagination);
      } else {
        setProducts([]);
        setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setProducts([]);
      setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryFilters: Filters = {
      category: slug,
      make: searchParams.get("make") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      sleeps: searchParams.get("sleeps") ?? undefined,
      condition: searchParams.get("condition") ?? undefined,
    };

    setFilters(queryFilters);
    loadListings(1, queryFilters);
  }, [slug, searchParams.toString()]);

  const handleNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      loadListings(pagination.current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      loadListings(pagination.current_page - 1);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    loadListings(1, newFilters);
  };

  return (
    <section className="services section-padding pb-30 style-1">
      <div className="container">
        <div className="content">
          <div className="text-sm text-gray-600 header">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            &gt; <span className="font-medium text-black">Listings</span>
          </div>

          <h1 className="page-title">{pageTitle}</h1>

          <div className="row justify-content-center mt-8">
            <div className="col-lg-3 col-12 col-md-4">
              <div className="filter">
                <CaravanFilter
                  categories={categories}
                  makes={makes}
                  products={products}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {isLoading ? (
              <SkeletonListing />
            ) : (
              <Lisiting
                products={products}
                pagination={pagination}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            )}

            <div className="col-lg-3 rightbar-stick"></div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
