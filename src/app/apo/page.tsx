 'use client';

import { useEffect, useState } from 'react';
import { fetchListings } from '../../api/listings/api';
import Image from 'next/image';
import Link from 'next/link';

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
    const response = await fetchListings({page});

    // ✅ Updated to match actual API structure
    if (response?.data?.products && response?.pagination) {
      setProducts(response.data.products);
      setPagination(response.pagination);
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


  useEffect(() => {
    loadListings(1);
     
  }, []);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>
        Showing page {pagination.current_page} of {pagination.total_pages}
      </h2>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={product.link}>
              <Image src={product.image} alt={product.name} width={300} height={200} />
            </Link>
            <h3>{product.name}</h3>
            <p>
              {product.sale_price ? (
                <>
                  <del>${product.regular_price}</del>{' '}
                  <strong>${product.sale_price}</strong>
                </>
              ) : (
                <strong>${product.regular_price}</strong>
              )}
            </p>
            <p>{product.location || 'Unknown Location'}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={pagination.current_page === 1} onClick={handlePrevPage}>
          Prev
        </button>
        <button disabled={pagination.current_page === pagination.total_pages} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
