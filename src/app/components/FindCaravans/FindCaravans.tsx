"use client";
import React from "react";
import Link from "next/link";
import "./FindCaravans.css";

const sections = [
  {
    title: "Region",
    basePath: "listings/south-australia-state",
    data: [
      "Adelaide",
      "Gold Coast",
      "Ballarat",
      "Melbourne",
      "Perth",
      "Brisbane",
      "Newcastle",
      "Gippsland",
      "Sydney",
      "Geelong",
      "Sunshine Coast",
      "Hobart",
    ],
  },
  {
    title: "Popular Manufacturers",
    basePath: "listings",
    data: [
      "Lotus",
      "JB",
      "Coronet RV",
      "Aussie Five Star",
      "Essential",
      "Jayco",
      "Zone RV",
      "The Little Caravan Company",
      "Supreme",
      "Grand City",
      "Crusader",
      "Masterpiece",
      "Mdc",
      "Retreat",
      "Snowy River",
      "New Age",
      "Prime Edge",
      "Urban",
      "Everest",
      "Royal Flair",
      "Orbit",
      "Legend",
      "Silver Valley",
      "Ezytrail",
      "Network Rv",
    ],
  },
  {
    title: "Size",
    basePath: "listings/between",
    data: [
      "12 ft",
      "13 ft",
      "14 ft",
      "15 ft",
      "16 ft",
      "17 ft",
      "18 ft",
      "19 ft",
      "20 ft",
      "21 ft",
      "22 ft",
      "23 ft",
      "24 ft",
      "25 ft",
      "26 ft",
      "27 ft",
      "28 ft",
    ],
  },
  {
    title: "Weight",
    basePath: "listings/under",
    data: [
      "1,250 Kg",
      "1,500 Kg",
      "1,750 Kg",
      "2,000 Kg",
      "2,250 Kg",
      "2,500 Kg",
      "2,750 Kg",
      "3,000 Kg",
      "3,500 Kg",
      "4,000 Kg",
    ],
  },
  {
    title: "Sleeping Capacity",
    basePath: "listings/over",
    data: [
      "2 people",
      "3 people",
      "4 people",
      "5 people",
      "6 people",
      "7 people",
    ],
  },
  {
    title: "Popular Pages",
    basePath: "listings",
    data: [
      "Best Off Road Caravans",
      "Best Off Road Caravan Manufacturers",
      "Best Caravan Manufacturers",
      "Best Semi Off Road Caravans",
      "Best Extreme Off Road Caravans",
      "Best Luxury Caravans",
      "Best Family Caravans",
      "Best Touring Caravans",
    ],
  },
];

export default function FindCaravans() {
  return (
    <section className="related-products section-padding">
      <div className="container">
        <div className="title">
          <div className="tpof_tab">
            <h2>Find Caravans For Sale By </h2>
          </div>
          {sections.map((section, index) => (
            <div key={index} className="modern_links">
              <h3>{section.title}</h3>
              <div className="links">
                {section.data.map((item, i) => {
                  const formattedItem = item
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/,/g, "");
                  return (
                    <Link
                      key={i}
                      href={`/${section.basePath}/${formattedItem}`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
