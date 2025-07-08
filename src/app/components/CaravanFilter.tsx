"use client";

import { fetchLocations } from "@/api/location/api";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchProductList } from "@/api/productList/api";

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

interface StateOption {
  value: string;
  name: string;
  regions?: {
    name: string;
    value: string;
    suburbs?: {
      name: string;
      value: string;
    }[];
  }[];
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
  condition?: string;
  sleeps?: string;
  states?: string;
  minKg?: string | number;
  maxKg?: string | number;
}

interface CaravanFilterProps {
  categories: Category[];
  makes: Make[];
  states: StateOption[];
  onFilterChange: (filters: Filters) => void;
}

interface Option {
  name: string;
  slug: string;
}
const CaravanFilter: React.FC<CaravanFilterProps> = ({ onFilterChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Option[]>([]);
  const [makes, setMakes] = useState<Option[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [makeOpen, setMakeOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
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
  const [stateOpen, setStateOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null
  );
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(
    null
  );
  const [selectedSuburbName, setSelectedSuburbName] = useState<string | null>(
    null
  );
  const [atmFrom, setAtmFrom] = useState<number | null>(null);
  const [atmTo, setAtmTo] = useState<number | null>(null);

  const conditionDatas = ["Near New", "New", "Used"];
  const [pendingLocation, setPendingLocation] = useState<string>("");
  const [pendingState, setPendingState] = useState<StateOption | null>(null);

  const atm = [600, 800, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750];

  const price = [
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000,
  ];

  const years = Array.from(
    { length: new Date().getFullYear() - 1914 + 1 },
    (_, i) => 1914 + i
  );

  const length = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  const sleep = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    const loadFilters = async () => {
      const res = await fetchProductList();
      if (res?.data) {
        setCategories(res.data.all_categories || []);
        setMakes(res.data.make_options || []);
        setStates(res.data.states || []);
      }
    };
    loadFilters();
  }, []);

  console.log("filters", filters);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  useEffect(() => {
    if (selectedCategory) {
      setFilters((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  const isAnyFilterSelected = Boolean(
    selectedCategory ||
      selectedMake ||
      selectedLocation ||
      selectedConditionName ||
      selectedSleepName ||
      selectedState ||
      atmFrom ||
      atmTo
  );
  useEffect(() => {
    const slug = pathname.split("/listings/")[1];

    if (slug?.includes("over") && slug?.includes("kg-atm")) {
      const value = parseInt(slug.split("-")[1]);
      setAtmFrom(value);
      setAtmTo(null);
      setFilters((prev) => ({ ...prev, minKg: value, maxKg: undefined }));
    } else if (slug?.includes("under") && slug?.includes("kg-atm")) {
      const value = parseInt(slug.split("-")[1]);
      setAtmFrom(null);
      setAtmTo(value);
      setFilters((prev) => ({ ...prev, minKg: undefined, maxKg: value }));
    } else if (slug?.includes("between") && slug?.includes("kg-atm")) {
      const [from, to] = slug
        .replace("between-", "")
        .replace("-kg-atm", "")
        .split("-")
        .map(Number);
      setAtmFrom(from);
      setAtmTo(to);
      setFilters((prev) => ({ ...prev, minKg: from, maxKg: to }));
    }
  }, [pathname]);

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const suburbSlug = pathParts[1]?.replace("-suburb", "") || "";
    const stateSlug = pathParts[2]?.replace("-state", "") || "";
    const postcode = pathParts[3] || "";

    if (!suburbSlug || !stateSlug || !postcode) return;

    let matchedState: StateOption | null = null;
    let matchedRegionName: string | null = null;
    let matchedSuburbName: string | null = null;

    for (const state of states) {
      if (state.name.toLowerCase().replace(/\s+/g, "-") === stateSlug) {
        matchedState = state;
        for (const region of state.regions || []) {
          for (const suburb of region.suburbs || []) {
            if (suburb.name.toLowerCase().replace(/\s+/g, "-") === suburbSlug) {
              matchedRegionName = region.name;
              matchedSuburbName = suburb.name;
              break;
            }
          }
          if (matchedSuburbName) break;
        }
        break;
      }
    }

    if (matchedState && matchedSuburbName) {
      setSelectedState(matchedState.value);
      setSelectedStateName(matchedState.name);
      setSelectedRegionName(matchedRegionName);
      setSelectedSuburbName(matchedSuburbName);
      setLocationInput(`${matchedSuburbName} ACT ${postcode}`);
      setFilters((prev) => ({
        ...prev,
        location: matchedState.value,
      }));
    }
  }, [pathname, states]);

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean); // ex: ["listings", "queensland-state"]
    const slug1 = pathParts[1]; // could be category or state
    const slug2 = pathParts[2]; // could be undefined or state

    let categoryMatch: Option | undefined;
    let stateMatch: StateOption | undefined;

    // Check if slug1 is category
    if (slug1?.endsWith("-category")) {
      const categorySlug = slug1.replace(/-category$/, "");
      categoryMatch = categories.find((cat) => cat.slug === categorySlug);
    }

    // Now check state (either in slug2 if category exists, or slug1 if only state)
    const rawStateSlug =
      slug2 ?? (slug1?.endsWith("-state") ? slug1 : undefined);
    const matchedState = states.find(
      (s) =>
        rawStateSlug === `${s.name.toLowerCase().replace(/\s+/g, "-")}-state`
    );
    if (matchedState) {
      stateMatch = matchedState;
    }
    // Update filters
    if (categoryMatch) {
      setSelectedCategory(categoryMatch.slug);
      setSelectedCategoryName(categoryMatch.name);
    }

    if (stateMatch) {
      setSelectedState(stateMatch.value);
      setSelectedStateName(stateMatch.name);
    }

    // Search Params: make, condition, sleeps
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

    // ✅ Trigger filter after all values are set
    setTimeout(() => {
      onFilterChange({
        category: categoryMatch?.slug,
        location: stateMatch?.value,
        make: make || undefined,
        condition: condition || undefined,
        sleeps: sleeps || undefined,
        minKg: atmFrom || undefined,
        maxKg: atmTo || undefined,
      });
    }, 0);
  }, [pathname, categories, makes, states, searchParams, onFilterChange]);

  const handleSuburbSelection = (shortAddress: string) => {
    setLocationInput(shortAddress);

    const match = shortAddress.match(/^(.+?)\s+[A-Z]{2,}\s+(\d{4})$/);
    if (!match) return;

    const suburbName = match[1].trim().toLowerCase();
    const postcode = match[2];

    let matchedState: StateOption | undefined;
    let suburbSlug: string | undefined;

    for (const state of states) {
      for (const region of state.regions || []) {
        for (const suburb of region.suburbs || []) {
          if (suburb.name.toLowerCase() === suburbName) {
            matchedState = state;
            suburbSlug = suburb.value?.split(".")[0];
            break;
          }
        }
        if (matchedState) break;
      }
      if (matchedState) break;
    }

    if (matchedState && suburbSlug) {
      setPendingLocation(shortAddress);
      setPendingState(matchedState);
    }
  };

  useEffect(() => {
    console.log("Triggered Filters:", {
      category: selectedCategory,
      location: selectedState,
      make: selectedMake,
      condition: selectedConditionName,
      sleeps: selectedSleepName,
    });
  }, [
    selectedCategory,
    selectedState,
    selectedMake,
    selectedConditionName,
    selectedSleepName,
  ]);

  const handleSearch = () => {
    const newFilters: Filters = {
      category: selectedCategory || undefined,
      make: selectedMake || undefined,
      location: selectedState || undefined,
      condition: selectedConditionName || undefined,
      sleeps: selectedSleepName || undefined,
      minKg: atmFrom || undefined,
      maxKg: atmTo || undefined,
    };

    onFilterChange(newFilters);

    const slugParts: string[] = [];

    // Add suburb
    if (selectedSuburbName) {
      slugParts.push(
        `${selectedSuburbName.toLowerCase().replace(/\s+/g, "-")}-suburb`
      );
    }

    // Add state
    if (selectedStateName) {
      slugParts.push(
        `${selectedStateName.toLowerCase().replace(/\s+/g, "-")}-state`
      );
    }

    // Add postcode
    const match = locationInput.match(/\b\d{4}\b/);
    if (match) {
      slugParts.push(match[0]);
    }

    // 🔥 Add ATM-based slug logic
    if (atmFrom && atmTo) {
      slugParts.push(`between-${atmFrom}-kg-${atmTo}-kg-atm`);
    } else if (atmFrom) {
      slugParts.push(`over-${atmFrom}-kg-atm`);
    } else if (atmTo) {
      slugParts.push(`under-${atmTo}-kg-atm`);
    }

    const finalURL = `/listings/${slugParts.join("/")}`;
    router.push(finalURL);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSelectedMake(null);
    setSelectedMakeName(null);
    setSelectedLocation("");
    setSelectedConditionName(null);
    setSelectedSleepName("");
    setLocationInput("");
    setLocationSuggestions([]);
    setAtmFrom(null);
    setAtmTo(null);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (locationInput.length >= 2) {
        fetchLocations(locationInput)
          .then((data) => {
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
                    setSelectedCategoryName(cat.name);
                    setCategoryOpen(false);
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
              <span className="filter-accordion-items">
                {selectedStateName}
                {selectedRegionName && `  ${selectedRegionName}`} <br />
                {selectedSuburbName && `  ${selectedSuburbName}`}
              </span>
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
            <select
              className="cfs-select-input"
              value={atmFrom ?? ""}
              onChange={(e) =>
                setAtmFrom(e.target.value ? parseInt(e.target.value) : null)
              } // Convert to number
            >
              <option value="">Min</option>
              {atm.map((val) => (
                <option key={val} value={val}>
                  {val} kg
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select
              className="cfs-select-input"
              value={
                atmTo !== null && atmTo !== undefined ? atmTo.toString() : ""
              }
              onChange={(e) =>
                setAtmTo(e.target.value ? parseInt(e.target.value) : null)
              } // Convert to number
            >
              <option value="">Max</option>
              {atm.map((val) => (
                <option key={val} value={val}>
                  {val} kg
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
              {price.map((value, idx) => (
                <option key={idx} value={value}>
                  $ {value}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Max</option>
              {price.map((value, idx) => (
                <option key={idx} value={value}>
                  $ {value}
                </option>
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
            {sleep.map((sleepValue, index) => (
              <div
                key={index}
                className={`filter-accordion-item ${
                  String(sleepValue) === selectedConditionName ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedSleepName(String(sleepValue));
                  setConditionOpen(false);
                }}
              >
                {sleepValue} People
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
              {years.map((value, idx) => (
                <option key={idx} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Max</option>
              {years.map((value, idx) => (
                <option key={idx} value={value}>
                  {value}
                </option>
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
                <option key={idx} value={value}>
                  {value} ft
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select className="cfs-select-input">
              <option value="">Min</option>
              {length.map((value, idx) => (
                <option key={idx} value={value}>
                  {value} ft
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
                      handleSuburbSelection(loc.short_address); // e.g., "Bass Hill NSW 2197"
                    }}
                  >
                    {loc.short_address}
                  </li>
                ))}
              </div>
            </div>

            <div className="cfs-modal-footer">
              <button
                type="button"
                className="cfs-btn btn"
                onClick={() => {
                  const input = locationInput.trim();

                  if (!input) {
                    setSelectedState(null);
                    setSelectedStateName(null);
                    setSelectedRegionName(null);
                    setSelectedSuburbName(null);
                    setIsModalOpen(false);
                    return;
                  }

                  const match = input.match(/^(.+?)\s+[A-Z]{2,}\s+(\d{4})$/);

                  if (match) {
                    const suburbName = match[1].trim().toLowerCase();

                    let matchedState: StateOption | null = null;
                    let matchedRegionName: string | null = null;
                    let matchedSuburbName: string | null = null;

                    for (const state of states) {
                      for (const region of state.regions || []) {
                        for (const suburb of region.suburbs || []) {
                          if (suburb.name.trim().toLowerCase() === suburbName) {
                            matchedState = state;
                            matchedRegionName = region.name;
                            matchedSuburbName = suburb.name;
                            break;
                          }
                        }
                        if (matchedState) break;
                      }
                      if (matchedState) break;
                    }

                    if (matchedState) {
                      setSelectedState(matchedState.value);
                      setSelectedStateName(matchedState.name);
                      setSelectedRegionName(matchedRegionName);
                      setSelectedSuburbName(matchedSuburbName);

                      setFilters((prev) => ({
                        ...prev,
                        location: matchedState.value,
                      }));
                    }
                  }

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
