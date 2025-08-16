"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    title: "Best Off Road Caravans 2025: What’s New, Tough, and Worth Your Money",
    date: "June 17, 2025",
    excerpt:
      "Introduction The demand for find the best off-road caravan is soaring as adventurers seek rugged, reliable, and comfortable homes on wheels...",
    image:
      "https://www.caravansforsale.com.au/wp-content/uploads/2025/06/2.jpg",
    link: "https://www.caravansforsale.com.au/best-off-road-caravans-2025/",
  },
  {
    title: "Best Pop-Top Caravans with Shower & Toilet in Australia for 2025",
    date: "June 13, 2025",
    excerpt:
      "Pop-top caravans with a shower and toilet offer the perfect blend of convenience and comfort for travellers seeking freedom on the road...",
    image:
      "https://www.caravansforsale.com.au/wp-content/uploads/2025/06/A-Comprehensive-Guide-to-Pop-Top-Caravans-with-Shower-Toilet_Mobile-.jpg",
    link: "https://www.caravansforsale.com.au/pop-top-caravans-with-shower-and-toilet/",
  },
  // ... repeat for other posts as needed
];

const BlogListingSection = () => {
  return (
    <div className="blog-page style-5">
    <section className="all-news bg-light-gray blog-listing section-padding blog bg-transparent style-3">
      <div className="container">
        <div className="section-head mb-60 style-5">
          <h2>Valuable News, Reviews &amp; Advice From Caravan Marketplace</h2>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="card border-0 bg-transparent rounded-0 border-bottom brd-gray pb-30 mb-30"
              >
                <div className="row">
                  <div className="col-lg-5">
                    <div className="img img-cover">
                      <Link href={post.link}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={1024}
                          height={683}
                          className="w-100 h-auto"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="card-body p-0">
                      <small className="d-block date text">
                        <Link href={post.link} className="op-8">
                          {post.date}
                        </Link>
                      </small>
                      <Link href={post.link} className="card-title mb-10">
                        {post.title}
                      </Link>
                      <p>{post.excerpt}</p>
                      <Link
                        href={post.link}
                        className="btn rounded-pill bg-blue4 fw-bold text-white mt-10"
                      >
                        <small> Read More </small>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pagination style-5 color-4 justify-content-center mt-20">
              <span aria-current="page" className="page-numbers current">
                1
              </span>
              <Link href="/blog/page/2" className="page-numbers">
                2
              </Link>
              <Link href="/blog/page/3" className="page-numbers">
                3
              </Link>
              <span className="page-numbers dots">…</span>
              <Link href="/blog/page/40" className="page-numbers">
                40
              </Link>
              <Link href="/blog/page/2" className="next page-numbers">
                next »
              </Link>
            </div>
          </div>

          <div className="col-lg-3 rightbar-stick">
            <p>Information</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default BlogListingSection;
