'use client'
import React from 'react';
    
const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light style-4">
      <div className="container">
        <div className="logo_left">
          <a className="navbar-brand" href="/">
            <img src="/cfs-logo.svg" alt="Caravans For Sale" />
          </a>
        </div>
        <div className="header_right_info">
          <button className="navbar-toggler mytogglebutton">
            <i className="bi bi-search"></i>
          </button>
          <button
            className="navbar-toggler hidden-xs hidden-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown1"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Browse by State
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                  <li>
                    <a className="dropdown-item" href="/listings/new-south-wales-state/">
                      New South Wales
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/queensland-state/">
                      Queensland
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/western-australia-state/">
                      Western Australia
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/victoria-state/">
                      Victoria
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/south-australia-state/">
                      South Australia
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/australian-capital-territory-state/">
                      Australian Capital Territory
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/tasmania-state/">
                      Tasmania
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Browse by Category
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                  <li>
                    <a className="dropdown-item" href="/listings/off-road-category/">
                      Off Road
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/hybrid-category/">
                      Hybrid
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/pop-top-category/">
                      Pop Top
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/luxury-category/">
                      Luxury
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/family-category/">
                      Family
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/touring-category/">
                      Touring
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/on-road-category/">
                      On Road
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/semi-off-road-category/">
                      Semi Off Road
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/full-off-road-category/">
                      Full Off Road
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/extreme-off-road-category/">
                      Extreme Off Road
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown3"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Browse By Price
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown3">
                  <li>
                    <a className="dropdown-item" href="/listings/under-50000/">
                      Under $50k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-60000/">
                      Under $60k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-70000/">
                      Under $70k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-80000/">
                      Under $80k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-90000/">
                      Under $90k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-100000/">
                      Under $100k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-120000/">
                      Under $120k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-140000/">
                      Under $140k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-160000/">
                      Under $160k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-180000/">
                      Under $180k
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/listings/under-200000/">
                      Under $200k
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/listings">
                  All Listings
                </a>
              </li>
            </ul>
          </div>
          <div className="left_menu">
            <input type="checkbox" id="openSideMenu" className="openSideMenu" />
            <label htmlFor="openSideMenu" className="menuIconToggle">
              <div className="hamb-line dia p-1"></div>
              <div className="hamb-line hor"></div>
              <div className="hamb-line dia p-2"></div>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;