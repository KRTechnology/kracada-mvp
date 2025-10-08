import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2c8048c3206e44c69949284319d6c44d.r2.dev",
        port: "",
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
