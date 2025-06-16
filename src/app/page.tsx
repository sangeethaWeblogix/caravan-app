 // components/HeroSection.tsx
'use client'

import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import Region from '../app/region/page'

const CATEGORIES = [
  { name: 'Off Road', img: '/images/img.png' },
  { name: 'Hybrid', img: '/images/img.png' },
  { name: 'Pop Top', img: '/images/img.png' },
  { name: 'Luxury', img: '/images/img.png' },
  { name: 'Family', img: '/images/img.png' },
  { name: 'Touring', img: '/images/img.png' }
]

const HeroSection = () => {
  return (
    <section
      className='relative text-white text-center bg-cover bg-center min-h-[600px] flex flex-col items-center justify-center px-4'
      // style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className='z-10 max-w-4xl mx-auto'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          Browse New & Used Caravans For Sale – Find Exclusive Deals
        </h1>
        <p className='text-lg md:text-xl mb-4'>
          CFS is dedicated to revolutionising your caravan buying experience.
        </p>
        <p className='text-sm md:text-base mb-8 text-gray-200'>
          Choose from a wide selection of high-quality caravans at competitive prices, find exclusive deals direct from manufacturers.
        </p>

        <div className='bg-white rounded-full overflow-hidden flex items-center max-w-2xl mx-auto shadow-lg p-2'>
          <FaSearch className='text-orange-500 ml-4' />
          <input
            type='text'
            placeholder='Find Exclusive Deals (State, Region, Suburb, Postcode...)'
            className='flex-grow px-4 py-2 focus:outline-none text-black'
          />
          <button className='bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full'>
            Search
          </button>
        </div>

        <div className='flex flex-wrap justify-center gap-6 mt-12'>
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              className='bg-black/30 px-4 py-2 rounded-md flex flex-col items-center hover:scale-105 transition-transform cursor-pointer'
            >
              <Image src={cat.img} alt={cat.name} width={70} height={70} />
              <span className='mt-2 text-white text-sm'>{cat.name}</span>
            </div>
          ))}

        </div>
      </div>

      <div className='absolute inset-0 bg-black opacity-30' />
      <Region />
    </section>
  )
}

export default HeroSection
