interface Filters {
  category?: string;
  condition?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string;
  to_price?: string;
  minKg?: string;
  maxKg?: string;
  from_length?: string;
  to_length?: string;
  sleeps?: string;
  make?: string;
  model?: string;
}
import { fetchListings } from "@/api/listings/api";
import ListingsPage from "@/app/components/ListContent/Listings";
import { Metadata } from "next";

function parseSlugToFilters(slugParts: string[]): Filters {
  const filters: Filters = {};
  slugParts.forEach((part) => {
    if (part.endsWith("-category")) {
      filters.category = part.replace("-category", "");
    } else if (part.endsWith("-condition")) {
      filters.condition = part.replace("-condition", "");
    } else if (part.endsWith("-state")) {
      filters.state = part.replace("-state", "").replace(/-/g, " ");
    } else if (part.endsWith("-region")) {
      filters.region = part.replace("-region", "").replace(/-/g, " ");
    } else if (part.endsWith("-suburb")) {
      filters.suburb = part.replace("-suburb", "").replace(/-/g, " ");
    } else if (/^\d{4}$/.test(part)) {
      filters.pincode = part;
    } else if (part.includes("-kg-atm")) {
      if (part.startsWith("between-")) {
        const match = part.match(/between-(\d+)-kg-(\d+)-kg-atm/);
        if (match) {
          filters.minKg = match[1];
          filters.maxKg = match[2];
        }
      } else if (part.startsWith("over-")) {
        filters.minKg = part.replace("over-", "").replace("-kg-atm", "");
      } else if (part.startsWith("under-")) {
        filters.maxKg = part.replace("under-", "").replace("-kg-atm", "");
      }
    } else if (part.includes("length-in-feet")) {
      if (part.startsWith("between-")) {
        const match = part.match(/between-(\d+)-(\d+)-length-in-feet/);
        if (match) {
          filters.from_length = match[1];
          filters.to_length = match[2];
        }
      } else if (part.startsWith("over-")) {
        filters.from_length = part
          .replace("over-", "")
          .replace("-length-in-feet", "");
      } else if (part.startsWith("under-")) {
        filters.to_length = part
          .replace("under-", "")
          .replace("-length-in-feet", "");
      }
    } else if (/over-(\d+)-people-sleeping-capacity/.test(part)) {
      const match = part.match(/over-(\d+)-people/);
      if (match) {
        filters.sleeps = `${match[1]}-people`;
      }
    } else if (/^over-\d+$/.test(part)) {
      filters.from_price = part.replace("over-", "");
    } else if (/^under-\d+$/.test(part)) {
      filters.to_price = part.replace("under-", "");
    } else if (/^between-\d+-\d+$/.test(part)) {
      const match = part.match(/between-(\d+)-(\d+)/);
      if (match) {
        filters.from_price = match[1];
        filters.to_price = match[2];
      }
    } else {
      // fallback for make/model slugs (must be non-numeric and valid)
      if (!filters.make && isNaN(Number(part)) && !part.includes("-")) {
        filters.make = part;
      } else if (!filters.model && isNaN(Number(part)) && !part.includes("-")) {
        filters.model = part;
      }
    }
  });

  return filters;
}
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { paged?: string };
}): Promise<Metadata> {
  const slugParts = params.slug || [];
  const filters = parseSlugToFilters(slugParts);
  const page = parseInt(searchParams?.paged || "1", 10);

  const response = await fetchListings({ ...filters, page });

  return {
    title: response?.seo?.metatitle || "Caravan Listings",
    description: response?.seo?.metadescription || "Browse caravans for sale",
    openGraph: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [
        {
          url: response?.seo?.metaimage || "/favicon.ico",
        },
      ],
    },
    twitter: {
      title: response?.seo?.metatitle,
      description: response?.seo?.metadescription,
      images: [response?.seo?.metaimage || "/favicon.ico"],
    },
  };
}

// const Listings = () => {
//   alert("part");

//   const searchParams = useSearchParams();
//   const paged = searchParams.get("paged") || "1";
//   const pathname = usePathname();
//   const slugString = pathname?.split("/listings/")[1] || "";
//   const slugParts = slugString.split("/").filter(Boolean);
//   const getPart = (suffix: string) =>
//     slugParts.find((part) => part.endsWith(suffix));

//   // Text filters
//   const category = getPart("-category")?.replace("-category", "") || undefined;
//   const condition =
//     getPart("-condition")?.replace("-condition", "") || undefined;
//   const state =
//     getPart("-state")?.replace("-state", "").replace(/-/g, " ") || undefined;
//   const region =
//     getPart("-region")?.replace("-region", "").replace(/-/g, " ") || undefined;
//   const suburb =
//     getPart("-suburb")?.replace("-suburb", "").replace(/-/g, " ") || undefined;
//   const postcode = slugParts.find((part) => /^\d{4}$/.test(part)) || undefined;

