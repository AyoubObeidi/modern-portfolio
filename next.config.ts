import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export can't use the default image optimizer; images are pre-sized WebP.
  images: { unoptimized: true },
  // A stray package-lock.json in the home directory would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
