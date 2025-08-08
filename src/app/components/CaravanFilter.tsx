import { fetchLocations } from "@/api/location/api";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { BiChevronDown } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchProductList } from "@/api/productList/api";
import { fetchModelsByMake } from "@/api/model/api";
import "./filter.css";
import { buildSlugFromFilters } from "./slugBuilter";
import { buildUpdatedFilters } from "./buildUpdatedFilters";
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
  pincode?: string;
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
  const [stateOpen, setStateOpen] = useState(true);
  const [stateLocationOpen, setStateLocationOpen] = useState(false);

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
  const [selectedSleepName, setSelectedSleepName] = useState<string | null>(
    null
  );
  const filtersInitialized = useRef(false);
  const [yearFrom, setYearFrom] = useState<number | null>(null);
  const [yearTo, setYearTo] = useState<number | null>(null);
  const [showAllMakes, setShowAllMakes] = useState(false);

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
  console.log(selectedSuggestion);
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

  const handleATMChange = (newFrom: number | null, newTo: number | null) => {
    setAtmFrom(newFrom);
    setAtmTo(newTo);

    const updatedFilters = buildUpdatedFilters(currentFilters, {
      minKg: newFrom ?? undefined,
      maxKg: newTo ?? undefined,
    });

    setFilters(updatedFilters);
    filtersInitialized.current = true;

    startTransition(() => {
      updateAllFiltersAndURL(updatedFilters);
    });
  };

  useEffect(() => {
    if (!filtersInitialized.current) {
      setAtmFrom(
        currentFilters.minKg !== undefined ? Number(currentFilters.minKg) : null
      );
      setAtmTo(
        currentFilters.maxKg !== undefined ? Number(currentFilters.maxKg) : null
      );
    }
  }, [currentFilters.minKg, currentFilters.maxKg]);

  // correct -2
  useEffect(() => {
    setAtmFrom(
      currentFilters.minKg !== undefined ? Number(currentFilters.minKg) : null
    );
    setAtmTo(
      currentFilters.maxKg !== undefined ? Number(currentFilters.maxKg) : null
    );

    setMinPrice(
      currentFilters.from_price !== undefined
        ? Number(currentFilters.from_price)
        : null
    );
    setMaxPrice(
      currentFilters.to_price !== undefined
        ? Number(currentFilters.to_price)
        : null
    );

    setLengthFrom(
      currentFilters.from_length !== undefined
        ? Number(currentFilters.from_length)
        : null
    );
    setLengthTo(
      currentFilters.to_length !== undefined
        ? Number(currentFilters.to_length)
        : null
    );

    setSelectedSleepName(
      currentFilters.sleeps
        ? currentFilters.sleeps.replace("-people", "")
        : null
    );
    setSelectedConditionName(currentFilters.condition ?? null);
  }, [
    currentFilters.minKg,
    currentFilters.maxKg,
    currentFilters.from_price,
    currentFilters.to_price,
    currentFilters.from_length,
    currentFilters.to_length,
    currentFilters.sleeps,
    currentFilters.condition,
  ]);

  const isModelFetchCompleteRef = useRef(false); // ADD THIS

  // correct 3
  useEffect(() => {
    if (!selectedMake) {
      setModel([]);
      setSelectedModel(null);
      setSelectedModelName(null);
      return;
    }

    isModelFetchCompleteRef.current = false;

    fetchModelsByMake(selectedMake)
      .then((models) => {
        setModel(models || []);
        isModelFetchCompleteRef.current = true;

        // ✅ Moved clearing logic here
        setSelectedModel(null);
        setSelectedModelName(null);

        const updatedFilters: Filters = {
          ...currentFilters,
          make: selectedMake || currentFilters.make,
          category: selectedCategory || currentFilters.category,
          state: selectedStateName || currentFilters.state,
          region: selectedRegionName || currentFilters.region,
          suburb: selectedSuburbName || currentFilters.suburb,
          pincode: selectedPostcode || currentFilters.pincode,
        };

        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
      })
      .catch(console.error);
  }, [selectedMake]);

  useEffect(() => {
    if (!selectedMakeName && filters.make && makes.length > 0) {
      const matched = makes.find((m) => m.slug === filters.make);
      if (matched) {
        setSelectedMake(matched.slug);
        setSelectedMakeName(matched.name);
      }
    }
  }, [filters.make, makes, selectedMakeName]);

  console.log("filters", filters);
  console.log(selectedRegion, filteredRegions);

  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  console.log("Active filters at API call:", filters);

  const [isPending, startTransition] = useTransition();
  console.log(isPending);

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

  const resetStateFilters = () => {
    console.log("❌ State Reset Triggered");

    // ✅ Clear all location-related UI state
    setSelectedState(null);
    setSelectedStateName(null);
    setSelectedRegion("");
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedPostcode(null);
    setFilteredRegions([]);
    setFilteredSuburbs([]);
    setLocationInput("");
    setStateOpen(false);

    // ✅ Delay filter clearing until React state updates apply
    setTimeout(() => {
      const updatedFilters: Filters = {
        ...currentFilters,
        state: undefined,
        region: undefined,
        suburb: undefined,
        pincode: undefined,
        location: null,
      };

      filtersInitialized.current = true;
      setFilters(updatedFilters);
      console.log("✅ Cleaned filters after timeout", updatedFilters);

      startTransition(() => {
        updateAllFiltersAndURL(updatedFilters);
      });
    }, 0); // Allow React to flush UI state
  };
  useEffect(() => {
    const noLocationInFilters =
      !currentFilters.state &&
      !currentFilters.region &&
      !currentFilters.suburb &&
      !currentFilters.pincode;

    if (noLocationInFilters && selectedStateName) {
      setSelectedState(null);
      setSelectedStateName(null);
      setFilteredRegions([]);
      setSelectedRegionName(null);
      setSelectedSuburbName(null);
      setFilteredSuburbs([]);
      setLocationInput("");
    }
  }, [
    currentFilters.state,
    currentFilters.region,
    currentFilters.suburb,
    currentFilters.pincode,
    selectedStateName,
  ]);

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
      pincode: undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetSuburbFilters = () => {
    setSelectedSuburbName(null); // ✅ Clear suburb UI label
    setFilteredSuburbs([]); // ✅ Clear list for region dropdown

    const updatedFilters: Filters = {
      ...currentFilters,
      suburb: undefined, // ✅ Remove from filters
      pincode: undefined,
      // ✅ Remove postcode only
    };

    setFilters(updatedFilters);
    filtersInitialized.current = true;

    onFilterChange(updatedFilters);
  };

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

    const parts = locationData.uri.split("/");
    const suburbSlug = parts[0] || "";
    const regionSlug = parts[1] || "";
    const stateSlug = parts[2] || "";

    const suburb = suburbSlug.replace("-suburb", "").replace(/-/g, " ").trim();
    const region = regionSlug.replace("-region", "").replace(/-/g, " ").trim();
    const state = stateSlug.replace("-state", "").replace(/-/g, " ").trim();

    // ✅ Postcode Extraction (with fallback)
    let postcode = parts[3] || "";

    if (!postcode || !/^\d{4}$/.test(postcode)) {
      const addressMatch = locationData.address.match(/\b\d{4}\b/);
      if (addressMatch) {
        postcode = addressMatch[0];
      }
    }
    console.log("output", state, region, suburb, postcode);
    // ✅ Set UI states
    setSelectedState(stateSlug);
    setSelectedRegion(region); // value: new-south-wales

    setSelectedStateName(state); // name: New South Wales
    setSelectedSuburbName(suburb); // Wagga Wagga
    setSelectedPostcode(postcode); // 2650
    setSelectedRegionName(region);
    // setLocationInput(locationData.address);
    setLocationInput(locationData.short_address);

    // ✅ Update filters
    const updatedFilters = buildUpdatedFilters(currentFilters, {
      make: selectedMake || filters.make || currentFilters.make,
      model: selectedModel || filters.model || currentFilters.model,
      category: selectedCategory || filters.category || currentFilters.category,
      suburb: suburb.toLowerCase(),
      pincode: postcode,
      state: state,
      region: selectedRegionName || region,
    });

    setFilters(updatedFilters);
    // filtersInitialized.current = true;
    // suburbClickedRef.current = true;

    // startTransition(() => {
    //   updateAllFiltersAndURL(updatedFilters);
    // });
  };

  console.log(
    "output selected",
    selectedPostcode,
    selectedSuburbName,
    selectedStateName,
    selectedRegionName,
    locationInput
  );
  useEffect(() => {
    if (
      filters.suburb &&
      filters.pincode &&
      !locationInput.includes(filters.suburb)
    ) {
      setLocationInput(`${filters.suburb} ${filters.pincode}`);
    }
  }, [filters.suburb, filters.pincode, locationInput]);

  const slugify = (value: string | null | undefined) =>
    value?.toLowerCase().replace(/\s+/g, "-").trim() || "";

  const resetFilters = () => {
    const reset: Filters = {
      make: undefined,
      model: undefined,
      category: undefined,
      condition: undefined,
      state: undefined,
      region: undefined,
      suburb: undefined,
      pincode: undefined,
      from_price: undefined,
      to_price: undefined,
      minKg: undefined,
      maxKg: undefined,
      sleeps: undefined,
      from_length: undefined,
      to_length: undefined,
      from_year: undefined,
      to_year: undefined,
      location: null,
    };

    // ✅ Clear all UI states explicitly
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSelectedMake(null);
    setSelectedMakeName(null);
    setSelectedModel(null);
    setSelectedModelName(null);

    // ✅ This block is key to reset location
    setSelectedState(null);
    setSelectedStateName(null);
    setSelectedRegionName(null);
    setSelectedSuburbName(null);
    setSelectedPostcode(null);
    setFilteredRegions([]);
    setFilteredSuburbs([]);
    setLocationInput(""); // <-- Reset visible field

    setAtmFrom(null);
    setAtmTo(null);
    setMinPrice(null);
    setMaxPrice(null);
    setYearFrom(null);
    setYearTo(null);
    setLengthFrom(null);
    setLengthTo(null);
    setSelectedConditionName(null);
    setSelectedSleepName(null);

    setFilters(reset);
    filtersInitialized.current = true;
    resetSuburbFilters();
    resetRegionFilters();
    resetStateFilters();
    // ✅ Reset region set flag too
    regionSetAfterSuburbRef.current = false;
    suburbClickedRef.current = false;

    startTransition(() => {
      updateAllFiltersAndURL(reset); // ✅ push reset filters to URL
    });
  };

  // locataion useeffe
  useEffect(() => {
    if (currentFilters.suburb && !selectedSuburbName) {
      setSelectedSuburbName(currentFilters.suburb);
    }
    if (currentFilters.pincode && !selectedPostcode) {
      setSelectedPostcode(currentFilters.pincode);
    }
    if (currentFilters.state && !selectedStateName) {
      setSelectedStateName(currentFilters.state);
    }
    if (currentFilters.region && !selectedRegionName) {
      setSelectedRegionName(currentFilters.region);
    }
  }, [
    currentFilters.suburb,
    currentFilters.pincode,
    currentFilters.state,
    currentFilters.region,
    selectedSuburbName,
    selectedPostcode,
    selectedStateName,
    selectedRegionName,
  ]);
  useEffect(() => {
    if (
      selectedSuburbName &&
      selectedStateName &&
      selectedPostcode &&
      selectedRegionName
    ) {
      setLocationInput(`${selectedSuburbName} ${selectedPostcode}`);
    }
  }, [
    selectedSuburbName,
    selectedStateName,
    selectedPostcode,
    selectedRegionName,
  ]);

  console.log("🔁 suburb Render triggered — filteredSuburbs:", filteredSuburbs);
  // correct-3
  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    const suburbSegment = segments.find((s) => s.endsWith("-suburb"));
    const regionSegment = segments.find((s) => s.endsWith("-region"));
    const stateSegment = segments.find((s) => s.endsWith("-state"));

    if (regionSegment) {
      const region = regionSegment.replace("-region", "").replace(/-/g, " ");
      setSelectedRegionName(region);
      setSelectedRegion(region);
    }

    if (suburbSegment) {
      const suburb = suburbSegment.replace("-suburb", "").replace(/-/g, " ");
      setSelectedSuburbName(suburb);
      setLocationInput(suburb);
    }

    if (stateSegment) {
      const state = stateSegment.replace("-state", "").replace(/-/g, " ");
      setSelectedStateName(state);
      setSelectedState(state);
    }
  }, [pathname]);

  useEffect(() => {
    if (!selectedStateName || !selectedRegionName || !states.length) return;

    const matchedState = states.find(
      (s) =>
        s.name.toLowerCase() === selectedStateName.toLowerCase() ||
        s.value.toLowerCase() === selectedStateName.toLowerCase()
    );

    if (!matchedState) return;

    const matchedRegion = matchedState.regions?.find(
      (r) =>
        r.name.toLowerCase() === selectedRegionName.toLowerCase() ||
        r.value.toLowerCase() === selectedRegionName.toLowerCase()
    );

    if (matchedRegion?.suburbs?.length) {
      setFilteredSuburbs(matchedRegion.suburbs);
    } else {
      // Only clear if we are switching region
      if (filteredSuburbs.length) {
        setFilteredSuburbs([]);
      }
    }
  }, [selectedStateName, selectedRegionName, states]);

  useEffect(() => {
    if (!suburbClickedRef.current) return;

    console.log(
      "🏘️ Suburb Render triggered – filteredSuburbs:",
      filteredSuburbs
    );
  }, [filteredSuburbs]);

  const suburbFilterReadyRef = useRef(false);
  suburbFilterReadyRef.current = true;
  useEffect(() => {
    if (
      !selectedRegionName &&
      currentFilters.region &&
      !selectedSuburbName && // avoid conflict
      !pathname.includes("-region") // ← only if not in URL
    ) {
      setSelectedRegionName(currentFilters.region);
    }
  }, [currentFilters.region, selectedRegionName, selectedSuburbName]);

  useEffect(() => {
    if (
      !suburbFilterReadyRef.current ||
      !selectedSuburbName ||
      !selectedPostcode ||
      !selectedStateName ||
      !selectedRegionName ||
      !locationInput
    )
      return;

    suburbFilterReadyRef.current = true;

    const updatedFilters = {
      ...currentFilters,
      make: selectedMake || currentFilters.make,
      model: selectedModel || currentFilters.model,
      category: selectedCategory || currentFilters.category,
      suburb: selectedSuburbName.toLowerCase(),
      pincode: selectedPostcode || currentFilters.pincode,
      state: selectedStateName,
      region: selectedRegionName || currentFilters.region,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    filtersInitialized.current = true;
    suburbClickedRef.current = false;
  }, [
    selectedSuburbName,
    selectedPostcode,
    selectedStateName,
    selectedRegionName,
    locationInput,
  ]);

  useEffect(() => {
    if (selectedMake && makes.length > 0 && !selectedMakeName) {
      const match = makes.find((m) => m.slug === selectedMake);
      if (match) {
        setSelectedMakeName(match.name);

        // ✅ Trigger full filter+URL sync here
        startTransition(() => {
          updateAllFiltersAndURL(); // Push slug with current filters
        });
      }
    }
  }, [selectedMake, makes, selectedMakeName]);

  const regionSetAfterSuburbRef = useRef(false);

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
    if (
      selectedMake &&
      !selectedModel &&
      currentFilters.model &&
      model.length > 0
    ) {
      const match = model.find((m) => m.slug === currentFilters.model);
      if (match) {
        setSelectedModel(match.slug);
        setSelectedModelName(match.name);
      }
    }

    if (selectedModel && model.length > 0 && !selectedModelName) {
      const match = model.find((m) => m.slug === selectedModel);
      if (match) {
        setSelectedModelName(match.name);
      }
    }
  }, [
    selectedMake,
    selectedModel,
    model,
    currentFilters.model,
    selectedModelName,
  ]);

  useEffect(() => {
    if (
      !makeInitializedRef.current &&
      selectedMake &&
      filtersInitialized.current &&
      (!filters.make || filters.make !== selectedMake)
    ) {
      const updatedFilters = {
        ...currentFilters,
        make: selectedMake,
        model: filters.model,
      };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      makeInitializedRef.current = true;
    }
  }, [selectedMake]);

  const makeInitializedRef = useRef(false); // ✅ add at top of component

  useEffect(() => {
    if (
      !makeInitializedRef.current &&
      !selectedMake &&
      pathname.includes("/listings/") &&
      makes.length > 0
    ) {
      const segments = pathname.split("/listings/")[1]?.split("/") || [];

      const matchedMakeSlug = segments.find((segment) =>
        makes.some((m) => m.slug === segment)
      );

      if (matchedMakeSlug) {
        const matched = makes.find((m) => m.slug === matchedMakeSlug);
        if (matched) {
          setSelectedMake(matched.slug);
          setSelectedMakeName(matched.name);
          makeInitializedRef.current = true;

          // Optional: Update filters
          const updatedFilters: Filters = {
            ...currentFilters,
            make: matched.slug,
          };
          setFilters(updatedFilters);
          onFilterChange(updatedFilters); // ✅ single API call
        }
      }
    }
  }, [pathname, selectedMake, makes]);

  const hasCategoryBeenSetRef = useRef(false);

  useEffect(() => {
    if (!hasCategoryBeenSetRef.current && selectedCategory) {
      hasCategoryBeenSetRef.current = true;
    }
  }, [selectedCategory]);
  console.log("category in filters", currentFilters.category);
  // router issue
  const lastPushedURLRef = useRef<string>("");

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

  const isValidMakeSlug = (slug: string | null | undefined): slug is string =>
    !!slug &&
    isNaN(Number(slug)) &&
    makes.some((m) => m.slug === slug) &&
    !slug.includes("kg") &&
    !slug.includes("atm") &&
    !/^over-/.test(slug) &&
    !/^under-/.test(slug) &&
    !/^between-/.test(slug);

  const isValidModelSlug = (slug: string | null | undefined): slug is string =>
    !!slug && isNaN(Number(slug)) && model.some((m) => m.slug === slug);

  useEffect(() => {
    if (!filtersInitialized.current) return;

    const slugPath = buildSlugFromFilters(filters);
    const query = new URLSearchParams();

    // if (filters.from_year)
    //   query.set("acustom_fromyears", filters.from_year.toString());
    // if (filters.to_year)
    //   query.set("acustom_toyears", filters.to_year.toString());

    if (!searchParams.has("page")) {
      const page = searchParams.get("page");
      if (page && page !== "1") {
        query.set("page", page);
      }
    }

    // ✅ Clean URL before pushing
    const deduped = new URLSearchParams(query.toString());
    const finalURL = deduped.toString() ? `${slugPath}?${deduped}` : slugPath;

    if (lastPushedURLRef.current !== finalURL) {
      lastPushedURLRef.current = finalURL;
      startTransition(() => {
        router.push(finalURL);
        onFilterChange(filters);
      });
    }
  }, [filters]);

  // ✅ Update all filters and URL with validation
  const updateAllFiltersAndURL = (overrideFilters?: Filters) => {
    const final = overrideFilters ?? filters;

    setFilters(final);
    filtersInitialized.current = true;

    const slugPath = buildSlugFromFilters(final);
    const query = new URLSearchParams();

    if (final.from_year)
      query.set("acustom_fromyears", final.from_year.toString());
    if (final.to_year) query.set("acustom_toyears", final.to_year.toString());
    query.set("page", "1");
    const safeSlugPath = slugPath.endsWith("/") ? slugPath : `${slugPath}/`;
    const finalURL = query.toString() ? `${slugPath}?${query}` : safeSlugPath;

    if (lastPushedURLRef.current !== finalURL) {
      lastPushedURLRef.current = finalURL;

      startTransition(() => {
        router.push(finalURL);
        onFilterChange(final); // ✅ single clean API call
      });
    }
  };

  // ✅ Update handleModelSelect with valid check
  const handleModelSelect = (mod: Model) => {
    const safeMake = isValidMakeSlug(selectedMake) ? selectedMake : undefined;
    const safeModel = isValidModelSlug(mod.slug) ? mod.slug : undefined;

    setSelectedModel(mod.slug);
    setSelectedModelName(mod.name);
    setModelOpen(false);

    const updatedFilters: Filters = {
      ...currentFilters,
      make: safeMake,
      model: safeModel,
      category: selectedCategory || currentFilters.category,
      state: selectedStateName || currentFilters.state,
      region: selectedRegionName || currentFilters.region,
      suburb: selectedSuburbName || currentFilters.suburb,
      pincode: selectedPostcode || currentFilters.pincode,
    };

    setFilters(updatedFilters);
    filtersInitialized.current = true;

    startTransition(() => {
      router.push(buildSlugFromFilters(updatedFilters));
      onFilterChange(updatedFilters); // ✅ correct model slug is used
    });
  };

  console.log("states", states);
  console.log("statesss", selectedState);

  useEffect(() => {
    if (!selectedStateName || !selectedRegionName || !states.length) return;

    const matchedState = states.find(
      (s) =>
        s.name.toLowerCase() === selectedStateName.toLowerCase() ||
        s.value.toLowerCase() === selectedStateName.toLowerCase()
    );

    if (!matchedState) return;

    const matchedRegion = matchedState.regions?.find(
      (r) =>
        r.name.toLowerCase() === selectedRegionName.toLowerCase() ||
        r.value.toLowerCase() === selectedRegionName.toLowerCase()
    );

    if (matchedRegion?.suburbs?.length) {
      setFilteredSuburbs(matchedRegion.suburbs);
    } else {
      // Only clear if we are switching region
      if (filteredSuburbs.length) {
        setFilteredSuburbs([]);
      }
    }
  }, [selectedStateName, selectedRegionName, states]);
  useEffect(() => {
    if (
      !regionSetAfterSuburbRef.current &&
      selectedSuburbName &&
      selectedStateName &&
      states.length > 0
    ) {
      const matchedState = states.find(
        (s) =>
          s.name.toLowerCase() === selectedStateName.toLowerCase() ||
          s.value.toLowerCase() === selectedStateName.toLowerCase()
      );

      const matchedRegion = matchedState?.regions?.find((region) =>
        region.suburbs?.some(
          (sub) =>
            sub.name.toLowerCase().trim() ===
            selectedSuburbName.toLowerCase().trim()
        )
      );
      console.log("reeeee", matchedRegion);
      if (matchedRegion) {
        console.log("✅ Auto-detected region:", matchedRegion.name);
        setSelectedRegionName(matchedRegion.name);
        setSelectedRegion(matchedRegion.value);
        regionSetAfterSuburbRef.current = true;

        const updatedFilters: Filters = {
          ...filters,
          state: selectedStateName || matchedState?.name,
          region: matchedRegion.name,
          suburb: selectedSuburbName,
          pincode: selectedPostcode ?? "",
        };

        setFilters(updatedFilters);
        filtersInitialized.current = true;

        startTransition(() => {
          updateAllFiltersAndURL(updatedFilters);
        });
      }
    }
  }, [selectedSuburbName, selectedStateName, states]);

  console.log("yy states", states);
  console.log("yy selectedState", selectedStateName);
  console.log("yy selectedRegion", selectedRegion);
  console.log("subbb", filteredSuburbs);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL();
                });
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
                    const updatedFilters: Filters = {
                      ...currentFilters,
                      category: cat.slug,
                    };
                    setFilters(updatedFilters);
                    filtersInitialized.current = true;
                    startTransition(() => {
                      updateAllFiltersAndURL(updatedFilters); // ✅ this triggers the API + URL update
                    });
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
              setStateLocationOpen((prev) => !prev);
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
              onClick={() => setStateLocationOpen((prev) => !prev)}
            >
              {selectedStateName}
            </span>
            {!selectedRegionName && (
              <div style={iconRowStyle}>
                <span onClick={resetStateFilters} style={closeIconStyle}>
                  ×
                </span>
                <BiChevronDown
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent click from firing
                    setStateLocationOpen((prev) => !prev);
                  }}
                  style={arrowStyle(stateOpen)}
                />
              </div>
            )}
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
                      .find(
                        (s) =>
                          s.name.toLowerCase().trim() ===
                          selectedStateName?.toLowerCase().trim()
                      )
                      ?.regions?.find(
                        (r) =>
                          r.name.toLowerCase().trim() ===
                          selectedRegionName?.toLowerCase().trim()
                      );

                    if (region?.suburbs) {
                      setFilteredSuburbs(region.suburbs); // preload
                    }
                    setStateOpen((prev) => !prev); // toggle dropdown
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
        {mounted &&
          selectedStateName &&
          stateOpen &&
          (!selectedRegionName || filteredSuburbs.length === 0) && (
            <div className="filter-accordion-items">
              {states
                .find(
                  (s) =>
                    s.name.toLowerCase().trim() ===
                    selectedStateName?.toLowerCase().trim()
                )
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
                      const updatedFilters: Filters = {
                        ...currentFilters,
                        state: selectedStateName || currentFilters.state,
                        region: region.name,
                        suburb: undefined,
                        pincode: undefined,
                      };

                      setFilters(updatedFilters);
                      filtersInitialized.current = true;

                      startTransition(() => {
                        updateAllFiltersAndURL(updatedFilters); // ✅ this triggers the API + URL update
                      });
                    }}
                  >
                    {region.name}
                  </div>
                ))}
            </div>
          )}
        {/* 🔽 SUBURB LIST */}
        {stateOpen &&
          selectedStateName &&
          selectedRegionName &&
          selectedRegion &&
          !selectedSuburbName && (
            <div className="filter-accordion-items">
              {Array.isArray(filteredSuburbs) &&
              filteredSuburbs.length === 0 ? (
                <>
                  {console.log("🚨 suburbs data:", filteredSuburbs)}{" "}
                  {console.log("🚨 suburbs EMPTY at render:", filteredSuburbs)}
                  <p style={{ marginLeft: 20 }}>❌ No suburbs available</p>
                </>
              ) : (
                filteredSuburbs.map((suburb, idx) => (
                  <div
                    key={`${suburb.value}-${idx}`}
                    className="filter-accordion-item"
                    style={suburbStyle(suburb.name === selectedSuburbName)}
                    onClick={() => {
                      const postcodeMatch = suburb.value?.match(/\d{4}$/);
                      const postcode = postcodeMatch ? postcodeMatch[0] : null;
                      suburbClickedRef.current = true;
                      setSelectedSuburbName(suburb.name);
                      setSelectedPostcode(postcode || "");
                      setLocationInput(`${suburb.name} ${selectedStateName}`);
                      setStateOpen(false);
                      const updatedFilters: Filters = {
                        ...currentFilters,
                        state: selectedStateName || currentFilters.state,
                        region: selectedRegionName || currentFilters.region, // ✅ preserve region
                        suburb: suburb.name,
                        pincode: postcode || undefined,
                      };

                      setFilters(updatedFilters);
                      // filtersInitialized.current = true;

                      // startTransition(() => {
                      //   updateAllFiltersAndURL(updatedFilters);
                      // });
                    }}
                  >
                    {suburb.name}
                  </div>
                ))
              )}
            </div>
          )}

        {/* 🔹 INITIAL STATE LIST */}
        {!selectedState && stateLocationOpen && (
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
                  const regions = state.regions || [];
                  setFilteredRegions(regions);
                  setFilteredSuburbs([]);
                  setStateLocationOpen(true);

                  // ✅ If regions exist, auto-toggle to region list
                  if (regions.length > 0) {
                    setTimeout(() => {
                      // Just trigger re-render
                      setFilteredRegions([...regions]);
                    }, 0);
                  }

                  const updatedFilters: Filters = {
                    ...currentFilters,
                    state: selectedStateName || state.name,
                    region: undefined,
                    suburb: undefined,
                    pincode: undefined,
                  };

                  setFilters(updatedFilters);
                  filtersInitialized.current = true;

                  startTransition(() => {
                    updateAllFiltersAndURL(updatedFilters); // ✅ this triggers the API + URL update
                  });
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
        {selectedSuburbName &&
          selectedStateName &&
          selectedPostcode &&
          selectedRegionName && (
            <div className="filter-chip">
              {locationInput}
              <span className="filter-chip-close" onClick={resetSuburbFilters}>
                ×
              </span>
            </div>
          )}
      </div>

      {/* Make Accordion */}
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
                setModel([]); // ✅ also reset the model list
                setModelOpen(false); // ✅ close model dropdown

                const updatedFilters: Filters = {
                  ...currentFilters,
                  make: undefined,
                  model: undefined,
                };

                setFilters(updatedFilters);
                // onFilterChange(updatedFilters);

                // ✅ Remove make & model from slug
                const segments = pathname.split("/").filter(Boolean);
                const newSegments = segments.filter(
                  (s) =>
                    s !== selectedMake && // old make
                    s !== selectedModel && // old model
                    !makes.some((m) => m.slug === s) && // any known make slug
                    !model.some((mod) => mod.slug === s) // any known model slug
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
                    // ✅ Reset model state
                    setSelectedModel(null);
                    setSelectedModelName(null);

                    // ✅ Force update make
                    setSelectedMake(make.slug);
                    setSelectedMakeName(make.name);

                    // ✅ Immediately open model dropdown
                    setModelOpen(true); // <== Force open immediately

                    // ✅ Fetch models async (don't wait for this to open dropdown)
                    fetchModelsByMake(make.slug)
                      .then((models) => {
                        setModel(models || []);
                      })
                      .catch(console.error);

                    // ✅ Update filters
                    const updatedFilters: Filters = {
                      ...currentFilters,
                      make: make.slug,
                      model: undefined,
                      category: selectedCategory || currentFilters.category,
                      state: selectedStateName || currentFilters.state,
                      region: selectedRegionName || currentFilters.region,
                      suburb: selectedSuburbName || currentFilters.suburb,
                      pincode: selectedPostcode || currentFilters.pincode,
                    };

                    setFilters(updatedFilters);
                    // onFilterChange(updatedFilters);
                    filtersInitialized.current = true;

                    // ✅ Update URL
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

                    router.push(fullURL); // ✅ Trigger URL update
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
      {selectedMake && (
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
                  // onFilterChange(updatedFilters);

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
          {/* ATM From */}
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">From</h6>
            <select
              className="cfs-select-input"
              value={atmFrom?.toString() || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                handleATMChange(val, atmTo); // ✅ pass current `atmTo`
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

          {/* ATM To */}
          <div className="col-6">
            <h6 className="cfs-filter-label-sub">To</h6>
            <select
              className="cfs-select-input"
              value={atmTo?.toString() || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                handleATMChange(atmFrom, val); // ✅ pass current `atmFrom`
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

        {/* ✅ Filter Chip Display */}
        {(atmFrom || atmTo) && (
          <div className="filter-chip">
            <span>
              {atmFrom ? `${atmFrom.toLocaleString()} Kg` : "Min"} –{" "}
              {atmTo ? `${atmTo.toLocaleString()} Kg` : "Max"}
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
                // onFilterChange(updatedFilters);
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL(updatedFilters); // ✅ pass it here
                });
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

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_price: val ?? undefined,
                  to_price: maxPrice ?? undefined,
                };

                startTransition(() => {
                  updateAllFiltersAndURL();
                });
                setFilters(updatedFilters);
                filtersInitialized.current = true;
              }}
            >
              <option value="">Min</option>
              {price.map((val) => (
                <option key={val} value={val}>
                  ${val.toLocaleString()}
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

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_price: minPrice ?? undefined,
                  to_price: val ?? undefined,
                };

                setFilters(updatedFilters);
                // onFilterChange(updatedFilters);
                filtersInitialized.current = true;

                startTransition(() => {
                  updateAllFiltersAndURL();
                });
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
                //                 onFilterChange(updatedFilters);

                setFilters(updatedFilters);
                // onFilterChange(updatedFilters);
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL(updatedFilters); // ✅ pass it here
                });
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
          <h5 className="cfs-filter-label"> Condition</h5>
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
                //                 onFilterChange(updatedFilters);

                setFilters(updatedFilters);
                // onFilterChange(updatedFilters);
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL(updatedFilters); // ✅ pass it here
                });
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

                  const updatedFilters: Filters = {
                    ...currentFilters,
                    condition,
                  };

                  setFilters(updatedFilters);
                  // onFilterChange(updatedFilters);
                  filtersInitialized.current = true;

                  startTransition(() => {
                    updateAllFiltersAndURL();
                  });
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
          <h5 className="cfs-filter-label">Sleep</h5>
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
                //                 onFilterChange(updatedFilters);

                setFilters(updatedFilters);
                // onFilterChange(updatedFilters);
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL(updatedFilters); // ✅ pass it here
                });
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
                  const selectedValue = String(sleepValue);
                  const isAlreadySelected = selectedSleepName === selectedValue;

                  const newSleep = isAlreadySelected
                    ? undefined
                    : `${selectedValue}-people`;
                  setSelectedSleepName(
                    isAlreadySelected ? null : selectedValue
                  );
                  setSleepsOpen(false);

                  const updatedFilters: Filters = {
                    ...currentFilters,
                    sleeps: newSleep,
                  };

                  setFilters(updatedFilters);
                  // onFilterChange(updatedFilters);
                  filtersInitialized.current = true;

                  startTransition(() => {
                    updateAllFiltersAndURL(); // ✅ SHOULD be called here
                  });
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

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_year: val ?? undefined, // ✅ Use val directly!
                  to_year: yearTo ?? filters.to_year,
                };

                setFilters(updatedFilters);
                filtersInitialized.current = true;
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

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_year: yearFrom ?? filters.from_year,
                  to_year: val ?? undefined, // ✅ Use val directly!
                };

                setFilters(updatedFilters);
                filtersInitialized.current = true;
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
                // onFilterChange(updatedFilters);
                //                 onFilterChange(updatedFilters);

                startTransition(() => {
                  updateAllFiltersAndURL(updatedFilters); // ✅ pass it here
                });
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

                const updatedFilters: Filters = {
                  ...currentFilters,
                  from_length: val ?? undefined,
                  to_length: lengthTo ?? undefined,
                };
                setFilters(updatedFilters);
                filtersInitialized.current = true;
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
                const updatedFilters: Filters = {
                  ...currentFilters,

                  from_length: lengthFrom ?? undefined,
                  to_length: val ?? undefined,
                };

                setFilters(updatedFilters);
                filtersInitialized.current = true;
                startTransition(() => {
                  updateAllFiltersAndURL();
                });
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
                //                 onFilterChange(updatedFilters);

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
                  {locationSuggestions.map((item, i) => {
                    const isSelected =
                      selectedSuggestion?.short_address === item.short_address;

                    return (
                      <li
                        key={i}
                        className={`suggestion-item ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => {
                          setLocationInput(item.short_address);
                          setSelectedSuggestion(item); // ✅ mark as selected
                          setLocationSuggestions([]); // ✅ CLOSE the suggestion list
                          suburbClickedRef.current = true;
                        }}
                      >
                        {item.address}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="cfs-modal-footer">
              <button
                type="button"
                className="cfs-btn btn"
                onClick={() => {
                  handleSearchClick();
                  setIsModalOpen(false);
                  setLocationSuggestions([]); // ✅ close modal
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
