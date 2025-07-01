 "use client";

import { fetchLocations } from "@/api/location/api";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

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

interface State {
   value: string;
  name: string;
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
  states?: string;
}


interface CaravanFilterProps {
  categories: Category[];
  makes: Make[];
  year: string[] | number[];
price: string | string[] | number[];
  length: string[] | number[];
  sleep: string[] | number[];
  atm: string | string[] | number[];
  states: State[]
  onFilterChange: (filters: Filters) => void;
}





const CaravanFilter: React.FC<CaravanFilterProps> = ({
  categories,
  makes,
  onFilterChange,
   atm,
  length,
  price,
  year,
  sleep,
  states 
}) => {
  const router = useRouter();
  const pathname = usePathname();
 const searchParams = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [makeOpen, setMakeOpen] = useState(false);

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
   const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
 const [stateOpen, setStateOpen] = useState(false);
const [selectedState, setSelectedState] = useState<string | null>(null);
const [selectedStateName, setSelectedStateName] = useState<string | null>(null);

const atmValues = Array.isArray(atm)
  ? atm.map(Number)
  : typeof atm === 'string'
  ? atm.split(',').map(Number)
  : [];
const priceOptions = Array.isArray(price)
  ? price.map((p) => String(p))
  : typeof price === "string"
  ? price.split(",").map((p) => p.trim())
  : [];
const conditionDatas = ['Near New', 'New', 'Used']

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
  selectedSleepName ||
  selectedState
);

 useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const rawCategory = pathParts[1];
    
    const categorySlug = rawCategory?.replace(/-category$/, ""); // ✅ becomes "family"
 const categoryMatch = categories.find(cat => cat.slug === categorySlug);
     if (categoryMatch) {
       setSelectedCategory(categoryMatch.slug);
       setSelectedCategoryName(categoryMatch.name);
     }
    const rawState = pathParts[2];


    const stateMatch = states.find(
      (s) => rawState === `${s.name.toLowerCase().replace(/\s+/g, "-")}-state`
    );
    if (stateMatch) {
      setSelectedState(stateMatch.value);
      setSelectedStateName(stateMatch.name);
    }

    const make = searchParams.get("make");
    if (make) {
      setSelectedMake(make);
      const makeMatch = makes.find((m) => m.slug === make);
      if (makeMatch) setSelectedMakeName(makeMatch.name);
    }

    const condition = searchParams.get("condition");
    if (condition) setSelectedConditionName(condition);

    const sleeps = searchParams.get("sleeps");
    if (sleeps) setSelectedSleepName(sleeps);
  }, [pathname, categories, makes, states, searchParams]);

 

const handleSearch = () => {
  const filters: Filters = {
    category: selectedCategory ?? undefined,
    make: selectedMake ?? undefined,
    location: selectedLocation || undefined,
    condition: selectedConditionName ?? undefined,
    sleeps: selectedSleepName || undefined,
    states: selectedState ?? undefined,
  };

  onFilterChange(filters); // 🟡 Trigger listing update first

  const categorySlugForURL = selectedCategory
    ? `${selectedCategory}-category`
    : "all";

  const stateSlug = selectedStateName
    ? selectedStateName.toLowerCase().replace(/\s+/g, "-") + "-state"
    : "";

  const finalUrl = `/listings/${categorySlugForURL}/${stateSlug}`;

  // ✅ Slight delay to let filter update trigger before navigation
  setTimeout(() => {
    router.push(finalUrl);
  }, 50);
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

      {/* State Filter Accordion */}
<div className="cs-full_width_section">
  <div className="filter-accordion" onClick={() => toggle(setStateOpen)}>
    <h5 className="cfs-filter-label">
      Location
      {selectedStateName && (
        <span className="filter-accordion-items">: {selectedStateName}</span>
      )}
    </h5>
    <BiChevronDown />
  </div>

  {stateOpen && (
    <div className="filter-accordion-items">
      {Array.isArray(states) &&
  states.map((state) => (
    <div
      key={state.value}
      className={`filter-accordion-item ${
        selectedState === state.value ? "selected" : ""
      }`}
      onClick={() => {
        setSelectedState(state.value);
        setSelectedStateName(state.name);
        setStateOpen(false);
      }}
    >
      {state.name}
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
              {atmValues.map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
             {atmValues.map((val) => (
          <option key={val} value={val}>{val}</option>
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
              {priceOptions.map((value, idx) => (
          <option key={idx} value={value}>{value}</option>
        ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Max</option>
              {priceOptions.map((value, idx) => (
          <option key={idx} value={value}>{value}</option>
        ))}
            </select>
          </div>
        </div>
      </div>
{/* 8883944599
9524163042 */}
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
           {conditionDatas.map((condition, index) => (
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
            {sleep.map((sleep, index) => (
  <div
    key={index}
    className={`filter-accordion-item ${
      selectedConditionName === sleep ? "selected" : ""
    }`}
    onClick={() => {
  setSelectedSleepName(String(sleep));   
     setConditionOpen(false);
    }}
  >
    {sleep}
  </div>
))}
          </div>
        )}
      </div>

      {/* Year Range */}
    <div className="cs-full_width_section">
        <h5 className="cfs-filter-label">Price</h5>
        <div className="row">
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">From</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
              {year.map((value, idx) => (
          <option key={idx} value={value}>{value}</option>
        ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Max</option>
              {year.map((value, idx) => (
          <option key={idx} value={value}>{value}</option>
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
              {length.map((value, idx) => (
          <option key={idx} value={value}>{value} ft</option>
        ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
               {length.map((value, idx) => (
          <option key={idx} value={value}>{value} ft</option>
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
   <button
          type="button"
          className="btn cfs-btn fullwidth_btn"
          disabled={!isAnyFilterSelected}
          onClick={handleSearch}
        >
          Search Filter
        </button>

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
 