//   // Make/Model filtering (excluding ATM/price/etc)
//   const makeModelCandidates = slugParts.filter((part) => {
//     const isKnownFilter = [
//       "-category",
//       "-condition",
//       "-state",
//       "-region",
//       "-suburb",
//     ].some((suffix) => part.endsWith(suffix));

//     const isSpecialPattern =
//       part.includes("kg-atm") ||
//       part.includes("length-in-feet") ||
//       part.includes("sleeping-capacity") ||
//       /^over-\d+$/.test(part) ||
//       /^under-\d+$/.test(part) ||
//       /^between-\d+-\d+$/.test(part) ||
//       /^\d{4}$/.test(part); // postcode

//     return !isKnownFilter && !isSpecialPattern;
//   });

//   function isValidMakeOrModel(slug: string | undefined) {
//     if (!slug) return false;
//     if (slug?.includes("kg") || slug?.includes("atm")) return false;
//     console.log("makeModelCandidates", makeModelCandidates);
//     console.log("parsed make", make);
//     if (!isNaN(Number(slug))) return false;
//     if (slug.includes("kg") || slug.includes("atm")) return false;
//     if (/^(over|under|between)-/.test(slug)) return false;
//     if (
//       slug.includes("people") ||
//       slug.includes("length") ||
//       slug.includes("capacity")
//     )
//       return false;
//     if (/^\d{4}$/.test(slug)) return false;
//     return true;
//   }

//   let maybeMake: string | undefined = makeModelCandidates[0];
//   let maybeModel: string | undefined = makeModelCandidates[1];

//   if (
//     maybeMake?.includes("kg") ||
//     maybeMake?.includes("atm") ||
//     /^(over|under|between)-/.test(maybeMake)
//   ) {
//     maybeMake = undefined;
//   }

//   if (
//     maybeModel?.includes("kg") ||
//     maybeModel?.includes("atm") ||
//     /^(over|under|between)-/.test(maybeModel)
//   ) {
//     maybeModel = undefined;
//   }

//   const make = isValidMakeOrModel(maybeMake) ? maybeMake : undefined;
//   const model = isValidMakeOrModel(maybeModel) ? maybeModel : undefined;

//   // Price
//   const priceMatch = slugParts.find(
//     (p) =>
//       /^over-\d+$/.test(p) ||
//       /^under-\d+$/.test(p) ||
//       /^between-\d+-\d+$/.test(p)
//   );
//   let from_price: string | undefined;
//   let to_price: string | undefined;
//   if (priceMatch?.startsWith("over-")) {
//     from_price = priceMatch.replace("over-", "");
//   } else if (priceMatch?.startsWith("under-")) {
//     to_price = priceMatch.replace("under-", "");
//   } else if (priceMatch?.startsWith("between-")) {
//     const match = priceMatch.match(/between-(\d+)-(\d+)/);
//     if (match) {
//       from_price = match[1];
//       to_price = match[2];
//     }
//   }

//   // ATM
//   const atmMatch = slugParts.find((p) => p.includes("kg-atm"));
//   let minKg: string | undefined;
//   let maxKg: string | undefined;

//   if (atmMatch?.startsWith("over-")) {
//     minKg = atmMatch.replace("over-", "").replace("-kg-atm", "");
//   } else if (atmMatch?.startsWith("under-")) {
//     maxKg = atmMatch.replace("under-", "").replace("-kg-atm", "");
//   } else if (atmMatch?.startsWith("between-")) {
//     const match = atmMatch.match(/between-(\d+)-kg-(\d+)-kg-atm/);
//     if (match) {
//       minKg = match[1];
//       maxKg = match[2];
//     }
//   }

//   // Length
//   const lengthMatch = slugParts.find((p) => p.includes("length-in-feet"));
//   let from_length: string | undefined;
//   let to_length: string | undefined;
//   if (lengthMatch?.startsWith("over-")) {
//     from_length = lengthMatch
//       .replace("over-", "")
//       .replace("-length-in-feet", "");
//   } else if (lengthMatch?.startsWith("under-")) {
//     to_length = lengthMatch
//       .replace("under-", "")
//       .replace("-length-in-feet", "");
//   } else if (lengthMatch?.startsWith("between-")) {
//     const match = lengthMatch.match(/between-(\d+)-(\d+)-length-in-feet/);
//     if (match) {
//       from_length = match[1];
//       to_length = match[2];
//     }
//   }

//   // Sleeps
//   const sleepMatch = slugParts.find((p) =>
//     p.includes("-people-sleeping-capacity")
//   );
//   let sleeps: string | undefined;
//   if (sleepMatch?.startsWith("over-")) {
//     const match = sleepMatch.match(/over-(\d+)-people-sleeping-capacity/);
//     if (match) {
//       sleeps = `${match[1]}-people`;
//     }
//   }

//   // Year from query params
//   const from_year = searchParams.get("acustom_fromyears") || undefined;
//   const to_year = searchParams.get("acustom_toyears") || undefined;

