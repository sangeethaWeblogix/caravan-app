import { Filters } from "../components/ListContent/Listings";

type PartialUpdate = Partial<Filters>;

/**
 * Safely merges current filters with updated fields, preserving existing values
 * and avoiding overwriting with undefined.
 */
export function buildUpdatedFilters(
  currentFilters: Filters,
  updates: PartialUpdate
): Filters {
  return {
    ...currentFilters,
    category: updates.category ?? currentFilters.category,
    make: updates.make ?? currentFilters.make,
    model: updates.model ?? currentFilters.model,
    state: updates.state ?? currentFilters.state,
    region: updates.region ?? currentFilters.region,
    suburb: updates.suburb ?? currentFilters.suburb,
    pincode: updates.pincode ?? currentFilters.pincode,
    condition: updates.condition ?? currentFilters.condition,
    sleeps: updates.sleeps ?? currentFilters.sleeps,
    from_price: updates.from_price ?? currentFilters.from_price,
    to_price: updates.to_price ?? currentFilters.to_price,
    minKg: updates.minKg ?? currentFilters.minKg,
    maxKg: updates.maxKg ?? currentFilters.maxKg,
    from_year: updates.from_year ?? currentFilters.from_year,
    to_year: updates.to_year ?? currentFilters.to_year,
    from_length: updates.from_length ?? currentFilters.from_length,
    to_length: updates.to_length ?? currentFilters.to_length,
    location: updates.location ?? currentFilters.location,
  };
}
