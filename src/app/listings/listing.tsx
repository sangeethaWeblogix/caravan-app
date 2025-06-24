 'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
interface Props {
  products: Product[];
  pagination: Pagination;
  onNext: () => void;
  onPrev: () => void;
}

export default function ListingContent({ products, pagination, onNext, onPrev }: Props) {
  return (
    <div className="col-lg-6 col-md-8">
      <div className="top-filter mb-10">
        <p>Showing page {pagination.current_page} of {pagination.total_pages}</p>
      </div>

      <div className="dealers-section product-type">
        {products.map(product => (
          <article key={product.id} className="vehicleSearch">
            <div className="vehicleSearch__column-poster">
              <Link href={product.link}>
                <Swiper navigation modules={[Navigation]} className="mySwiper">
                  <SwiperSlide>
                   <Image src="/images/img.png" alt={product.name} width={600} height={400} />

                  </SwiperSlide>
                </Swiper>
              </Link>
              <div className="vehicleThumbDetails">
                <h3><Link href={product.link}>{product.name}</Link></h3>
                <div className="price">
                  {product.sale_price ? (
                    <>
                      <del>${product.regular_price}</del>
                      <ins>${product.sale_price}</ins>
                    </>
                  ) : (
                    <span>${product.regular_price}</span>
                  )}
                </div>
                <h3>{product.location || 'N/A'}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-wrapper mt-4">
        <nav>
          <button onClick={onPrev} disabled={pagination.current_page === 1}>Prev</button>
          <span>Page {pagination.current_page}</span>
          <button onClick={onNext} disabled={pagination.current_page === pagination.total_pages}>Next</button>
        </nav>
      </div>
    </div>
  );
}
