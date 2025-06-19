 'use client'
import React from'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sections = [
  {
    heading: 'Region',
    items: ['Adelaide', 'Gold Coast', 'Ballarat', 'Melbourne', 'Perth', 'Brisbane', 'Newcastle', 'Gippsland', 'Sydney', 'Geelong', 'Sunshine Coast', 'Hobart']
  },
  {
    heading: 'Popular Manufacturers',
    items: ['Lotus', 'JB', 'Coronet RV', 'Aussie Five Star', 'Essential', 'Jayco', 'Zone RV', 'The Little Caravan Company', 'Supreme', 'Grand City', 'Crusader', 'Masterpiece', 'Mdc', 'Retreat', 'Snowy River', 'New Age', 'Prime Edge', 'Urban', 'Everest', 'Royal Flair', 'Orbit', 'Legend', 'Silver Valley', 'Ezytrail', 'Network Rv']
  },
  {
    heading: 'Size',
    items: Array.from({ length: 17 }, (_, i) => `${12 + i} ft`)
  },
  {
    heading: 'Weight',
    items: [
      'Under 1,250 Kg', 'Under 1,500 Kg', 'Under 1,750 Kg', 'Under 2,000 Kg', 'Under 2,250 Kg',
      'Under 2,500 Kg', 'Under 2,750 Kg', 'Under 3,000 Kg', 'Under 3,500 Kg', 'Under 4,000 Kg'
    ]
  },
  {
    heading: 'Sleeping Capacity',
    items: ['Sleeps 2', 'Sleeps 3', 'Sleeps 4', 'Sleeps 5', 'Sleeps 6', 'Sleeps 7']
  },
  {
    heading: 'Popular Pages',
    items: [
      'Best Off Road Caravans', 'Best Off Road Caravan Manufacturers', 'Best Caravan Manufacturers',
      'Best Semi Off Road Caravans', 'Best Extreme Off Road Caravans', 'Best Luxury Caravans',
      'Best Family Caravans', 'Best Touring Caravans'
    ]
  }
]

export default function FilterListingPage() {
  const router = useRouter()

  const handleClick = (item: string) => {
    alert(`You clicked on ${item}`) // Ensure this line is correct
    router.push(`/region/${encodeURIComponent(item)}`)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-sm sm:text-base">
      <h2 className="text-2xl font-bold mb-6">Find Caravans For Sale By</h2>

      {sections.map(section => (
        <div key={section.heading} className="mb-6">
          <h3 className="text-lg font-semibold mb-1 text-black">{section.heading}</h3>
          <div className="flex flex-wrap gap-x-1 gap-y-1 text-blue-600">  
            {section.items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className="bg-transparent border-none p-0 m-0 text-blue-600 hover:underline cursor-pointer"
                >
                  {item}
                </button>
                {idx !== section.items.length - 1 && (
                  <span className="text-gray-400 px-2">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
