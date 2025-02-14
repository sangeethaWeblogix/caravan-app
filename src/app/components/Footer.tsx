// footer.tsx
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="style-8">
      <div className="container">
        <div className="foot py-4 border-1 border-top brd-gray text-center">
          <div className="content">
            <div className="foot-info logo-social">
              <div className="socials">
                <a href="https://www.facebook.com/caravansforsale.com.au" target="_blank">
                  <FaFacebookF size={18} />
                </a>
                <a href="https://www.instagram.com/caravansforsale.com.au" target="_blank">
                  <FaInstagram size={18} />
                </a>
                <a href="https://x.com/CaravanMarketPL" target="_blank">
                  <FaXTwitter size={18} />
                </a>
                <a href="https://www.youtube.com/@caravansforsalecomau" target="_blank">
                  <FaYoutube size={18} />
                </a>
                <a href="https://www.linkedin.com/company/caravansforsale/" target="_blank">
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>
          <h6 className="foot-title foot_xs hidden-lg hidden-md hidden-sm">About Us</h6>
          <ul className="menu footer_xs">
            <li>
              <a href="/caravan-dealers">Caravan Dealers</a>
            </li>
            <li>
              <a href="/listings">For Sale</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/terms-conditions">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/privacy-collection-statement">Privacy Collection Statement</a>
            </li>
            <li className="hidden-xs">
              <a href="/about-us">About</a>
            </li>
            <li className="hidden-lg hidden-md hidden-sm">
              <a href="/about-us">About Caravan Marketplace</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
          <p> Caravan Marketplace (Web Logix) ABN 92 009 784 881 | Copyright © {new Date().getFullYear()}. All Rights Reserved. </p>
          <div className="disclaimer" style={{ marginTop: 12 }}>
            <p>
              <small>Disclaimer: Caravan marketplace is not affiliated with any manufacturers, dealers listed on our website. All product data listed on our website including logos, and brands are property of their respective owners. Product information is provided for informational purposes only. <br />
              Caravan marketplace does not make any warranty as to the accuracy, completeness or reliability of the information or accept any liability arising in any way from any omissions or errors. The information should not be regarded as advice or relied upon by you or any other person and we recommend that you seek professional advice before making any purchase decisions.</small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
