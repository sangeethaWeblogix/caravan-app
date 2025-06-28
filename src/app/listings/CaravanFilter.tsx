"use client";

import { fetchLocations } from "@/api/location/api";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";

type LocationSuggestion = {
  key: string;
  uri: string;
  address: string;
  short_address: string;
};

interface Category {
  name: string;
  slug: string;
}

interface Make {
  name: string;
  slug: string;
}
export interface Filters {
  category?: string;
  make?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minKg?: string;
  maxKg?: string;
  condition?: string;
  sleeps?: string;
}


interface CaravanFilterProps {
  categories: Category[];
  makes: Make[];
  products: Product[];
    onFilterChange: (filters: Filters) => void;
}

interface Product {
  id: number;
  name: string;
  length: string;
  kg: string;
  regular_price: string;
  sale_price?: string;
  price_difference?: string;
  image: string;
  link: string;
  location?: string;
  categories?: string[];
  condition?: string;
  people?: string;
}

const CaravanFilter: React.FC<CaravanFilterProps> = ({
  categories,
  makes,
  onFilterChange,
  products,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [makeOpen, setMakeOpen] = useState(false);
  const [moreMakeShown, setMoreMakeShown] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [sleepsOpen, setSleepsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSleepName, setSelectedSleepName] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [selectedMakeName, setSelectedMakeName] = useState<string | null>(null);
  const [selectedConditionName, setSelectedConditionName] = useState<
    string | null
  >(null);
 
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const isAnyFilterSelected = Boolean(
  selectedCategory ||
  selectedMake ||
  selectedLocation ||
  selectedConditionName ||
  selectedSleepName
);


 const handleSearch = () => {
  if (!isAnyFilterSelected) return;

  const filters = {
    category: selectedCategoryName,
    make: selectedMakeName,
    location: selectedLocation,
    condition: selectedConditionName,
    sleeps: selectedSleepName
  };

  console.log('🔍 Applied Filters:', filters);
};


  const resetFilters = () => {
   setSelectedCategory(null)
  setSelectedCategoryName(null)
  setSelectedMake(null)
  setSelectedMakeName(null)
  setSelectedLocation('')
  setSelectedConditionName(null)
  setSelectedSleepName('')
  setLocationInput('')
  setLocationSuggestions([])
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (locationInput.length >= 2) {
        fetchLocations(locationInput)
          .then((data) => {
            console.log("✅ API Result:", data); // should show array of objects
            setLocationSuggestions(data); // ← keep full object
          })
          .catch(console.error);
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [locationInput]);
  return (
    <div className="filter-card mobile-search">
      <div className="card-title align-items-center d-flex justify-content-between hidden-xs">
        <h3 className="filter_title">Filter</h3>
      </div>

      {/* Category Accordion */}
      <div className="cs-full_width_section">
        <div
          className="filter-accordion"
          onClick={() => toggle(setCategoryOpen)}
        >
          <h5 className="cfs-filter-label">
            {" "}
            Categorie
            {selectedCategoryName && (
              <span className="filter-accordion-items">
                : {selectedCategoryName}
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>

        {categoryOpen && (
          <div className="filter-accordion-items">
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <div
                  key={cat.slug}
                  className={`filter-accordion-item ${
                    selectedCategory === cat.slug ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSelectedCategoryName(cat.name); // Show name near label
                    setCategoryOpen(false); // Close dropdown
                  }}
                >
                  {cat.name}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Location Accordion */}

      <div className="cs-full_width_section">
        <div
          className="filter-accordion"
          onClick={() => toggle(setLocationOpen)}
        >
          <h5 className="cfs-filter-label">
            {" "}
            Location
            {selectedLocation && (
              <span className="filter-accordion-items">
                : {selectedLocation}
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>

        {locationOpen && (
          <div className="filter-accordion-items">
            {products.map((product) => (
              <div
                key={product.id}
                className={`filter-accordion-item ${
                  selectedLocation === product.location ? "selected" : ""
                }`}
                onClick={() => {
                  if (product.location) {
                    setSelectedLocation(product.location);
                    setLocationOpen(false);
                  }
                }}
              >
                {product.location}
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
          <h5 className="cfs-filter-label">
            {" "}
            Make
            {selectedMakeName && (
              <span className="filter-accordion-items">
                : {selectedMakeName}
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>

        {makeOpen && (
          <div className="filter-accordion-items">
            {Array.isArray(makes) &&
              makes.map((make) => (
                <div
                  key={make.slug}
                  className={`filter-accordion-item ${
                    selectedMake === make.slug ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedMake(make.slug);
                    setSelectedMakeName(make.name); // Show name near label
                    setMakeOpen(false); // Close dropdown
                  }}
                >
                  {make.name}
                </div>
              ))}
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
              {products
                .filter((product) => product.kg?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.kg}>
                    {product.kg}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
              {products
                .filter((product) => product.kg?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.kg}>
                    {product.kg}
                  </option>
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
              {products
                .filter((product) => product.regular_price?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.regular_price}>
                    {product.regular_price}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Max</option>
              {products
                .filter((product) => product.regular_price?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.regular_price}>
                    {product.regular_price}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Condition Accordion */}
      <div className="cs-full_width_section">
        <div
          className="filter-accordion"
          onClick={() => toggle(setConditionOpen)}
        >
          <h5 className="cfs-filter-label">
            {" "}
            Condition
            {selectedConditionName && (
              <span className="filter-accordion-items">
                : {selectedConditionName}
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>

        {conditionOpen && (
          <div className="filter-accordion-items">
            {products
              .map((p) => p.condition)
              .filter((c): c is string => !!c)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((condition, index) => (
                <div
                  key={index}
                  className={`filter-accordion-item ${
                    selectedConditionName === condition ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedConditionName(condition);
                    setConditionOpen(false);
                  }}
                >
                  {condition}
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Sleeps Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setSleepsOpen)}>
          <h5 className="cfs-filter-label">
            {" "}
            Sleep
            {selectedConditionName && (
              <span className="filter-accordion-items">
                : {selectedSleepName}
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>

        {sleepsOpen && (
          <div className="filter-accordion-items">
            {products
              .map((p) => p.people)
              .filter((c): c is string => !!c)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((sleep, index) => (
                <div
                  key={index}
                  className={`filter-accordion-item ${
                    selectedSleepName === sleep ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedSleepName(sleep);
                    setSleepsOpen(false);
                  }}
                >
                  {sleep}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Year Range */}
      {/* <div className="cs-full_width_section">
  <h5 className="cfs-filter-label">Length</h5>
  <div className="row">
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">From</h6>
     <select className="cfs-select-input">
  <option value="">Min</option>
  {products
    .filter(product => product.length?.trim() !== '')  
    .map(product => (
      <option key={product.id} value={product.length}>
        {product.length}
      </option>
  ))}
</select>

    </div>
    <div className="col-6">
      <h6 className="cfs-filter-label-sub">To</h6>
     <select className="cfs-select-input">
  <option value="">Min</option>
  {products
    .filter(product => product.length?.trim() !== '')  
    .map(product => (
      <option key={product.id} value={product.length}>
        {product.length}
      </option>
  ))}
</select>
    </div>
  </div>
</div> */}

      {/* Length Range */}
      <div className="cs-full_width_section">
        <h5 className="cfs-filter-label">Length</h5>
        <div className="row">
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">From</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
              {products
                .filter((product) => product.length?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.length}>
                    {product.length}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
              {products
                .filter((product) => product.length?.trim() !== "")
                .map((product) => (
                  <option key={product.id} value={product.length}>
                    {product.length}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Keyword Search (hidden or toggle if needed) */}
      <div className="cs-full_width_section" style={{ display: "none" }}>
        <h5 className="cfs-filter-label">Keyword</h5>
        <input
          type="text"
          className="cfs-select-input"
          placeholder="Search by keyword"
        />
      </div>
      <div className="search_float_btn">
  <button type="button" className="btn cfs-btn fullwidth_btn"
   disabled={!isAnyFilterSelected}
  onClick={() =>
    onFilterChange({
     category: selectedCategoryName ?? undefined,
    make: selectedMakeName ?? undefined,
    location: selectedLocation || undefined,
    condition: selectedConditionName ?? undefined,
    sleeps: selectedSleepName || undefined
    })
  }
  >Search Filter</button>
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
              <span onClick={() => setIsModalOpen(false)} className="cfs-close">
                ×
              </span>
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
                      setSelectedLocation(loc.short_address);
                      setLocationInput(loc.short_address);
                      setLocationSuggestions([]);
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
                  console.log("Selected Location:", selectedLocation);
                  setIsModalOpen(false);
                }}
              >
                Search
              </button>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default CaravanFilter;
