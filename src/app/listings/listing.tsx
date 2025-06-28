"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./listings.css";

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
  per_page: number;
  total_products: number; // ✅ match your API key
  total_pages: number;
}

interface Props {
  products: Product[];
  pagination: Pagination;
  onNext: () => void;
  onPrev: () => void;
}

export default function ListingContent({
  products,
  pagination,
  onNext,
  onPrev,
}: Props) {
  return (
    <div className="col-lg-6 col-md-8">
      <div className="top-filter mb-10">
        <div className="row align-items-center">
          <div className="col-lg-6"><p className="show_count">
  Showing {(pagination.current_page - 1) * pagination.per_page + 1}
  –
  {Math.min(pagination.current_page * pagination.per_page, pagination.total_products)}
  of {pagination.total_products} results
</p>

           </div>
          <div className="col-4 d-lg-none d-md-none">
            <button className="mobile_fltn navbar-toggler mytogglebutton">
              <i className="bi bi-search" /> &nbsp;Filter
            </button>
          </div>
          <div className="col-lg-6 col-8">
            <div className="r-side">
              <form className="woocommerce-ordering" method="get">
                <div className="form-group shot-buy">
                  <select
                    name="orderby"
                    className="orderby form-select"
                    aria-label="Shop order"
                  >
                    <option value="featured">Featured</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="year-desc">Year Made (High to Low)</option>
                    <option value="year-asc">Year Made (Low to High)</option>
                  </select>
                  <input type="hidden" name="paged" value="1" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="dealers-section product-type">
        {products.map((product) => (
          <article
            className="vehicleSearch html general null pro"
            key={product.id}
          >
            <div className="vehicleSearch__column-poster">
              <Link href={product.link}>
                <div>
                  <Swiper
                    navigation
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <div className="swiper-zoom-container">
  
                      <Image
                        src="/images/img.png"
                        alt={product.name}
                        width={1593}
                        height={1195}
                      />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </Link>
              <div className="vehicleThumbDetails">
                <div className="title">
                  <Link href={product.link}>
                    <h3 className="woocommerce-loop-product__title">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <ul className="vehicleDetailsWithIcons simple">
                  {(product.categories || []).map((tag, i) => (
                    <li key={i}>
                      <span className="attribute3">{tag}</span>
                    </li>
                  ))}
                  {product.length && (
                    <li>
                      <span className="attribute3">{product.length}</span>
                    </li>
                  )}

                  {product.kg && (
                    <li>
                      <span className="attribute3">{product.kg}</span>
                    </li>
                  )}
                </ul>

                <div className="vehicleThumbDetails__part">
                  <div className="price">
                    <div className="vehicleThumbDetails__part__price">
                      {product.sale_price ? (
                        <>
                          <del>
                            <span className="woocommerce-Price-amount old-price amount">
                              <bdi>{product.regular_price}</bdi>
                            </span>
                          </del>
                          <ins>
                            <span className="woocommerce-Price-amount amount">
                              <bdi>{product.sale_price}</bdi>
                            </span>
                          </ins>
                        </>
                      ) : (
                        <span className="woocommerce-Price-amount amount">
                          <bdi>{product.regular_price}</bdi>
                        </span>
                      )}
                    </div>
                    {product.price_difference ? (
                      <div className="vehicleThumbDetails__part__finance">
                        <span className="n_price">
                          <small>Save</small>
                          <span>{product.price_difference}</span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="vehicleThumbDetails__features__address">
                    <label>Seller Location</label>
                    <h3>{product.location}</h3>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-wrapper mt-4">
        <nav className="woocommerce-pagination custom-pagination mt-4">
          <ul className="pagination-icons">
            <li className="">
              <span>
                <button
                  onClick={onPrev}
                  disabled={pagination.current_page === 1}
                  className="prev-icon"
                >
                  Back
                </button>
              </span>
            </li>
            <li className="page-count"> page {pagination.current_page} of {pagination.total_pages}  
           </li>
            <li className="">
              <button
              className="next-icon"
                onClick={onNext}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
