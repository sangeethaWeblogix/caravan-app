"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CaravanDetailModal from "./CaravanDetailModal";
import "./product.css";

type Attribute = {
  label?: string;
  value?: string;
  url?: string;
  name?: string;
  title?: string;
  val?: string;
  text?: string;
};

type Category = { name?: string; label?: string; value?: string } | string;
interface ApiData {
  product_details?: ProductData;
  main_image?: string;
  images?: string[];
  categories?: Category[];
}

interface ProductDetailResponse {
  data?: ApiData;
}
type ProductData = {
  id?: string | number;
  name?: string;
  images?: string[];
  main_image?: string;
  location?: string;
  regular_price?: string;
  sale_price?: string;
  price_difference?: string;
  categories?: Category[];
  attribute_urls?: Attribute[];
  description?: string;
};
export default function ClientLogger({
  data,
}: {
  data: ProductDetailResponse;
}) {
  const [activeImage, setActiveImage] = useState<string>("");
  console.log("slug de ", data, activeImage);
  const product = (data?.data?.product_details ?? {}) as ProductData;
  const pd = data?.data ?? {}; // full product object (top-level)
  const productDetails = pd.product_details ?? {};
  const productImage: string =
    productDetails.main_image || pd.main_image || "/images/img.png";

  const productSubImage: string[] = useMemo(
    () =>
      Array.isArray(productDetails.images)
        ? productDetails.images.filter(Boolean)
        : Array.isArray(pd.images)
        ? pd.images.filter(Boolean)
        : [],
    [productDetails.images, pd.images]
  );
  console.log("slug de pr", productDetails);
  console.log("slug de ", pd);

  const images: string[] = useMemo(
    () => (Array.isArray(pd.images) ? pd.images.filter(Boolean) : []),
    [pd.images]
  );
  console.log("thumbs:", productSubImage);
  useEffect(() => {
    const initial = productImage || images[0] || "/images/img.png";
    setActiveImage(initial);
  }, [productImage, images]);
  const [activeTab, setActiveTab] = useState<"specifications" | "description">(
    "specifications"
  );
  const [showModal, setShowModal] = useState(false);
  const attributes: Attribute[] = Array.isArray(productDetails.attribute_urls)
    ? productDetails.attribute_urls
    : [];

  const getAttr = (label: string): string =>
    attributes.find(
      (a) => String(a?.label ?? "").toLowerCase() === label.toLowerCase()
    )?.value ?? "";

  const isNonEmpty = (s: unknown): s is string =>
    typeof s === "string" && s.trim().length > 0;

  const rawCats: Category[] = Array.isArray(productDetails.categories)
    ? productDetails.categories
    : Array.isArray(pd.categories)
    ? pd.categories
    : [];

  const categoryNames: string[] = rawCats
    .map((c) =>
      typeof c === "string" ? c : c?.name ?? c?.label ?? c?.value ?? ""
    )
    .filter(isNonEmpty);
  const makeValue = getAttr("Make"); // e.g., "Kokoda"

  const specFields = [
    { label: "Type", value: categoryNames.join(", ") || getAttr("Type") }, // 👈 from categories
    { label: "Make", value: getAttr("Make") },
    { label: "Model", value: getAttr("Model") },
    { label: "Year", value: getAttr("Years") },
    { label: "Condition", value: getAttr("Conditions") },
    { label: "Axle Configuration", value: getAttr("AxleConfiguration") },
    { label: "Length", value: getAttr("length") },
    { label: "Sleep", value: getAttr("sleeps") },
    { label: "ATM", value: getAttr("ATM") },
    { label: "Tare Mass", value: getAttr("Tare Mass") },
    { label: "Ball Weight", value: getAttr("Ball Weight") },

    { label: "Extras", value: getAttr("Extras") },
    { label: "Location", value: getAttr("Location") },
  ];

  // helpers
  const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
  const num = (s: string) => {
    const n = parseInt(String(s).replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };

  type LinkOut = { href: string; text: string };

  /** Build links for a spec row based on its label/value. */
  const linksForSpec = (label: string, value: string): LinkOut[] | null => {
    const L = label.toLowerCase();
    const v = String(value).trim();
    if (!v) return null;

    if (L === "make") {
      // /listings/make-value/
      return [{ href: `/listings/${slug(v)}/`, text: v }];
    }

    if (L === "model") {
      // per your requirement: /listings/model-value/
      return [{ href: `/listings/${makeValue}/${slug(v)}/`, text: v }];
    }
    if (L === "category" || L === "type") {
      // value may be "Luxury, Off Road"
      return v.split(",").map((c) => {
        const t = c.trim();
        return { href: `/listings/${slug(t)}-category/`, text: t };
      });
    }

    if (L === "atm") {
      const kg = num(v);
      if (kg) return [{ href: `/listings/under-${kg}-kg-atm/`, text: v }];
      return null;
    }

    if (L === "location" || L === "state") {
      // e.g., Victoria -> /listings/victoria-state/
      return [{ href: `/listings/${slug(v)}-state/`, text: v }];
    }

    if (L === "year" || L === "years") {
      const y = num(v);
      if (y)
        return [
          {
            href: `/listings/?acustom_fromyears=${y}&acustom_toyears=${y}`,
            text: v,
          },
        ];
      return null;
    }

    if (L === "sleep" || L === "sleeps") {
      const s = num(v);
      if (s)
        return [
          { href: `/listings/over-${s}-people-sleeping-capacity/`, text: v },
        ];
      return null;
    }

    if (L === "length") {
      const ft = num(v);
      if (ft)
        return [{ href: `/listings/under-${ft}-length-in-feet/`, text: v }];
      return null;
    }

    if (L === "condition" || L === "conditions") {
      return [{ href: `/listings/${slug(v)}-condition/`, text: v }];
    }

    return null;
  };

  const stateFields = [{ label: "Location", value: getAttr("Location") }];
  // --- helpers ---
  const parseAmount = (v: string | number | undefined) => {
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
                    {productSubImage.slice(0, 4).map((image, i) => (
                      <div className="image_item" key={i}>
                        <div className="background_thumb">
                          <Image
                            src={image}
                            width={128}
                            height={96}
                            alt="Thumbnail"
                            priority={i < 4}
                          />
                        </div>
                        <div className="img">
                          <Image
                            src={image}
                            width={128}
                            height={96}
                            alt={`Thumb ${image}`}
                            priority={i < 4}
                          />
                        </div>
                      </div>
                    ))}

                    <span className="caravan__image_count">
                      <span>{productSubImage.length}+</span>
                    </span>
                  </div>
                </div>

                {/* Large Image */}
                <div className="lager_img_view image_container">
                  <div className="background_thumb">
                    <Image
                      src={activeImage || productImage}
                      width={800}
                      height={600}
                      alt="Large"
                      className="img-fluid"
                    />
                  </div>
                  <a href="#">
                    <Image
                      src={activeImage || productImage}
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
                              .map((f, i) => {
                                const links = linksForSpec(
                                  f.label,
                                  String(f.value)
                                );
                                return (
                                  <li key={i}>
                                    <strong>{f.label}:</strong>{" "}
                                    {links
                                      ? // multiple links (e.g., Type has many categories)
                                        links.map((lnk, idx) => (
                                          <span key={lnk.href}>
                                            <Link
                                              href={lnk.href}
                                              prefetch={false}
                                            >
                                              {lnk.text}
                                            </Link>
                                            {idx < links.length - 1 ? ", " : ""}
                                          </span>
                                        ))
                                      : String(f.value)}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "description" && (
                    <div className="tab-pane fade show active">
                      {productDetails.description}
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
                        Contact Delar
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
                images={productSubImage} // full array
                product={{
                  id: (product as any)?.id ?? (pd as any)?.id ?? product.name,
                  slug: (product as any)?.slug ?? (pd as any)?.slug,
                  name: product.name ?? "",
                  image: activeImage || productImage,
                  price: hasSale ? sale : reg,
                  regularPrice: reg,
                  salePrice: sale,
                  isPOA,
                  location: product.location ?? undefined,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
