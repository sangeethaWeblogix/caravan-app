'use client'

import './navbar.css'
import { useState } from 'react'
import Link from 'next/link'

const STATES = [
  'New South Wales',
  'Queensland',
  'Western Australia',
  'Victoria',
  'South Australia',
  'Australian Capital Territory',
  'Tasmania'
]

const CATEGORIES = ['off-road', 'hybrid', 'pop-top', 'luxury', 'family', 'touring']
const PRICES = [50000, 60000, 70000, 80000, 90000, 100000, 125000, 150000, 175000, 200000]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNav = () => {
    setIsOpen(!isOpen)
  }

  const closeNav = () => {
    setIsOpen(false)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light style-4">
        <div className="container">
          <div className="logo_left">
            <Link className="navbar-brand" href="/">
              <img src="/images/cfs-logo.svg" alt="Caravans For Sale" />
            </Link>
          </div>

          <div className="header_right_info">
            <button className="navbar-toggler mytogglebutton" onClick={toggleNav}>
              <i className="bi bi-search"></i>
            </button>

            <button
              className="navbar-toggler hidden-xs hidden-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav mb-2 mb-lg-0">

                {/* Browse by State */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Browse by State
                  </a>
                  <ul className="dropdown-menu">
                    {STATES.map(state => (
                      <li key={state}>
                        <Link className="dropdown-item" href={`/listings/${state.toLowerCase().replace(/ /g, '-')}-state/`}>
                          {state}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Browse by Category */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Browse by Category
                  </a>
                  <ul className="dropdown-menu">
                    {CATEGORIES.map(cat => (
                      <li key={cat}>
                        <Link className="dropdown-item" href={`/listings/${cat}-category/`}>
                          {cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Browse by Price */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Browse by Price
                  </a>
                  <ul className="dropdown-menu">
                    {PRICES.map(price => (
                      <li key={price}>
                        <Link className="dropdown-item" href={`/listings/under-${price}/`}>
                          Under ${price.toLocaleString()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" href="/listings/">All Listings</Link>
                </li>

              </ul>
            </div>

            <div className="left_menu">
              <input type="checkbox" id="openSideMenu" className="openSideMenu" onClick={toggleNav} />
              <label htmlFor="openSideMenu" className="menuIconToggle">
                <div className="hamb-line dia p-1"></div>
                <div className="hamb-line hor"></div>
                <div className="hamb-line dia p-2"></div>
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div id="mySidenav" className={`sidenav ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-navigation">
          <ul>

            <li className="hidden-lg hidden-md">
              <button className="drop_down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Browse by State
              </button>
              <ul className="dropdown-menu">
                {STATES.map(state => (
                  <li key={state}>
                    <Link className="dropdown-item" href={`/listings/${state.toLowerCase().replace(/ /g, '-')}-state/`} onClick={closeNav}>
                      {state}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="hidden-lg hidden-md">
              <button className="drop_down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Browse by Category
              </button>
              <ul className="dropdown-menu">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <Link className="dropdown-item" href={`/listings/${cat}-category/`} onClick={closeNav}>
                      {cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="hidden-lg hidden-md">
              <button className="drop_down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Browse by Price
              </button>
              <ul className="dropdown-menu">
                {PRICES.map(price => (
                  <li key={price}>
                    <Link className="dropdown-item" href={`/listings/under-${price}/`} onClick={closeNav}>
                      Under ${price.toLocaleString()}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li><Link href="/caravan-dealers/" onClick={closeNav}>Caravan Dealers</Link></li>
            <li className="hidden-lg hidden-md"><Link href="/listings/" onClick={closeNav}>All Listings</Link></li>
            <li><Link href="/blog/" onClick={closeNav}>Blog</Link></li>
            <li><Link href="/contact/" onClick={closeNav}>Contact</Link></li>

          </ul>
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay-close ${isOpen ? 'active' : ''}`} onClick={closeNav}></div>
      <div id="overlay" className={`overlay ${isOpen ? 'active' : ''}`} onClick={closeNav}></div>
    </>
  )
}

export default Navbar