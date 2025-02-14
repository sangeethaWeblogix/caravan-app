"use client";
import React from "react";
import Image from "next/image";
import TopSearchFilter from "./components/TopSearchFilter/TopSearchFilter";
import RelatedProductsSection from "./components/RelatedProductsSection/RelatedProductsSection";
import RelatedBlogSection from "./components/RelatedBlogSection/RelatedBlogSection";
import FindCaravans from "./components/FindCaravans/FindCaravans";

// import CaravanCategory from './components/Category'

// import dynamic from "next/dynamic";
// import FindCaravans from "./components/FindCaravans";
// const FeaturedSlider = dynamic(() => import("./components/ProductSlider"), { ssr: false });

const Home: React.FC = () => {
  const featuredCaravans = [
    {
      url: "https://www.caravansforsale.com.au/product/everest-alpine-freestyle-2024",
      image: "images/slider/2024-everest-18-6-alpine-freestyle-new-full-off-road-caravan-straight-lounge-3061-41-maini.png",
      title:
        "18'6 Everest Alpine Freestyle 2024 Full Off Road Caravan Straight Lounge",
      region: "Western Australia",
      price: {
        del: "89,990",
        ins: null,
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/coronet-rv-ultimate-2024",
      image: "images/slider/coronet-rv-21-6-ultimate-2024-new-family-caravan-2-65-maini.jpg",
      title: "21'6 Coronet RV Ultimate 2024 Semi Off Road Caravan",
      region: "Queensland",
      price: {
        del: "91,999",
        ins: "90,999",
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/urban-tungsten-armorlite-2024",
      image: "images/slider/16-6-urban-2024-tungsten-armorlite-new-hybrid-caravan-2264-main-1.jpg",
      title: "16'6 Urban Tungsten Armorlite 2024 Hybrid Caravan",
      region: "New South Wales",
      price: {
        del: "99,990",
        ins: null,
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/silver-valley-yarra-2024",
      image: "images/slider/2024-silver-valley-19-6-yarra-new-luxury-caravan-3061-61-maini.png",
      title: "19'6 Silver Valley Yarra 2024 Touring Caravan",
      region: "Queensland",
      price: {
        del: "74,990",
        ins: "73,990",
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/little-caravan-company-xplorer-2024",
      image: "images/slider/15-the-little-caravan-company-2024-x-plorer-15ft-pop-top-new-hybrid-caravan-1-57-maini.png",
      title:
        "15' The Little Caravan Company Xplorer 15ft Pop Top 2024 Pop Top Caravan",
      region: "New South Wales",
      price: {
        del: "56,990",
        ins: "55,990",
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/prime-edge-xplorer-2024",
      image: "images/slider/18-6-prime-edge-2024-xplorer-new-off-road-caravan-4555-main-1.jpg",
      title: "18'6 Prime Edge Xplorer 2024 Off Road Caravan",
      region: "Queensland",
      price: {
        del: "125,990",
        ins: null,
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/orbit-discovery-x-2024",
      image: "images/slider/2024-orbit-discovery-x-new-luxury-caravan-2-50-maini.jpg",
      title: "Orbit Discovery X 2024 Off Road Caravan",
      region: "Western Australia",
      price: {
        del: "69,999",
        ins: "68,999",
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/masterpiece-performance-2024",
      image: "images/slider/23-masterpiece-2024-performance-new-full-off-road-caravan-3061-main-1.jpg",
      title: "23' Masterpiece Performance 2024 Full Off Road Caravan",
      region: "Victoria",
      price: {
        del: "151,950",
        ins: null,
      },
    },
    {
      url: "https://www.caravansforsale.com.au/product/aussie-fivestar-the-cape-2024",
      image: "images/slider/2024-aussie-fivestar-18-6-the-cape-new-full-off-road-caravan-2-30-maini-2048x1536.jpg",
      title: "18'6 Aussie Fivestar The Cape 2024 Full Off Road Caravan",
      region: "New South Wales",
      price: {
        del: "82,990",
        ins: "75,990",
      },
    },
  ];


  return (
    <main className="product-page style-5">
      <TopSearchFilter />
      <FindCaravans />
      {/* <section className="related-products section-padding">
        <div className="container">
          <div className="title">
            <div className="tpof_tab">
              <h2>Find Caravans For Sale By </h2>
            </div>
            <div className="modern_links">
              <h3>Region</h3>
              <div className="al-ty-bd">
                {popularManufacturers.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="modern_links">
              <h3>Popular Manufacturers</h3>
              <div className="al-ty-bd">
                {popularManufacturers.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="modern_links">
              <h3>Size</h3>
              <div className="al-ty-bd">
                {sizeLinks.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="modern_links">
              <h3>Weight</h3>
              <div className="al-ty-bd">
                {weightLinks.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="modern_links">
              <h3>Sleeping Capacity</h3>
              <div className="al-ty-bd">
                {sleepingCapacityLinks.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="tpof_tab">
              <h2>Popular Pages</h2>
            </div>
            <div className="modern_links">
              <div className="al-ty-bd">
                {popularPages.map((link, index) => (
                  <a key={index} href={link.url}>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <RelatedProductsSection
        products={featuredCaravans}
      />
      <RelatedBlogSection />
    </main>
  );
};

export default Home;
