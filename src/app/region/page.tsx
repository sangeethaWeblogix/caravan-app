 'use client'

 import { useEffect, useState } from 'react'
import { fetchRegionData } from '@/api/region/api'
import Link from 'next/link'

export default function ListingHomePage() {
  const [headings, setHeadings] = useState<string[]>([])

  useEffect(() => {
    fetchRegionData().then(res => {
      setHeadings(res.data.map(entry => entry.heading))
    })
  }, [])

console.log(headings,"he")

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Choose a Category</h2>
      <div className="flex flex-wrap gap-4">
        {headings.map(heading => (
          <Link
            key={heading}
             href={`/region/${heading}`}
            className="text-blue-600  capitalize"
          >
            {heading}
          </Link>
        ))}
      </div>
    </div>
  )
}
