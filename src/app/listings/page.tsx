 'use client';
import { useEffect, useState } from 'react';
import { fetchListings } from '../../api/listings/api'; // your custom API call
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Lisiting from './listing'
import CaravanFilter from './CaravanFilter';


interface Product {
  id: number;
  name: string;
  regular_price: string;
  sale_price?: string;
  image: string;
  link: string;
  location?: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
}


export default function ListingsPage() {
 const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);

const loadListings = async (page = 1) => {
  setLoading(true);
  try {
    const response = await fetchListings(page);

    if (response?.data?.products && response?.pagination) {
      setProducts(response.data.products);
      setPagination(response.pagination); // ✅ Use actual values from backend
    } else {
      console.warn('Unexpected response shape:', response);
      setProducts([]);
      setPagination({ current_page: 1, total_pages: 1 });
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    setProducts([]);
    setPagination({ current_page: 1, total_pages: 1 });
  } finally {
    setLoading(false);
  }
};


  console.log("Products:", products);
  useEffect(() => {
    loadListings();
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
     <section className="services section-padding pt-30 pb-30 style-1">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-12 col-md-4">
              <div className="filter">
              <CaravanFilter />
              </div>
              </div>
<Lisiting
  products={products}
  pagination={pagination}
  onNext={handleNextPage}
  onPrev={handlePrevPage}
/>          
    <div className="col-lg-3 rightbar-stick">
                </div>
          </div>
        </div>
      </div>
    </section>

    

   
  );
}


