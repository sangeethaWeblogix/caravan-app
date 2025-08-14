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
   const [selectedPostcode, setSelectedPostcode] = useState<string | null>(
     null
   );

   const [selectedCategory, setSelectedCategory] = useState<string | null>(
     null
   );
   const [selectedCategoryName, setSelectedCategoryName] = useState<
     string | null
   >(null);
   const [selectedMakeName, setSelectedMakeName] = useState<string | null>(
     null
   );
   const [selectedModelName, setSelectedModelName] = useState<string | null>(
     null
   );
   const suburbClickedRef = useRef(false);
   const preventResetRef = useRef(false);
   const [selectedConditionName, setSelectedConditionName] = useState<
     string | null
   >(null);
   const [stateRegionOpen, setStateRegionOpen] = useState(true);
   const [stateLocationOpen, setStateLocationOpen] = useState(false);
   const [stateSuburbOpen, setStateSuburbOpen] = useState(true);

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
         currentFilters.minKg !== undefined
           ? Number(currentFilters.minKg)
           : null
       );
       setAtmTo(
         currentFilters.maxKg !== undefined
           ? Number(currentFilters.maxKg)
           : null
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

   // useEffect(() => {
   //   if (!selectedMakeName && filters.make && makes.length > 0) {
   //     const matched = makes.find((m) => m.slug === filters.make);
   //     if (matched) {
   //       setSelectedMake(matched.slug);
   //       setSelectedMakeName(matched.name);
   //     }
   //   }
   // }, [filters.make, makes, selectedMakeName]);

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
   const resetMakeFilters = () => {
     setSelectedMake(null);
     setSelectedMakeName(null);
     setSelectedModel(null);
     setSelectedModelName(null);
     setModel([]);
     setModelOpen(false);

     const updatedFilters: Filters = {
       ...currentFilters,
       make: undefined,
       model: undefined,
     };

     filtersInitialized.current = true;
     setFilters(updatedFilters);
     console.log("✅ Cleaned filters after timeout", updatedFilters);

     startTransition(() => {
       updateAllFiltersAndURL(updatedFilters);
     });
     // Allow React to flush UI state
   };

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
     setStateRegionOpen(false);

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
     if (!suburbClickedRef.current || !selectedSuggestion) return;

     const parts = selectedSuggestion.uri.split("/");
     const suburbSlug = parts[0] || "";
     const regionSlug = parts[1] || "";
     const stateSlug = parts[2] || "";

     const suburb = suburbSlug.replace("-suburb", "").replace(/-/g, " ").trim();
     const region = regionSlug.replace("-region", "").replace(/-/g, " ").trim();
     const state = stateSlug.replace("-state", "").replace(/-/g, " ").trim();

     let postcode = parts[3] || "";
     if (!/^\d{4}$/.test(postcode)) {
       const m = selectedSuggestion.address.match(/\b\d{4}\b/);
       if (m) postcode = m[0];
     }

     // ✅ set UI using parsed data
     setSelectedState(stateSlug);
     setSelectedStateName(state);
     setSelectedRegionName(region);
     setSelectedSuburbName(suburb);
     setSelectedPostcode(postcode || null);

     // ✅ filters
     const updatedFilters = buildUpdatedFilters(currentFilters, {
       make: selectedMake || filters.make || currentFilters.make,
       model: selectedModel || filters.model || currentFilters.model,
       category:
         selectedCategory || filters.category || currentFilters.category,
       suburb: suburb.toLowerCase(),
       pincode: postcode || undefined,
       state,
       region,
     });

     setFilters(updatedFilters);
     // (push when you want)
     // startTransition(() => updateAllFiltersAndURL(updatedFilters));
   };

   useEffect(() => {
     if (!selectedSuggestion && filters.suburb && filters.pincode) {
       setLocationInput(`${filters.suburb} ${filters.pincode}`);
     }
   }, [selectedSuggestion, filters.suburb, filters.pincode]);

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

     // Clear UI states
     setSelectedCategory(null);
     setSelectedCategoryName(null);
     setSelectedMake(null);
     setSelectedMakeName(null);
     setSelectedModel(null);
     setSelectedModelName(null);
     setSelectedConditionName(null);
     setSelectedSleepName(null);
     setModel([]);
     setFilteredRegions([]);
     setFilteredSuburbs([]);
     setLocationInput("");
     setSelectedState(null);
     setSelectedStateName(null);
     setSelectedRegionName(null);
     setSelectedSuburbName(null);
     setSelectedPostcode(null);
     setMinPrice(null);
     setMaxPrice(null);
     setAtmFrom(null);
     setAtmTo(null);
     setYearFrom(null);
     setYearTo(null);
     setLengthFrom(null);
     setLengthTo(null);

     filtersInitialized.current = true;
     makeInitializedRef.current = false;
     regionSetAfterSuburbRef.current = false;
     suburbClickedRef.current = false;

     // ✅ Fix: Call parent state update
     onFilterChange(reset);

     setFilters(reset);

     startTransition(() => {
       updateAllFiltersAndURL(reset);
     });
   };

   // locataion useeffe
   // useEffect(() => {
   //   if (currentFilters.suburb && !selectedSuburbName) {
   //     setSelectedSuburbName(currentFilters.suburb);
   //   }
   //   if (currentFilters.pincode && !selectedPostcode) {
   //     setSelectedPostcode(currentFilters.pincode);
   //   }
   //   if (currentFilters.state && !selectedStateName) {
   //     setSelectedStateName(currentFilters.state);
   //   }
   //   if (currentFilters.region && !selectedRegionName) {
   //     setSelectedRegionName(currentFilters.region);
   //   }
   // }, [
   //   currentFilters.suburb,
   //   currentFilters.pincode,
   //   currentFilters.state,
   //   currentFilters.region,
   //   selectedSuburbName,
   //   selectedPostcode,
   //   selectedStateName,
   //   selectedRegionName,
   // ]);

   // useEffect(() => {
   //   if (
   //     selectedSuburbName &&
   //     selectedStateName &&
   //     selectedPostcode &&
   //     selectedRegionName
   //   ) {
   //     setLocationInput(`${selectedSuburbName} ${selectedPostcode}`);
   //   }
   // }, [
   //   selectedSuburbName,
   //   selectedStateName,
   //   selectedPostcode,
   //   selectedRegionName,
   // ]);

   console.log(
     "🔁 suburb Render triggered — filteredSuburbs:",
     filteredSuburbs
   );
   // correct-3
   // useEffect(() => {
   //   const slug = pathname.split("/listings/")[1];
   //   const segments = slug?.split("/") || [];

   //   const suburbSegment = segments.find((s) => s.endsWith("-suburb"));
   //   const regionSegment = segments.find((s) => s.endsWith("-region"));
   //   const stateSegment = segments.find((s) => s.endsWith("-state"));

   //   if (regionSegment) {
   //     const region = regionSegment.replace("-region", "").replace(/-/g, " ");
   //     setSelectedRegionName(region);
   //     setSelectedRegion(region);
   //   }

   //   if (suburbSegment) {
   //     const suburb = suburbSegment.replace("-suburb", "").replace(/-/g, " ");
   //     setSelectedSuburbName(suburb);
   //     setLocationInput(suburb);
   //   }

   //   if (stateSegment) {
   //     const state = stateSegment.replace("-state", "").replace(/-/g, " ");
   //     setSelectedStateName(state);
   //     setSelectedState(state);
   //   }
   // }, [pathname]);

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
     if (currentFilters.state) setSelectedStateName(currentFilters.state);
     if (currentFilters.region) setSelectedRegionName(currentFilters.region); // only set if present
     if (currentFilters.suburb) setSelectedSuburbName(currentFilters.suburb);
     if (currentFilters.pincode) setSelectedPostcode(currentFilters.pincode);
   }, [
     currentFilters.state,
     currentFilters.region,
     currentFilters.suburb,
     currentFilters.pincode,
   ]);

   // useEffect(() => {
   //   if (!suburbClickedRef.current) return;

   //   console.log(
   //     "🏘️ Suburb Render triggered – filteredSuburbs:",
   //     filteredSuburbs
   //   );
   // }, [filteredSuburbs]);

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

   // useEffect(() => {
   //   if (selectedMake && makes.length > 0 && !selectedMakeName) {
   //     const match = makes.find((m) => m.slug === selectedMake);
   //     if (match) {
   //       setSelectedMakeName(match.name);

   //       // ✅ Trigger full filter+URL sync here
   //       startTransition(() => {
   //         updateAllFiltersAndURL(); // Push slug with current filters
   //       });
   //     }
   //   }
   // }, [selectedMake, makes, selectedMakeName]);

   const regionSetAfterSuburbRef = useRef(false);

   useEffect(() => {
     const q = locationInput.trim();
     if (q.length < 2) {
       setLocationSuggestions([]);
       return;
     }
     const t = setTimeout(() => {
       // If you want only the suburb token, do it here
       const suburb = q.split(" ")[0];
       fetchLocations(suburb)
         .then((data) => setLocationSuggestions(data))
         .catch(console.error);
     }, 300);
     return () => clearTimeout(t);
   }, [locationInput]); // <-- do NOT include suggestions or filters here

   useEffect(() => {
     if (
       currentFilters.category &&
       !selectedCategory &&
       categories.length > 0 &&
       !filtersInitialized.current
     ) {
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

   // useEffect(() => {
   //   if (
   //     currentFilters.state &&
   //     !selectedStateName &&
   //     filtersInitialized.current
   //   ) {
   //     setSelectedStateName(currentFilters.state);
   //   }
   // }, [currentFilters.state, selectedStateName, filtersInitialized.current]);

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
     // Block hydration if we already initialized or make was reset
     if (
       makeInitializedRef.current || // already hydrated
       selectedMake || // already selected in UI
       !pathname.includes("/listings/") || // not in listings page
       !makes.length || // no make list
       !currentFilters.make // ❌ make no longer in filters after reset
     ) {
       return;
     }

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

         // Optional: sync filters
         const updatedFilters: Filters = {
           ...currentFilters,
           make: matched.slug,
         };

         setFilters(updatedFilters);
         onFilterChange(updatedFilters);
       }
     }
   }, [pathname, selectedMake, makes, currentFilters.make]);

   const hasCategoryBeenSetRef = useRef(false);
   // --- helpers ---
   const shallowEqual = (a: any, b: any) => {
     if (a === b) return true;
     if (!a || !b) return false;
     const ak = Object.keys(a),
       bk = Object.keys(b);
     if (ak.length !== bk.length) return false;
     for (const k of ak) if (a[k] !== b[k]) return false;
     return true;
   };

   const setIfChanged = <T,>(
     setter: React.Dispatch<React.SetStateAction<T>>,
     next: T
   ) => setter((prev) => (shallowEqual(prev, next) ? prev : next));

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
       });
     }
   }, [filters]);
   const lastSentFiltersRef = useRef<Filters | null>(null);
   // ✅ Update all filters and URL with validation
   const updateAllFiltersAndURL = (overrideFilters?: Filters) => {
     const final = overrideFilters ?? filters;

     // 1) Set local filters only if changed
     setFilters((prev) => (shallowEqual(prev, final) ? prev : final));
     filtersInitialized.current = true;

     // 2) Notify parent only if changed (prevents loops)
     if (!shallowEqual(lastSentFiltersRef.current || {}, final)) {
       lastSentFiltersRef.current = final;
       onFilterChange(final);
     }

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
     // Run only once after a suburb is chosen (per mount)
     if (
       regionSetAfterSuburbRef.current || // already set once
       !selectedSuburbName || // need a suburb
       !selectedStateName || // need a state
       states.length === 0
     ) {
       return;
     }

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

     if (!matchedRegion) return;

     // ✅ Set UI state for region
     setSelectedRegionName(matchedRegion.name);
     setSelectedRegion(matchedRegion.value);

     // ✅ Update filters but DO NOT trigger URL push
     //    (don't flip filtersInitialized.current to true)
     setFilters((prev) => ({
       ...prev,
       state: selectedStateName || matchedState?.name,
       region: matchedRegion.name, // keep region in local filters (UI needs it)
       suburb: selectedSuburbName,
       pincode: selectedPostcode ?? "",
     }));

     // ✅ Close all panels so nothing re-opens on remount
     setStateLocationOpen(false);
     setStateRegionOpen(false);
     setStateSuburbOpen(false);

     // mark done
     regionSetAfterSuburbRef.current = true;
   }, [selectedSuburbName, selectedStateName, states, selectedPostcode]);

   console.log("yy states", states);
   console.log("yy selectedState", selectedStateName);
   console.log("yy selectedRegion", selectedRegion);
   console.log("subbb", filteredSuburbs);
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   const resetCategoryFilter = () => {
     setSelectedCategory(null);
     setSelectedCategoryName(null);

     const updatedFilters: Filters = {
       ...currentFilters,
       category: undefined,
     };

     setFilters(updatedFilters);
     filtersInitialized.current = true;

     startTransition(() => {
       updateAllFiltersAndURL(updatedFilters); // Trigger API + URL sync
     });
   };

   const openOnly = (which: "state" | "region" | "suburb" | null) => {
     setStateLocationOpen(which === "state");
     setStateRegionOpen(which === "region");
     setStateSuburbOpen(which === "suburb");
   };
   useEffect(() => {
     if (selectedRegionName && !selectedSuburbName) {
       setStateRegionOpen(false);
       setStateSuburbOpen(true);
     }
   }, [selectedRegionName, selectedSuburbName]);
   // when a state is chosen and no suburb yet → keep Region panel visible
   useEffect(() => {
     if (selectedStateName && !selectedSuburbName) {
       setStateLocationOpen(false);
     }
   }, [selectedStateName, selectedSuburbName]);

   // once a suburb is chosen → keep all panels closed
   // useEffect(() => {
   //   if (selectedSuburbName) {
   //     setStateRegionOpen(false);
   //     setStateSuburbOpen(false);
   //   }
   // }, [selectedSuburbName]);
   // put this near the top (below types)
   const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");

   const findSuggestionFor = (
     suburb: string,
     region: string | null,
     state: string | null,
     postcode: string | null,
     suggestions: LocationSuggestion[]
   ): LocationSuggestion | null => {
     const ss = slug(suburb);
     const rr = slug(region || "");
     const st = slug(state || "");

     // match by URI parts first
     const byUri = suggestions.find((it) => {
       const [sub, reg, sta, pc] = it.uri.split("/");
       const matchSub = sub?.startsWith(`${ss}-suburb`);
       const matchReg = reg?.startsWith(`${rr}-region`);
       const matchSta = sta?.startsWith(`${st}-state`);
       const matchPc = postcode ? (pc || "").includes(postcode) : true;
       return matchSub && matchReg && matchSta && matchPc;
     });
     if (byUri) return byUri;

     // fallback by address text
     const byText = suggestions.find((it) => {
       const A = it.address.toLowerCase();
       return (
         A.includes(suburb.toLowerCase()) &&
         (!region || A.includes(region.toLowerCase())) &&
         (!state || A.includes(state.toLowerCase())) &&
         (!postcode || A.includes(postcode))
       );
     });
     return byText || null;
   };
   useEffect(() => {
     if (!selectedSuburbName || !selectedStateName || !selectedRegionName)
       return;

     const postcode = selectedPostcode || null;

     fetchLocations(selectedSuburbName)
       .then((data) => {
         const match = findSuggestionFor(
           selectedSuburbName,
           selectedRegionName,
           selectedStateName,
           postcode,
           data || []
         );
         if (match) {
           setSelectedSuggestion(match); // keep the full row
           setLocationInput(match.short_address); // show “Suburb 2650”
         }
       })
       .catch(console.error);
   }, [
     selectedSuburbName,
     selectedRegionName,
     selectedStateName,
     selectedPostcode,
   ]);

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
             <span className="filter-chip-close" onClick={resetCategoryFilter}>
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
       {/* ===== LOCATION (DROP-IN) ===== */}
       {/* ===== LOCATION ===== */}
       <div className="cs-full_width_section">
         {/* Header: opens STATE list */}
         <div className="filter-accordion" onClick={() => openOnly("state")}>
           <h5 className="cfs-filter-label">Location</h5>
           <BiChevronDown
             onClick={(e) => {
               e.stopPropagation();
               openOnly(stateLocationOpen ? null : "state");
             }}
             style={{
               cursor: "pointer",
               transform: stateLocationOpen ? "rotate(180deg)" : "",
             }}
           />
         </div>

         {/* STATE CHIP */}
         {selectedStateName && (
           <div
             className="filter-accordion-item"
             style={accordionStyle(!selectedRegionName && !selectedSuburbName)}
           >
             <span style={{ flexGrow: 1 }} onClick={() => openOnly("state")}>
               {selectedStateName}
             </span>

             {!selectedRegionName && (
               <div style={iconRowStyle}>
                 <span onClick={resetStateFilters} style={closeIconStyle}>
                   ×
                 </span>
                 {/* This arrow toggles the REGION panel */}
                 <BiChevronDown
                   onClick={(e) => {
                     e.stopPropagation();
                     const next = !stateRegionOpen;
                     setStateRegionOpen(next);
                     if (!next) setStateSuburbOpen(false);
                   }}
                   style={arrowStyle(stateRegionOpen)}
                 />
               </div>
             )}
           </div>
         )}

         {/* REGION CHIP */}
         {selectedRegionName && (
           <div
             className="filter-accordion-item"
             style={accordionStyle(!selectedSuburbName)}
           >
             <span style={{ flexGrow: 1 }} onClick={() => openOnly("region")}>
               {selectedRegionName}
             </span>

             {!selectedSuburbName && (
               <div style={iconRowStyle}>
                 <span onClick={resetRegionFilters} style={closeIconStyle}>
                   ×
                 </span>
                 {/* This arrow toggles the SUBURB panel */}
                 <BiChevronDown
                   onClick={(e) => {
                     e.stopPropagation();
                     setStateSuburbOpen(!stateSuburbOpen);
                   }}
                   style={arrowStyle(stateSuburbOpen)}
                 />
               </div>
             )}
           </div>
         )}

         {/* SUBURB CHIP */}
         {selectedSuburbName && (
           <div className="filter-accordion-item" style={accordionStyle(true)}>
             <span style={{ flexGrow: 1 }}>{selectedSuburbName}</span>
             <span onClick={resetSuburbFilters} style={closeIconStyle}>
               ×
             </span>
           </div>
         )}

         {/* STATE LIST */}
         {!selectedState && stateLocationOpen && (
           <div className="filter-accordion-items">
             {states.map((state) => (
               <div
                 key={state.value}
                 className={`filter-accordion-item ${
                   selectedState === state.value ? "selected" : ""
                 }`}
                 onClick={() => {
                   setSelectedState(state.value);
                   setSelectedStateName(state.name);
                   setSelectedRegionName(null);
                   setSelectedSuburbName(null);

                   setFilteredRegions(state.regions || []);
                   setFilteredSuburbs([]);

                   // Open Region immediately
                   setStateLocationOpen(false);
                   setStateRegionOpen(true);
                   setStateSuburbOpen(false);

                   const updatedFilters: Filters = {
                     ...currentFilters,
                     state: state.name,
                     region: undefined,
                     suburb: undefined,
                     pincode: undefined,
                   };
                   setFilters(updatedFilters);
                   filtersInitialized.current = true;

                   startTransition(() => {
                     updateAllFiltersAndURL(updatedFilters);
                     // keep Region open after router.push
                     setTimeout(() => {
                       setStateRegionOpen(true);
                       setStateSuburbOpen(false);
                     }, 0);
                   });
                 }}
               >
                 {state.name}
               </div>
             ))}
           </div>
         )}

         {/* REGION LIST (only if a state is chosen and suburb not yet chosen) */}
         {stateRegionOpen && !!selectedStateName && !selectedSuburbName && (
           <div className="filter-accordion-items">
             {(
               states.find(
                 (s) =>
                   s.name.toLowerCase().trim() ===
                   selectedStateName?.toLowerCase().trim()
               )?.regions || []
             ).map((region, idx) => (
               <div
                 key={idx}
                 className="filter-accordion-item"
                 style={{ marginLeft: 16, cursor: "pointer" }}
                 onClick={() => {
                   setSelectedRegionName(region.name);
                   setSelectedRegion(region.value);
                   setFilteredSuburbs(region.suburbs || []);
                   setSelectedSuburbName(null);

                   // Open Suburb immediately
                   setStateRegionOpen(false);
                   setStateSuburbOpen(true);

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
                     updateAllFiltersAndURL(updatedFilters);
                     // keep Suburb open after router.push
                     setTimeout(() => {
                       setStateRegionOpen(false);
                       setStateSuburbOpen(true);
                     }, 0);
                   });
                 }}
               >
                 {region.name}
               </div>
             ))}
           </div>
         )}

         {/* SUBURB LIST */}
         {stateSuburbOpen && selectedStateName && selectedRegionName && (
           <div className="filter-accordion-items">
             {Array.isArray(filteredSuburbs) && filteredSuburbs.length === 0 ? (
               // <p style={{ marginLeft: 20 }}>❌ No suburbs available</p>
               <p style={{ marginLeft: 20 }}></p>
             ) : (
               filteredSuburbs.map((suburb, idx) => (
                 <div
                   key={`${suburb.value}-${idx}`}
                   className="filter-accordion-item"
                   style={suburbStyle(suburb.name === selectedSuburbName)}
                   onClick={async () => {
                     const postcode =
                       suburb.value?.match(/\d{4}$/)?.[0] || null;

                     // fetch API for this suburb
                     let match: LocationSuggestion | null = null;
                     try {
                       const res = await fetchLocations(suburb.name);
                       match = findSuggestionFor(
                         suburb.name,
                         selectedRegionName,
                         selectedStateName,
                         postcode,
                         res || []
                       );
                     } catch {}

                     // fallback if API didn't return an exact row
                     if (!match) {
                       const uSub = slug(suburb.name);
                       const uReg = slug(selectedRegionName || "");
                       const uSta = slug(selectedStateName || "");
                       match = {
                         key: `${uSub}-${uReg}-${uSta}-${postcode || ""}`,
                         uri: `${uSub}-suburb/${uReg}-region/${uSta}-state/${
                           postcode || ""
                         }`,
                         address: [
                           suburb.name,
                           selectedRegionName || "",
                           selectedStateName || "",
                           postcode || "",
                         ]
                           .filter(Boolean)
                           .join(", "),
                         // what we want to DISPLAY in the input
                         short_address: `${suburb.name}${
                           postcode ? ` ${postcode}` : ""
                         }`,
                       };
                     }

                     // drive the UI/input via selectedSuggestion
                     setSelectedSuggestion(match);
                     setLocationInput(match.short_address); // for the chip below

                     suburbClickedRef.current = true;
                     setSelectedSuburbName(suburb.name);
                     setSelectedPostcode(postcode || "");

                     // close panels
                     setStateLocationOpen(false);
                     setStateRegionOpen(false);
                     setStateSuburbOpen(false);

                     // update filters
                     const updatedFilters: Filters = {
                       ...currentFilters,
                       state: selectedStateName || currentFilters.state,
                       region: selectedRegionName || currentFilters.region,
                       suburb: suburb.name,
                       pincode: postcode || undefined,
                     };
                     setFilters(updatedFilters);
                     filtersInitialized.current = true;
                     startTransition(() =>
                       updateAllFiltersAndURL(updatedFilters)
                     );
                   }}
                 >
                   {suburb.name}
                 </div>
               ))
             )}
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
           value={locationInput} // ← use locationInput
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
             <span className="filter-chip-close" onClick={resetMakeFilters}>
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

                     // ✅ Update filters
                     const updatedFilters: Filters = {
                       ...currentFilters,
                       make: make.slug,
                       model: undefined,
                     };

                     setFilters(updatedFilters);
                     // onFilterChange(updatedFilters);
                     filtersInitialized.current = true;

                     // ✅ Update URL
                     startTransition(() => {
                       updateAllFiltersAndURL(updatedFilters); // ✅ this triggers the API + URL update
                     });
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
         <div
           className="filter-accordion"
           onClick={() => toggle(setSleepsOpen)}
         >
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
                   const isAlreadySelected =
                     selectedSleepName === selectedValue;

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
               <span
                 onClick={() => setIsModalOpen(false)}
                 className="cfs-close"
               >
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
                   if (selectedSuggestion)
                     setLocationInput(selectedSuggestion.short_address);
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
