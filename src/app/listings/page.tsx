  'use client';
import { useEffect, useState } from 'react';
import { fetchListings } from '../../api/listings/api'; // your custom API call
 import Link from 'next/link';
 import 'swiper/css';
import 'swiper/css/navigation';
import Lisiting from './listing'
import CaravanFilter from './CaravanFilter';
import SkeletonListing from '../components/skelton'


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


export default function ListingsPage() {
 const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
        total_items: 0,
        total_products: 0,
        per_page: 12
  });
  const [loading, setLoading] = useState(true);

const loadListings = async (page = 1) => {
    setIsLoading(true);
     window.scrollTo({
    top: 0,
    behavior: 'smooth', // or 'auto' if you prefer instant scroll
  });
      try {
    const response = await fetchListings(page);

    if (response?.data?.products && response?.pagination) {
      setProducts(response.data.products);
      setPagination(response.pagination); 
          setIsLoading(false);// ✅ Use actual values from backend
    } else {
      console.warn('Unexpected response shape:', response);
      setProducts([]);
      setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0 });
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    setProducts([]);
    setPagination({ current_page: 1, total_pages: 1, per_page: 12, total_products: 0});
  } finally {
    setLoading(false);
  }
};


   useEffect(() => {
    loadListings(1);
  }, []);

  if (loading) return <p>Loading...</p>;

const handleNextPage = () => {
  if (pagination.current_page < pagination.total_pages) {
    loadListings(pagination.current_page + 1); // ✅ That’s it
  }
};

const handlePrevPage = () => {
  if (pagination.current_page > 1) {
    loadListings(pagination.current_page - 1);
  }
};



  return (
     <section className="services section-padding pb-30 style-1">
      <div className="container">
        <div className="content">
 <div className="text-sm text-gray-600 header">
            <Link href="/" className="hover:underline">Home</Link> &gt; <span className="font-medium text-black">Listings</span>
          </div>
            
            <h1 className="page-title">

            {pagination.total_items ?? 6585} Caravans For Sale in Australia
          </h1>
                    <div className="row justify-content-center mt-8">
            <div className="col-lg-3 col-12 col-md-4">
              <div className="filter">
              <CaravanFilter />
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
    <div className="col-lg-3 rightbar-stick">
                </div>
          </div>
        </div>
      </div>
    </section>

    

   
  );
}


