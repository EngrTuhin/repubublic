/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactCompiler: true,
  allowedDevOrigins: ['192.168.0.24', 'localhost:3000', '192.168.0.24:3000','https://repubublic.vercel.app'],
};

export default nextConfig;
