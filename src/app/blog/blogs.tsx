"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogs, type BlogPost } from "@/api/blog/api";
import { formatPostDate } from "@/utils/date";
import { toSlug } from "../../utils/seo/slug";

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
  const getHref = (p: BlogPost) => {
    const slug = p.slug?.trim() || toSlug(p.slug);
    return slug ? `/blog/${slug}/` : ""; // trailing slash optional
  };
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
              {blogPosts.map((post, index) => {
                const href = getHref(post);
                return (
                  <div
                    key={index}
                    className="card border-0 bg-transparent rounded-0 border-bottom brd-gray pb-30 mb-30"
                  >
                    <div className="row">
                      <div className="col-lg-5">
                        <div className="img img-cover">
                          <Link href={href}>
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
                            <Link href={href} className="op-8">
                              {formatPostDate(post.date)}
                            </Link>
                          </small>
                          <Link href={href} className="card-title mb-10">
                            {post.title}
                          </Link>
                          <p>{post.excerpt}</p>
                          <Link
                            href={href}
                            className="btn rounded-pill bg-blue4 fw-bold text-white mt-10"
                          >
                            <small> Read More </small>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

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
