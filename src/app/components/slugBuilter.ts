import { Filters } from "../components/ListContent/Listings";

export const buildSlugFromFilters = (filters: Filters): string => {
  const slugParts: string[] = [];

  if (filters.make) slugParts.push(filters.make);
  if (filters.model && filters.model !== filters.make)
    slugParts.push(filters.model);
  if (filters.condition)
    slugParts.push(`${filters.condition.toLowerCase()}-condition`);
  if (filters.category) slugParts.push(`${filters.category}-category`);

  if (filters.suburb) {
    slugParts.push(`${filters.suburb.replace(/\s+/g, "-")}-suburb`);
    if (filters.state)
      slugParts.push(`${filters.state.replace(/\s+/g, "-")}-state`);
    if (filters.pincode) slugParts.push(filters.pincode);
  } else if (filters.state) {
    slugParts.push(`${filters.state.replace(/\s+/g, "-")}-state`);
    if (filters.region)
      slugParts.push(`${filters.region.replace(/\s+/g, "-")}-region`);
  }

  if (filters.minKg && filters.maxKg)
    slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
  else if (filters.minKg) slugParts.push(`over-${filters.minKg}-kg-atm`);
  else if (filters.maxKg) slugParts.push(`under-${filters.maxKg}-kg-atm`);

  if (filters.from_price && filters.to_price)
    slugParts.push(`between-${filters.from_price}-${filters.to_price}`);
  else if (filters.from_price) slugParts.push(`over-${filters.from_price}`);
  else if (filters.to_price) slugParts.push(`under-${filters.to_price}`);

  if (filters.from_length && filters.to_length)
    slugParts.push(
      `between-${filters.from_length}-${filters.to_length}-length-in-feet`
    );
  else if (filters.from_length)
    slugParts.push(`over-${filters.from_length}-length-in-feet`);
  else if (filters.to_length)
    slugParts.push(`under-${filters.to_length}-length-in-feet`);

  if (filters.sleeps)
    slugParts.push(
      `over-${filters.sleeps.replace("-people", "")}-people-sleeping-capacity`
    );

  const query = new URLSearchParams();

  if (filters.from_year)
    query.set("acustom_fromyears", filters.from_year.toString());
  if (filters.to_year) query.set("acustom_toyears", filters.to_year.toString());

  return `/listings/${slugParts.join("/")}${
    query.toString() ? `?${query.toString()}` : ""
  }`;
};
