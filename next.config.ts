import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /* Our photography tops out around 2300px wide, asking the optimiser for
       3840px only upscales, costing bytes and build time for no visible gain. */
    deviceSizes: [480, 640, 828, 1080, 1440, 1920, 2304],
    imageSizes: [128, 192, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
