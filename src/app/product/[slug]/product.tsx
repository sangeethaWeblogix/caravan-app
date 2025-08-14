"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CaravanDetailModal from "./CaravanDetailModal";
import "./product.css";
type ProductData = {
  name?: string;
  images?: string[]; // array of image URLs
  main_image?: string; // preferred main image
  location?: string;
  regular_price?: string;
  sale_price?: string;
  price_difference?: string;
  // ... add fields if you need
};
export default function ClientLogger({ data }: { data: any }) {
  const [activeImage, setActiveImage] = useState<string>("");
  console.log("slug de ", data, activeImage);
  const product = (data?.data?.product_details ?? {}) as ProductData;
  const pd = data?.data ?? {}; // full product object (top-level)
  const productDetails = pd.product_details ?? {};
  const productImage = pd.product_details.main_image ?? {};

  console.log("slug de pr", productImage);

  const images: string[] = Array.isArray(pd.images)
    ? pd.images.filter(Boolean)
    : [];
  const [activeTab, setActiveTab] = useState<"specifications" | "description">(
    "specifications"
  );
  const [showModal, setShowModal] = useState(false);
  const attributes: Array<{
    label?: string;
    value?: string;
    url?: string;
    name?: string;
    title?: string;
    val?: string;
    text?: string;
  }> = Array.isArray(productDetails.attribute_urls)
    ? productDetails.attribute_urls
    : [];

  const getAttr = (label: string) =>
    attributes.find(
      (a) => String(a?.label ?? "").toLowerCase() === label.toLowerCase()
    )?.value ?? "";
  const rawCats = Array.isArray(productDetails.categories)
    ? productDetails.categories
    : Array.isArray(pd.categories)
    ? pd.categories
    : [];

  const categoryNames: string[] = rawCats
    .map((c: any) =>
      typeof c === "string" ? c : c?.name ?? c?.label ?? c?.value
    )
    .filter(Boolean);
  const specFields = [
    { label: "Type", value: categoryNames.join(", ") || getAttr("Type") }, // 👈 from categories
    { label: "Make", value: getAttr("Make") },
    { label: "Model", value: getAttr("Model") },
    { label: "Year", value: getAttr("Years") },
    { label: "Condition", value: getAttr("Conditions") },
    { label: "Axle Configuration", value: getAttr("Sleeps") },
    { label: "Length", value: getAttr("length") },
    { label: "Extras", value: getAttr("Tare Mass") },
    { label: "Location", value: getAttr("Location") },
  ];
  const stateFields = [{ label: "Location", value: getAttr("Location") }];
  // --- helpers ---
  const parseAmount = (v: any) => {
    const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  const fmt = (n: number) =>
    n.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    });

  // --- numbers ---
  const reg = parseAmount(product.regular_price);
  const sale = parseAmount(product.sale_price);
  const hasSale = sale > 0 && reg > 0 && sale < reg;
  const save = hasSale ? reg - sale : 0;
  const isPOA = !hasSale && (reg === 0 || Number.isNaN(reg));

  useEffect(() => {
    const initial = pd.main_image || images[0] || "/images/img.png";
    setActiveImage(initial);
  }, [pd.main_image, images]);

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
              <Link
                href="#"
                onClick={handleBackClick}
                className="back_to_search back_to_search_btn"
              >
                <i className="bi bi-chevron-left fs-6"></i> Back to Search
              </Link>
              {/* Product Info */}
              <div className="product-info left-info">
                <h1 className="title">{product.name}</h1>
                <div className="contactSeller__container d-lg-none">
                  <div className="price_section">
                    <div className="price-shape">
                      <span className="current">
                        <span className="woocommerce-Price-amount amount">
                          <bdi>
                            <span className="woocommerce-Price-currencySymbol"></span>
                            {product.regular_price}
                          </bdi>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="attributes">
                  {stateFields
                    .filter((f) => f.value)
                    .map((f, index) => (
                      <h6 className="category" key={index}>
                        {f.label}- {f.value}
                      </h6>
                    ))}
                </div>
              </div>
              {/* Image Gallery */}
              <div className="caravan_slider_visible">
                <button
                  className="hover_link Click-here"
                  onClick={() => setShowModal(true)}
                ></button>
                <div className="slider_thumb_vertical image_container">
                  <div className="image_mop">
                    {[1, 2, 3, 4].map((i) => (
                      <div className="image_item" key={i}>
                        <div className="background_thumb">
                          <Image
                            src={`/images/thumb-${i}.jpg`}
                            width={128}
                            height={96}
                            alt={`Thumb ${i}`}
                          />
                        </div>
                        <div className="img">
                          <Image
                            src={`/images/thumb-${i}.jpg`}
                            width={128}
                            height={96}
                            alt={`Thumb ${i}`}
                          />
                        </div>
                      </div>
                    ))}
                    <span className="caravan__image_count">
                      <span>8+</span>
                    </span>
                  </div>
                </div>

                {/* Large Image */}
                <div className="lager_img_view image_container">
                  <div className="background_thumb">
                    <Image
                      src={productImage}
                      width={800}
                      height={600}
                      alt="Large"
                      className="img-fluid"
                    />
                  </div>
                  <a href="#">
                    <Image
                      src={productImage}
                      width={800}
                      height={600}
                      alt="Large"
                      className="img-fluid"
                    />
                  </a>
                </div>
              </div>
              {/* Tabs */}
              <section className="product-details">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "specifications" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("specifications")}
                    >
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "description" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      Description
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {activeTab === "specifications" && (
                    <div className="tab-pane fade show active">
                      <div className="content-info text-center pb-0">
                        <div className="additional-info">
                          <ul>
                            {specFields
                              .filter((f) => f.value)
                              .map((f, i) => (
                                <li key={i}>
                                  <strong>{f.label}:</strong> {f.value}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "description" && (
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
                    <p>
                      We help you get superior service, guaranteed deals, and
                      access to top manufacturers.
                    </p>
                  </div>
                  <div className="card_flex d-flex flex-wrap">
                    {[
                      {
                        img: "low-price",
                        text: "Get exclusive deals from top caravan manufacturers.",
                      },
                      {
                        img: "deal",
                        text: "Our expert team sources deals from across the market.",
                      },
                      {
                        img: "special_deal",
                        text: "Access insights and hidden gems in the industry.",
                      },
                    ].map((item, i) => (
                      <div className="commun-card" key={i}>
                        <div className="icon">
                          <Image
                            src={`/images/${item.img}.svg`}
                            alt={item.img}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="inf">
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="contact_dealer mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowModal(true)}
                    >
                      Contact D
                    </button>
                  </div>
                </div>
              </section>
              {/* Mobile Bottom Bar */}
              <div className="fixed-bottom-bar d-lg-none">
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => setShowModal(true)}
                >
                  Send Enquiry
                </button>
                <p className="terms_text small">
                  By clicking &apos;Send Enquiry&apos;, you agree to our
                  <Link href="/privacy-collection-statement">
                    {" "}
                    Collection Statement
                  </Link>
                  , <Link href="/privacy-policy">Privacy Policy</Link>, and{" "}
                  <Link href="/terms-conditions">Terms and Conditions</Link>.
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-xl-4 col-lg-4 d-none d-lg-block">
              <div
                className="product-info-sidebar sticky-top"
                style={{ top: "80px" }}
              >
                <div className="contactSeller__container">
                  <div
                    className="price_section"
                    style={{
                      boxShadow: "0px 4px 15px #0000000d",
                      display: "block",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div className="divide-2">
                      <div className="price_section border-0">
                        <div className="price-shape">
                          <span className="current">
                            <div>
                              <div className="price-card">
                                <div className="price-card__left">
                                  {isPOA ? (
                                    <div className="price-card__sale">POA</div>
                                  ) : hasSale ? (
                                    <>
                                      <div className="price-card__sale">
                                        {fmt(sale)}
                                      </div>
                                      <div className="price-card__regular">
                                        <s>{fmt(reg)}</s>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="price-card__sale">
                                      {fmt(reg)}
                                    </div>
                                  )}
                                </div>

                                {hasSale && (
                                  <>
                                    <div className="price-card__divider" />
                                    <div className="price-card__save">
                                      <div className="price-card__saveLabel">
                                        Save
                                      </div>
                                      <div className="price-card__saveValue">
                                        {fmt(save)}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="contact_dealer mt-2">
                      <button
                        className="btn btn-primary "
                        onClick={() => setShowModal(true)}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <CaravanDetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
