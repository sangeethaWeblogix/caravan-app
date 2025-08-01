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
            pincode:
              selectedPostcode || filters.pincode || currentFilters.pincode,
          };

          setFilters(updatedFilters);
          onFilterChange(updatedFilters);

          console.log("✅ Category set from slug:", categorySlug);
        }
      }
    }
  }, [pathname, categories]);
  // Dependencies to trigger when state/region/suburb change
  useEffect(() => {
    if (selectedState) {
      const slugifiedState = selectedState.toLowerCase().replace(/\s+/g, "-");
      const slugifiedRegion = selectedRegionName
        ? selectedRegionName.toLowerCase().replace(/\s+/g, "-")
        : "";
      // Update filters and URL
      const updatedFilters = {
        ...filters,
        state: selectedState,
        make: selectedMake || currentFilters.make || undefined,
        model: selectedModel || currentFilters.model,
        region: selectedRegionName || undefined,
        suburb: selectedSuburbName || undefined,
        pincode: selectedPostcode || currentFilters.pincode,
      };

      setFilters(updatedFilters); // Update the state with the new filters
      onFilterChange(updatedFilters); // Trigger the API call with updated filters
      filtersInitialized.current = true;
      const newPath = `/listings/${slugifiedState}-state/${slugifiedRegion}-region`;
      router.push(newPath);
    }
  }, [selectedState, selectedRegionName, selectedSuburbName, selectedPostcode]);

  const isModelFetchCompleteRef = useRef(false); // ADD THIS
  useEffect(() => {
    if (selectedMake && !filters.make) {
      onFilterChange({ ...filters, make: selectedMake });
    }
  }, [selectedMake]);

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
    if (!selectedMake) return;

    const categorySlug = selectedCategory || currentFilters.category;

    // 🛠️ Fallback: parse from pathname if still missing
    let finalCategory = categorySlug;
    if (!finalCategory) {
      const categorySegment = pathname
        .split("/listings/")[1]
        ?.split("/")
        .find((s) => s.endsWith("-category"));

      if (categorySegment) {
        finalCategory = categorySegment.replace("-category", "");
      }
    }

    const updatedFilters: Filters = {
      ...filters,
      make: selectedMake,
      model: selectedModel || filters.model || currentFilters.model,
      category:
        (selectedCategory ||
          currentFilters.category ||
          getCategoryFromPath()) ??
        undefined,
      region: selectedRegionName || currentFilters.region || filters.region,
      suburb: selectedSuburbName || currentFilters.suburb || filters.suburb,
      pincode: selectedPostcode || currentFilters.pincode || filters.pincode,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
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
  useEffect(() => {
    if (filters.make && makes.length > 0) {
      const match = makes.find((m) => m.slug === filters.make);
      if (match) {
        setSelectedMake(match.slug);
        setSelectedMakeName(match.name);
      }
    }
  }, [filters.make, makes]);

  const getCategoryFromPath = () => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];
    const categorySegment = segments.find((s) => s.endsWith("-category"));
    return categorySegment?.replace("-category", "") || null;
  };

  // resend use effect

  // kkkkk
  // Dependencies to trigger when state/region/suburb change
  // ✅ Unified Filters Update & URL Sync Handler

  const pendingURLRef = useRef<string | null>(null);

  console.log("filters", filters);
  console.log(selectedRegion, filteredRegions);

  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const toggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  useEffect(() => {
    const slug = pathname.split("/listings/")[1];
    const segments = slug?.split("/") || [];

    const isSlugKnownFilter = (slug: string) => {
      return (
        /^\d{4}$/.test(slug) || // ✅ Postcode (like 2650)
        slug.endsWith("-suburb") ||
        slug.endsWith("-state") ||
        slug.endsWith("-region") ||
        slug.endsWith("-category") ||
        slug.includes("-condition") ||
        slug.includes("-people-sleeping-capacity") ||
        slug.includes("length-in-feet") ||
        /^over-\d+$/.test(slug) ||
        /^under-\d+$/.test(slug) ||
        /^between-\d+-\d+$/.test(slug) ||
        /^between-\d+-kg-\d+-kg-atm$/.test(slug) ||
        /^over-\d+-kg-atm$/.test(slug) ||
        /^under-\d+-kg-atm$/.test(slug)
      );
    };

    const matchedMakeSlug: string | null = null;
    const matchedMakeName: string | null = null;
    const matchedModelSlug: string | null = null;
    const matchedModelName: string | null = null;
    const matchedCondition = null;
    const matchedSleep = null;
    // ✅ CaravanFilter slug parser fix
    // 🔁 Replaces your existing segments.forEach logic
    const isValidMakeSlug = (
      slug: string | undefined | null,
      makes: Option[]
    ) => {
      if (!slug || /^\d+$/.test(slug)) return false;
      return makes.some((make) => make.slug === slug);
    };

    const isValidModelSlug = (
      slug: string | undefined | null,
      models: Model[]
    ) => {
      if (!slug || /^\d+$/.test(slug)) return false;
      return models.some((model) => model.slug === slug);
    };

    segments.forEach((part) => {
      console.log("🧩 Processing slug segment:", part);

      // ✅ 1. Handle postcode early to avoid make/model confusion
      if (/^\d{4}$/.test(part)) {
        console.log("📮 Detected postcode:", part);
        setSelectedPostcode(part);
        filters.pincode = part;
        return;
      }

      // ✅ 2. Handle suburb
      if (part.endsWith("-suburb")) {
        const name = part.replace("-suburb", "").replace(/-/g, " ");
        setSelectedSuburbName(name);
        filters.suburb = name;
        return;
      }

      // ✅ 3. Handle state
      if (part.endsWith("-state")) {
        const name = part.replace("-state", "").replace(/-/g, " ");
        setSelectedStateName(name);
        setSelectedState(name);
        filters.state = name;
        return;
      }

      // ✅ 4. Handle region
      if (part.endsWith("-region")) {
        const name = part.replace("-region", "").replace(/-/g, " ");
        setSelectedRegionName(name);
        filters.region = name;
        return;
      }

      // ✅ 5. Handle category
      if (part.endsWith("-category")) {
        const slug = part.replace("-category", "");
        const match = categories.find((c) => c.slug === slug);
        if (match) {
          setSelectedCategory(slug);
          setSelectedCategoryName(match.name);
          filters.category = slug;
        }
        return;
      }

      // ✅ 6. Handle condition
      if (part.endsWith("-condition")) {
        const condition = part.replace("-condition", "");
        setSelectedConditionName(condition);
        filters.condition = condition;
        return;
      }

      // ✅ 7. Handle sleeps
      if (part.includes("-people-sleeping-capacity")) {
        const sleepMatch = part.match(/over-(\d+)-people/);
        const sleep = sleepMatch?.[1];
        if (sleep) {
          setSelectedSleepName(sleep);
          filters.sleeps = `${sleep}-people`;
        }
        return;
      }

      // ✅ 8. Handle ATM
      if (/^over-(\d+)-kg-atm$/.test(part)) {
        const val = parseInt(part.match(/^over-(\d+)-kg-atm$/)?.[1] || "0");
        setAtmFrom(val);
        setAtmTo(null);
        filters.minKg = val;
        return;
      }
      if (/^under-(\d+)-kg-atm$/.test(part)) {
        const val = parseInt(part.match(/^under-(\d+)-kg-atm$/)?.[1] || "0");
        setAtmTo(val);
        setAtmFrom(null);
        filters.maxKg = val;
        return;
      }
      if (/^between-(\d+)-kg-(\d+)-kg-atm$/.test(part)) {
        const [, from, to] =
          part.match(/^between-(\d+)-kg-(\d+)-kg-atm$/) || [];
        setAtmFrom(parseInt(from));
        setAtmTo(parseInt(to));
        filters.minKg = parseInt(from);
        filters.maxKg = parseInt(to);
        return;
      }

      // ✅ 9. Handle Length
      if (/^over-(\d+)-length-in-feet$/.test(part)) {
        const val = parseInt(
          part.match(/^over-(\d+)-length-in-feet$/)?.[1] || "0"
        );
        setLengthFrom(val);
        setLengthTo(null);
        filters.from_length = val;
        return;
      }
      if (/^under-(\d+)-length-in-feet$/.test(part)) {
        const val = parseInt(
          part.match(/^under-(\d+)-length-in-feet$/)?.[1] || "0"
        );
        setLengthFrom(null);
        setLengthTo(val);
        filters.to_length = val;
        return;
      }
      if (/^between-(\d+)-(\d+)-length-in-feet$/.test(part)) {
        const [, from, to] =
          part.match(/^between-(\d+)-(\d+)-length-in-feet$/) || [];
        setLengthFrom(parseInt(from));
        setLengthTo(parseInt(to));
        filters.from_length = parseInt(from);
        filters.to_length = parseInt(to);
        return;
      }

      // ✅ 10. Handle Price
      if (/^over-(\d+)$/.test(part)) {
        const val = parseInt(part.replace("over-", ""));
        setMinPrice(val);
        setMaxPrice(null);
        filters.from_price = val;
        return;
      }
      if (/^under-(\d+)$/.test(part)) {
        const val = parseInt(part.replace("under-", ""));
        setMinPrice(null);
        setMaxPrice(val);
        filters.to_price = val;
        return;
      }
      if (/^between-(\d+)-(\d+)$/.test(part)) {
        const [, from, to] = part.match(/^between-(\d+)-(\d+)$/) || [];
        setMinPrice(parseInt(from));
        setMaxPrice(parseInt(to));
        filters.from_price = parseInt(from);
        filters.to_price = parseInt(to);
        return;
      }

      // ✅ 11. Handle Make & Model (only if valid slugs)
      // ✅ 11. Handle Make only if it's NOT a known filter
      if (!isSlugKnownFilter(part) && isValidMakeSlug(part, makes)) {
        const makeMatch = makes.find((m) => m.slug === part);
        if (makeMatch) {
          setSelectedMake(makeMatch.slug);
          setSelectedMakeName(makeMatch.name);
          filters.make = makeMatch.slug;
        }
        return;
      }
      if (!isSlugKnownFilter(part) && isValidModelSlug(part, model)) {
        const modelMatch = model.find((m) => m.slug === part);
        if (modelMatch) {
          setSelectedModel(modelMatch.slug);
          setSelectedModelName(modelMatch.name);
          filters.model = modelMatch.slug;
        }
        return;
      }

      // 🚫 Skip any unrecognized part
      console.warn("❓ Unknown slug part skipped:", part);
    });

    setSelectedModel(matchedModelSlug);
    setSelectedModelName(matchedModelName);
    setSelectedConditionName(matchedCondition);
    setSelectedSleepName(matchedSleep);
    if (isValidMakeSlug(matchedMakeSlug, makes)) {
      setSelectedMake(matchedMakeSlug);
      setSelectedMakeName(matchedMakeName);
    } else {
      setSelectedMake(null);
      setSelectedMakeName(null);
    }

    if (isValidModelSlug(matchedModelSlug, model)) {
      setSelectedModel(matchedModelSlug);
      setSelectedModelName(matchedModelName);
    } else {
      setSelectedModel(null);
      setSelectedModelName(null);
    }
  }, [pathname, states, makes, model]);

  console.log("Active filters at API call:", filters);

  // useEffect(() => {
  //   if (atmFrom !== null || atmTo !== null) {
  //     updateAtmFiltersAndURL(); // Update filters and URL when values change
  //   }
  // }, [atmFrom, atmTo]);

  useEffect(() => {
    if (!filtersInitialized.current || !pendingURLRef.current) return;

    const url = pendingURLRef.current;
    pendingURLRef.current = null;

    if (url && url !== pathname) {
      router.push(url);
    }
  }, [filters]);

  const [isPending, startTransition] = useTransition();
  console.log(isPending);
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
    const stateSlug = pathname
      .split("/")
      .find((part) => part.endsWith("-state"));
    if (stateSlug) {
      const stateName = stateSlug.replace("-state", "").replace(/-/g, " ");
      setSelectedStateName(stateName);
      setSelectedState(stateName);
    } else {
      setSelectedState(null);
      setSelectedStateName(null);
      setFilteredRegions([]);
      setFilteredSuburbs([]);
    }
  }, [pathname]); // Ensure this is triggered whenever the URL pathname changes

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
      pincode: undefined,
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
      pincode: undefined,
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
      pincode: undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // ⬇️ Place this inside your component top-level
  useEffect(() => {}, [filteredSuburbs]);
  useEffect(() => {
    if (
      !filters.suburb ||
      !filters.region ||
      !filters.state ||
      !filters.pincode
    ) {
      console.warn("🚨 Missing one or more location fields", filters);
    } else {
      console.log("✅ All location fields present:", filters);
    }
  }, [filters]);

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
    let postcode = parts[3] || "";

    const suburb = suburbSlug.replace("-suburb", "");
    const region = regionSlug.replace("-region", "");
    const state = stateSlug.replace("-state", "");

    if (!postcode || !/^\d{4}$/.test(postcode)) {
      const addressMatch = locationData.address.match(/\b\d{4}\b/);
      if (addressMatch) {
        postcode = addressMatch[0];
      }
    }

    // ✅ Set values first
    setSelectedState(state);
    setSelectedStateName(state);
    setSelectedRegion(region);
    setSelectedRegionName(region); // ← needs to be ready BEFORE calling API
    setSelectedSuburbName(suburb);
    setSelectedPostcode(postcode);
    setLocationInput(locationData.short_address);

    // ✅ Delay setting filters until all values are updated
    setTimeout(() => {
      const updatedFilters = {
        ...filters,
        make: selectedMake || currentFilters.make,
        model: selectedModel || currentFilters.model,
        region: selectedRegionName || currentFilters.region,
        suburb,
        state,
        pincode: postcode,
      };

      console.log("🚀 Final updatedFilters for location:", updatedFilters);

      setFilters(updatedFilters);
      filtersInitialized.current = true;
      suburbClickedRef.current = true;
    }, 100); // Small delay to allow `setSelectedRegionName()` to finish
  };

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
      pincode: undefined,
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

  // useEffect(() => {
  //   // Auto-load suburbs when state and region are already selected
  //   if (selectedState && selectedRegionName && states.length > 0) {
  //     const matchedState = states.find((s) => s.value === selectedState);

  //     const matchedRegion = matchedState?.regions?.find(
  //       (r) =>
  //         r.name.trim().toLowerCase() ===
  //         selectedRegionName.trim().toLowerCase()
  //     );

  //     if (matchedRegion && Array.isArray(matchedRegion.suburbs)) {
  //       console.log("✅ Auto-loading suburbs for region:", matchedRegion.name);
  //       console.log("✅ Suburbs:", matchedRegion.suburbs);
  //       setFilteredSuburbs(matchedRegion.suburbs);

  //       // ✅ Also auto-set postcode from first suburb if not set
  //       if (!selectedPostcode && matchedRegion.suburbs.length > 0) {
  //         const firstSuburb = matchedRegion.suburbs[0];
  //         const postcodeMatch = firstSuburb.value?.match(/\b\d{4}\b/);
  //         if (postcodeMatch) {
  //           setSelectedPostcode(postcodeMatch[0]);
  //           console.log("📮 Auto-set postcode:", postcodeMatch[0]);
  //         }
  //       }
  //     } else {
  //       console.warn(
  //         "❌ Region not found or has no suburbs:",
  //         selectedRegionName
  //       );
  //     }
  //   }
  // }, [ states]);

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

  const suburbFilterReadyRef = useRef(false);
  suburbFilterReadyRef.current = true;

  useEffect(() => {
    if (
      !suburbFilterReadyRef.current ||
      !selectedSuburbName ||
      !selectedPostcode ||
      !selectedStateName ||
      !selectedRegionName || // ✅ Add this to ensure region is ready
      !locationInput
    )
      return;

    suburbFilterReadyRef.current = true;

    const updatedFilters = {
      ...filters,
      make: selectedMake || currentFilters.make,
      model: selectedModel || currentFilters.model,
      category: selectedCategory || currentFilters.category,
      suburb: selectedSuburbName.toLowerCase(),
      pincode: selectedPostcode || currentFilters.pincode,
      state: selectedStateName,
      region: selectedRegionName || currentFilters.region, // ✅ Must exist
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    filtersInitialized.current = true;
    suburbClickedRef.current = false;
  }, [
    selectedSuburbName,
    selectedPostcode,
    selectedStateName,
    selectedRegionName, // ✅ include dependency
    locationInput,
  ]);
  useEffect(() => {
    if (selectedMake && makes.length > 0 && !selectedMakeName) {
      const match = makes.find((m) => m.slug === selectedMake);
      if (match) {
        setSelectedMakeName(match.name);
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
    if (
      !makeInitializedRef.current &&
      selectedMake &&
      filtersInitialized.current &&
      (!filters.make || filters.make !== selectedMake)
    ) {
      const updatedFilters = {
        ...filters,
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
            ...filters,
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
  const syncSlugToName = (
    slug: string | undefined,
    list: { name: string; slug: string }[],
    setName: (name: string) => void
  ) => {
    if (!slug || !list.length) return;
    const match = list.find((item) => item.slug === slug);
    if (match) setName(match.name);
  };
  useEffect(() => {
    syncSlugToName(filters.make, makes, setSelectedMakeName);
    syncSlugToName(filters.model, model, setSelectedModelName);
    syncSlugToName(filters.category, categories, setSelectedCategoryName);
  }, [filters.make, filters.model, filters.category, makes, model, categories]);

  // router issue
  const lastPushedURLRef = useRef<string>("");

  useEffect(() => {
    if (!filtersInitialized.current) return;
    const slugParts = [];
    if (filters.make) slugParts.push(filters.make);
    if (filters.model) slugParts.push(filters.model);
    if (filters.condition) slugParts.push(`${filters.condition}-condition`);

    if (filters.category) slugParts.push(`${filters.category}-category`);
    // ✅ LOCATION LOGIC
    if (filters.suburb) {
      if (filters.suburb) {
        slugParts.push(`${slugify(filters.suburb)}-suburb`);
      }
      if (filters.state) {
        slugParts.push(`${slugify(filters.state)}-state`);
      }
      if (filters.pincode) {
        slugParts.push(filters.pincode); // ✅ Always include pincode if present
      }
    } else {
      if (filters.state) slugParts.push(`${slugify(filters.state)}-state`);
      if (filters.region) slugParts.push(`${slugify(filters.region)}-region`);
    }

    if (filters.minKg && filters.maxKg) {
      slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
    } else if (filters.minKg) {
      slugParts.push(`over-${filters.minKg}-kg-atm`);
    } else if (filters.maxKg) {
      slugParts.push(`under-${filters.maxKg}-kg-atm`);
    }

    if (filters.from_price && filters.to_price) {
      slugParts.push(`between-${filters.from_price}-${filters.to_price}`);
    } else if (filters.from_price) {
      slugParts.push(`over-${filters.from_price}`);
    } else if (filters.to_price) {
      slugParts.push(`under-${filters.to_price}`);
    }
    if (filters.from_length && filters.to_length) {
      slugParts.push(
        `between-${filters.from_length}-${filters.to_length}-length-in-feet`
      );
    } else if (filters.from_length) {
      slugParts.push(`over-${filters.from_length}-length-in-feet`);
    } else if (filters.to_length) {
      slugParts.push(`under-${filters.to_length}-length-in-feet`);
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

  const isValidMakeSlug = (slug: string | null | undefined): slug is string =>
    !!slug && isNaN(Number(slug)) && makes.some((m) => m.slug === slug);

  const isValidModelSlug = (slug: string | null | undefined): slug is string =>
    !!slug && isNaN(Number(slug)) && model.some((m) => m.slug === slug);

  // ✅ Auto-set region from suburb fix
  useEffect(() => {
    if (
      selectedSuburbName &&
      selectedState &&
      !regionSetAfterSuburbRef.current &&
      states.length > 0
    ) {
      const matchedState = states.find(
        (s) =>
          s.name.toLowerCase() === selectedState.toLowerCase() ||
          s.value.toLowerCase() === selectedState.toLowerCase()
      );

      const matchedRegion = matchedState?.regions?.find((region) =>
        region.suburbs?.some(
          (sub) =>
            sub.name.toLowerCase().trim() ===
            selectedSuburbName.toLowerCase().trim()
        )
      );

      if (matchedRegion) {
        console.log("✅ Auto-detected region:", matchedRegion.name);
        setSelectedRegionName(matchedRegion.name);
        setSelectedRegion(matchedRegion.value); // ✅ added line
        regionSetAfterSuburbRef.current = true;
      }
    }
  }, [selectedSuburbName, selectedState, states]);

  // ✅ Update all filters and URL with validation
  const updateAllFiltersAndURL = () => {
    const safeMake = isValidMakeSlug(selectedMake) ? selectedMake : undefined;
    const safeModel = isValidModelSlug(selectedModel)
      ? selectedModel
      : undefined;

    const updated: Filters = {
      ...filters,
      category: selectedCategory || undefined,
      make: safeMake,
      model: safeModel,
      condition: selectedConditionName || undefined,
      sleeps: selectedSleepName ? `${selectedSleepName}-people` : undefined,
      state: selectedStateName || undefined,
      region: selectedRegionName || undefined,
      suburb: selectedSuburbName || undefined,
      pincode: selectedPostcode || filters.pincode || undefined,
      minKg: atmFrom ?? filters.minKg,
      maxKg: atmTo ?? filters.maxKg,
      from_price: minPrice ?? filters.from_price,
      to_price: maxPrice ?? filters.to_price,
      from_year: yearFrom ?? filters.from_year,
      to_year: yearTo ?? filters.to_year,
      from_length: lengthFrom ?? filters.from_length,
      to_length: lengthTo ?? filters.to_length,
      location: selectedStateName || undefined,
    };

    // ✅ Trigger API call
    onFilterChange(updated);

    // ✅ Update filters in state
    setFilters(updated);
  };

  // ✅ Update handleModelSelect with valid check
  const handleModelSelect = (mod: Model) => {
    setSelectedModel(mod.slug);
    setSelectedModelName(mod.name);
    setModelOpen(false);

    const safeMake = isValidMakeSlug(selectedMake) ? selectedMake : undefined;
    const safeModel = isValidModelSlug(mod.slug) ? mod.slug : undefined;

    const updatedFilters: Filters = {
      ...filters,
      make: isValidMakeSlug(selectedMake) ? selectedMake : undefined,
      model: isValidModelSlug(selectedModel) ? selectedModel : undefined,
      category: selectedCategory || currentFilters.category,
      state: selectedStateName || currentFilters.state,
      region: selectedRegionName || currentFilters.region,
      suburb: selectedSuburbName || currentFilters.suburb,
      pincode: selectedPostcode || currentFilters.pincode,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    const slugParts: string[] = [];
    if (safeMake) slugParts.push(safeMake);
    if (safeModel) slugParts.push(safeModel);
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

  useEffect(() => {
    const selectedStateData = states.find(
      (s) =>
        selectedState &&
        s.name.toLowerCase().startsWith(selectedState.toLowerCase())
    );
    console.log("valuee sub", selectedStateData);

    if (selectedStateData && Array.isArray(selectedStateData.regions)) {
      const selectedRegion = selectedStateData.regions.find(
        (region) =>
          selectedRegionName &&
          region.name.toLowerCase() === selectedRegionName.toLowerCase() // Case-insensitive match for region
      );

      // If selectedRegion exists, update the suburbs, otherwise, fallback to empty array
      if (selectedRegion) {
        setFilteredSuburbs(selectedRegion.suburbs || []);
      } else {
        setFilteredSuburbs([]); // No suburbs for this region
      }
    } else {
      setFilteredSuburbs([]); // If selectedStateData doesn't exist or has no regions, fallback to empty array
    }
  }, [selectedState, selectedRegionName, states]);
  // filed set make
  useEffect(() => {
    if (selectedMake && model.length > 0) {
      setModelOpen(true); // ✅ Ensure dropdown opens
    }
  }, [selectedMake, model]);

  // Trigger this when selectedState, selectedRegionName, or states change
  const updatePriceFilter = (
    priceType: "min" | "max", // "min" or "max" to identify the price field
    value: string | null,
    otherPrice: number | null // minPrice or maxPrice (depending on the field being updated)
  ) => {
    const val = value ? parseInt(value) : null;

    // Update the respective price field (minPrice or maxPrice)
    if (priceType === "min") {
      setMinPrice(val);
    } else if (priceType === "max") {
      setMaxPrice(val);
    }

    const updatedFilters: Filters = {
      ...filters,
      from_price: priceType === "min" ? val ?? undefined : undefined,
      to_price:
        priceType === "max" ? val ?? undefined : otherPrice ?? undefined,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    filtersInitialized.current = true;

    startTransition(() => {
      updateAllFiltersAndURL(); // ✅ triggers slug+router.push
    });
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
                //                 onFilterChange(updatedFilters);

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
                      pincode: selectedPostcode || currentFilters.pincode,
                    };

                    setFilters(updatedFilters);
                    //                 onFilterChange(updatedFilters);
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
              .find((s) =>
                s.name.toLowerCase().startsWith(selectedState.toLowerCase())
              ) // ✅ match the start of state
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
                      setSelectedPostcode(postcode);
                      setLocationInput(`${suburb.name} ${selectedStateName}`);
                      setStateOpen(false);
                      updateAllFiltersAndURL(); // ✅ This ensures all values are merged
                      filtersInitialized.current = true;
                      const updatedFilters: Filters = {
                        ...filters, // ✅ live state
                        make:
                          selectedMake || filters.make || currentFilters.make,
                        model: selectedModel || currentFilters.model,
                        state: selectedStateName || currentFilters.state,
                        region: selectedRegionName || currentFilters.region,
                        suburb: selectedSuburbName || currentFilters.suburb,
                        pincode: selectedPostcode || currentFilters.pincode,
                      };

                      setFilters(updatedFilters);
                      //                 onFilterChange(updatedFilters);
                    }}
                  >
                    {suburb.name}
                  </div>
                ))
              )}
            </div>
          )}
        {/* 🔹 INITIAL STATE LIST */}
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

                  const slugify = (text: string) =>
                    text
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]+/g, "");

                  setSelectedState(slugify(state.value));
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
                    pincode: undefined,
                  };

                  setFilters(updatedFilters);
                  onFilterChange(updatedFilters);

                  const slugParts: string[] = [];
                  if (preservedMake) slugParts.push(preservedMake);
                  if (preservedModel) slugParts.push(preservedModel);
                  if (preservedCategory)
                    slugParts.push(`${preservedCategory}-category`);
                  if (state.name)
                    slugParts.push(`${slugify(state.name)}-state`);

                  const query = searchParams.toString();
                  const finalSlug = `/listings/${slugParts.join("/")}`;
                  const finalURL = query ? `${finalSlug}?${query}` : finalSlug;

                  router.push(finalURL); // ✅ always starts with /listings/
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
                  pincode: undefined,
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
                  ...filters,
                  make: undefined,
                  model: undefined,
                };

                setFilters(updatedFilters);
                onFilterChange(updatedFilters);

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
                      ...filters,
                      make: make.slug,
                      model: undefined,
                      category: selectedCategory || currentFilters.category,
                      state: selectedStateName || currentFilters.state,
                      region: selectedRegionName || currentFilters.region,
                      suburb: selectedSuburbName || currentFilters.suburb,
                      pincode: selectedPostcode || currentFilters.pincode,
                    };

                    setFilters(updatedFilters);
                    onFilterChange(updatedFilters);
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

                const updated = {
                  ...filters,
                  minKg: val ?? undefined,
                  maxKg: atmTo ?? undefined,
                  make: selectedMake || currentFilters.make,
                  model: selectedModel || currentFilters.model,
                };

                setFilters(updated);
                onFilterChange(updated); // ✅ ADD THIS
                filtersInitialized.current = true;

                startTransition(() => {
                  updateAllFiltersAndURL();
                });
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

                const updated = {
                  ...filters,
                  minKg: atmFrom ? `${atmFrom}kg` : undefined,
                  maxKg: atmTo ? `${atmTo}kg` : undefined,
                };

                setFilters(updated);
                filtersInitialized.current = true;

                startTransition(() => {
                  updateAllFiltersAndURL();
                });
              }}

              // onChange={handleAtmToChange}
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
                //                 onFilterChange(updatedFilters);

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
              onChange={(e) =>
                updatePriceFilter("min", e.target.value, maxPrice)
              }
              // onChange={(e) => {
              //   const val = e.target.value ? parseInt(e.target.value) : null;
              //   setMinPrice(val);

              //   const updatedFilters: Filters = {
              //     ...filters,
              //     from_price: val ?? undefined,
              //     to_price: maxPrice ?? undefined,
              //   };

              //   setFilters(updatedFilters);
              //   onFilterChange(updatedFilters);
              //   filtersInitialized.current = true;

              //   startTransition(() => {
              //     updateAllFiltersAndURL(); // ✅ triggers slug+router.push
              //   });
              // }}
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
                updatePriceFilter("max", e.target.value, maxPrice)
              }
              // onChange={(e) => {
              //   const val = e.target.value ? parseInt(e.target.value) : null;
              //   setMaxPrice(val);

              //   const updatedFilters: Filters = {
              //     ...filters,
              //     from_price: minPrice ?? undefined,
              //     to_price: val ?? undefined,
              //   };

              //   setFilters(updatedFilters);
              //   onFilterChange(updatedFilters);
              //   filtersInitialized.current = true;

              //   startTransition(() => {
              //     updateAllFiltersAndURL();
              //   });
              // }}
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
                  //                 onFilterChange(updatedFilters);
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
                //                 onFilterChange(updatedFilters);

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
                //                 onFilterChange(updatedFilters);

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
