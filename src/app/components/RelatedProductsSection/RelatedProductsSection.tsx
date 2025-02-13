import React from'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import { Navigation, Grid, Autoplay } from "swiper/modules";
import Link from 'next/link';

const RelatedProductsSection: React.FC<{ title: string; products: any[] }> = ({ title, products }) => {
  return (
    // <section className="related-products section-padding">
    //   <div className="container">
    //     <div className="title">
    //       <div className="tpof_tab">
    //         <h2>{title}</h2>
    //         <div className="viewall_bttn">
    //           <a href="">
    //             <i className="bi bi-chevron-right"></i>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //     <Swiper
    //       modules={[Grid, Navigation]}
    //       spaceBetween={30}
    //       slidesPerView={4} // Number of columns
    //       navigation
    //       grid={{ rows: 2, fill: "row" }} // Enables two-row layout
    //       breakpoints={{
    //         640: { slidesPerView: 2 },
    //         768: { slidesPerView: 3 },
    //         1024: { slidesPerView: 4 },
    //       }}
    //     >
    //       {products.map((product, index) => (
    //         <SwiperSlide key={index}>
    //           <a href={product.url} className="mb-3">
    //             <div className="product-card">
    //               <div className="img">
    //                 <img src={product.image} alt={product.title} decoding="async" />
    //               </div>
    //               <div className="product_de">
    //                 <div className="info">
    //                   <h6 className="category">
    //                     <i className="far fa-map-marker-alt"></i>
    //                     <span>{product.region}</span>
    //                   </h6>
    //                   <h3 className="title">{product.title}</h3>
    //                 </div>
    //                 <div className="price">
    //                   {product.price.ins ? (
    //                     <>
    //                       <del>
    //                         <span className="woocommerce-Price-amount amount">
    //                           <bdi>
    //                             <span className="woocommerce-Price-currencySymbol">&#36;</span>
    //                             {product.price.del}
    //                           </bdi>
    //                         </span>
    //                       </del>
    //                       <ins>
    //                         <span className="woocommerce-Price-amount amount">
    //                           <bdi>
    //                             <span className="woocommerce-Price-currencySymbol">&#36;</span>
    //                             {product.price.ins}
    //                           </bdi>
    //                         </span>
    //                       </ins>
    //                     </>
    //                   ) : (
    //                     <span className="woocommerce-Price-amount amount">
    //                       <bdi>
    //                         <span className="woocommerce-Price-currencySymbol">&#36;</span>
    //                         {product.price.del}
    //                       </bdi>
    //                     </span>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           </a>
    //         </SwiperSlide>
    //       ))}
    //     </Swiper>
    //   </div>
    // </section> 
    <section className="related-products section-padding">
      <div className="container">
        <div className="title">
          <div className="tpof_tab">
            <h2>Featured Caravans For Sale</h2>
            <div className="viewall_bttn">
              <a href="">
                <i className="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Grid, Autoplay]}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          grid={{ rows: 2, fill: "row" }}
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <Link href={`/product/${item.slug}`} className="mb-3">
                <div className="product-card">
                  <div className="img">
                    {/* <img src={item.img} alt={item.title} decoding="async" /> */}
                    <img src='https://www.caravansforsale.com.au/wp-content/uploads/2025/01/Avan-Caravans-Review-Features-Models-and-Pricing-Guide-mob.jpg' alt={item.title} decoding="async" />

                  </div>
                  <div className="product_de">
                    <div className="info">
                      <h6 className="category">
                        <i className="far fa-map-marker-alt"></i>
                        <span>{' '}{item.region}</span>
                      </h6>
                      <h3 className="title">{item.title}</h3>
                    </div>
                    <div className="price">
                      {item.price.ins ? (
                        <>
                          <del>
                            <span className="woocommerce-Price-amount amount">
                              <bdi>
                                <span className="woocommerce-Price-currencySymbol">&#36;</span>
                                {item.price.del}
                              </bdi>
                            </span>
                          </del>
                          <ins>
                            <span className="woocommerce-Price-amount amount">
                              <bdi>
                                <span className="woocommerce-Price-currencySymbol">&#36;</span>
                                {item.price.ins}
                              </bdi>
                            </span>
                          </ins>
                        </>
                      ) : (
                        <span className="woocommerce-Price-amount amount">
                          <bdi>
                            <span className="woocommerce-Price-currencySymbol">&#36;</span>
                            {item.price.del}
                          </bdi>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
