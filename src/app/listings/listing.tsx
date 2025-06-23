 'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface product {
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
  products: product[];
  pagination: Pagination;
  onNext: () => void;
  onPrev: () => void;
}

export default function ListingContent({ products, pagination, onNext, onPrev }: Props) {
  return (
    <div className="col-lg-6 col-md-8">
      <div className="top-filter mb-10">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <p className="show_count">
              Showing page {pagination.current_page} of {pagination.total_pages}
            </p>
          </div>
        </div>
      </div>

      <div className="dealers-section product-type">
        {products.map((product) => (
          <article className="vehicleSearch" key={product.id}>
            <div className="vehicleSearch__column-poster">
              <Link href={product.link}>
                <div>
                  <Swiper navigation modules={[Navigation]} className="mySwiper">
                    <SwiperSlide>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="attachment-woocommerce_thumbnail"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </Link>
              <div className="vehicleThumbDetails">
                <div className="title">
                  <Link href={product.link}>
                    <h3>{product.name}</h3>
                  </Link>
                </div>
                <div className="price">
                  {product.sale_price ? (
                    <>
                      <del>{product.regular_price}</del>
                      <ins>{product.sale_price}</ins>
                    </>
                  ) : (
                    <span>{product.regular_price}</span>
                  )}
                </div>
                <div className="vehicleThumbDetails__features__address">
                  <label>Seller Location</label>
                  <h3>{product.location || 'N/A'}</h3>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-wrapper mt-4">
        <PaginationComponent
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>
    </div>
  );
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}) => (
  <nav className="woocommerce-pagination custom-pagination mt-4">
    <ul className="pagination-icons">
      <li className={`prev-page ${currentPage === 1 ? 'disabled' : ''}`}>
        <button onClick={onPrev} disabled={currentPage === 1}>
          Back
        </button>
      </li>
      <li className="page-count">
        Page {currentPage} of {totalPages}
      </li>
      <li className={`next-page ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button onClick={onNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </li>
    </ul>
  </nav>
);
