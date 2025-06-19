'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import FeaturedProductsSlider from './FeaturedProductsSlider'
import LatestBlogSection from './LatestBlogSection'

const categories = [
  { name: 'Off Road', link: '/listings/off-road-category/', image: '/images/off-road.webp', alt: 'off-road' },
  { name: 'Hybrid', link: '/listings/hybrid-category/', image: '/images/hybrid.webp', alt: 'hybrid' },
  { name: 'Pop Top', link: '/listings/pop-top-category/', image: '/images/pop-top.webp', alt: 'pop-top' },
  { name: 'Luxury', link: '/listings/luxury-category/', image: '/images/luxury.webp', alt: 'luxury' },
  { name: 'Family', link: '/listings/family-category/', image: '/images/family.webp', alt: 'family' },
  { name: 'Touring', link: '/listings/touring-category/', image: '/images/touring.webp', alt: 'touring' },
]

export default function ProductPage() {
  const searchLocationho = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
  }

  const search_by_header = () => {
    console.log('Search button clicked')
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="services top_search_filter style-1">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-12">
              <div className="section-head text-center">
                <h1 className="divide-orange pb-10">
                  Browse New & Used Caravans For Sale - Find Exclusive Deals
                </h1>
                <p>
                  CFS is dedicated to revolutionising your caravan buying experience.
                  <br />
                  Choose from a wide selection of high-quality caravans at competitive prices,
                  find exclusive deals direct from manufacturers.
                </p>

                {/* Search Box */}
                <div className="top_search_c">
                  <ul>
                    <li className="keybased_search">
                      <div className="key-form">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <i className="bi bi-search"></i>
                          <input
                            type="text"
                            onKeyUp={searchLocationho}
                            id="hofilter-location-title"
                            className="form-control"
                            placeholder="Find Exclusive Deals (State, Region, Suburb, Postcode...)"
                            aria-label="Location search"
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
                      <a onClick={search_by_header} className="btn btn-primary">
                        <FaSearch /> Search
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Categories */}
                <ul className="category_icon">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <Link href={cat.link}>
                        <div className="item-image">
                          <Image src={cat.image} alt={cat.alt} width={80} height={80} />
                        </div>
                        <span>{cat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="related-products section-padding">
        <div className="container">
          <div className="title">
            <div className="tpof_tab">
              <h2>Find Caravans For Sale By</h2>
            </div>

            {/* Region */}
            <div className="modern_links">
              <h3>Region</h3>
              <div className="al-ty-bd">
                {[
                  ['Adelaide', 'south-australia-state/adelaide-region'],
                  ['Gold Coast', 'queensland-state/gold-coast-region'],
                  ['Ballarat', 'victoria-state/ballarat-region'],
                  ['Melbourne', 'victoria-state/melbourne-region'],
                  ['Perth', 'western-australia-state/perth-region'],
                  ['Brisbane', 'queensland-state/brisbane-region'],
                  ['Newcastle', 'new-south-wales-state/newcastle-and-lake-macquarie-region'],
                  ['Gippsland', 'victoria-state/latrobe-gippsland-region'],
                  ['Sydney', 'new-south-wales-state/sydney-region'],
                  ['Geelong', 'victoria-state/geelong-region'],
                  ['Sunshine Coast', 'queensland-state/sunshine-coast-region'],
                  ['Hobart', 'tasmania-state/hobart-region'],
                ].map(([name, slug], i) => (
                  <span key={i}>
                    <Link href={`/listings/${slug}`}>{name}</Link>
                    {i !== 11 && ' | '}
                  </span>
                ))}
              </div>
            </div>

            {/* Manufacturers */}
            <div className="modern_links">
              <h3>Popular Manufacturers</h3>
              <div className="al-ty-bd">
                {[
                  'lotus', 'jb', 'coronet-rv', 'aussie-fivestar', 'essential', 'jayco', 'zone-rv',
                  'the-little-caravan-company', 'supreme', 'grand-city', 'crusader', 'masterpiece',
                  'mdc', 'retreat', 'snowy-river', 'new-age', 'prime-edge', 'urban', 'everest',
                  'royal-flair', 'orbit', 'legend', 'silver-valley', 'ezytrail-camper-trailer', 'network-rv',
                ].map((slug, i) => (
                  <span key={i}>
                    <Link href={`/listings/${slug}`}>
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Link>
                    {i !== 24 && ' | '}
                  </span>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="modern_links">
              <h3>Size</h3>
              <div className="al-ty-bd">
                {Array.from({ length: 17 }, (_, i) => i + 12).map((size, index) => (
                  <span key={index}>
                    <Link href={`/listings/between-${size}-${size}-length-in-feet/`}>{size} ft</Link>
                    {size !== 28 && ' | '}
                  </span>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="modern_links">
              <h3>Weight</h3>
              <div className="al-ty-bd">
                {[1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000].map((weight, i) => (
                  <span key={i}>
                    <Link href={`/listings/under-${weight}-kg-atm/`}>
                      Under {weight.toLocaleString()} Kg
                    </Link>
                    {i !== 9 && ' | '}
                  </span>
                ))}
              </div>
            </div>

            {/* Sleeping Capacity */}
            <div className="modern_links">
              <h3>Sleeping Capacity</h3>
              <div className="al-ty-bd">
                {[2, 3, 4, 5, 6, 7].map((count, i) => (
                  <span key={i}>
                    <Link href={`/listings/over-${count}-people-sleeping-capacity/`}>
                      Sleeps {count}
                    </Link>
                    {i !== 5 && ' | '}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Pages */}
            <div className="tpof_tab">
              <h2>Popular Pages</h2>
            </div>
            <div className="modern_links">
              <div className="al-ty-bd">
                {[
                  ['Best Off Road Caravans', '/best-caravans-full-off-road-capabilities-australia/'],
                  ['Best Off Road Caravan Manufacturers', '/off-road-caravan-manufacturers/'],
                  ['Best Caravan Manufacturers', '/caravan-manufacturers/'],
                  ['Best Semi Off Road Caravans', '/best-semi-off-road-caravans-australia-guide/'],
                  ['Best Extreme Off Road Caravans', '/best-caravans-for-extreme-off-road-travel/'],
                  ['Best Luxury Caravans', '/best-luxury-caravans-australia-highlights-features-reviews/'],
                  ['Best Family Caravans', '/top-family-off-road-caravans-australia/'],
                  ['Best Touring Caravans', '/touring-caravans/'],
                ].map(([label, link], i) => (
                  <span key={i}>
                    <Link href={link}>{label}</Link>
                    {i !== 7 && ' | '}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Slider */}
      <FeaturedProductsSlider />

      {/* Latest Blog Section */}
      <LatestBlogSection />
    </div>
  )
}
