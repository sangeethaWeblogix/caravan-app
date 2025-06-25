'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Sample data
const caravans = [
  {
    title: "2024 Masterpiece Performance 20'6 Full Off Road Luxury",
    href: "/product/2024-masterpiece-performance-20-6-full-off-road-luxury/",
    img: ["/images/sample1.webp"],
    tags: ['New', '20.6 ft'],
    price: 'POA',
    location: 'South Australia',
    exclusive: false,
  },
  {
    title: "2024 Paramount Signature 19'6 Family with Toilet and Shower - Tandem Axle",
    href: "/product/2024-paramount-signature-19-6-family-with-toilet-and-shower-tandem-axle/",
    img: ["/images/sample2.jpg"],
    tags: ['New', 'Family', '2 people', '19.6 ft', '3500 Kg'],
    price: '$81,990',
    oldPrice: '$85,990',
    save: '$4,000',
    location: 'Victoria',
    exclusive: false,
  },
  {
    title: "2023 Regent Cruiser 21'6 Off Road Couples with Ensuite - Club Lounge",
    href: "/product/2023-regent-cruiser-21-6-off-road-couples-with-ensuite-club-lounge/",
    img: ["/images/sample3.jpg"],
    tags: ['New', '3500 Kg'],
    price: '$89,990',
    location: 'Queensland',
    exclusive: false,
  },
]

const CaravanListingSection = () => {
  return (
    
            <div className="col-lg-6 col-md-8">
              {/* Top filter bar */}
              <div className="top-filter mb-10">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <p className="show_count">Showing 1–12 of 6585 results</p>
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
                          <select name="orderby" className="orderby form-select" aria-label="Shop order">
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

              {/* Caravan listings */}
              <div className="dealers-section product-type">
                {caravans.map((caravan, index) => (
                  <article className="vehicleSearch html general null pro" key={index}>
                    <div className="vehicleSearch__column-poster">
                      <Link href={caravan.href}>
                        <div>
                          <Swiper
                            navigation
                            modules={[Navigation]}
                            className="mySwiper"
                          >
                            {caravan.img.map((imgSrc, i) => (
                              <SwiperSlide key={`slide-${index}-${i}`}>
                                <div className="swiper-zoom-container">
                                  <Image
                                    src={imgSrc}
                                    alt={caravan.title}
                                    width={1593}
                                    height={1195}
                                    className="attachment-woocommerce_thumbnail"
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </Link>
                      <div className="vehicleThumbDetails">
                        <div className="title">
                          <Link href={caravan.href}>
                            <h3 className="woocommerce-loop-product__title">{caravan.title}</h3>
                          </Link>
                        </div>
                        <ul className="vehicleDetailsWithIcons simple">
                          {caravan.tags.map((tag, i) => (
                            <li key={i}>
                              <span className="attribute3">{tag}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="vehicleThumbDetails__part">
                          <div className="price">
                            <div className="vehicleThumbDetails__part__price">
                              {caravan.oldPrice ? (
                                <>
                                  <del>
                                    <span className="woocommerce-Price-amount old-price amount">
                                      <bdi>{caravan.oldPrice}</bdi>
                                    </span>
                                  </del>
                                  <ins>
                                    <span className="woocommerce-Price-amount amount">
                                      <bdi>{caravan.price}</bdi>
                                    </span>
                                  </ins>
                                </>
                              ) : (
                                <span className="woocommerce-Price-amount amount">
                                  <bdi>{caravan.price}</bdi>
                                </span>
                              )}
                            </div>
                            {caravan.save && (
                              <div className="vehicleThumbDetails__part__finance">
                                <span className="n_price">
                                  <small>Save</small>
                                  <span>{caravan.save}</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="vehicleThumbDetails__features__address">
                            <label>Seller Location</label>
                            <h3>{caravan.location}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination inside container */}
              <div className="pagination-wrapper mt-4">
                <Pagination />
              </div>
            </div>
            
  )
}

// Dummy Pagination component for now
const Pagination = () => (
  <nav className="woocommerce-pagination custom-pagination mt-4">
    <ul className="pagination-icons">
      <li className="prev-page disabled">
        <span className="disabled-link">
          <span className="prev-icon">Back</span>
        </span>
      </li>
      <li className="page-count"> Page 1 of 549 </li>
      <li className="next-page">
        <Link href="/listings/page/2">
          <span className="next-icon">Next</span>
        </Link>
      </li>
    </ul>
  </nav>
)

export default CaravanListingSection
