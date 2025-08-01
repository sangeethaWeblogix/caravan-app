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
export const slugify = (text: string | null | undefined) =>
  text?.toLowerCase().replace(/\s+/g, "-").trim() || "";

// export const buildSlugPath = (filters: Filters) => {
//   const slugParts: string[] = [];

//   if (filters.suburb) {
//     slugParts.push(`${slugify(filters.suburb)}-suburb`);
//     if (filters.state) slugParts.push(`${slugify(filters.state)}-state`);
//     if (filters.pincode) slugParts.push(filters.pincode);
//   } else {
//     if (filters.state) slugParts.push(`${slugify(filters.state)}-state`);
//     // if (filters.region) slugParts.push(`${slugify(filters.region)}-region`);
//   }

//   if (filters.make) {
//     slugParts.push(filters.make);
//     if (filters.model && filters.model !== filters.make) {
//       slugParts.push(filters.model);
//     }
//   }

//   if (filters.category) slugParts.push(`${filters.category}-category`);
//   if (filters.condition) {
//     slugParts.push(`${filters.condition.toLowerCase()}-condition`);
//   }

//   if (filters.from_price && filters.to_price) {
//     slugParts.push(`between-${filters.from_price}-${filters.to_price}`);
//   } else if (filters.from_price) {
//     slugParts.push(`over-${filters.from_price}`);
//   } else if (filters.to_price) {
//     slugParts.push(`under-${filters.to_price}`);
//   }

//   if (filters.minKg && filters.maxKg) {
//     slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
//   } else if (filters.minKg) {
//     slugParts.push(`over-${filters.minKg}-kg-atm`);
//   } else if (filters.maxKg) {
//     slugParts.push(`under-${filters.maxKg}-kg-atm`);
//   }

//   if (filters.sleeps) {
//     const num = filters.sleeps.split("-")[0];
//     slugParts.push(`over-${num}-people-sleeping-capacity`);
//   }

//   if (filters.from_length && filters.to_length) {
//     slugParts.push(
//       `between-${filters.from_length}-${filters.to_length}-length-in-feet`
//     );
//   } else if (filters.from_length) {
//     slugParts.push(`over-${filters.from_length}-length-in-feet`);
//   } else if (filters.to_length) {
//     slugParts.push(`under-${filters.to_length}-length-in-feet`);
//   }

//   return `/listings/${slugParts.join("/")}`;
// };
export const buildSlugPath = (filters: Filters) => {
  const slugParts: string[] = [];

  // Make and Model Filters
  if (filters.make) {
    slugParts.push(filters.make);
    if (filters.model && filters.model !== filters.make) {
      slugParts.push(filters.model); // Ensure model is only added if it is different from make
    }
  }

  // Category and Condition Filters
  if (filters.category) slugParts.push(`${filters.category}-category`);
  if (filters.condition)
    slugParts.push(`${filters.condition.toLowerCase()}-condition`);

  // Location Filters: State → Region → Suburb → Postcode
  if (filters.state) {
    slugParts.push(`${filters.state.toLowerCase().replace(/\s+/g, "-")}-state`);
  }

  if (filters.region && filters.state) {
    slugParts.push(
      `${filters.region.toLowerCase().replace(/\s+/g, "-")}-region`
    );
  }

  if (filters.suburb) {
    slugParts.push(`${slugify(filters.suburb)}-suburb`);
    if (filters.state) {
      slugParts.push(`${slugify(filters.state)}-state`);
    }
    if (filters.pincode) {
      slugParts.push(filters.pincode);
    }
  } else {
    // ✅ Else: State → Region
    if (filters.state) {
      slugParts.push(`${slugify(filters.state)}-state`);
    }
    if (filters.region) {
      slugParts.push(`${slugify(filters.region)}-region`);
    }
  }

  // Price and ATM Filters
  if (filters.from_price && filters.to_price) {
    slugParts.push(`between-${filters.from_price}-${filters.to_price}`);
  } else if (filters.from_price) {
    slugParts.push(`over-${filters.from_price}`);
  } else if (filters.to_price) {
    slugParts.push(`under-${filters.to_price}`);
  }

  // Weight (ATM) Range Filters
  if (filters.minKg && filters.maxKg) {
    slugParts.push(`between-${filters.minKg}-kg-${filters.maxKg}-kg-atm`);
  } else if (filters.minKg) {
    slugParts.push(`over-${filters.minKg}-kg-atm`);
  } else if (filters.maxKg) {
    slugParts.push(`under-${filters.maxKg}-kg-atm`);
  }

  // Sleeping Capacity Filter
  if (filters.sleeps) {
    const num = filters.sleeps.split("-")[0]; // Extract number of people
    slugParts.push(`over-${num}-people-sleeping-capacity`);
  }

  // Length Filters
  if (filters.from_length && filters.to_length) {
    slugParts.push(
      `between-${filters.from_length}-${filters.to_length}-length-in-feet`
    );
  } else if (filters.from_length) {
    slugParts.push(`over-${filters.from_length}-length-in-feet`);
  } else if (filters.to_length) {
    slugParts.push(`under-${filters.to_length}-length-in-feet`);
  }

  // Combine filters into the URL
  return `/listings/${slugParts.join("/")}`;
};
