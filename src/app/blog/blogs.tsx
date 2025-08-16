"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogs, type BlogPost } from "@/api/blog/api";

// //   {
// //     title: "Best Off Road Caravans 2025: What’s New, Tough, and Worth Your Money",
// //     date: "June 17, 2025",
// //     excerpt:
// //       "Introduction The demand for find the best off-road caravan is soaring as adventurers seek rugged, reliable, and comfortable homes on wheels...",
// //     image:
// //       "https://www.caravansforsale.com.au/wp-content/uploads/2025/06/2.jpg",
// //     link: "https://www.caravansforsale.com.au/best-off-road-caravans-2025/",
// //   },
// //   {
// //     title: "Best Pop-Top Caravans with Shower & Toilet in Australia for 2025",
// //     date: "June 13, 2025",
// //     excerpt:
// //       "Pop-top caravans with a shower and toilet offer the perfect blend of convenience and comfort for travellers seeking freedom on the road...",
// //     image:
// //       "https://www.caravansforsale.com.au/wp-content/uploads/2025/06/A-Comprehensive-Guide-to-Pop-Top-Caravans-with-Shower-Toilet_Mobile-.jpg",
// //     link: "https://www.caravansforsale.com.au/pop-top-caravans-with-shower-and-toilet/",
// //   },
// //   // ... repeat for other posts as needed
// // ];
// export default function Blogs({
//   blogPosts,
//   currentPage,
//   hasPrev,
//   hasNext,
// }: {
//   blogPosts: BlogPost[];
//   currentPage: number;
//   hasPrev: boolean;
//   hasNext: boolean;
// }) {
export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchBlogs(1)
      .then((data) => mounted && setBlogPosts(data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-8">Loading…</div>;
  return (
    <div className="blog-page style-5">
      <section className="all-news bg-light-gray blog-listing section-padding blog bg-transparent style-3">
        <div className="container">
          <div className="section-head mb-60 style-5">
            <h2>
              Valuable News, Reviews &amp; Advice From Caravan Marketplace
            </h2>
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

              {/* <div className="pagination style-5 color-4 justify-content-center mt-20 flex items-center gap-2">
                {hasPrev && (
                  <Link
                    href={`/blog/page/${currentPage - 1}/`}
                    className="prev page-numbers px-3 py-1 border rounded"
                  >
                    « prev
                  </Link>
                )}
                <span
                  aria-current="page"
                  className="page-numbers current px-3 py-1 border rounded"
                >
                  {currentPage}
                </span>
                {hasNext && (
                  <Link
                    href={`/blog/page/${currentPage + 1}/`}
                    className="next page-numbers px-3 py-1 border rounded"
                  >
                    next »
                  </Link>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
