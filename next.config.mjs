/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Optimize dev memory usage by reducing page cache duration in RAM
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
