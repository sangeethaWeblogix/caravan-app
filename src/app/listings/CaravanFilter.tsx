'use client'

import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { fetchLocations } from '../../api/location/api'; // Adjust path if needed

type LocationSuggestion = {
  key: string;
  uri: string;
  address: string;
  short_address: string;
};


const categories = ['Off Road', 'Hybrid', 'Pop Top', 'Luxury', 'Family', 'Touring']
const locations = [
  'Australian Capital Territory', 'New South Wales', 'Northern Territory',
  'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
]
const makes = ['Active', 'Adria', 'Apache', 'Arctic', 'Atlantic', 'Atlas', 'Aura', 'Ausflex', 'Aussie Land RV']
const moreMakes = ['Austrack Campers', 'Avan', 'Avida']
const conditions = ['Near New', 'New', 'Used']
const sleeps = ['1 people', '2 people', '3 people', '4 people', '5 people', '6 people', '7 people', '8 people']
const atmOptions = ['600 Kg', '800 Kg', '1,000 Kg', '1,250 Kg', '1,500 Kg', '1,750 Kg', '2,000 Kg', '2,250 Kg', '2,500 Kg', '2,750 Kg', '3,000 Kg', '3,500 Kg', '4,000 Kg', '4,500 Kg']
const priceOptions = ['$10,000', '$20,000', '$30,000', '$40,000', '$50,000', '$60,000', '$70,000', '$80,000', '$90,000', '$100,000', '$125,000', '$150,000', '$175,000', '$200,000', '$225,000', '$250,000', '$275,000', '$300,000']
const yearOptions = Array.from({ length: 2025 - 1914 + 1 }, (_, i) => `${2025 - i}`)
const lengthOptions = ['12 ft', '13 ft', '14 ft', '15 ft', '16 ft', '17 ft', '18 ft', '19 ft', '20 ft', '21 ft', '22 ft', '23 ft', '24 ft', '25 ft', '26 ft', '27 ft', '28 ft']

const CaravanFilter = () => {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [makeOpen, setMakeOpen] = useState(false)
  const [moreMakeShown, setMoreMakeShown] = useState(false)
  const [conditionOpen, setConditionOpen] = useState(false)
  const [sleepsOpen, setSleepsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
 const [locationInput, setLocationInput] = useState('')
const [selectedLocation, setSelectedLocation] = useState('') // ✅ Add this
const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]) // ✅ CORRECT

const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
  setter(prev => !prev)
}
  const resetFilters = () => {
    setCategoryOpen(false)
    setLocationOpen(false)
    setMakeOpen(false)
    setMoreMakeShown(false)
    setConditionOpen(false)
    setSleepsOpen(false)
    setLocationInput('')
  }
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (locationInput.length >= 2) {
      fetchLocations(locationInput)
        .then((data) => {
          console.log('✅ API Result:', data) // should show array of objects
          setLocationSuggestions(data) // ← keep full object
        })
        .catch(console.error)
    } else {
      setLocationSuggestions([])
    }
  }, 300)

  return () => clearTimeout(delayDebounce)
}, [locationInput])



