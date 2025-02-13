// TopSearchFilter.tsx
"use client";
import React, { useState } from "react";

const TopSearchFilter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className="services top_search_filter style-1">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-12">
            <div className="section-head text-center">
              <h1 className="divide-orange pb-10">
                Browse New & Used Caravans For Sale - Find Exclusive Deals
              </h1>
              <p>
                CFS is dedicated to revolutionising your caravan buying
                experience. <br />
                Choose from a wide selection of high-quality caravans at
                competitive prices, find exclusive deals direct from
                manufacturers.
              </p>
              <div className="top_search_c">
                <ul style={{paddingLeft: "0"}}>
                  <li className="keybased_search">
                    <div className="key-form">
                      <form>
                        <i className="bi bi-search"></i>
                        {/* <input
                          type="text"
                          onKeyUp={(e) => searchLocationho(e)}
                          id="hofilter-location-title"
                          className="form-control"
                          placeholder="Find Exclusive Deals (State, Region, Suburb, Postcode...)"
                          value=""
                        /> */}
                        <input
                        className="form-control"
                          type="text"
                          value={searchTerm}
                          onChange={handleChange}
                          placeholder="Find Exclusive Deals (State, Region, Suburb, Postcode...)"
                        />
                        <input type="hidden" id="hofilter_location_uri" />
                        <input type="hidden" id="hofilter_state" />
                        <div className="hosuggestions">
                          <ul id="hosuggestionsul"></ul>
                        </div>
                      </form>
                    </div>
                  </li>
                  <li className="cafs_586974">
                    <a
                      href="javascript:void(0)"
                      onClick={() => search_by_header()}
                    >
                      Search
                    </a>
                  </li>
                </ul>
              </div>
              <ul className="category_icon">
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/off-road-category/">
                    <div className="item-image">
                      <img src="images/off-road.png" alt="off-road" />
                    </div>
                    <span>Off Road</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/hybrid-category/">
                    <div className="item-image">
                      <img src="images/hybrid.png?=1" alt="hybrid" />
                    </div>
                    <span>Hybrid</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/pop-top-category/">
                    <div className="item-image">
                      <img src="images/pop-top.png?=1" alt="pop-top" />
                    </div>
                    <span>Pop Top</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/luxury-category/">
                    <div className="item-image">
                      <img src="images/luxury.png?=1" alt="luxury" />
                    </div>
                    <span>Luxury</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/family-category/">
                    <div className="item-image">
                      <img src="images/family.png?=1" alt="family" />
                    </div>
                    <span>Family</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/touring-category/">
                    <div className="item-image">
                      <img src="images/touring.png?=1" alt="touring" />
                    </div>
                    <span>Touring</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.caravansforsale.com.au/listings/on-road-category/">
                    <div className="item-image">
                      <img src="images/on-road.png?=1" alt="on-road" />
                    </div>
                    <span>On Road</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Placeholder functions for searchLocationho and search_by_header
const searchLocationho = (e: React.KeyboardEvent) => {
  // Implement your search logic here
};

const search_by_header = () => {
  // Implement your search logic here
};

export default TopSearchFilter;
