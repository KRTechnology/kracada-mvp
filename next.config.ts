import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any HTTPS domain
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // Allow any HTTP domain
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb", // Increased to support 5MB featured images + metadata
    },
  },
};

export default nextConfig;
