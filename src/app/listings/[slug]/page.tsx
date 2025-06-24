 import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Footer from './Footer'
import ProductList from './ProductList'
import CaravanFilter from '../CaravanFilter'
import '../listings.css'


interface Props {
  params: {
    slug: string
  }
}

const SLUG_NAME_MAP: Record<string, string> = {
  // Regions
  'south-australia-state/adelaide-region': 'Adelaide',
  'queensland-state/gold-coast-region': 'Gold Coast',
  'victoria-state/ballarat-region': 'Ballarat',
  'victoria-state/melbourne-region': 'Melbourne',
  'western-australia-state/perth-region': 'Perth',
  'queensland-state/brisbane-region': 'Brisbane',
  'new-south-wales-state/newcastle-and-lake-macquarie-region': 'Newcastle',
  'victoria-state/latrobe-gippsland-region': 'Gippsland',
  'new-south-wales-state/sydney-region': 'Sydney',
  'victoria-state/geelong-region': 'Geelong',
  'queensland-state/sunshine-coast-region': 'Sunshine Coast',
  'tasmania-state/hobart-region': 'Hobart',

  // Manufacturers (slug => readable)
  'lotus': 'Lotus',
  'jb': 'JB',
  'coronet-rv': 'Coronet RV',
  'aussie-fivestar': 'Aussie Fivestar',
  'essential': 'Essential',
  'jayco': 'Jayco',
  'zone-rv': 'Zone RV',
  'the-little-caravan-company': 'The Little Caravan Company',
  'supreme': 'Supreme',
  'grand-city': 'Grand City',
  'crusader': 'Crusader',
  'masterpiece': 'Masterpiece',
  'mdc': 'MDC',
  'retreat': 'Retreat',
  'snowy-river': 'Snowy River',
  'new-age': 'New Age',
  'prime-edge': 'Prime Edge',
  'urban': 'Urban',
  'everest': 'Everest',
  'royal-flair': 'Royal Flair',
  'orbit': 'Orbit',
  'legend': 'Legend',
  'silver-valley': 'Silver Valley',
  'ezytrail-camper-trailer': 'EzyTrail Camper Trailer',
  'network-rv': 'Network RV',

  // Sizes (e.g. between-16-16-length-in-feet)
  ...Object.fromEntries(
    Array.from({ length: 17 }, (_, i) => i + 12).map(size => [
      `between-${size}-${size}-length-in-feet`,
      `${size} ft`
    ])
  ),

  // Weights
  ...Object.fromEntries(
    [1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000].map(weight => [
      `under-${weight}-kg-atm`,
      `Under ${weight.toLocaleString()} Kg`
    ])
  ),

  // Sleeping Capacity
  ...Object.fromEntries(
    [2, 3, 4, 5, 6, 7].map(count => [
      `over-${count}-people-sleeping-capacity`,
      `Sleeps ${count}`
    ])
  ),

  // Categories or additional listings
  'hybrid-category': 'Hybrid Caravans',
  'off-road-category': 'Off Road Caravans'
}

export const generateMetadata = ({ params }: Props): Metadata => {
  const name = SLUG_NAME_MAP[params.slug] || params.slug.replace(/-/g, ' ')
  return {
    title: `${name} Caravans for Sale`
  }
}

export default function ListingPage({ params }: Props) {
    
  const readable = SLUG_NAME_MAP[params.slug] || params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  if (!readable) return notFound()

  return (
    <div style={{ backgroundColor: '#f7f7f7' }}>

    <div className="container py-10">
      <h1 className="page-title">{readable}</h1>
      {/* <p className="text-lg">Showing caravan listings for <strong>{readable}</strong>.</p> */}
    </div>
    <section className="services section-padding pt-30 pb-30 style-1">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-12 col-md-4">
              <div className="filter">
              <CaravanFilter />
              </div>
              </div>
              <ProductList />
              <div className="col-lg-3 rightbar-stick">
                </div>
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
    </div>
  )
} 
