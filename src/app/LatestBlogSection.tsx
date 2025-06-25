'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    title: "Adria Caravans Review – Models, Features & Buyer’s Guide",
    url: "https://www.caravansforsale.com.au/adria-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/04/Adria-Caravans-Review-–-Models-Features-Buyers-Guide_Mob.jpg",
    excerpt: "Adria has been a trusted name in the recreational vehicle space for nearly 60 years, with a strong presence in the Australian market..."
  },
  {
    title: "Blue Sky Caravans Review – Models, Features & Buyer’s Guide",
    url: "https://www.caravansforsale.com.au/blue-sky-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/04/Blue-Sky-Caravans-Review-–-Models-Features-Buyers-Guide_Mob.jpg",
    excerpt: "Blue Sky Caravans, established in 2007, is an Australian manufacturer specializing in custom-built caravans tailored to individual preferences..."
  },
  {
    title: "Villa Caravans Review: Luxury Off-Road Models & Features",
    url: "https://www.caravansforsale.com.au/villa-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/03/Villa-Caravans-Review-–-Models-Features-Buyers-Guide_mobile-size.jpg",
    excerpt: "Villa Caravans, a proudly Australian-owned and family-operated business, specializes in luxurious, modern caravans..."
  },
  {
    title: "Best Family Caravans in Australia (2025) – Top 5 Picks for Adventure",
    url: "https://www.caravansforsale.com.au/best-family-caravans-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/03/Best-Family-Caravans-in-Australia-2025-–-Top-5-Picks-for-Adventure_mob-1.jpg",
    excerpt: "Exploring Australia with your family is a unique adventure, and the right caravan can turn a simple trip into a cherished memory..."
  },
  {
    title: "Adria Caravans Review – Models, Features & Buyer’s Guide",
    url: "https://www.caravansforsale.com.au/adria-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/04/Adria-Caravans-Review-–-Models-Features-Buyers-Guide_Mob.jpg",
    excerpt: "Adria has been a trusted name in the recreational vehicle space for nearly 60 years, with a strong presence in the Australian market..."
  },
  {
    title: "Blue Sky Caravans Review – Models, Features & Buyer’s Guide",
    url: "https://www.caravansforsale.com.au/blue-sky-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/04/Blue-Sky-Caravans-Review-–-Models-Features-Buyers-Guide_Mob.jpg",
    excerpt: "Blue Sky Caravans, established in 2007, is an Australian manufacturer specializing in custom-built caravans tailored to individual preferences..."
  },
  {
    title: "Villa Caravans Review: Luxury Off-Road Models & Features",
    url: "https://www.caravansforsale.com.au/villa-caravans-review-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/03/Villa-Caravans-Review-–-Models-Features-Buyers-Guide_mobile-size.jpg",
    excerpt: "Villa Caravans, a proudly Australian-owned and family-operated business, specializes in luxurious, modern caravans..."
  },
  {
    title: "Best Family Caravans in Australia (2025) – Top 5 Picks for Adventure",
    url: "https://www.caravansforsale.com.au/best-family-caravans-australia/",
    img: "https://www.caravansforsale.com.au/wp-content/uploads/2025/03/Best-Family-Caravans-in-Australia-2025-–-Top-5-Picks-for-Adventure_mob-1.jpg",
    excerpt: "Exploring Australia with your family is a unique adventure, and the right caravan can turn a simple trip into a cherished memory..."
  }
  // Add more blog posts as needed
]

const LatestBlogSection = () => {
  return (
    <section className="related-products latest_blog section-padding">
      <div className="container">
        <div className="title">
          <div className="tpof_tab d-flex justify-between align-items-center">
            <h3>Latest News, Reviews &amp; Advice</h3>
            <div className="viewall_bttn">
              <a href="">
                <i className="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="related-blog-slider position-relative">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {blogPosts.map((post, index) => (
              <SwiperSlide key={index}>
                <Link href={post.url}>
                  <div className="product-card">
                    <div className="img">
                      <Image
                      width={100} height={100}
                        src={post.img}
                        alt={post.title}
                        className="img-fluid"
                      />
                    </div>
                    <div className="product_de">
                      <div className="info">
                        <h5 className="title">{post.title}</h5>
                        <p>{post.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
    
  )
}

export default LatestBlogSection
