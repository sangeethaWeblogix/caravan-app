 // components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATES = [
  'New South Wales',
  'Queensland',
  'Western Australia',
  'Victoria',
  'South Australia',
  'Australian Capital Territory',
  'Tasmania'
]

const Navbar = () => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <nav className='flex items-center justify-between px-8 py-4 bg-[#1e1e1e] text-white font-medium z-50 relative'>
      <div className='text-2xl font-bold'>
        <span className='text-white'>caravansfor</span>
        <span className='text-orange-500'>sale.com.au</span>
      </div>

      <ul className='flex gap-6 items-center relative'>
        <li
          className='relative cursor-pointer'
          onMouseEnter={() => setHovered('state')}
          onMouseLeave={() => setHovered(null)}
        >
          <span className='hover:text-orange-500 text-orange-500 transition-colors'>Browse By State &#x25B2;</span>
          {hovered === 'state' && (
            <ul className='absolute top-full mt-2 bg-white text-black rounded shadow-md w-64 py-2 z-10'>
              {STATES.map(state => {
                const isActive = activeItem === state
                const linkHref = `/browse/state/${state.toLowerCase().replace(/\s+/g, '-')}`

                return (
                  <li
                    key={state}
                    onMouseEnter={() => setActiveItem(state)}
                    onMouseLeave={() => setActiveItem(null)}
                    className={`px-4 py-2 transition-all cursor-pointer text-sm font-medium flex items-center gap-2
                      ${isActive ? 'bg-[#f2f2f2] text-orange-500' : 'text-black'}`}
                  >
                    <Link href={linkHref} className='w-full block'>
                      {state}
                    </Link>
                    {isActive && <span className='text-orange-500'>&#x276F;</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </li>

        <li className='cursor-pointer hover:text-orange-500 transition-colors'>Browse By Category</li>
        <li className='cursor-pointer hover:text-orange-500 transition-colors'>Browse By Price</li>
        <li className='cursor-pointer hover:text-orange-500 transition-colors'>All Listings</li>
      </ul>
    </nav>
  )
}

export default Navbar