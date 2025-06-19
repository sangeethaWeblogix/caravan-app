const sectionData = {
  Region: ['Adelaide', 'Gold Coast', 'Ballarat', 'Melbourne', 'Perth', 'Brisbane', 'Newcastle', 'Gippsland', 'Sydney', 'Geelong', 'Sunshine Coast', 'Hobart'],
  'Popular Manufacturers': ['Lotus', 'JB', 'Coronet RV', 'Aussie Five Star', 'Essential', 'Jayco', 'Zone RV', 'The Little Caravan Company', 'Supreme', 'Grand City', 'Crusader', 'Masterpiece', 'Mdc', 'Retreat', 'Snowy River', 'New Age', 'Prime Edge', 'Urban', 'Everest', 'Royal Flair', 'Orbit', 'Legend', 'Silver Valley', 'Ezytrail', 'Network Rv'],
  Size: Array.from({ length: 17 }, (_, i) => `${12 + i} ft`),
  Weight: ['Under 1,250 Kg', 'Under 1,500 Kg', 'Under 1,750 Kg', 'Under 2,000 Kg', 'Under 2,250 Kg', 'Under 2,500 Kg', 'Under 2,750 Kg', 'Under 3,000 Kg', 'Under 3,500 Kg', 'Under 4,000 Kg'],
  'Sleeping Capacity': ['Sleeps 2', 'Sleeps 3', 'Sleeps 4', 'Sleeps 5', 'Sleeps 6', 'Sleeps 7'],
  'Popular Pages': ['Best Off Road Caravans', 'Best Off Road Caravan Manufacturers', 'Best Caravan Manufacturers', 'Best Semi Off Road Caravans', 'Best Extreme Off Road Caravans', 'Best Luxury Caravans', 'Best Family Caravans', 'Best Touring Caravans']
}

export default function HeadingItemsPage({ params }: { params: { heading: string } }) {
  const decodedHeading = decodeURIComponent(params.heading)
  const items = sectionData[decodedHeading as keyof typeof sectionData]

  if (!items) {
    return <div className="p-6 text-red-500">No items found for "{decodedHeading}"</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{decodedHeading}</h2>
      <div className="flex flex-wrap gap-x-1 gap-y-1 text-blue-600">
        {items.map((item, idx) => (
          <span key={item}>
            <span className="hover:underline cursor-pointer">{item}</span>
            {idx !== items.length - 1 && <span className="text-gray-400 px-2">|</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