console.log("location", fetchLocations)

  return (
    <div className="filter-card mobile-search">
      <div className="card-title align-items-center d-flex justify-content-between hidden-xs">
        <h3 className="filter_title">Filter</h3>
      </div>

      {/* Category Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setCategoryOpen)}>
          <h5 className="cfs-filter-label">Category</h5>
          <BiChevronDown />
        </div>
        {categoryOpen && (
          <div className="filter-accordion-items">
            {categories.map(cat => (
              <div key={cat} className="filter-accordion-item" onClick={() => console.log('Category:', cat)}>
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setLocationOpen)}>
          <h5 className="cfs-filter-label">Location</h5>
          <BiChevronDown />
        </div>
        {locationOpen && (
          <div className="filter-accordion-items">
            {locations.map(loc => (
              <div key={loc} className="filter-accordion-item" onClick={() => console.log('Location:', loc)}>
                {loc}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suburb / Postcode */}
      <div className="cs-full_width_section">
        <h5 className="cfs-filter-label">Suburb / Postcode</h5>
        <input
          type="text"
          id="afilter_locations_text"
          className="cfs-select-input"
          placeholder=""
          value={locationInput}
          onClick={() => setIsModalOpen(true)}
          onChange={(e) => setLocationInput(e.target.value)}
        />
      </div>

      {/* Make Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setMakeOpen)}>
          <h5 className="cfs-filter-label">Make</h5>
          <BiChevronDown />
        </div>
        {makeOpen && (
          <div className="filter-accordion-items">
            {[...makes, ...(moreMakeShown ? moreMakes : [])].map(make => (
              <div key={make} className="filter-accordion-item" onClick={() => console.log('Make:', make)}>
                {make}
              </div>
            ))}
            {!moreMakeShown && (
              <div className="text-blue-600 cursor-pointer" onClick={() => setMoreMakeShown(true)}>
                Show more...
              </div>
            )}
          </div>
        )}
      </div>

      {/* ATM Range */}
<div className="cs-full_width_section">
  <h5 className="cfs-filter-label">ATM</h5>
  <div className="row">
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">From</h6>
      <select className="cfs-select-input">
        <option value="">Min</option>
        {atmOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">To</h6>
      <select className="cfs-select-input">
        <option value="">Max</option>
        {atmOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
</div>

{/* Price Range */}
<div className="cs-full_width_section">
  <h5 className="cfs-filter-label">Price</h5>
  <div className="row">
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">From</h6>
      <select className="cfs-select-input">
        <option value="">Min</option>
        {priceOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">To</h6>
      <select className="cfs-select-input">
        <option value="">Max</option>
        {priceOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
</div>

      {/* Condition Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setConditionOpen)}>
          <h5 className="cfs-filter-label">Condition</h5>
          <BiChevronDown />
        </div>
        {conditionOpen && (
          <div className="filter-accordion-items ">
            {conditions.map(cond => (
              <div key={cond} className="filter-accordion-item" onClick={() => console.log('Condition:', cond)}>
                {cond}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Sleeps Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setSleepsOpen)}>
          <h5 className="cfs-filter-label">Sleeps</h5>
          <BiChevronDown />
        </div>
        {sleepsOpen && (
          <div className="filter-accordion-items ">
            {sleeps.map(sleep => (
              <div key={sleep} className="filter-accordion-item" onClick={() => console.log('Sleeps:', sleep)}>
                {sleep}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year Range */}
<div className="cs-full_width_section">
  <h5 className="cfs-filter-label">Year</h5>
  <div className="row">
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">From</h6>
      <select className="cfs-select-input">
        <option value="">From</option>
        {yearOptions.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">To</h6>
      <select className="cfs-select-input">
        <option value="">To</option>
        {yearOptions.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>
</div>

{/* Length Range */}
<div className="cs-full_width_section">
  <h5 className="cfs-filter-label">Length</h5>
  <div className="row">
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">From</h6>
      <select className="cfs-select-input">
        <option value="">Min</option>
        {lengthOptions.map(length => (
          <option key={length} value={length}>{length}</option>
        ))}
      </select>
    </div>
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">To</h6>
      <select className="cfs-select-input">
        <option value="">Max</option>
        {lengthOptions.map(length => (
          <option key={length} value={length}>{length}</option>
        ))}
      </select>
    </div>
  </div>
</div>

      

      {/* Keyword Search (hidden or toggle if needed) */}
<div className="cs-full_width_section" style={{ display: 'none' }}>
  <h5 className="cfs-filter-label">Keyword</h5>
  <input
    type="text"
    className="cfs-select-input"
    placeholder="Search by keyword"
  />
</div>

      {/* Reset Button */}
      <button onClick={resetFilters} className="btn cfs-btn fullwidth_btn">
        Reset Filters
      </button>

      {/* Modal */}
     {isModalOpen && (
  <div className="cfs-modal">
    <div className="cfs-modal-content">
      <div className="cfs-modal-header">
        <span onClick={() => setIsModalOpen(false)} className="cfs-close">×</span>
      </div>

      <div className="cfs-modal-body">
        <div className="cfs-modal-search-section">
          <h5 className="cfs-filter-label">Select Location</h5>
          <input
            type="text"
            placeholder="Suburb, Postcode..."
            className="filter-dropdown cfs-select-input"
            autoComplete="off"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        {locationSuggestions.map((loc, index) => (
  <li
    key={index}
    onClick={() => {
      setSelectedLocation(loc.short_address)
      setLocationInput(loc.short_address)
      setLocationSuggestions([])
    }}
  >
    {loc.short_address} {/* ✅ this is a string */}
  </li>
))}

        </div>
      </div>

      <div className="cfs-modal-footer">
        <button
          type="button"
          className="cfs-btn btn"
          onClick={() => {
            console.log('Selected Location:', selectedLocation)
            setIsModalOpen(false)
          }}
        >
          Search
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default CaravanFilter
