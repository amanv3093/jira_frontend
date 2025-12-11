import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
   eslint: {
    ignoreDuringBuilds: true,   // ← ADD HERE
  },
};


export default nextConfig;
