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
import "./filter.css";

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
  location?: string | null;
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
  state?: string;
  region?: string;
  suburb?: string;
  postcode?: string;
}

interface CaravanFilterProps {
  categories: Category[];
  makes: Make[];
  models: Model[];
  states: StateOption[];
  currentFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}
type QueryObject = {
  acustom_fromyears?: string;
  acustom_toyears?: string;
};
interface Option {
  name: string;
  slug: string;
}
interface Model {
  name: string;
  slug: string;
}
type Region = {
  name: string;
  value: string;
  suburbs?: Suburb[];
};

type Suburb = {
  name: string;
  value: string;
};

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
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [filteredSuburbs, setFilteredSuburbs] = useState<Suburb[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [conditionOpen, setConditionOpen] = useState(false);
  const [sleepsOpen, setSleepsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedPostcode, setSelectedPostcode] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [selectedMakeName, setSelectedMakeName] = useState<string | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string | null>(
    null
  );
  const suburbClickedRef = useRef(false);
  const preventResetRef = useRef(false);
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
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<LocationSuggestion | null>(null);

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
  const justSelectedStateRef = useRef(false);

  const atm = [
    600, 800, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000,
    4500,
  ];

  const price = [
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000,
  ];

  const years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
    2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 1994, 1984, 1974,
    1964, 1954, 1944, 1934, 1924, 1914,
  ];

  const length = [
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  ];

  const sleep = [1, 2, 3, 4, 5, 6, 7];
  const [selectedRegion, setSelectedRegion] = useState<string>();
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
  const urlJustUpdatedRef = useRef(false);

  // useEffect(() => {
  //   if (urlJustUpdatedRef.current || preventResetRef.current) {
  //     urlJustUpdatedRef.current = false;
  //     preventResetRef.current = false;
  //     return;
  //   }

  //   const slug = pathname.split("/listings/")[1];
  //   const segments = slug?.split("/") || [];

  //   const categorySegment = segments.find((s) => s.endsWith("-category"));
  //   if (categorySegment) {
  //     const categorySlug = categorySegment.replace("-category", "");
  //     const match = categories.find((c) => c.slug === categorySlug);
  //     if (match) {
  //       setSelectedCategory(categorySlug);
  //       setSelectedCategoryName(match.name);
  //     }
  //   }
  // }, [pathname, categories]);
  useEffect(() => {
    if (currentFilters.category && !selectedCategory && categories.length > 0) {
      const cat = categories.find((c) => c.slug === currentFilters.category);
      if (cat) {
        setSelectedCategory(cat.slug);
        setSelectedCategoryName(cat.name);
      }
    }
  }, [currentFilters.category, selectedCategory, categories]);

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    const categorySegment = segments.find((s) => s.endsWith("-category"));
    if (categorySegment && categories.length > 0) {
      const categorySlug = categorySegment.replace("-category", "");
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) {
        setSelectedCategory(categorySlug);
        setSelectedCategoryName(match.name);

        if (!hasCategoryBeenSetRef.current) {
          hasCategoryBeenSetRef.current = true;

          const updatedFilters: Filters = {
            ...filters,
            category: categorySlug,
            make: selectedMake || filters.make || currentFilters.make,
            model: selectedModel || filters.model || currentFilters.model,
            state: selectedStateName || filters.state || currentFilters.state,
            region:
              selectedRegionName || filters.region || currentFilters.region,
            suburb:
              selectedSuburbName || filters.suburb || currentFilters.suburb,
            postcode:
              selectedPostcode || filters.postcode || currentFilters.postcode,
          };

          setFilters(updatedFilters);
          onFilterChange(updatedFilters);

          console.log("✅ Category set from slug:", categorySlug);
        }
      }
    }
  }, [pathname, categories]);

  // useEffect(() => {
  //   if (!selectedMake) return;

  //   const updatedFilters: Filters = {
  //     ...filters, // ✅ preserves previous filters like ATM, price, year, etc.
  //     make: selectedMake,
  //     model: undefined,
  //     category: selectedCategory || filters.category || currentFilters.category,
  //     condition:
  //       selectedConditionName || filters.condition || currentFilters.condition,
  //     sleeps: selectedSleepName
  //       ? `${selectedSleepName}-people`
  //       : filters.sleeps || currentFilters.sleeps,
  //     state: selectedStateName || filters.state || currentFilters.state,
  //     region: selectedRegionName || filters.region || currentFilters.region,
  //     suburb: selectedSuburbName || filters.suburb || currentFilters.suburb,
  //     postcode: selectedPostcode || filters.postcode || currentFilters.postcode,
  //     minKg: atmFrom ?? filters.minKg ?? currentFilters.minKg,
  //     maxKg: atmTo ?? filters.maxKg ?? currentFilters.maxKg,
  //     from_price: minPrice ?? filters.from_price ?? currentFilters.from_price,
  //     to_price: maxPrice ?? filters.to_price ?? currentFilters.to_price,
  //     from_year: yearFrom ?? filters.from_year ?? currentFilters.from_year,
  //     to_year: yearTo ?? filters.to_year ?? currentFilters.to_year,
  //     from_length:
  //       lengthFrom ?? filters.from_length ?? currentFilters.from_length,
  //     to_length: lengthTo ?? filters.to_length ?? currentFilters.to_length,
  //   };

  //   setFilters(updatedFilters);
  //   onFilterChange(updatedFilters);
  // }, [selectedMake]);

  const getCategoryFromPath = () => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];
    const categorySegment = segments.find((s) => s.endsWith("-category"));
    return categorySegment?.replace("-category", "") || null;
  };

  // resend use effect
  useEffect(() => {
    // Initialize state and region from URL on page load (refresh)
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    const stateSlug = segments.find((s) => s.endsWith("-state"));
    const regionSlug = segments.find((s) => s.endsWith("-region"));

    if (stateSlug) {
      const stateName = stateSlug.replace("-state", "").replace(/-/g, " ");
      setSelectedStateName(stateName);
      setSelectedState(stateName); // Set selected state from the URL
    }

    if (regionSlug) {
      const regionName = regionSlug.replace("-region", "").replace(/-/g, " ");
      setSelectedRegionName(regionName);
      setSelectedRegion(regionName); // Set selected region from the URL
    }
  }, [pathname]);

  // useEffect(() => {
  //   if (selectedState) {
  //     const slugifiedState = selectedState.toLowerCase().replace(/\s+/g, "-");
  //     const query = searchParams.toString();

  //     // Update the URL with selected state and region (if available)
  //     const slug = `/listings/${slugifiedState}-state${
  //       selectedRegion
  //         ? `/${selectedRegion.toLowerCase().replace(/\s+/g, "-")}-region`
  //         : ""
  //     }${query ? `?${query}` : ""}`;

  //     router.push(slug);

  //     // Trigger the fetch for listings based on the updated filters
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       state: selectedState,
  //     }));
  //   }
  // }, [selectedState, selectedRegion, searchParams, router]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (!selectedMake && !selectedState) return;

  //     const slugParts:
  //  string[] = [];

  //     if (selectedMake) slugParts.push(selectedMake);
  //     if (selectedModel) slugParts.push(selectedModel);
  //     if (selectedCategory) slugParts.push(`${selectedCategory}-category`);
  //     if (selectedStateName)
  //       slugParts.push(`${slugify(selectedStateName)}-state`);
  //     if (selectedRegionName)
  //       slugParts.push(`${slugify(selectedRegionName)}-region`);
  //     if (selectedSuburbName)
  //       slugParts.push(`${slugify(selectedSuburbName)}-suburb`);
  //     if (selectedPostcode) slugParts.push(selectedPostcode);

  //     const query: Record<string, string> = {};
  //     if (yearFrom) query.acustom_fromyears = yearFrom.toString();
  //     if (yearTo) query.acustom_toyears = yearTo.toString();
  //     const queryString = new URLSearchParams(query).toString();

  //     const newURL = `/listings/${slugParts.join("/")}${
  //       queryString ? `?${queryString}` : ""
  //     }`;

  //     // Avoid unnecessary router.push
  //     const currentURL =
  //       pathname + (searchParams.toString() ? `?${searchParams}` : "");
  //     if (newURL !== currentURL) {
  //       router.push(newURL);
  //     }
  //   }, 300); // debounce 300ms

  //   return () => clearTimeout(timeout);
  // }, [
  //   selectedMake,
  //   selectedModel,
  //   selectedStateName,
  //   selectedCategory,
  //   selectedRegionName,
  //   selectedSuburbName,
  //   selectedPostcode,
  //   yearFrom,
  //   yearTo,
  // ]);

  const isModelFetchCompleteRef = useRef(false); // ADD THIS

  useEffect(() => {
    if (!selectedMake) {
      setModel([]);
      setSelectedModel(null);
      setSelectedModelName(null);
      return;
    }

    // Clear previous model selection
    setSelectedModel(null);
    setSelectedModelName(null);
    isModelFetchCompleteRef.current = false;

    fetchModelsByMake(selectedMake)
      .then((models) => {
        setModel(models || []);
        isModelFetchCompleteRef.current = true;

        const updatedFilters: Filters = {
          ...filters,
          make: selectedMake,
          model: undefined,
          category: selectedCategory || currentFilters.category,
          state: selectedStateName || currentFilters.state,
          region: selectedRegionName || currentFilters.region,
          suburb: selectedSuburbName || currentFilters.suburb,
          postcode: selectedPostcode || currentFilters.postcode,
        };

        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
      })
      .catch(console.error);
  }, [selectedMake]);

  console.log("filters", filters);
  console.log(setSelectedRegion, filteredRegions);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    setSelectedState(null);
    setSelectedStateName(null);
    setSelectedModel(null);
    setSelectedModelName(null);
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedCategory(null);
    setSelectedCategoryName(null);

    // ✅ CaravanFilter slug parser fix
    // 🔁 Replaces your existing segments.forEach logic
    segments.forEach((part) => {
      // ✅ 1. Skip known non-make patterns FIRST
      if (
        part.endsWith("-state") ||
        part.endsWith("-region") ||
        part.endsWith("-suburb") ||
        part.endsWith("-category") ||
        part.includes("-condition") ||
        part.includes("-people-sleeping-capacity") ||
        part.includes("-kg-atm") ||
        part.includes("length-in-feet") ||
        part.includes("year-range") ||
        part.match(/^over-\d+$/) ||
        part.match(/^under-\d+$/) ||
        part.match(/^between-\d+-\d+$/) ||
        /^\d{4}$/.test(part)
      ) {
        return; // ✅ SKIP these so they don’t get interpreted as make/model
      }

      // ✅ 2. Now try to match MAKE
      const matchedMake = makes.find((m) => m.slug === part);
      if (matchedMake) {
        setSelectedMake(matchedMake.slug);
        setSelectedMakeName(matchedMake.name);
        return;
      }

      // ✅ 3. Match MODEL
      const matchedModel = model.find((m) => m.slug === part);
      if (matchedModel) {
        setSelectedModel(matchedModel.slug);
        setSelectedModelName(matchedModel.name);
        return;
      }

      // ✅ 4. Category
      if (part.endsWith("-category")) {
        const slug = part.replace("-category", "");
        const match = categories.find((c) => c.slug === slug);
        if (match) {
          setSelectedCategory(slug);
          setSelectedCategoryName(match.name);
        }
        return;
      }

      // ✅ 5. ATM Filters
      if (/^over-(\d+)-kg-atm$/.test(part)) {
        setAtmFrom(parseInt(part.match(/^over-(\d+)-kg-atm$/)?.[1] || "0"));
        setAtmTo(null);
        return;
      } else if (/^under-(\d+)-kg-atm$/.test(part)) {
        setAtmFrom(null);
        setAtmTo(parseInt(part.match(/^under-(\d+)-kg-atm$/)?.[1] || "0"));
        return;
      } else if (/^between-(\d+)-kg-(\d+)-kg-atm$/.test(part)) {
        const [, from, to] =
          part.match(/^between-(\d+)-kg-(\d+)-kg-atm$/) || [];
        setAtmFrom(parseInt(from));
        setAtmTo(parseInt(to));
        return;
      }

      // ✅ 6. Price
      if (/^over-(\d+)$/.test(part)) {
        setMinPrice(parseInt(part.replace("over-", "")));
        setMaxPrice(null);
        return;
      } else if (/^under-(\d+)$/.test(part)) {
        setMaxPrice(parseInt(part.replace("under-", "")));
        setMinPrice(null);
        return;
      } else if (/^between-(\d+)-(\d+)$/.test(part)) {
        const [, from, to] = part.match(/^between-(\d+)-(\d+)$/) || [];
        setMinPrice(parseInt(from));
        setMaxPrice(parseInt(to));
        return;
      }
    });
  }, [pathname, states, makes, model]);
  // ✅ Unified Filters Update & URL Sync Handler
  const pendingURLRef = useRef<string | null>(null);

  const updateAllFiltersAndURL = () => {
    const updated: Filters = {
      category: selectedCategory || undefined,
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      condition: selectedConditionName || undefined,
      sleeps: selectedSleepName ? `${selectedSleepName}-people` : undefined,
      state: selectedStateName || undefined,
      region: selectedRegionName || undefined,
      suburb: selectedSuburbName || undefined,
      postcode: selectedPostcode || undefined,
      minKg: atmFrom || undefined,
      maxKg: atmTo || undefined,
      from_price: minPrice || undefined,
      to_price: maxPrice || undefined,
      from_year: yearFrom || undefined,
      to_year: yearTo || undefined,
      from_length: lengthFrom || undefined,
      to_length: lengthTo || undefined,
      location: selectedStateName || undefined,
    };

    setFilters(updated); // ✅ this will trigger useEffect below

    // 👇 Build URL and save it
    const slugParts = [];
    if (updated.make) slugParts.push(updated.make);
    if (updated.model) slugParts.push(updated.model);
    if (updated.category) slugParts.push(`${updated.category}-category`);
    if (updated.condition)
      slugParts.push(`${updated.condition.toLowerCase()}-condition`);
    if (updated.sleeps)
      slugParts.push(
        `over-${updated.sleeps.replace("-people", "")}-people-sleeping-capacity`
      );
    if (updated.state) slugParts.push(`${slugify(updated.state)}-state`);
    if (updated.region) slugParts.push(`${slugify(updated.region)}-region`);
    if (updated.suburb) slugParts.push(`${slugify(updated.suburb)}-suburb`);
    if (updated.postcode) slugParts.push(updated.postcode);
    if (updated.minKg && updated.maxKg)
      slugParts.push(`between-${updated.minKg}-kg-${updated.maxKg}-kg-atm`);
    else if (updated.minKg) slugParts.push(`over-${updated.minKg}-kg-atm`);
    else if (updated.maxKg) slugParts.push(`under-${updated.maxKg}-kg-atm`);
    if (updated.from_price && updated.to_price)
      slugParts.push(`between-${updated.from_price}-${updated.to_price}`);
    else if (updated.from_price) slugParts.push(`over-${updated.from_price}`);
    else if (updated.to_price) slugParts.push(`under-${updated.to_price}`);
    if (updated.from_length && updated.to_length)
      slugParts.push(
        `between-${updated.from_length}-${updated.to_length}-length-in-feet`
      );
    else if (updated.from_length)
      slugParts.push(`over-${updated.from_length}-length-in-feet`);
    else if (updated.to_length)
      slugParts.push(`under-${updated.to_length}-length-in-feet`);

    const query: QueryObject = {};
    if (updated.from_year)
      query.acustom_fromyears = updated.from_year.toString();
    if (updated.to_year) query.acustom_toyears = updated.to_year.toString();

    const queryString = new URLSearchParams(query).toString();
    const newURL = `/listings/${slugParts.join("/")}${
      queryString ? `?${queryString}` : ""
    }`;

    pendingURLRef.current = newURL; // ✅ store the next URL for router.push
  };
  useEffect(() => {
    if (!filtersInitialized.current || !pendingURLRef.current) return;

    const url = pendingURLRef.current;
    pendingURLRef.current = null;

    if (url && url !== pathname) {
      router.push(url);
    }
  }, [filters]);

  // ✅ Replace individual onChange calls with this
  // Example:
  // setAtmFrom(val); updateAllFiltersAndURL();
  // setSelectedCategory(cat.slug); updateAllFiltersAndURL();

  const accordionStyle = (highlight: boolean) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "4px",
    padding: "6px 12px",
    marginBottom: "6px",
    cursor: "pointer",
    background: highlight ? "#f7f7f7" : "transparent",
  });

  const iconRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const closeIconStyle = {
    fontWeight: "bold",
    cursor: "pointer",
  };

  const arrowStyle = (isOpen: boolean) => ({
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "0.3s",
    marginLeft: "8px",
    cursor: "pointer",
  });

  const suburbStyle = (isSelected: boolean) => ({
    marginLeft: "24px",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "4px",
    backgroundColor: isSelected ? "#e8f0fe" : "transparent",
  });

  useEffect(() => {
    const stateSlug = pathname.split("/").find((s) => s.endsWith("-state"));
    if (!stateSlug) {
      // ✅ No state present in URL → reset state UI
      setSelectedState(null);
      setSelectedStateName(null);
      setFilteredRegions([]);
      setFilteredSuburbs([]);
    }
  }, [pathname]);
  const updateFilters = (partial: Partial<Filters>) => {
    const updated = { ...filters, ...partial };
    setFilters(updated);
    onFilterChange(updated);
    filtersInitialized.current = true;
  };

  const resetStateFilters = () => {
    console.log("❌ State Reset Triggered");

    // ⛔️ Reset all location-related values
    setSelectedState(null);
    setSelectedStateName(null);
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedPostcode(null);
    setFilteredRegions([]);
    setFilteredSuburbs([]);
    setStateOpen(false);

    // ✅ Clear location filters
    const updatedFilters: Filters = {
      ...currentFilters,
      state: undefined,
      location: undefined,
      region: undefined,
      suburb: undefined,
      postcode: undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    // ✅ Clean URL segments
    const segments = pathname.split("/").filter(Boolean);

    const filteredSegments = segments
      // Remove duplicate 'listings' beyond the first
      .filter((seg, i) => !(seg === "listings" && i !== 0))
      // Remove state/region/suburb/postcode
      .filter(
        (s) =>
          !s.endsWith("-state") &&
          !s.endsWith("-region") &&
          !s.endsWith("-suburb") &&
          !/^\d{4}$/.test(s)
      );

    // ✅ Build clean path
    const newPath = `/${filteredSegments.join("/")}`;
    const query = searchParams.toString();
    const finalURL = newPath + (query ? `?${query}` : "");

    router.push(finalURL);

    // ⚠️ Reset internal refs
    filtersInitialized.current = false;
    hasCategoryBeenSetRef.current = false;
    suburbClickedRef.current = false;
    urlJustUpdatedRef.current = true;
  };

  const resetRegionFilters = () => {
    setSelectedRegion("");
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedPostcode(null);
    setFilteredSuburbs([]);

    const updatedFilters: Filters = {
      ...currentFilters,
      region: undefined,
      suburb: undefined,
      postcode: undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetSuburbFilters = () => {
    setSelectedSuburbName(null);
    setSelectedPostcode(null);

    const updatedFilters: Filters = {
      ...currentFilters,
      suburb: undefined,
      postcode: undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // ⬇️ Place this inside your component top-level
  useEffect(() => {}, [filteredSuburbs]);

  // useEffect(() => {
  //   const pathParts = pathname.split("/").filter(Boolean); // ex: ["listings", "queensland-state"]
  //   const slug1 = pathParts[1]; // could be category or state
  //   alert("enter 2");
  //   let categoryMatch: Option | undefined;

  //   if (slug1?.endsWith("-category")) {
  //     const categorySlug = slug1.replace(/-category$/, "");
  //     categoryMatch = categories.find((cat) => cat.slug === categorySlug);
  //   }

  //   if (categoryMatch) {
  //     setSelectedCategory(categoryMatch.slug);
  //     setSelectedCategoryName(categoryMatch.name);
  //   }

  //   const slug = pathname.split("/listings/")[1];
  //   const segments = slug?.split("/") || [];
  //   const isKnownFilter = (s: string) =>
  //     s.endsWith("-state") ||
  //     s.endsWith("-category") ||
  //     s.endsWith("-region") ||
  //     s.endsWith("-suburb") ||
  //     s.includes("-kg") ||
  //     s.includes("-people") ||
  //     s.includes("between-") ||
  //     s.includes("over-") ||
  //     s.includes("under-") ||
  //     s.endsWith("-condition") ||
  //     /^\d{4}$/.test(s); // postcode

  //   const filteredSegments = segments.filter((s) => !isKnownFilter(s));

  //   const makeSlug = filteredSegments[0];
  //   const modelSlug = filteredSegments[1];

  //   if (modelSlug && modelSlug !== makeSlug) {
  //     const filteredModels = models.filter(
  //       (m) => m.slug === selectedMake // if you're using make_slug
  //     );

  //     const modelMatch = filteredModels.find((m) => m.slug === modelSlug);

  //     if (modelMatch) {
  //       setSelectedModel(modelMatch.slug);
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
  //       make: selectedMake || currentFilters.make,
  //       model: selectedModel || currentFilters.model,
  //       category: selectedCategory || currentFilters.category,
  //       state: selectedStateName || currentFilters.state,
  //       region: selectedRegionName || currentFilters.region,
  //       suburb: selectedSuburbName || currentFilters.suburb,
  //       postcode: selectedPostcode || currentFilters.postcode,
  //       condition: selectedConditionName || currentFilters.condition,
  //       sleeps: selectedSleepName
  //         ? `${selectedSleepName}-people`
  //         : currentFilters.sleeps,
  //       from_price: minPrice ?? currentFilters.from_price,
  //       to_price: maxPrice ?? currentFilters.to_price,
  //       minKg: atmFrom ?? currentFilters.minKg,
  //       maxKg: atmTo ?? currentFilters.maxKg,
  //       from_year: yearFrom ?? currentFilters.from_year,
  //       to_year: yearTo ?? currentFilters.to_year,
  //       from_length: lengthFrom ?? currentFilters.from_length,
  //       to_length: lengthTo ?? currentFilters.to_length,
  //       location: selectedStateName || currentFilters.location,
  //     });
  //   }, 0);
  // }, [
  //   pathname,
  //   categories,
  //   makes,
  //   model,
  //   selectedCategory,
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
  //   selectedStateName,
  //   selectedState,
  //   selectedMake,
  //   selectedModel,
  //   selectedRegionName,
  //   selectedSuburbName,
  // ]);

  const handleSearchClick = () => {
    const input = locationInput.trim();
    if (!suburbClickedRef.current || input === "") return;

    const locationData = locationSuggestions.find(
      (loc) => loc.short_address === input
    );

    if (!locationData) {
      console.warn("No matching location found.");
      return;
    }

    // Extract the parts from the URI
    const [suburbSlug, regionSlug, stateSlug, postcode] =
      locationData.uri.split("/");

    const suburb = suburbSlug.replace("-suburb", "");
    const region = regionSlug.replace("-region", "");
    const state = stateSlug.replace("-state", "");

    console.log("🧩 Extracted:", {
      suburb,
      region,
      state,
      postcode,
    });

    setSelectedState(state);
    setSelectedStateName(state); // Update the state
    setSelectedRegionName(region);
    setSelectedSuburbName(suburb); // Update the suburb

    setSelectedPostcode(postcode); // Set the postcode
    setLocationInput(locationData.short_address);

    // Update filters with the new values
    const updatedFilters = {
      ...filters,
      suburb,
      region,
      state,
      postcode,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    suburbClickedRef.current = true;
  };
  console.log("🧩 output:", {
    selectedState,
    selectedStateName,
    selectedRegionName,
    selectedSuburbName,
    selectedPostcode,
    selectedRegion,
  });

  useEffect(() => {
    if (
      filters.suburb &&
      filters.postcode &&
      !locationInput.includes(filters.suburb)
    ) {
      setLocationInput(`${filters.suburb} ${filters.postcode}`);
    }
  }, [filters.suburb, filters.postcode, locationInput]);

  const slugify = (value: string | null | undefined) =>
    value?.toLowerCase().replace(/\s+/g, "-").trim() || "";

  const resetFilters = () => {
    // ✅ Clear all UI selections
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedState(null);
    setSelectedStateName(null);
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedPostcode(null);
    setFilteredRegions([]);
    setFilteredSuburbs([]);
    setSelectedConditionName(null);
    setSelectedSleepName("");
    setSelectedMakeName(null);
    setSelectedModelName(null);
    setLocationInput("");
    setLocationSuggestions([]);
    setAtmFrom(null);
    setAtmTo(null);
    setMinPrice(null);
    setMaxPrice(null);
    setYearFrom(null);
    setYearTo(null);
    setLengthFrom(null);
    setLengthTo(null);

    // ✅ Clear filter object
    const resetFilters: Filters = {
      make: undefined,
      model: undefined,
      category: undefined,
      condition: undefined,
      state: undefined,
      region: undefined,
      suburb: undefined,
      postcode: undefined,
      from_price: undefined,
      to_price: undefined,
      minKg: undefined,
      maxKg: undefined,
      sleeps: undefined,
      from_length: undefined,
      to_length: undefined,
      location: null,
    };

    // ✅ Update filters in state + trigger API
    setFilters(resetFilters);
    onFilterChange(resetFilters);

    // ✅ Reset URL
    router.push("/listings");
  };
  // locataion useeffe
  useEffect(() => {
    if (currentFilters.suburb && !selectedSuburbName) {
      setSelectedSuburbName(currentFilters.suburb);
    }
    if (currentFilters.postcode && !selectedPostcode) {
      setSelectedPostcode(currentFilters.postcode);
    }
    if (currentFilters.state && !selectedStateName) {
      setSelectedStateName(currentFilters.state);
    }
    if (currentFilters.region && !selectedRegionName) {
      setSelectedRegionName(currentFilters.region);
    }
  }, [
    currentFilters.suburb,
    currentFilters.postcode,
    currentFilters.state,
    currentFilters.region,
    selectedSuburbName,
    selectedPostcode,
    selectedStateName,
    selectedRegionName,
  ]);
  useEffect(() => {
    if (selectedSuburbName && selectedStateName && selectedPostcode) {
      setLocationInput(`${selectedSuburbName} ${selectedPostcode}`);
    }
  }, [selectedSuburbName, selectedStateName, selectedPostcode]);

  useEffect(() => {
    // Auto-load suburbs when state and region are already selected
    if (selectedState && selectedRegionName && states.length > 0) {
      const region = states
        .find((s) => s.value === selectedState)
        ?.regions?.find(
          (r) =>
            r.name.trim().toLowerCase() ===
            selectedRegionName.trim().toLowerCase()
        );

      if (region && Array.isArray(region.suburbs)) {
        console.log("✅ Auto-loading suburbs for region:", region.name);
        console.log("✅ Auto-loading suburbs:", region.suburbs);
        setFilteredSuburbs(region.suburbs);
      } else {
        console.warn(
          "❌ Region not found or has no suburbs:",
          selectedRegionName
        );
      }
    }
  }, [selectedState, selectedRegionName, states]);

  console.log("🔁 suburb Render triggered — filteredSuburbs:", filteredSuburbs);

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    const suburbSegment = segments.find((s) => s.endsWith("-suburb"));
    const postcodeSegment = segments.find((s) => /^\d{4}$/.test(s)); // Match 4-digit postcode

    if (suburbSegment) {
      const suburbName = suburbSegment
        .replace("-suburb", "")
        .replace(/-/g, " ");
      setSelectedSuburbName(suburbName);

      // Also set input field and postcode
      if (postcodeSegment) {
        setSelectedPostcode(postcodeSegment);
        setLocationInput(`${suburbName} ${postcodeSegment}`);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!suburbClickedRef.current) return;

    console.log(
      "🏘️ Suburb Render triggered – filteredSuburbs:",
      filteredSuburbs
    );
  }, [filteredSuburbs]);

  useEffect(() => {
    if (
      selectedSuburbName &&
      selectedPostcode &&
      selectedStateName &&
      locationInput // All required fields are set
    ) {
      console.log("🔄 Triggering API fetch with auto-filled filters");

      const updatedFilters = {
        ...filters,
        suburb: selectedSuburbName.toLowerCase(),
        postcode: selectedPostcode,
        state: selectedStateName,
      };

      setFilters(updatedFilters);
      onFilterChange(updatedFilters);

      suburbClickedRef.current = true;
      filtersInitialized.current = true;
    }
  }, [selectedSuburbName, selectedPostcode, selectedStateName, locationInput]);
  // newww
  useEffect(() => {
    if (selectedState && !selectedRegionName && !selectedSuburbName) {
      const slugifiedState = selectedStateName
        ?.toLowerCase()
        .replace(/\s+/g, "-");
      if (!slugifiedState) return;

      const currentSegments = pathname.split("/").filter(Boolean);
      const hasStateAlready = currentSegments.some(
        (s) => s === `${slugifiedState}-state`
      );

      // ✅ Skip if state already present in the URL
      if (hasStateAlready) return;

      const slugParts = [...currentSegments];
      slugParts.push(`${slugifiedState}-state`);
      const newSlug = `/listings/${slugParts.join("/")}`;
      const query = searchParams.toString();

      const newURL = newSlug + (query ? `?${query}` : "");
      const currentURL =
        pathname + (searchParams.toString() ? `?${searchParams}` : "");

      // ✅ Push only if different
      if (currentURL !== newURL) {
        router.push(newURL);
      }
    }
  }, [
    selectedState,
    selectedStateName,
    selectedRegionName,
    selectedSuburbName,
    pathname,
    searchParams,
  ]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (locationInput.length >= 2) {
        // Extract only the suburb name (assuming it's the first word in the input)
        const suburbName = locationInput.split(" ")[0]; // Takes only the first word

        // Call the API with just the suburb
        fetchLocations(suburbName)
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
    if (currentFilters.category && !selectedCategory && categories.length > 0) {
      const cat = categories.find((c) => c.slug === currentFilters.category);
      if (cat) {
        setSelectedCategory(cat.slug);
        setSelectedCategoryName(cat.name);
      }
    }
  }, [currentFilters.category, selectedCategory, categories]);

  useEffect(() => {
    if (
      !selectedStateName &&
      selectedSuburbName &&
      selectedRegionName &&
      selectedState
    ) {
      const state = states.find((s) => s.value === selectedState);
      if (state) {
        setSelectedStateName(state.name);
      }
    }
  }, [
    selectedSuburbName,
    selectedRegionName,
    selectedState,
    selectedStateName,
    states,
  ]);
  // adaa
  useEffect(() => {
    const fromYearParam = searchParams.get("acustom_fromyears");
    const toYearParam = searchParams.get("acustom_toyears");

    if (fromYearParam) {
      setYearFrom(parseInt(fromYearParam));
    }
    if (toYearParam) {
      setYearTo(parseInt(toYearParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      currentFilters.state &&
      !selectedStateName &&
      filtersInitialized.current
    ) {
      setSelectedStateName(currentFilters.state);
    }
  }, [currentFilters.state, selectedStateName, filtersInitialized.current]);

  useEffect(() => {
    if (selectedModel && model.length > 0 && !selectedModelName) {
      const match = model.find((m) => m.slug === selectedModel);
      if (match) {
        setSelectedModelName(match.name);
      }
    }
  }, [selectedModel, model]);
  useEffect(() => {
    if (selectedMake && !filters.make) {
      onFilterChange({ ...filters, make: selectedMake });
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedSuburbName || selectedRegionName || selectedStateName) {
      console.log("✅ Location set from modal:");
      console.log("select:", selectedSuburbName);
      console.log("select:", selectedRegionName);
      console.log("select:", selectedStateName);
    }
  }, [selectedSuburbName, selectedRegionName, selectedStateName]);
  const hasCategoryBeenSetRef = useRef(false);

  useEffect(() => {
    if (!hasCategoryBeenSetRef.current && selectedCategory) {
      hasCategoryBeenSetRef.current = true;
    }
  }, [selectedCategory]);

  // router issue
  const lastPushedURLRef = useRef<string>("");

  useEffect(() => {
    if (!filtersInitialized.current) return;

    const slugParts = [];
    if (filters.make) slugParts.push(filters.make);
    if (filters.model) slugParts.push(filters.model);
    if (filters.category) slugParts.push(`${filters.category}-category`);
    if (filters.state) slugParts.push(`${slugify(filters.state)}-state`);
    if (filters.region) slugParts.push(`${slugify(filters.region)}-region`);
    if (filters.suburb) slugParts.push(`${slugify(filters.suburb)}-suburb`);
    if (filters.postcode) slugParts.push(filters.postcode);

    if (filters.minKg && filters.maxKg) {
      slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
    } else if (filters.minKg) {
      slugParts.push(`over-${filters.minKg}-kg-atm`);
    } else if (filters.maxKg) {
      slugParts.push(`under-${filters.maxKg}-kg-atm`);
    }

    const query: Record<string, string> = {};
    if (filters.from_year)
      query.acustom_fromyears = filters.from_year.toString();
    if (filters.to_year) query.acustom_toyears = filters.to_year.toString();

    const queryString = new URLSearchParams(query).toString();
    const fullSlug = `/listings/${slugParts.join("/")}${
      queryString ? `?${queryString}` : ""
    }`;

    if (lastPushedURLRef.current !== fullSlug) {
      lastPushedURLRef.current = fullSlug;
      router.push(fullSlug);
    }
  }, [filters]); // ✅ react to filters change

  useEffect(() => {
    if (!selectedModel || model.length === 0) return;

    const modelMatch = model.find((m) => m.slug === selectedModel);
    if (modelMatch) {
      setSelectedModelName(modelMatch.name);
    }
  }, [model, selectedModel]);

  useEffect(() => {
    if (!selectedCategory && !selectedMake && !selectedStateName) {
      console.warn("🚨 Important filters are null!", {
        pathname,
        filters,
        selectedCategory,
        selectedMake,
        selectedStateName,
      });
    }
  }, [filters, selectedCategory, selectedMake, selectedStateName]);
  // ✅ Call this function on Model click
  const handleModelSelect = (mod: Model) => {
    setSelectedModel(mod.slug);
    setSelectedModelName(mod.name);
    setModelOpen(false);

    const updatedFilters = {
      ...filters,
      make: selectedMake || undefined,
      model: mod.slug || undefined,
      category: selectedCategory || currentFilters.category,
      state: selectedStateName || currentFilters.state,
      region: selectedRegionName || currentFilters.region,
      suburb: selectedSuburbName || currentFilters.suburb,
      postcode: selectedPostcode || currentFilters.postcode,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    // 🧠 Rebuild URL slug
    const slugParts = [];
    if (selectedMake) slugParts.push(selectedMake);
    if (mod.slug) slugParts.push(mod.slug);
    if (selectedCategory) slugParts.push(`${selectedCategory}-category`);
    if (selectedStateName)
      slugParts.push(
        `${selectedStateName.toLowerCase().replace(/\s+/g, "-")}-state`
      );
    if (selectedRegionName)
      slugParts.push(
        `${selectedRegionName.toLowerCase().replace(/\s+/g, "-")}-region`
      );
    if (selectedSuburbName)
      slugParts.push(
        `${selectedSuburbName.toLowerCase().replace(/\s+/g, "-")}-suburb`
      );
    if (selectedPostcode) slugParts.push(selectedPostcode);

    const queryParams = new URLSearchParams(searchParams.toString());
    if (yearFrom) queryParams.set("acustom_fromyears", yearFrom.toString());
    if (yearTo) queryParams.set("acustom_toyears", yearTo.toString());

    const url = `/listings/${slugParts.join("/")}${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    router.push(url);
  };

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
          <h5 className="cfs-filter-label">Category</h5>
          <BiChevronDown />
        </div>

        {/* ✅ Selected Category Chip */}
        {selectedCategoryName && (
          <div className="filter-chip">
            <span>{selectedCategoryName}</span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedCategoryName(null);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  category: undefined,
                };

                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments
                  .filter((s) => !s.endsWith("-category"))
                  .map((s) => s.toLowerCase().replace(/\s+/g, "-")); // ✅ slugify each segme
                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}

        {/* ✅ Dropdown menu */}
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
                    updateFilters({ category: cat.slug });

                    updateAllFiltersAndURL(); // ✅ This ensures all values are merged
                    filtersInitialized.current = true;
                    const updatedFilters: Filters = {
                      ...filters, // ✅ live state
                      category: cat.slug,
                      make: selectedMake || filters.make || currentFilters.make,
                      model: selectedModel || currentFilters.model,
                      state: selectedStateName || currentFilters.state,
                      region: selectedRegionName || currentFilters.region,
                      suburb: selectedSuburbName || currentFilters.suburb,
                      postcode: selectedPostcode || currentFilters.postcode,
                    };

                    setFilters(updatedFilters);
                    onFilterChange(updatedFilters);
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
        <div className="filter-accordion" onClick={() => toggle(setStateOpen)}>
          <h5 className="cfs-filter-label">Location</h5>
          <BiChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setStateOpen((prev) => !prev);
            }}
            style={{
              cursor: "pointer",
              transform: stateOpen ? "rotate(180deg)" : "",
            }}
          />{" "}
        </div>

        {/* STATE */}
        {selectedStateName && (
          <div
            className="filter-accordion-item"
            style={accordionStyle(!selectedRegionName && !selectedSuburbName)}
          >
            <span
              style={{ flexGrow: 1 }}
              onClick={() => setStateOpen((prev) => !prev)}
            >
              {selectedStateName}
            </span>
            <div style={iconRowStyle}>
              <span onClick={resetStateFilters} style={closeIconStyle}>
                ×
              </span>
              <BiChevronDown
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click from firing
                  setStateOpen((prev) => !prev);
                }}
                style={arrowStyle(stateOpen)}
              />
            </div>
          </div>
        )}

        {/* REGION */}
        {selectedRegionName && (
          <div
            className="filter-accordion-item"
            style={accordionStyle(!selectedSuburbName)}
          >
            <span
              style={{ flexGrow: 1 }}
              onClick={() => setStateOpen((prev) => !prev)}
            >
              {selectedRegionName}
            </span>
            {!selectedSuburbName && (
              <div style={iconRowStyle}>
                <span onClick={resetRegionFilters} style={closeIconStyle}>
                  ×
                </span>
                <BiChevronDown
                  onClick={(e) => {
                    e.stopPropagation();
                    const region = states
                      .find((s) => s.value === selectedState)
                      ?.regions?.find(
                        (r) =>
                          r.name.trim().toLowerCase() ===
                          selectedRegionName.trim().toLowerCase()
                      );

                    if (region && Array.isArray(region.suburbs)) {
                      console.log(
                        "🔽 Manually loading suburbs from arrow click:",
                        region.name
                      );
                      setFilteredSuburbs(region.suburbs);
                    } else {
                      console.warn(
                        "❌ Region not found or has no suburbs:",
                        selectedRegionName
                      );
                    }
                    setStateOpen((prev) => !prev); // Toggle dropdown
                  }}
                  style={arrowStyle(stateOpen)}
                />
              </div>
            )}
          </div>
        )}

        {/* SUBURB */}
        {selectedSuburbName && (
          <div className="filter-accordion-item" style={accordionStyle(true)}>
            <span style={{ flexGrow: 1 }}>{selectedSuburbName}</span>
            <span onClick={resetSuburbFilters} style={closeIconStyle}>
              ×
            </span>
          </div>
        )}

        {/* 🔽 REGION LIST */}
        {stateOpen && selectedState && !selectedRegionName && (
          <div className="filter-accordion-items">
            {states
              .find((s) => s.value === selectedState)
              ?.regions?.map((region, idx) => (
                <div
                  key={idx}
                  className="filter-accordion-item"
                  style={{ marginLeft: "16px", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRegionName(region.name);
                    setSelectedRegion(region.value); // ✅ this triggers URL update effect
                    setFilteredSuburbs(region.suburbs || []);
                    setSelectedSuburbName(null);
                    setStateOpen(false);
                  }}
                >
                  {region.name}
                </div>
              ))}
          </div>
        )}

        {/* 🔽 SUBURB LIST */}
        {stateOpen &&
          selectedState &&
          selectedRegionName &&
          !selectedSuburbName && (
            <div className="filter-accordion-items">
              {Array.isArray(filteredSuburbs) &&
                filteredSuburbs.length === 0 && (
                  <>
                    {console.log(
                      "🚨 suburbs EMPTY at render:",
                      filteredSuburbs
                    )}
                    <p style={{ marginLeft: 20 }}>❌ No suburbs available</p>
                  </>
                )}

              {filteredSuburbs.map((suburb, idx) => (
                <div
                  key={`${suburb.value}-${idx}`}
                  className="filter-accordion-item"
                  style={suburbStyle(suburb.name === selectedSuburbName)}
                  onClick={() => {
                    const postcodeMatch = suburb.value?.match(/\d{4}$/);
                    const postcode = postcodeMatch ? postcodeMatch[0] : null;
                    suburbClickedRef.current = true;

                    setSelectedSuburbName(suburb.name);
                    setSelectedPostcode(postcode);
                    setLocationInput(`${suburb.name} ${selectedStateName}`);
                    setStateOpen(false);

                    const updatedFilters: Filters = {
                      ...currentFilters,
                      suburb: suburb.name,
                      region: selectedRegionName,
                      state: selectedStateName || undefined,
                      postcode: postcode || undefined,
                    };

                    setFilters(updatedFilters);
                    onFilterChange(updatedFilters); // ✅ this triggers ListingsPage
                  }}
                >
                  {suburb.name}
                </div>
              ))}
            </div>
          )}
        {/* inital state */}
        {!selectedState && stateOpen && (
          <div className="filter-accordion-items">
            {states.map((state) => (
              <div
                key={state.value}
                className={`filter-accordion-item ${
                  selectedState === state.value ? "selected" : ""
                }`}
                onClick={() => {
                  preventResetRef.current = true;
                  urlJustUpdatedRef.current = true;

                  setSelectedState(state.value);
                  setSelectedStateName(state.name);
                  setSelectedRegionName(null);
                  setSelectedSuburbName(null);
                  setFilteredRegions(state.regions || []);
                  setFilteredSuburbs([]);
                  setStateOpen(true);

                  const preservedMake =
                    selectedMake || filters.make || currentFilters.make;
                  const preservedModel =
                    selectedModel || filters.model || currentFilters.model;

                  const preservedCategory =
                    selectedCategory ||
                    currentFilters.category ||
                    (() => {
                      const segments = pathname.split("/").filter(Boolean);
                      const categorySegment = segments.find((s) =>
                        s.endsWith("-category")
                      );
                      if (categorySegment) {
                        const slug = categorySegment.replace("-category", "");
                        const matchedCategory = categories.find(
                          (cat) => cat.slug === slug
                        );
                        if (matchedCategory) {
                          setSelectedCategory(matchedCategory.slug);
                          setSelectedCategoryName(matchedCategory.name);
                          return matchedCategory.slug;
                        }
                      }
                      return "";
                    })();

                  const updatedFilters: Filters = {
                    ...currentFilters,
                    make: preservedMake,
                    model: preservedModel,
                    category: preservedCategory,
                    state: state.name,
                    region: undefined,
                    suburb: undefined,
                    postcode: undefined,
                    condition: currentFilters.condition,
                    sleeps: currentFilters.sleeps,
                    from_price: currentFilters.from_price,
                    to_price: currentFilters.to_price,
                    minKg: currentFilters.minKg,
                    maxKg: currentFilters.maxKg,
                    from_year: yearFrom ?? currentFilters.from_year,
                    to_year: yearTo ?? currentFilters.to_year,
                    from_length: currentFilters.from_length,
                    to_length: currentFilters.to_length,
                  };

                  setFilters(updatedFilters);
                  onFilterChange(updatedFilters);

                  // ✅ FIX: Avoid double 'listings' in slug
                  const cleanedSegments = pathname
                    .split("/")
                    .filter(Boolean)
                    .filter((seg, i) => i === 0 || seg !== "listings");

                  const slugParts = [...cleanedSegments];

                  if (preservedMake) slugParts.push(preservedMake);
                  if (preservedModel) slugParts.push(preservedModel);
                  if (preservedCategory)
                    slugParts.push(`${preservedCategory}-category`);
                  if (state.name)
                    slugParts.push(`${slugify(state.name)}-state`);

                  const query = searchParams.toString();
                  const url = `/listings/${slugParts.join("/")}${
                    query ? `?${query}` : ""
                  }`;

                  router.push(url);
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

        {/* ✅ Show selected suburb below input, like a pill with X */}
        {selectedSuburbName && selectedStateName && selectedPostcode && (
          <div className="filter-chip">
            {locationInput}
            <span
              className="filter-chip-close"
              onClick={() => {
                setSelectedSuburbName(null);
                setSelectedPostcode(null);
                setLocationInput("");
                setFilteredSuburbs([]);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  suburb: undefined,
                  postcode: undefined,
                };
                filtersInitialized.current = true;

                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                const segments = window.location.pathname
                  .split("/")
                  .filter(Boolean);
                const newSegments = segments.filter(
                  (s) => !s.includes("-suburb") && !/^\d{4}$/.test(s)
                );

                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
      </div>

      {/* Make Accordion */}
      <div className="cs-full_width_section">
        <div className="filter-accordion" onClick={() => toggle(setMakeOpen)}>
          <h5 className="cfs-filter-label"> Make</h5>
          <BiChevronDown
            style={{
              cursor: "pointer",
              transform: makeOpen ? "rotate(180deg)" : "",
            }}
          />
        </div>
        {selectedMakeName && (
          <div className="filter-chip">
            <span>{selectedMakeName}</span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setSelectedMake(null);
                setSelectedMakeName(null);
                setSelectedModel(null);
                setSelectedModelName(null);
                setModel([]);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  make: undefined,
                  model: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                // Remove make/model from slug
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) => s !== selectedMake && s !== selectedModel
                );

                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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
                    setSelectedModel(null);
                    setSelectedModelName(null);
                    updateFilters({ make: make.slug, model: undefined });

                    setModel([]);

                    const updatedFilters: Filters = {
                      ...filters,
                      make: make.slug,
                      model: undefined,
                      category: selectedCategory || currentFilters.category,
                      state: selectedStateName || currentFilters.state,
                    };

                    setFilters(updatedFilters);
                    onFilterChange(updatedFilters);
                    filtersInitialized.current = true;

                    // ✅ Build slugParts with current selections
                    const slugParts: string[] = [];
                    if (make.slug) slugParts.push(make.slug);
                    if (selectedCategory)
                      slugParts.push(`${selectedCategory}-category`);
                    if (selectedStateName)
                      slugParts.push(`${slugify(selectedStateName)}-state`);

                    const query: Record<string, string> = {};
                    if (yearFrom) query.acustom_fromyears = yearFrom.toString();
                    if (yearTo) query.acustom_toyears = yearTo.toString();

                    const queryString = new URLSearchParams(query).toString();
                    const slugPath = `/listings/${slugParts.join("/")}`;
                    const fullURL = queryString
                      ? `${slugPath}?${queryString}`
                      : slugPath;

                    router.push(fullURL);
                  }}
                >
                  {make.name}
                </div>
              ))}

            {/* Show More / Show Less toggle */}
            {makes.length > 10 && (
              <div
                className="filter-accordion-subitem"
                style={{
                  cursor: "pointer",
                  color: "#007BFF",
                  marginTop: "8px",
                  fontWeight: 500,
                }}
                onClick={() => setShowAllMakes((prev) => !prev)}
              >
                {showAllMakes ? "Show Less ▲" : "Show More ▼"}
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
            <h5 className="cfs-filter-label">Model</h5>
            <BiChevronDown />
          </div>
          {selectedModelName && (
            <div className="filter-chip">
              <span>{selectedModelName}</span>
              <span
                className="filter-chip-close"
                onClick={() => {
                  setSelectedModel(null);
                  setSelectedModelName(null);

                  const updatedFilters: Filters = {
                    ...currentFilters,
                    model: undefined,
                  };
                  setFilters(updatedFilters);
                  onFilterChange(updatedFilters);

                  // Remove model from slug
                  const segments = pathname.split("/").filter(Boolean);
                  const newSegments = segments.filter(
                    (s) => s !== selectedModel
                  );

                  const newPath = `/${newSegments.join("/")}`;
                  router.push(
                    newPath +
                      (searchParams.toString() ? `?${searchParams}` : "")
                  );
                }}
              >
                ×
              </span>
            </div>
          )}

          {modelOpen && (
            <div className="filter-accordion-items">
              {model.map((mod) => (
                <div
                  key={mod.slug}
                  className={`filter-accordion-item ${
                    selectedModel === mod.slug ? "selected" : ""
                  }`}
                  onClick={() => handleModelSelect(mod)} // ✅ Call here
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setAtmFrom(val);

                const updatedFilters: Filters = {
                  ...filters,
                  minKg: val ?? undefined,
                  maxKg: atmTo ?? undefined,
                };

                setFilters(updatedFilters);
                onFilterChange(updatedFilters);
                updateAllFiltersAndURL(); // ✅ Ensures URL and API sync
                filtersInitialized.current = true;
              }}
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setAtmTo(val);
                updateAllFiltersAndURL(); // ✅ This ensures all values are merged
                filtersInitialized.current = true; // ✅ Force filter effect

                const updatedFilters: Filters = {
                  ...filters,
                  minKg: val ?? undefined,
                  maxKg: atmTo ?? undefined,
                };

                setFilters(updatedFilters);
                onFilterChange(updatedFilters);
              }}
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
        {(atmFrom || atmTo) && (
          <div className="filter-chip">
            <span>
              {atmFrom ? `${atmFrom.toLocaleString()}-Kg` : "Min"} –{" "}
              {atmTo ? `${atmTo.toLocaleString()}-Kg` : "Max"}
            </span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setAtmFrom(null);
                setAtmTo(null);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  minKg: undefined,
                  maxKg: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                // Remove from slug
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    !s.includes("-kg-atm") &&
                    !s.match(/^between-\d+-kg-\d+-kg-atm$/)
                );
                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setMinPrice(val);
                filtersInitialized.current = true;

                suburbClickedRef.current = true; // ✅ Trigger URL update
              }}
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setMaxPrice(val);
                filtersInitialized.current = true;

                suburbClickedRef.current = true; // ✅ Trigger URL update
              }}
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
        {(minPrice || maxPrice) && (
          <div className="filter-chip">
            <span>
              {minPrice ? `$${minPrice.toLocaleString()}` : "Min"} –{" "}
              {maxPrice ? `$${maxPrice.toLocaleString()}` : "Max"}
            </span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setMinPrice(null);
                setMaxPrice(null);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_price: undefined,
                  to_price: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                // Remove price slugs from URL
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    !/^over-\d+$/.test(s) &&
                    !/^under-\d+$/.test(s) &&
                    !/^between-\d+-\d+$/.test(s)
                );

                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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
        {selectedConditionName && (
          <div className="filter-chip">
            <span>{selectedConditionName}</span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setSelectedConditionName(null);
                const updatedFilters: Filters = {
                  ...currentFilters,
                  condition: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    ![
                      "new-condition",
                      "used-condition",
                      "near-new-condition",
                    ].includes(s.toLowerCase())
                );
                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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
                  suburbClickedRef.current = true;
                  filtersInitialized.current = true;
                  const updatedFilters: Filters = {
                    ...filters,
                    condition,
                  };

                  setFilters(updatedFilters);
                  onFilterChange(updatedFilters);
                  updateAllFiltersAndURL(); // ✅ Force filter effect
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
            {selectedSleepName && (
              <span className="filter-accordion-items">
                : {selectedSleepName} People
              </span>
            )}
          </h5>
          <BiChevronDown />
        </div>
        {selectedSleepName && (
          <div className="filter-chip">
            <span>{selectedSleepName} People</span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setSelectedSleepName("");
                const updatedFilters: Filters = {
                  ...currentFilters,
                  sleeps: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) => !s.includes("-people-sleeping-capacity")
                );
                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}

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
                  suburbClickedRef.current = true;
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setYearFrom(val);
                filtersInitialized.current = true; // ✅ Force filter effect
                suburbClickedRef.current = true; // ✅ Trigger URL update
              }}
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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setYearTo(val);
                filtersInitialized.current = true; // ✅ Force filter effect
                suburbClickedRef.current = true; // ✅ Trigger URL update
              }}
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
        {(yearFrom || yearTo) && (
          <div className="filter-chip">
            <span>
              {yearFrom ? yearFrom : "Min"} – {yearTo ? yearTo : "Max"}
            </span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setYearFrom(null);
                setYearTo(null);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_year: undefined,
                  to_year: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                // Remove year-range slugs from URL
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    !s.match(/^between-\d+-and-\d+-year-range$/) &&
                    !s.match(/^from-\d+-year-range$/) &&
                    !s.match(/^to-\d+-year-range$/)
                );

                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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
                suburbClickedRef.current = true; // ✅ Trigger URL update

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
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setLengthTo(val);
                filtersInitialized.current = true; // ✅ Force filter effect
                suburbClickedRef.current = true; // ✅ Trigger URL update
              }}
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
        {(lengthFrom || lengthTo) && (
          <div className="filter-chip">
            <span>
              {lengthFrom ? `${lengthFrom} ft` : "Min"} –{" "}
              {lengthTo ? `${lengthTo} ft` : "Max"}
            </span>
            <span
              className="filter-chip-close"
              onClick={() => {
                setLengthFrom(null);
                setLengthTo(null);

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_length: undefined,
                  to_length: undefined,
                };
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

                // Remove slug segments related to length
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    !s.match(/^between-\d+-\d+-length-in-feet$/) &&
                    !s.match(/^over-\d+-length-in-feet$/) &&
                    !s.match(/^under-\d+-length-in-feet$/)
                );

                const newPath = `/${newSegments.join("/")}`;
                router.push(
                  newPath + (searchParams.toString() ? `?${searchParams}` : "")
                );
              }}
            >
              ×
            </span>
          </div>
        )}
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

                {/* 🔽 Styled suggestion list */}
                <ul className="location-suggestions">
                  {locationSuggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setLocationInput(item.short_address);
                        setSelectedSuggestion(item);
                        suburbClickedRef.current = true;
                      }}
                    >
                      {item.address}
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
                  handleSearchClick();
                  setIsModalOpen(false); // ✅ close modal
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
