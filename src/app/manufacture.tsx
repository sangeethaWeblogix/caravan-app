"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchRangeFeaturedCategories } from "@/api/homeMake/api";
type MakeItem = {
  term_id: number;
  name: string;
  slug?: string;
  description?: string;
  logo_url?: string | null;
  custom_link?: string | null;
  caravan_type?: string | null;
  is_top?: boolean | null;
};
const Manufacture = () => {
  const [items, setItems] = useState<MakeItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetchRangeFeaturedCategories(); // returns array
        if (mounted) {
          setItems(res as MakeItem[]);
        }
      } catch (e: unknown) {
        if (mounted) {
          if (e instanceof Error) {
            setErr(e.message);
            console.error("Manufacture fetch error:", e);
          } else {
            setErr("Failed to load manufacturers");
            console.error("Manufacture fetch error:", e);
          }
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);
  console.log("make-categories", items);
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="section-head mb-40">
              <h2>
                High-Quality Caravans for Sale – Without the Big Brand Price Tag
              </h2>
              <p>
                Discover some of the best caravan manufacturers you may not have
                heard of — offering superior craftsmanship, smart floor plans,
                and unbeatable pricing for the quality.
              </p>
            </div>
          </div>
        </div>

        <div className="range-home position-relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: ".swiper-button-next-manufacturer",
              prevEl: ".swiper-button-prev-manufacturer",
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 25 },
            }}
            className="swiper-container"
          >
            {[
              {
                name: "Lotus Caravans",
                image:
                  "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/Lotus.png",
                description:
                  "Lotus Caravans has been the standard for quality, innovation and durability in the Australian caravan industry...",
                types: ["Off Road", "Semi Off Road"],
                link: "/listings/lotus/",
              },
              {
                name: "JB Caravans",
                image:
                  "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/JB-caravans.png",
                description:
                  "Founded on a passion to create caravans that make every journey better, JB Caravans build durable and stylish caravans...",
                types: ["Off Road", "Semi Off Road", "On Road", "Hybrid"],
                link: "/listings/jb/",
              },
              {
                name: "Coronet RV",
                image:
                  "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/Coronet-RV.png",
                description:
                  "Coronet RV has been around since 1959. We specialise in semi off-road and off-road caravans...",
                types: ["Off Road", "Semi Off Road", "On Road", "Family"],
                link: "/listings/coronet-rv/",
              },
              {
                name: "Jayco",
                image:
                  "https://www.caravansforsale.com.au/wp-content/uploads/2025/01/Jayco.png",
                description:
                  "Jayco has been Australia’s number one caravan manufacturer since 1975. We’re all about quality, innovation and reliability...",
                types: ["Off Road", "On Road", "Hybrid", "Family"],
                link: "/listings/jayco/",
              },
            ].map((man) => (
              <SwiperSlide key={man.name}>
                <div className="post_item">
                  <div className="post_image">
                    <Image
                      src={man.image}
                      alt={man.name}
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="post_info">
                    <h3>{man.name}</h3>
                    <p>{man.description}</p>
                    <ul>
                      <li>
                        <i className="bi bi-info-circle" />
                        <span>{man.types.join(", ")}</span>
                      </li>
                    </ul>
                    <Link href={man.link}>
                      View Listings <i className="bi bi-chevron-right" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-next swiper-button-next-manufacturer" />
          <div className="swiper-button-prev swiper-button-prev-manufacturer" />
        </div>
      </div>
    </div>
  );
};

export default Manufacture;
