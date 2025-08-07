import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true, // ✅ forces all URLs to end with '/'
  images: {
    domains: [
      "www.dev.caravansforsale.com.au",
      "www.caravansforsale.com.au", // ✅ add this line
    ],
  },
};

export default nextConfig;
