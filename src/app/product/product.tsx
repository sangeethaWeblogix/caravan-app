'use client';

import './product.css'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CaravanDetail() {
  const [activeTab, setActiveTab] = useState('specifications');

  const handleBackClick = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <section className="product caravan_dtt">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            {/* Left Column */}
            <div className="col-xl-8 col-lg-8 col-md-12">
              {/* Back Buttons */}
              <Link href="#" onClick={handleBackClick} className="back_to_search back_to_search_btn">
                <i className="bi bi-chevron-left fs-6"></i> Back to Search
              </Link>
              

              {/* Product Info */}
              <div className="product-info left-info">
                <h1 className="title">2022 Aura Allion 19′ Touring 2 Berth with Shower and Toilet</h1>
                <div className="contactSeller__container d-lg-none">
                  <div className="price_section">
                    <div className="price-shape">
                      <span className="current">
                        <span className="woocommerce-Price-amount amount">
                          <bdi>
                            <span className="woocommerce-Price-currencySymbol">$</span>59,990
                          </bdi>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="attributes">
                  <h6 className="category">Location - South Australia</h6>
                </div>
              </div>

              {/* Image Gallery (Thumbnails can be made interactive with Swiper or similar later) */}
              <div className="caravan_slider_visible">
                
                  <div className="slider_thumb_vertical image_container">
                    <div className="image_mop">
                    {/* Thumbnails */}
                    {[1, 2, 3, 4].map((i) => (
                      <div className="image_item" key={i}>
                        <div className="background_thumb">
                          <Image
                            src={`/images/thumb-${i}.jpg`} // replace with dynamic path
                            width={128}
                            height={96}
                            alt={`Thumbnail ${i}`}
                          />
                        </div>
                        <div className="img">
                          <Image
                            src={`/images/thumb-${i}.jpg`} // replace with dynamic path
                            width={128}
                            height={96}
                            alt={`Thumbnail ${i}`}
                          />
                        </div>
                      </div>
                    ))}
                    <span className="caravan__image_count"><span>8+</span></span>
                    </div>
                  </div>
                  {/* Large Image */}
                  <div className="lager_img_view image_container">
                    <div className="background_thumb">
<Image
                      src="/images/large.jpg"
                      width={800}
                      height={600}
                      alt="Large Image"
                      className="img-fluid"
                    />
                    </div>
                    <a href=''>
                    <Image
                      src="/images/large.jpg"
                      width={800}
                      height={600}
                      alt="Large Image"
                      className="img-fluid"
                    />
                    </a>
                  </div>
                
              </div>

              {/* Product Tabs */}
              <section className="product-details">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('specifications')}
                    >
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                      onClick={() => setActiveTab('description')}
                    >
                      Description
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {activeTab === 'specifications' && (
                    <div className="tab-pane fade show active">
                      <div className="additional-info">
                      <ul className="list-unstyled text-start">
                        <li><strong>Type:</strong> Touring</li>
                        <li><strong>Make:</strong> Aura</li>
                        <li><strong>Year:</strong> 2022</li>
                        <li><strong>Model:</strong> Allion</li>
                        <li><strong>Condition:</strong> Used</li>
                        <li><strong>Length:</strong> 19 ft</li>
                        <li><strong>Sleep:</strong> 2 people</li>
                        <li><strong>ATM:</strong> 2705 Kg</li>
                        <li><strong>Tare Mass:</strong> 2255 Kg</li>
                        <li><strong>Ball Weight:</strong> 185 Kg</li>
                        <li><strong>Location:</strong> South Australia</li>
                      </ul>
                      </div>
                    </div>
                  )}
                  {activeTab === 'description' && (
                    <div className="tab-pane fade show active">
                      <p>LOCATED AT 1 PINN STREET ST MARYS</p>
                      <p>(08) *****4388</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Bottom Banner Section */}
              <section className="community product_dt_lower style-5 pt-4">
                <div className="content">
                <div className="heading">
                  <h3>Caravan Marketplace Advantage</h3>
                  <p>As Australia's new comprehensive caravan listing site, our site helps you get superior service, guaranteed deals and the best shot at a great price from top quality manufacturers.</p>
                </div>
                <div className="card_flex d-flex flex-wrap">
                  <div className="commun-card">
                    <div className="icon"><img src="/images/low-price.svg" alt="price" /></div>
                    <div className="inf"><p>Help potential buyers every month get exclusive deals from quality caravan manufactuers</p></div>
                  </div>
                  <div className="commun-card">
                    <div className="icon"><img src="/images/deal.svg" alt="deal" /></div>
                    <div className="inf"><p>Our expert team is looking for deals from multiple caravan manufacturer to showcase them if and when available</p></div>
                  </div>
                  <div className="commun-card">
                    <div className="icon"><img src="/images/special_deal.svg" alt="special" /></div>
                    <div className="inf"><p>Provide valuable resources & insights about the industry including the best caravans in every category that you may not have heard of.</p></div>
                  </div>
                </div>
                <div className="contact_dealer mt-3">
                  <a href="javascript:void(0);" className="btn btn-primary">Contact Dealer</a>
                </div>
                </div>
              </section>

              {/* Mobile Bottom Bar */}
              <div className="fixed-bottom-bar d-lg-none">
                <a className="btn btn-primary w-100 mb-2" href="#">Send Enquiry</a>
                <p className="terms_text small">
                  By clicking 'Send Enquiry', you agree to our <Link href="/privacy-collection-statement">Collection Statement</Link>, <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-conditions">Terms and Conditions</Link>.
                </p>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="col-xl-4 col-lg-4 d-none d-lg-block">
              <div className="product-info-sidebar sticky-top" style={{ top: '80px' }}>
                <div className="contactSeller__container">
                  <div className="internalContainer">
                <div className="price_section" style={{
    boxShadow: '0px 4px 15px #0000000d',
    border: '1px solid #ddd',
    display: 'block',
  }} >
                        <div className="divide-2">
                          <div className="price_section border-0">
                            <div className="price-shape">
                              <span className="current">
                                <span className="woocommerce-Price-amount amount">
                                  <bdi>
                                    <span className="woocommerce-Price-currencySymbol">&#36;</span>89,990 </bdi>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="contact_dealer">
                          <a className="modal-open" data-modal="modal-1" href="javascript:void(0);">Contact Dealer</a>
                        </div>
                      </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
