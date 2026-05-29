/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint warnings shouldn't block production builds (type-checking still runs).
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow remote images (admin can paste hosted image URLs). Using unoptimized
  // keeps arbitrary user-supplied URLs and data: URLs working without config.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
