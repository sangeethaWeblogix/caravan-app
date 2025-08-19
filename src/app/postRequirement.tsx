"use client";
import React, { useEffect, useState } from "react";
import { fetchRequirements, Requirement } from "@/api/postRquirements/api";
import Link from "next/link";
const PostRequirement = () => {
  const [items, setItems] = useState<Requirement[]>([]);
  const load = async () => {
    try {
      const data = await fetchRequirements();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch requirements:", error);
    }
  };
  console.log("reqitems", items);
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <div className="container">
        <div className="post_bgs">
          <div className="home-post_head">
            <h2>
              <span>Find Your Ideal Caravan</span> – Post Your Requirements
            </h2>
            <p>
              Tell us what you&apos;re looking for and we&apos;ll match you with
              the right caravan for sale, from trusted dealers at a fair price.
              Make sure your budget and expectations are realistic to help us
              deliver the best possible outcome. See some examples of what other
              caravan buyers are looking for.
            </p>
          </div>

          {/* Example Post Requirement */}
          <div className="home-post__items info top_cta_container">
            <div className="top_cta bg-white">
              <div className="home_post_middle hidden-xs">
                <div className="type">Type</div>
                <div className="condition">Condition</div>
                <div className="requirements">Requirements</div>
                <div className="status">Status</div>
                <div className="location">Location</div>
                <div className="budget">Budget</div>
              </div>
              {items.map((item, index) => (
                <div className="post_flip" key={index}>
                  <a href="#" className="home-post__item d-flex">
                    <div className="type">
                      <Link
                        href={`/listings/${item.type.toLowerCase()}-category/`}
                      >
                        {" "}
                        {item.type}
                      </Link>
                    </div>
                    <div className="condition">
                      <Link
                        href={`/listings/${item.condition.toLowerCase()}-condition/`}
                      >
                        {" "}
                        {item.condition}
                      </Link>{" "}
                    </div>
                    <div className="requirements">{item.requirements}</div>
                    <div className="status">
                      <i className="fa fa-check" />{" "}
                      {item.active === "1" ? "Active" : "Inactive"}
                    </div>
                    <div className="location">{item.location}</div>
                    <div className="budget">{item.budget}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="final_post_btn">
            <a href="/caravan-enquiry-form/" className="btn">
              Post Your Requirements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequirement;
