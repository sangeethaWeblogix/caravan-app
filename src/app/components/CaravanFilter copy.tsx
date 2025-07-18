"use client";

import { fetchLocations } from "@/api/location/api";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { BiChevronDown } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchProductList } from "@/api/productList/api";
import { fetchModelsByMake } from "@/api/model/api";
import "./subrub.css";
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
interface Model {
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
  from_year?: number | string;
  to_year?: number | string;
  from_length?: string | number;
  to_length?: string | number;
  model?: string;
}

interface CaravanFilterProps {
  categories: Category[];
  makes: Make[];
  models: Model[];
  states: StateOption[];
  currentFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}

interface Option {
  name: string;
  slug: string;
}
interface Model {
  name: string;
  slug: string;
}

const CaravanFilter: React.FC<CaravanFilterProps> = ({
  onFilterChange,
  currentFilters,
  models,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Option[]>([]);
  const [makes, setMakes] = useState<Option[]>([]);
  const [model, setModel] = useState<Model[]>([]);

  const [states, setStates] = useState<StateOption[]>([]);
  const [makeOpen, setMakeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({});
  const [conditionOpen, setConditionOpen] = useState(false);
  const [sleepsOpen, setSleepsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [selectedMakeName, setSelectedMakeName] = useState<string | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string | null>(
    null
  );

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
  const [lengthFrom, setLengthFrom] = useState<number | null>(null);
  const [lengthTo, setLengthTo] = useState<number | null>(null);

  const conditionDatas = ["Near New", "New", "Used"];
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedSleepName, setSelectedSleepName] = useState<string>(
    currentFilters?.sleeps?.replace("-people", "") || ""
  );
  const filtersInitialized = useRef(false);
  const [yearFrom, setYearFrom] = useState<number | null>(null);
  const [yearTo, setYearTo] = useState<number | null>(null);
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  const setPendingLocation = useState<string>("")[1];
  const setPendingState = useState<StateOption | null>(null)[1];
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

  const length = [
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  ];

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

  useEffect(() => {
    if (!selectedMake) {
      // nothing selected – clear everything
      setModel([]);
      setSelectedModel(null);
      setSelectedModelName(null);
      return;
    }

    /* 👇 clear old model BEFORE fetching the new list */
    setSelectedModel(null);
    setSelectedModelName(null);

    fetchModelsByMake(selectedMake)
      .then(setModel) // model list for the new make
      .catch(console.error);
  }, [selectedMake]);

  console.log("filters", filters);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    segments.forEach((part) => {
      // ATM: over
      const overAtmMatch = part.match(/^over-(\d+)-kg-atm$/);
      if (overAtmMatch) {
        setAtmFrom(parseInt(overAtmMatch[1]));
        setAtmTo(null);
      }

      // ATM: under
      const underAtmMatch = part.match(/^under-(\d+)-kg-atm$/);
      if (underAtmMatch) {
        setAtmFrom(null);
        setAtmTo(parseInt(underAtmMatch[1]));
      }

      // ATM: between
      const betweenAtmMatch = part.match(/^between-(\d+)-kg-(\d+)-kg-atm$/);
      if (betweenAtmMatch) {
        setAtmFrom(parseInt(betweenAtmMatch[1]));
        setAtmTo(parseInt(betweenAtmMatch[2]));
      }

      // Price: over
      const overPriceMatch = part.match(/^over-(\d+)$/);
      if (overPriceMatch) {
        setMinPrice(parseInt(overPriceMatch[1]));
        setMaxPrice(null);
      }

      // Price: under
      const underPriceMatch = part.match(/^under-(\d+)$/);
      if (underPriceMatch) {
        setMinPrice(null);
        setMaxPrice(parseInt(underPriceMatch[1]));
      }

      // Price: between
      const betweenPriceMatch = part.match(/^between-(\d+)-(\d+)$/);
      if (betweenPriceMatch) {
        setMinPrice(parseInt(betweenPriceMatch[1]));
        setMaxPrice(parseInt(betweenPriceMatch[2]));
      }

      // Condition
      const conditionMatch = part.match(/(near-new|new|used)-condition/);
      if (conditionMatch) {
        const formatted = conditionMatch[1]
          .split("-")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ");
        setSelectedConditionName(formatted);
      }

      // Sleeps
      const sleepMatch = part.match(/^over-(\d+)-people-sleeping-capacity$/);
      if (sleepMatch) {
        setSelectedSleepName(sleepMatch[1]);
      }

      const yearRangeMatch = part.match(/^between-(\d+)-and-(\d+)-year-range$/);
      if (yearRangeMatch) {
        setYearFrom(parseInt(yearRangeMatch[1]));
        setYearTo(parseInt(yearRangeMatch[2]));
      }
      const fromYearMatch = part.match(/^from-(\d+)-year-range$/);
      if (fromYearMatch) {
        setYearFrom(parseInt(fromYearMatch[1]));
        setYearTo(null);
      }
      const toYearMatch = part.match(/^to-(\d+)-year-range$/);
      if (toYearMatch) {
        setYearTo(parseInt(toYearMatch[1]));
        setYearFrom(null);
      }

      // Length Slug: between-X-Y-length-in-feet
      const betweenLenMatch = part.match(
        /^between-(\d+)-(\d+)-length-in-feet$/
      );
      if (betweenLenMatch) {
        setLengthFrom(parseInt(betweenLenMatch[1]));
        setLengthTo(parseInt(betweenLenMatch[2]));
      }

      // over-X-length-in-feet
      const overLenMatch = part.match(/^over-(\d+)-length-in-feet$/);
      if (overLenMatch) {
        setLengthFrom(parseInt(overLenMatch[1]));
        setLengthTo(null);
      }

      // under-X-length-in-feet
      const underLenMatch = part.match(/^under-(\d+)-length-in-feet$/);
      if (underLenMatch) {
        setLengthFrom(null);
        setLengthTo(parseInt(underLenMatch[1]));
      }

      const makeMatch = makes.find((m) => m.slug === part);
      if (makeMatch) {
        setSelectedMake(makeMatch.slug);
        setSelectedMakeName(makeMatch.name);
      }
      const modelMatch = model.find((m) => m.slug === part);
      if (modelMatch) {
        setSelectedModel(modelMatch.slug);
        setSelectedModelName(modelMatch.name);
      }
    });
  }, [pathname]);

  // useEffect(() => {
  //   const pathParts = pathname.split("/").filter(Boolean);
  //   const suburbSlug = pathParts[1]?.replace("-suburb", "") || "";
  //   const stateSlug = pathParts[2]?.replace("-state", "") || "";
  //   const postcode = pathParts[3] || "";

  //   if (!suburbSlug || !stateSlug || !postcode) return;

  //   let matchedState: StateOption | null = null;
  //   let matchedRegionName: string | null = null;
  //   let matchedSuburbName: string | null = null;

  //   for (const state of states) {
  //     if (state.name.toLowerCase().replace(/\s+/g, "-") === stateSlug) {
  //       matchedState = state;
  //       for (const region of state.regions || []) {
  //         for (const suburb of region.suburbs || []) {
  //           if (suburb.name.toLowerCase().replace(/\s+/g, "-") === suburbSlug) {
  //             matchedRegionName = region.name;
  //             matchedSuburbName = suburb.name;
  //             break;
  //           }
  //         }
  //         if (matchedSuburbName) break;
  //       }
  //       break;
  //     }
  //   }

  //   if (matchedState && matchedSuburbName) {
  //     setSelectedState(matchedState.value);
  //     setSelectedStateName(matchedState.name);
  //     setSelectedRegionName(matchedRegionName);
  //     setSelectedSuburbName(matchedSuburbName);
  //     setLocationInput(`${matchedSuburbName} ACT ${postcode}`);
  //     setFilters((prev) => ({
  //       ...prev,
  //       location: matchedState.value,
  //     }));
  //   }
  // }, [pathname, states]);
  // filter  data
  // useEffect(() => {
  //   const pathParts = pathname.split("/").filter(Boolean); // ex: ["listings", "queensland-state"]
  //   const slug1 = pathParts[1]; // could be category or state
  //   const slug2 = pathParts[2]; // could be undefined or state

  //   let categoryMatch: Option | undefined;
  //   let stateMatch: StateOption | undefined;

  //   // Check if slug1 is category
  //   if (slug1?.endsWith("-category")) {
  //     const categorySlug = slug1.replace(/-category$/, "");
  //     categoryMatch = categories.find((cat) => cat.slug === categorySlug);
  //   }

  //   // Now check state (either in slug2 if category exists, or slug1 if only state)
  //   const rawStateSlug =
  //     slug2 ?? (slug1?.endsWith("-state") ? slug1 : undefined);
  //   const matchedState = states.find(
  //     (s) =>
  //       rawStateSlug === `${s.name.toLowerCase().replace(/\s+/g, "-")}-state`
  //   );
  //   if (matchedState) {
  //     stateMatch = matchedState;
  //   }
  //   // Update filters
  //   if (categoryMatch) {
  //     setSelectedCategory(categoryMatch.slug);
  //     setSelectedCategoryName(categoryMatch.name);
  //   }

  //   if (stateMatch) {
  //     setSelectedState(stateMatch.value);
  //     setSelectedStateName(stateMatch.name);
  //   }

  //   // Search Params: make, condition, sleeps
  //   const slug = pathname.split("/listings/")[1];
  //   const segments = slug?.split("/") || [];
  //   const makeSlug = segments[0];
  //   if (makeSlug) {
  //     setSelectedMake(makeSlug);
  //     const makeMatch = makes.find((m) => m.slug === makeSlug);
  //     if (makeMatch) setSelectedMakeName(makeMatch.name);
  //   }

  //   const modelSlug = segments[1]; // 0 = make, 1 = model

  //   if (modelSlug) {
  //     setSelectedModel(modelSlug);

  //     // If you already have model list loaded
  //     const modelMatch = models.find((m) => m.slug === modelSlug);
  //     if (modelMatch) {
  //       setSelectedModelName(modelMatch.name);
  //     }
  //   }

  //   const condition = searchParams.get("condition");
  //   if (condition && !selectedConditionName)
  //     setSelectedConditionName(condition);
  //   const sleeps = searchParams.get("sleeps");
  //   if (sleeps) setSelectedSleepName(sleeps);

  //   // ✅ Trigger filter after all values are set
  //   setTimeout(() => {
  //     onFilterChange({
  //       category: categoryMatch?.slug,
  //       location: stateMatch?.value,
  //       make: selectedMake || undefined,
  //       condition: selectedConditionName || undefined,
  //       sleeps: selectedSleepName ? `${selectedSleepName}-people` : undefined,
  //       minKg: atmFrom || undefined,
  //       maxKg: atmTo || undefined,
  //       from_price: minPrice || undefined, // ✅ Add this
  //       to_price: maxPrice || undefined,
  //       from_year: yearFrom || undefined,
  //       to_year: yearTo || undefined,
  //       from_length: lengthFrom || undefined,
  //       to_length: lengthTo || undefined,
  //       model: selectedModel || undefined,
  //     });
  //   }, 0);
  // }, [
  //   pathname,
  //   categories,
  //   makes,
  //   states,
  //   searchParams,
  //   onFilterChange,
  //   atmFrom,
  //   atmTo,
  //   minPrice,
  //   maxPrice,
  //   selectedConditionName,
  //   selectedSleepName,
  //   yearFrom,
  //   yearTo,
  //   lengthFrom,
  //   lengthTo,
  // ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const slugParts: string[] = [];

      if (selectedConditionName)
        slugParts.push(`${selectedConditionName.toLowerCase()}-condition`);
      if (selectedCategory) slugParts.push(`${selectedCategory}-category`);
      if (selectedSuburbName) slugParts.push(`${selectedSuburbName}-suburb`);
      if (selectedStateName)
        slugParts.push(`${selectedStateName.toLowerCase()}-state`);
      const match = locationInput.match(/\b\d{4}\b/);
      if (match) slugParts.push(match[0]);

      if (minPrice && maxPrice)
        slugParts.push(`between-${minPrice}-${maxPrice}`);
      else if (minPrice) slugParts.push(`over-${minPrice}`);
      else if (maxPrice) slugParts.push(`under-${maxPrice}`);

      if (atmFrom && atmTo)
        slugParts.push(`between-${atmFrom}-kg-${atmTo}-kg-atm`);
      else if (atmFrom) slugParts.push(`over-${atmFrom}-kg-atm`);
      else if (atmTo) slugParts.push(`under-${atmTo}-kg-atm`);

      if (selectedSleepName)
        slugParts.push(`over-${selectedSleepName}-people-sleeping-capacity`);

      if (lengthFrom && lengthTo)
        slugParts.push(`between-${lengthFrom}-${lengthTo}-length-in-feet`);
      else if (lengthFrom) slugParts.push(`over-${lengthFrom}-length-in-feet`);
      else if (lengthTo) slugParts.push(`under-${lengthTo}-length-in-feet`);

      // ✅ FIX: Move this up before the URL is formed
      if (selectedMake) slugParts.push(selectedMake);

      if (selectedModel) slugParts.push(selectedModel); // ✅ add model to URL slug

      // ✅ Then generate URL
      let slugifiedURL = `/listings/${slugParts.join("/")}`
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();

      const query: Record<string, string> = {};
      if (yearFrom) query.acustom_fromyears = yearFrom.toString();
      if (yearTo) query.acustom_toyears = yearTo.toString();

      const queryString = new URLSearchParams(query).toString();
      if (queryString) slugifiedURL += `?${queryString}`;

      if (filtersInitialized.current) {
        router.push(slugifiedURL);
      } else {
        filtersInitialized.current = true;
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    selectedCategory,
    selectedMake,
    selectedModel,
    selectedConditionName,
    selectedSleepName,
    selectedState,
    selectedSuburbName,
    selectedStateName,
    locationInput,
    atmFrom,
    atmTo,
    minPrice,
    maxPrice,
    onFilterChange,
    router,
    yearFrom,
    yearTo,
    lengthFrom,
    lengthTo,
  ]);

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

  useEffect(() => {
    if (!selectedModel || model.length === 0) return;

    const modelMatch = model.find((m) => m.slug === selectedModel);
    if (modelMatch) {
      setSelectedModelName(modelMatch.name);
    }
  }, [model, selectedModel]);

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
            Category
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
              (showAllMakes ? makes : makes.slice(0, 10)).map((make) => (
                <div
                  key={make.slug}
                  className={`filter-accordion-item ${
                    selectedMake === make.slug ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedMake(make.slug);
                    setSelectedMakeName(make.name);
                    setMakeOpen(false);
                    setSelectedModel(null);
                    setSelectedModelName(null);
                    setModel([]);
                  }}
                >
                  {make.name}
                </div>
              ))}

            {makes.length > 10 && (
              <div
                className="filter-accordion-item show-more-toggle"
                onClick={() => setShowAllMakes(!showAllMakes)}
                style={{
                  cursor: "pointer",
                  fontWeight: 500,
                  marginTop: "6px",
                  color: "#007bff",
                }}
              >
                {showAllMakes ? "Show Less" : "Show More"}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedMake && model.length > 0 && (
        <div className="cs-full_width_section">
          <div
            className="filter-accordion"
            onClick={() => toggle(setModelOpen)}
          >
            <h5 className="cfs-filter-label">
              Model
              {selectedModelName && (
                <span className="filter-accordion-items">
                  : {selectedModelName}
                </span>
              )}
            </h5>
            <BiChevronDown />
          </div>

          {modelOpen && (
            <div className="filter-accordion-items">
              {model.map((mod) => (
                <div
                  key={mod.slug}
                  className={`filter-accordion-item ${
                    selectedModel === mod.slug ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedModel(mod.slug);
                    setSelectedModelName(mod.name);
                    setModelOpen(false);
                  }}
                >
                  {mod.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
                  {val.toLocaleString()} kg
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
                  {val.toLocaleString()} kg
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
                  ${value.toLocaleString()}{" "}
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
                  ${value.toLocaleString()}{" "}
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
        <h5 className="cfs-filter-label">Year</h5>
        <div className="row">
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">From</h6>
            <select
              className="cfs-select-input"
              value={yearFrom?.toString() || ""}
              onChange={(e) =>
                setYearFrom(e.target.value ? parseInt(e.target.value) : null)
              }
            >
              <option value="">Min</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select
              className="cfs-select-input"
              value={yearTo?.toString() || ""}
              onChange={(e) =>
                setYearTo(e.target.value ? parseInt(e.target.value) : null)
              }
            >
              <option value="">Max</option>
              {years.map((value) => (
                <option key={value} value={value}>
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
            <select
              className="cfs-select-input"
              value={lengthFrom || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setLengthFrom(val);
                onFilterChange({
                  ...filters,
                  from_length: val ?? undefined,
                  to_length: lengthTo ?? undefined,
                });
              }}
            >
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
            <select
              className="cfs-select-input"
              value={lengthTo?.toString() || ""}
              onChange={(e) =>
                setLengthTo(e.target.value ? parseInt(e.target.value) : null)
              }
            >
              <option value="">Max</option>
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
      {/* Reset Button */}
      <button onClick={resetFilters} className="btn cfs-btn fullwidth_btn">
        Reset Filters
      </button>
      {/* Modal */}
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
                {selectedSuburbName && selectedStateName && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {selectedSuburbName} {selectedStateName}{" "}
                    {locationInput.match(/\b\d{4}\b/)?.[0]}
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#888",
                        marginLeft: "4px",
                      }}
                    >
                      +50 Km
                    </span>
                  </div>
                )}

                <ul className="location-suggestions">
                  {locationSuggestions.map((loc, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setLocationInput(loc.short_address); // ✅ Set input value
                        // You can also update other related state here if needed
                        setSelectedSuburbName(loc.suburbName || ""); // If available in your data
                        setSelectedStateName(loc.stateName || ""); // If available in your data
                      }}
                      style={{ cursor: "pointer" }} // Optional: make it look clickable
                    >
                      {loc.short_address}
                    </li>
                  ))}
                </ul>
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

                  setIsModalOpen(false); // ✅ Only close here
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
