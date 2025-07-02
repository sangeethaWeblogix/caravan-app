 'use client';

import { usePathname } from 'next/navigation';
import ListingsPage from '@/app/components/Listings';

const Listings = () => {
  const pathname = usePathname();
 
  // Parse slug from pathname: /listings/[category-slug]/[state-slug]
  const pathParts = pathname?.split('/').filter(Boolean);
  const categorySlug = pathParts?.[1];
  const stateSlug = pathParts?.[2];

  // Convert category-slug and state-slug to usable values
  const category = categorySlug?.replace(/-category$/, '') || undefined;
  const location = stateSlug?.replace(/-state$/, '').replace(/-/g, ' ') || undefined;

  return (
    <ListingsPage
      category={category}
      location={location}
    />
  );
};

export default Listings;
