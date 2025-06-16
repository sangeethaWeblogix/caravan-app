// components/Footer.tsx
'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTimes, FaYoutube, FaInfo } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-[#1e1e1e] text-white text-center px-4 py-10'>
      <div className='flex justify-center gap-6 mb-6'>
        <a href='#' className='border border-white rounded-full w-10 h-10 flex items-center justify-center'>
          <FaFacebookF size={16} />
        </a>
        <a href='#' className='border border-white rounded-full w-10 h-10 flex items-center justify-center'>
          <FaInstagram size={16} />
        </a>
        <a href='#' className='border border-white rounded-full w-10 h-10 flex items-center justify-center'>
          <FaTimes size={16} />
        </a>
        <a href='#' className='border border-white rounded-full w-10 h-10 flex items-center justify-center'>
          <FaYoutube size={16} />
        </a>
        <a href='#' className='border border-white rounded-full w-10 h-10 flex items-center justify-center'>
          <FaInfo size={16} />
        </a>
      </div>

      <div className='text-sm text-gray-300 mb-4 flex flex-wrap justify-center gap-3'>
        {[
          'Caravan Dealers',
          'For Sale',
          'Manufacturer Range',
          'Blog',
          'Terms & Conditions',
          'Privacy Policy',
          'Privacy Collection Statement',
          'About',
          'Contact Us'
        ].map((item, idx) => (
          <span key={idx} className='px-1'>
            <Link href='#' className='hover:underline'>{item}</Link>
            {idx < 8 && <span className='px-1'>/</span>}
          </span>
        ))}
      </div>

      <p className='text-sm text-gray-400 mb-2'>
        Caravan Marketplace (Web Logix) ABN 92 009 784 881 | Copyright © 2025. All Rights Reserved.
      </p>

      <p className='text-xs text-gray-500 max-w-4xl mx-auto leading-relaxed'>
        Disclaimer : Caravan marketplace is not affiliated with any manufacturers, dealers listed on our website. All product data listed on our website including logos, and brands are property of their respective owners. Product information is provided for informational purposes only.<br />
        Caravan marketplace does not make any warranty as to the accuracy, completeness or reliability of the information or accept any liability arising in any way from any omissions or errors. The information should not be regarded as advice or relied upon by you or any other person and we recommend that you seek professional advice before making any purchase decisions.
      </p>
    </footer>
  )
}

export default Footer;
