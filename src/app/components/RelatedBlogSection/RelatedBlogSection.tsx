'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const BlogSwiper = () => {
  const blogData = [
    {
      url: "https://www.caravansforsale.com.au/top-6-off-road-pop-top-caravans-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Top-6-Off-Road-Pop-Top-Caravans-in-Australia-for-Your-Next-Adventure_mob.jpg",
      title: "Top 6 Off-Road Pop-Top Caravans in Australia for Your Next Adventure",
      description: "Off-road pop-top caravans have rugged construction, independent suspension and solar power for self-sufficient travel. Leading brands like Jayco, Apache and Cub Campers build tough caravans for Australian conditions and off-grid adventures. Versatile layouts include ensuites, external kitchens and energy efficient systems for comfort. Models from The Little Caravan Company and Ezytrail balance compactness with practicality,..."
    },
    {
      url: "https://www.caravansforsale.com.au/top-australian-made-hybrid-caravans-buying-guide/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Best-Australian-Made-Hybrid-Caravans-Top-5-Models-Buying-Guide-Mob.jpg",
      title: "Best Australian-Made Hybrid Caravans: Top 5 Models & Buying Guide",
      description: "Australian made hybrid off-road caravans are tough and self sufficient for the adventurous traveller. Built with reinforced chassis, solar power systems, lithium batteries and plenty of water storage these caravans are perfect for off grid travel. Leading brands like Alpine Campers, The Little Caravan Company, Eagle Campers Trailers, Ezytrail and Austrack Campers have models for..."
    },
    {
      url: "https://www.caravansforsale.com.au/top-caravans-for-sale-melbourne-vic-guide/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Top-Caravans-for-Sale-in-Melbourne-Victoria-–-Buyers-Guide-Best-Deals-Mob.jpg",
      title: "Top Caravans for Sale in Melbourne, Victoria – Buyer’s Guide & Best Deals",
      description: "Caravans for sale in Melbourne include a wide range from budget tourers to luxury vans. Options suit off-roaders, families and those who want high end comfort with all the bells and whistles. Leading brands like Jayco, Lotus, Goldstar RV, Great Aussie, Orbit and Paramount offer caravans with durable construction, off grid capability and modern interiors..."
    },
    {
      url: "https://www.caravansforsale.com.au/top-6-caravans-for-sale-perth-western-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Top-6-Caravans-for-Sale-in-Perth-Western-Australia-–-Best-Models-Deals_mob.jpg",
      title: "Top 6 Caravans for Sale in Perth, Western Australia – Best Models & Deals",
      description: "Check out caravans for sale in Perth including the Goldstream Panther 15’ and Jayco CrossTrak. These small off-road caravans are perfect for adventure and easy towing. Look at spacious and luxurious caravans like the Wonderland Hornet 23 and New Age Big Red Range. With modern amenities they are perfect for families on extended trips and..."
    },
    {
      url: "https://www.caravansforsale.com.au/new-age-caravans-for-sale-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/New-Age-Caravans-for-Sale-–-Reviews-Features-Buying-Guide_Mob.jpg",
      title: "New Age Caravans for Sale – Reviews, Features & Buying Guide",
      description: "New Age Caravans, based in Melbourne is a Australian RV manufacturer. Their Melbourne north factory produces around 2000 caravans and camper trailers per year. In a move to strengthen their position in the market New Age Caravans joined forces with JB Caravans. This has created Australia’s second largest RV manufacturer. In terms of search share..."
    },
    {
      url: "https://www.caravansforsale.com.au/best-14-foot-caravans-for-sale-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/5-Best-14-Foot-Caravans-for-Sale-in-Australia-with-Shower-Toilet_Mob.jpg",
      title: "5 Best 14-Foot Caravans for Sale in Australia with Shower & Toilet",
      description: "Top 14 foot caravans with shower and toilet, compact designs with all the essentials. Off road hybrids, lightweight, feature packed interiors for comfort, convenience and self sufficient travel. Chassis, independent suspension and off grid options like solar panels and lithium batteries. Luxury interiors with ensuite bathrooms or practical layouts for smooth towing and versatility. Models..."
    },
    {
      url: "https://www.caravansforsale.com.au/crusader-caravans-review-features-compare-prices/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Crusader-Caravans-for-Sale-–-Reviews-Features-Price-Comparison_Mob1.jpg",
      title: "Crusader Caravans – Reviews, Features & Price Comparison",
      description: "Overview Crusader Caravans, established in 2002 by Serge Valentino, is an Australian caravan manufacturer that’s renowned for its innovative designs and superior build quality. Based in Epping, Victoria, the company uses composite construction techniques to build caravans that are both strong and lightweight – one of the leading off-road caravan manufacturers in Australia. In 2024..."
    },
    {
      url: "https://www.caravansforsale.com.au/top-5-expensive-caravans-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/02/Top-5-Most-Expensive-Caravans-in-Australia-mob.jpg",
      title: "Top 5 Most Expensive Caravans in Australia",
      description: "Check out the most luxurious off-road caravans, where performance meets comfort. These top of the line models have top notch off-grid systems so you can go anywhere and not worry about power or efficiency. Each caravan is packed with the latest technology, from suspension systems to solar power. Spacious interiors, gourmet kitchens and ensuites so..."
    },
    {
      url: "https://www.caravansforsale.com.au/lightweight-caravans-with-shower-toilet-australia/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/lightweight-caravans-with-shower-and-toilet-australia_Mob-1.jpg",
      title: "Top 7 Lightweight Caravans with Shower & Toilet in Australia",
      description: "Browse a selection of lightweight caravans featuring a full shower and toilet, designed for easy towing and comfort. These models combine compact design with modern amenities for unforgettable Australian adventures. Caravans like the Avan Aspire 470, Silver Valley Orana, and Snowy River SRC-14 offer off-grid capabilities, spacious interiors, and well-equipped kitchens. They ensure comfort, practicality,..."
    },
    {
      url: "https://www.caravansforsale.com.au/avan-caravans-review-features-prices/",
      image: "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/Avan-Caravans-Review-Features-Models-and-Pricing-Guide-mob.jpg",
      title: "Avan Caravans Review: Features, Models, and Pricing Guide",
      description: "Avan has changed the face of the Australian RV industry with its design, light weight and comfort. Started in a small garage in Hallam, Victoria, the company has grown into a well known manufacturer of campers, caravans and pop-tops. Avan’s pre-painted aluminium ensures durability, UV resistance and reduced weight making them easy to tow and..."
    }
  ];

  return (
    <section className="related-products section-padding">
      <div className="container">
        <div className="title">
          <div className="tpof_tab">
            <h2>Featured Blog Posts</h2>
            <div className="viewall_bttn">
              <a href="">
                <i className="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4} // Number of slides per view in a single row
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {blogData.map((blog, index) => (
            <SwiperSlide key={index}>
              <a href={blog.url} className="mb-3">
                <div className="product-card">
                  <div className="img">
                    <img src={blog.image} alt={blog.title} decoding="async" />
                  </div>
                  <div className="product_de">
                    <div className="info">
                      <h5 className="title">{blog.title}</h5>
                      <p className='blog-description'>{blog.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BlogSwiper;
