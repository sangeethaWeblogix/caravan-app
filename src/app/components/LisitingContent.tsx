"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../listings/listings.css";
import Head from "next/head";

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
  condition: string;
  location?: string;
  categories?: string[];
  people?: string;
  make?: string;
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
  metaTitle: string; // Add metaTitle prop
  metaDescription: string; // Add metaDescription prop
}

export default function ListingContent({
  products,
  pagination,
  onNext,
  onPrev,
  metaTitle,
  metaDescription,
}: Props) {
  console.log("metaa", metaTitle);

  return (
    <>
      <Head>
        <title>{metaTitle}</title> {/* Dynamically set title */}
        <meta name="description" content={metaDescription} />{" "}
        {/* Dynamically set description */}
      </Head>
      <div className="col-lg-6 col-md-8">
        <div className="top-filter mb-10">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <p className="show_count">
                Showing{" "}
                {(pagination.current_page - 1) * pagination.per_page + 1}–
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total_products
                )}
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
          {products?.map((product) => (
            <article
              className="vehicleSearch html general null pro"
              key={product.id}
            >
              <div className="vehicleSearch__column-poster">
                {product.link ? (
                  <Link href={product.link}>
                    <div>
                      <Swiper
                        navigation
                        modules={[Navigation]}
                        className="mySwiper"
                      >
                        <SwiperSlide>
                          <div className="swiper-zoom-container">
                            {product.image && product.image.trim() !== "" ? (
                              <Image
                                src={product.image}
                                alt="Caravan"
                                width={1593}
                                height={1195}
                              />
                            ) : (
                              <Image
                                src="/images/img.png"
                                alt="Fallback Caravan"
                                width={1593}
                                height={1195}
                              />
                            )}
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </div>
                  </Link>
                ) : (
                  <div className="swiper-zoom-container">
                    {product.image && product.image.trim() !== "" ? (
                      <Image
                        src={product.image}
                        alt="Caravan"
                        width={1593}
                        height={1195}
                      />
                    ) : (
                      <Image
                        src="/images/img.png"
                        alt="Fallback Caravan"
                        width={1593}
                        height={1195}
                      />
                    )}
                  </div>
                )}

                <div className="vehicleThumbDetails">
                  <div className="title">
                    {product.link ? (
                      <Link href={product.link}>
                        <h3 className="woocommerce-loop-product__title">
                          {product.name}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className="woocommerce-loop-product__title">
                        {product.name}
                      </h3>
                    )}
                  </div>
                  <ul className="vehicleDetailsWithIcons simple">
                    {product.condition && (
                      <li>
                        <span className="attribute3">{product.condition}</span>
                      </li>
                    )}

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

                    {product.people && (
                      <li>
                        <span className="attribute3">{product.people}</span>
                      </li>
                    )}
                    {product.make && (
                      <li>
                        <span className="attribute3">{product.make}</span>
                      </li>
                    )}
                  </ul>

                  <div className="vehicleThumbDetails__part">
                    <div className="price">
                      <div className="vehicleThumbDetails__part__price">
                        {/* If regular price is 0, show POA */}
                        {parseFloat(product.regular_price) === 0 ? (
                          <span className="woocommerce-Price-amount amount">
                            <bdi>POA</bdi>
                          </span>
                        ) : product.sale_price ? (
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

                      {(() => {
                        const cleaned = (
                          product.price_difference || ""
                        ).replace(/[^0-9.]/g, "");
                        const numericValue = parseFloat(cleaned);
                        return numericValue > 0 ? (
                          <div className="vehicleThumbDetails__part__finance">
                            <span className="n_price">
                              <small>Save</small>
                              <span>{product.price_difference}</span>
                            </span>
                          </div>
                        ) : null;
                      })()}
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
              <li className="page-count">
                {" "}
                page {pagination.current_page} of {pagination.total_pages}
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
    </>
  );
}
