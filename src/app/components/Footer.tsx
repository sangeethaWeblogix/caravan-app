
// components/Footer.js
'use client'
import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
// import  '../../../public/svg/facebook.svg'

import Link from 'next/link'; // Assuming you're using Next.js for the <Link> component
import './footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <div className="footer">
      <div className="social-icons">
        <a href="https://www.facebook.com/caravansforsale.com.au">
          <FaFacebookF size={24} />
        </a>
        <a href="https://www.instagram.com/caravansforsale.com.au">
          <FaInstagram size={24}  />
        </a>
        <a href="https://x.com/CaravanMarketPL">
          <FaXTwitter size={24} />
        </a>
        <a href="https://www.youtube.com/@caravansforsalecomau">
          <FaYoutube size={24} />
        </a>
        <a href="https://www.linkedin.com/company/caravansforsale/">
          <FaLinkedin size={24} />
        </a>
      </div>
      <nav>
        <ul className='font-15'>
          <li><Link href="#">Manufacturers</Link></li>
          <li><Link href="#">Caravan Dealers</Link></li>
          <li><Link href="#">For Sale</Link></li>
          <li><Link href="#">Blog</Link></li>
          <li><Link href="#">Terms & Conditions</Link></li>
          <li><Link href="#">Privacy Policy</Link></li>
          <li><Link href="#">Privacy Collection Statement</Link></li>
          <li><Link href="#">About</Link></li>
          <li><Link href="#">Contact Us</Link></li>
        </ul>
      </nav>
      <p className='font-14'>
        &copy; 2025 Caravan Marketplace (Web Logix) ABN 92 009 784 881. All Rights Reserved.
      </p> 
      <p className='font-13' style={{ marginTop: '8px', maxWidth: '56rem', margin: '0 auto' }}>
        Disclaimer: Caravan marketplace is not affiliated with any manufacturers, dealers listed on our website. All product data listed on our website including logos, and brands are property of their respective owners. Product information is provided for informational purposes only. Caravan marketplace does not make any warranty as to the accuracy, completeness or reliability of the information or accept any liability arising in any way from any omissions or errors. The information should not be regarded as advice or relied upon by you or any other person and we recommend that you seek professional advice before making any purchase decisions.
      </p>
    </div>
  );
};

export default Footer;
