import { Filters } from "./CaravanFilter"; // or wherever Filters is declared

export const generateSlugURL = (
  filters: Filters,
  selectedStateName?: string,
  selectedSuburbName?: string,
  selectedMake?: string,
  selectedModel?: string
): string => {
  const {
    from_price,
    to_price,
    minKg,
    maxKg,
    from_length,
    to_length,
    condition,
    sleeps,
    from_year,
    to_year,
    category,
  } = filters;

  const slugParts: string[] = [];

  if (condition)
    slugParts.push(`${condition.toLowerCase().replace(/\s+/g, "-")}-condition`);
  if (category) slugParts.push(`${category}-category`);
  if (selectedSuburbName) slugParts.push(`${selectedSuburbName}-suburb`);
  if (selectedStateName)
    slugParts.push(`${selectedStateName.toLowerCase()}-state`);

  if (from_price && to_price)
    slugParts.push(`between-${from_price}-${to_price}`);
  else if (from_price) slugParts.push(`over-${from_price}`);
  else if (to_price) slugParts.push(`under-${to_price}`);

  if (minKg && maxKg) slugParts.push(`between-${minKg}-kg-${maxKg}-kg-atm`);
  else if (minKg) slugParts.push(`over-${minKg}-kg-atm`);
  else if (maxKg) slugParts.push(`under-${maxKg}-kg-atm`);

  if (sleeps) {
    const people = sleeps.replace("-people", "");
    slugParts.push(`over-${people}-people-sleeping-capacity`);
  }

  if (from_length && to_length)
    slugParts.push(`between-${from_length}-${to_length}-length-in-feet`);
  else if (from_length) slugParts.push(`over-${from_length}-length-in-feet`);
  else if (to_length) slugParts.push(`under-${to_length}-length-in-feet`);

  if (selectedMake) slugParts.push(selectedMake);
  if (selectedModel) slugParts.push(selectedModel);

  let slugifiedURL = `/listings/${slugParts.join("/")}`
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  const query: Record<string, string> = {};
  if (from_year) query.acustom_fromyears = String(from_year);
  if (to_year) query.acustom_toyears = String(to_year);

  const queryString = new URLSearchParams(query).toString();
  if (queryString) slugifiedURL += `?${queryString}`;

  return slugifiedURL;
};
