import Link from 'next/link'
import { Search } from 'lucide-react' // or use any search icon

const manufacturers = [
  'Aussie Fivestar', 'Coronet RV Caravans', 'Everest', 'JB Caravans',
  'MDC Caravans', 'Nova', 'Orbit', 'Red Centre',
  'Silver Valley', 'The Little Caravan Company', 'Titanium'
]

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export default function SimilarManufacturers() {
  return (
    <section className="py-10">
      <h2 className="text-xl font-semibold mb-6">Browse by Similar Manufacturers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {manufacturers.map((name) => (
          <Link
            key={name}
            href={`/listings/${slugify(name)}`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-sm font-medium text-gray-800 rounded-full hover:bg-gray-300 transition"
          >
            <Search size={16} />
            {name}
          </Link>
        ))}
      </div>
    </section>
  )
}
