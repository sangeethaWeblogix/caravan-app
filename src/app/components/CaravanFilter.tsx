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
  from_price?: string | number; // ✅ add this
  to_price?: string | number;
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
  currentFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}

interface Option {
  name: string;
  slug: string;
}
const CaravanFilter: React.FC<CaravanFilterProps> = ({
  onFilterChange,
  currentFilters,
}) => {
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
  const setPendingLocation = useState<string>("")[1];
  const setPendingState = useState<StateOption | null>(null)[1];
  const conditionDatas = ["Near New", "New", "Used"];
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedSleepName, setSelectedSleepName] = useState<string>(
    currentFilters?.sleeps?.replace("-people", "") || ""
  );

  const atm = [
    600, 800, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000,
    4500,
  ];

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

  useEffect(() => {
    if (currentFilters?.sleeps) {
      setSelectedSleepName(currentFilters.sleeps.replace("-people", ""));
    }
  }, [currentFilters?.sleeps]);

  useEffect(() => {
    if (selectedSleepName) {
      setFilters((prev) => ({
        ...prev,
        sleeps: `${selectedSleepName}-people`,
      }));
    }
  }, [selectedSleepName]);

  const isAnyFilterSelected = Boolean(
    selectedCategory ||
      selectedMake ||
      selectedLocation ||
      selectedConditionName ||
      selectedSleepName ||
      selectedState ||
      atmFrom ||
      atmTo ||
      minPrice || // ✅ include minPrice
      maxPrice
  );

  // 🛠️ PATCHED CaravanFilter.tsx (only the price-from conflict fix shown)

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];

    // ✅ Detect ATM values from slug
    if (slug?.includes("between") && slug?.includes("kg-atm")) {
      const match = slug.match(/between-(\d+)-kg-(\d+)-kg-atm/);
      if (match) {
        const from = parseInt(match[1]);
        const to = parseInt(match[2]);
        setAtmFrom(from);
        setAtmTo(to);
      }
    } else if (slug?.includes("over") && slug?.includes("kg-atm")) {
      const match = slug.match(/over-(\d+)-kg-atm/);
      if (match) {
        setAtmFrom(parseInt(match[1]));
        setAtmTo(null);
      }
    } else if (slug?.includes("under") && slug?.includes("kg-atm")) {
      const match = slug.match(/under-(\d+)-kg-atm/);
      if (match) {
        setAtmFrom(null);
        setAtmTo(parseInt(match[1]));
      }
    }

    // ✅ Detect Price Slug specifically — prevent overlap with "over-3-people"
    if (slug?.match(/between-(\d+)-(\d+)$/)) {
      const match = slug.match(/between-(\d+)-(\d+)$/);
      if (match) {
        setMinPrice(parseInt(match[1]));
        setMaxPrice(parseInt(match[2]));
      }
    } else if (slug?.match(/over-(\d+)$/)) {
      const match = slug.match(/over-(\d+)$/);
      if (match) {
        setMinPrice(parseInt(match[1]));
        setMaxPrice(null);
      }
    } else if (slug?.match(/under-(\d+)$/)) {
      const match = slug.match(/under-(\d+)$/);
      if (match) {
        setMinPrice(null);
        setMaxPrice(parseInt(match[1]));
      }
    }

    // ✅ Detect condition
    const conditionMatch = slug?.match(/(near-new|new|used)-condition/);
    if (conditionMatch) {
      const matchedCondition = conditionMatch[1].replace(/-/g, " ");
      setSelectedConditionName(
        matchedCondition
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      );
    }

    // ✅ Detect sleeps separately
    const sleepSlugMatch = slug?.match(/over-(\d+)-people-sleeping-capacity/);
    if (sleepSlugMatch) {
      const sleepValue = sleepSlugMatch[1];
      setSelectedSleepName(sleepValue);
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
    if (condition && !selectedConditionName)
      setSelectedConditionName(condition);
    const sleeps = searchParams.get("sleeps");
    if (sleeps) setSelectedSleepName(sleeps);

    // ✅ Trigger filter after all values are set
    setTimeout(() => {
      onFilterChange({
        category: categoryMatch?.slug,
        location: stateMatch?.value,
        make: make || undefined,
        condition: selectedConditionName || undefined,
        sleeps: selectedSleepName ? `${selectedSleepName}-people` : undefined,
        minKg: atmFrom || undefined,
        maxKg: atmTo || undefined,
        from_price: minPrice || undefined, // ✅ Add this
        to_price: maxPrice || undefined,
      });
    }, 0);
  }, [
    pathname,
    categories,
    makes,
    states,
    searchParams,
    onFilterChange,
    atmFrom,
    atmTo,
    minPrice,
    maxPrice,
    selectedConditionName,
    selectedSleepName,
  ]);
  const handleSuburbSelection = (shortAddress: string) => {
    setLocationInput(shortAddress);

    const match = shortAddress.match(/^(.+?)\s+[A-Z]{2,}\s+(\d{4})$/);
    if (!match) return;

    const suburbName = match[1].trim().toLowerCase();
    // const postcode = match[2];

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
      sleeps: selectedSleepName ? `${selectedSleepName}-people` : undefined,
      maxKg: atmTo || undefined,
      from_price: minPrice || undefined,
      to_price: maxPrice || undefined,
    };
    console.log("Triggered Filters:", filters);

    onFilterChange(newFilters);
    console.log("Triggered :", newFilters);
    console.log("➡️ Final Filters to Parent", newFilters);

    const slugParts: string[] = [];
    if (
      selectedConditionName &&
      !selectedCategory &&
      !selectedState &&
      !selectedSuburbName &&
      !selectedMake &&
      !atmFrom &&
      !atmTo &&
      !minPrice &&
      !maxPrice &&
      !selectedSleepName
    ) {
      slugParts.push(
        `${selectedConditionName.toLowerCase().replace(/\s+/g, "-")}-condition`
      );
      const finalURL = `/listings/${slugParts.join("/")}`;
      router.push(finalURL);
      return;
    }

    if (selectedCategory) {
      slugParts.push(`${selectedCategory}-category`);
    }

    if (selectedSleepName) {
      slugParts.push(`over-${selectedSleepName}-people-sleeping-capacity`);
    }

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

    // price
    if (minPrice && maxPrice) {
      slugParts.push(`between-${minPrice}-${maxPrice}`);
    } else if (minPrice) {
      slugParts.push(`over-${minPrice}`);
    } else if (maxPrice) {
      slugParts.push(`under-${maxPrice}`);
    }

    // Condition
    if (selectedConditionName) {
      slugParts.push(
        `${selectedConditionName.toLowerCase().replace(/\s+/g, "-")}-condition`
      );
    }

    let slugifiedURL = `/listings/${slugParts.join("/")}`
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    // Query Params (preserve selected filters)
    const query: Record<string, string> = {};
    if (selectedConditionName) query.condition = selectedConditionName;
    if (selectedMake) query.make = selectedMake;

    const queryString = new URLSearchParams(query).toString();
    if (queryString) slugifiedURL += `?${queryString}`;

    router.push(slugifiedURL);
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
      {/* ATM Range */}
      <div className="cs-full_width_section">
        <h5 className="cfs-filter-label">ATM</h5>
        <div className="row">
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">From</h6>
            <select
              className="cfs-select-input"
              value={atmFrom?.toString() || ""}
              onChange={(e) =>
                setAtmFrom(e.target.value ? parseInt(e.target.value) : null)
              }
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
              value={atmTo?.toString() || ""}
              onChange={(e) =>
                setAtmTo(e.target.value ? parseInt(e.target.value) : null)
              }
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
            <select
              className="cfs-select-input"
              value={minPrice?.toString() || ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? parseInt(e.target.value) : null)
              }
            >
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
            <select
              className="cfs-select-input"
              value={maxPrice?.toString() || ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
              }
            >
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
      {/* Sleep Range */}
      {/* Sleeps Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setSleepsOpen)}>
          <h5 className="cfs-filter-label">
            Sleep
            {selectedSleepName && (
              <span className="filter-accordion-items">
                : {selectedSleepName} People
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
                  selectedSleepName === String(sleepValue) ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedSleepName(String(sleepValue));
                  setSleepsOpen(false);
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
