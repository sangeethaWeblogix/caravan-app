"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./popup.css";

const CaravanDetailModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="custom-model-main carava_details show">
      <div className="custom-model-inner">
        <div className="close-btn" onClick={onClose}>
          ×
        </div>
        <div className="custom-model-wrap">
          <div className="pop-up-content-wrap">
            <div className="container">
              <div className="row">
                {/* Left Content */}
                <div className="col-lg-9">
                  <div className="pop-top">
                    <h3>
                      2024 Everest Alpine Freestyle 18′6 Full Off Road Slideouts
                      with Ensuite
                    </h3>
                    <div className="vehicleThumbDetails__part__price pop_up_price">
                      <span>
                        <span className="woocommerce-Price-amount amount">
                          <bdi>
                            <span className="woocommerce-Price-currencySymbol"></span>
                            89,990
                          </bdi>
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="single-product-slider">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      loop
                    >
                      {[
                        "3061-41-maini.png",
                        "3061-2-subi.png",
                        "3061-3-subi.jpg",
                        "3061-4-subi.jpg",
                        "3061-5-subi.jpg",
                      ].map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={`https://www.caravansforsale.com.au/wp-content/uploads/2024/07/2024-everest-18-6-alpine-freestyle-new-full-off-road-caravan-straight-lounge-${img}`}
                            alt={`Slide ${idx + 1}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                {/* Right Content - Enquiry Form */}
                <div className="col-lg-3">
                  <div className="sidebar-enquiry">
                    <form className="wpcf7-form" noValidate>
                      <div className="form">
                        <h4>Contact Dealer</h4>

                        {["name", "email", "phone", "postcode"].map((field) => (
                          <div className="form-item" key={field}>
                            <p>
                              <input
                                id={`enquiry2-${field}`}
                                name={`enquiry2-${field}`}
                                type={field === "email" ? "email" : "text"}
                                className="wpcf7-form-control"
                                required
                              />
                              <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </label>
                            </p>
                          </div>
                        ))}

                        <p className="terms_text">
                          By clicking &apos;Send Enquiry&apos;, you agree to
                          Caravan Marketplace{" "}
                          <a
                            href="/privacy-collection-statement"
                            target="_blank"
                          >
                            Collection Statement
                          </a>
                          ,{" "}
                          <a href="/privacy-policy" target="_blank">
                            Privacy Policy
                          </a>{" "}
                          and{" "}
                          <a href="/terms-conditions" target="_blank">
                            Terms and Conditions
                          </a>
                          .
                        </p>

                        <div className="submit-btn">
                          <button type="button" className="btn btn-primary">
                            Send Enquiry
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-overlay" onClick={onClose}></div>
    </div>
  );
};

export default CaravanDetailModal;
