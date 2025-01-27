import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      //to set dynamic pages to not be cached. we just want to cache data
      dynamic: 0
    }
  }
};

export default nextConfig;
