'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CaravanDetailModal from './CaravanDetailModal';
import './product.css';

export default function CaravanDetail() {
  const [activeTab, setActiveTab] = useState<'specifications' | 'description'>('specifications');
  const [showModal, setShowModal] = useState(false);

  const handleBackClick = (e: React.MouseEvent) => {
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
              {/* Back Button */}
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
              
              {/* Image Gallery */}
              <div className="caravan_slider_visible">
                <button className="hover_link Click-here" onClick={() => setShowModal(true)}></button>
                <div className="slider_thumb_vertical image_container">
                  <div className="image_mop">
                    {[1, 2, 3, 4].map((i) => (
                      <div className="image_item" key={i}>
                        <div className="background_thumb">
                          <Image src={`/images/thumb-${i}.jpg`} width={128} height={96} alt={`Thumb ${i}`} />
                        </div>
                        <div className="img">
                          <Image src={`/images/thumb-${i}.jpg`} width={128} height={96} alt={`Thumb ${i}`} />
                        </div>
                      </div>
                    ))}
                    <span className="caravan__image_count"><span>8+</span></span>
                  </div>
                </div>

                {/* Large Image */}
                <div className="lager_img_view image_container">
                  <div className="background_thumb">
                    <Image src="/images/large.jpg" width={800} height={600} alt="Large" className="img-fluid" />
                  </div>
                  <a href="#">
                    <Image src="/images/large.jpg" width={800} height={600} alt="Large" className="img-fluid" />
                  </a>
                </div>
              </div>

              {/* Tabs */}
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
                      <div className="content-info text-center pb-0">
                        <div className="additional-info">
                      <ul>
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

              {/* Community Section */}
              <section className="community product_dt_lower style-5 pt-4">
                <div className="content">
                  <div className="heading">
                    <h3>Caravan Marketplace Advantage</h3>
                    <p>We help you get superior service, guaranteed deals, and access to top manufacturers.</p>
                  </div>
                  <div className="card_flex d-flex flex-wrap">
                    {[
                      { img: 'low-price', text: 'Get exclusive deals from top caravan manufacturers.' },
                      { img: 'deal', text: 'Our expert team sources deals from across the market.' },
                      { img: 'special_deal', text: 'Access insights and hidden gems in the industry.' }
                    ].map((item, i) => (
                      <div className="commun-card" key={i}>
                        <div className="icon">
                          <Image src={`/images/${item.img}.svg`} alt={item.img} width={32} height={32} />
                        </div>
                        <div className="inf">
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="contact_dealer mt-3">
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>Contact Dealer</button>
                  </div>
                </div>
              </section>

              {/* Mobile Bottom Bar */}
              <div className="fixed-bottom-bar d-lg-none">
                <button className="btn btn-primary w-100 mb-2" onClick={() => setShowModal(true)}>Send Enquiry</button>
                <p className="terms_text small">
                  By clicking 'Send Enquiry', you agree to our
                  <Link href="/privacy-collection-statement"> Collection Statement</Link>,{' '}
                  <Link href="/privacy-policy">Privacy Policy</Link>, and{' '}
                  <Link href="/terms-conditions">Terms and Conditions</Link>.
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-xl-4 col-lg-4 d-none d-lg-block">
              <div className="product-info-sidebar sticky-top" style={{ top: '80px' }}>
                <div className="contactSeller__container">
                  <div className="price_section" style={{ boxShadow: '0px 4px 15px #0000000d', display: 'block', border: '1px solid #ddd' }}>
                    <div className="divide-2">
                      <div className="price_section border-0">
                    <div className="price-shape">
                      <span className="current">
                        <span className="woocommerce-Price-amount amount">
                          <bdi><span className="woocommerce-Price-currencySymbol">$</span>89,990</bdi>
                        </span>
                      </span>
                    </div>
                    </div>
                    </div>
                    <div className="contact_dealer mt-2">
                      <button className="btn btn-primary " onClick={() => setShowModal(true)}>Contact Dealer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <CaravanDetailModal isOpen={showModal} onClose={() => setShowModal(false)} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