//   return (
//     <ListingsPage
//       category={category}
//       condition={condition}
//       make={make}
//       model={model}
//       state={state}
//       region={region}
//       suburb={suburb}
//       pincode={postcode}
//       from_price={from_price}
//       to_price={to_price}
//       minKg={minKg}
//       maxKg={maxKg}
//       from_length={from_length}
//       to_length={to_length}
//       sleeps={sleeps}
//       from_year={from_year}
//       to_year={to_year}
//       paged={paged} // ✅ add this line
//     />
//   );
// };
// export default Listings;

const Listings = () => {
  const searchParams = useSearchParams();
  const paged = searchParams.get("paged") || "1";
  const pathname = usePathname();

  const slugString = pathname?.split("/listings/")[1] || "";
  const slugParts = slugString.split("/").filter(Boolean);

  const getPart = (suffix: string) =>
    slugParts.find((part) => part.endsWith(suffix));

  const category = getPart("-category")?.replace("-category", "") || undefined;
  const condition =
    getPart("-condition")?.replace("-condition", "") || undefined;
  const state =
    getPart("-state")?.replace("-state", "").replace(/-/g, " ") || undefined;
  const region =
    getPart("-region")?.replace("-region", "").replace(/-/g, " ") || undefined;
  const suburb =
    getPart("-suburb")?.replace("-suburb", "").replace(/-/g, " ") || undefined;
  const postcode = slugParts.find((p) => /^\d{4}$/.test(p)) || undefined;

  // Price
  const priceSlug = slugParts.find((p) =>
    /^(over|under|between)-\d+(-\d+)?$/.test(p)
  );
  let from_price: string | undefined, to_price: string | undefined;
  if (priceSlug?.startsWith("over-"))
    from_price = priceSlug.replace("over-", "");
  else if (priceSlug?.startsWith("under-"))
    to_price = priceSlug.replace("under-", "");
  else if (priceSlug?.startsWith("between-")) {
    const match = priceSlug.match(/between-(\d+)-(\d+)/);
    if (match) [from_price, to_price] = [match[1], match[2]];
  }

  // ATM
  const atmSlug = slugParts.find((p) => p.includes("kg-atm"));
  let minKg: string | undefined, maxKg: string | undefined;
  if (atmSlug?.startsWith("over-"))
    minKg = atmSlug.replace("over-", "").replace("-kg-atm", "");
  else if (atmSlug?.startsWith("under-"))
    maxKg = atmSlug.replace("under-", "").replace("-kg-atm", "");
  else if (atmSlug?.startsWith("between-")) {
    const match = atmSlug.match(/between-(\d+)-kg-(\d+)-kg-atm/);
    if (match) [minKg, maxKg] = [match[1], match[2]];
  }

  // Length
  const lengthSlug = slugParts.find((p) => p.includes("length-in-feet"));
  let from_length: string | undefined, to_length: string | undefined;
  if (lengthSlug?.startsWith("over-"))
    from_length = lengthSlug
      .replace("over-", "")
      .replace("-length-in-feet", "");
  else if (lengthSlug?.startsWith("under-"))
    to_length = lengthSlug.replace("under-", "").replace("-length-in-feet", "");
  else if (lengthSlug?.startsWith("between-")) {
    const match = lengthSlug.match(/between-(\d+)-(\d+)-length-in-feet/);
    if (match) [from_length, to_length] = [match[1], match[2]];
  }

  // Sleeps
  const sleepSlug = slugParts.find((p) =>
    p.includes("-people-sleeping-capacity")
  );
  let sleeps: string | undefined;
  if (sleepSlug?.startsWith("over-")) {
    const match = sleepSlug.match(/over-(\d+)-people/);
    if (match) sleeps = `${match[1]}-people`;
  }

  // Year
  const from_year = searchParams.get("acustom_fromyears") || undefined;
  const to_year = searchParams.get("acustom_toyears") || undefined;

  // Extract make/model (after excluding known patterns)
  const knownSuffixes = [
    "-category",
    "-condition",
    "-state",
    "-region",
    "-suburb",
  ];
  const knownPatterns = [
    /kg-atm/,
    /length-in-feet/,
    /people-sleeping-capacity/,
    /^\d{4}$/,
    /^over-\d+$/,
    /^under-\d+$/,
    /^between-\d+-\d+/,
  ];
  const makeModelCandidates = slugParts.filter(
    (slug) =>
      !knownSuffixes.some((suffix) => slug.endsWith(suffix)) &&
      !knownPatterns.some((pattern) => pattern.test(slug))
  );

  const make = makeModelCandidates[0];
  const model = makeModelCandidates[1];

  return (
    <ListingsPage
      category={category}
      condition={condition}
      make={make}
      model={model}
      state={state}
      region={region}
      suburb={suburb}
      pincode={postcode}
      from_price={from_price}
      to_price={to_price}
      minKg={minKg}
      maxKg={maxKg}
      from_length={from_length}
      to_length={to_length}
      sleeps={sleeps}
      from_year={from_year}
      to_year={to_year}
      paged={paged}
    />
  );
};

export default Listings;
