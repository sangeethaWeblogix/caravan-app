 import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.dev.caravansforsale.com.au',
       'www.caravansforsale.com.au', // ✅ add this line
     ],
  },
};

export default nextConfig;
