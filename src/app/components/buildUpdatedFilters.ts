import { Filters } from "../components/ListContent/Listings";

export const buildUpdatedFilters = (
  current: Filters,
  override: Partial<Filters>
): Filters => {
  return {
    ...current,

    // Primary Filters
    category: override.category ?? current.category,
    make: override.make ?? current.make,
    model: override.model ?? current.model,
    condition: override.condition ?? current.condition,
    sleeps: override.sleeps ?? current.sleeps,

    // Price Range
    from_price: override.from_price ?? current.from_price,
    to_price: override.to_price ?? current.to_price,

    // ATM Range
    minKg: override.minKg ?? current.minKg,
    maxKg: override.maxKg ?? current.maxKg,

    // Year Range
    from_year: override.from_year ?? current.from_year,
    to_year: override.to_year ?? current.to_year,

    // Length Range
    from_length: override.from_length ?? current.from_length,
    to_length: override.to_length ?? current.to_length,

    // Location
    state: override.state ?? current.state,
    region: override.region ?? current.region,
    suburb: override.suburb ?? current.suburb,
    pincode: override.pincode ?? current.pincode,
  };
};
