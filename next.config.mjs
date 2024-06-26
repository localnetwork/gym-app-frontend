/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: process.env.NEXT_PUBLIC_API_PORT,
        pathname: `/**`,
      },
      {
        protocol: "https",
        hostname: "one-kaizen-backend.vercel.app",
        port: process.env.NEXT_PUBLIC_API_PORT,
        pathname: `/**`,
      },

      {
        protocol: "https",
        hostname: "node-gym-backend.onrender.com",
        pathname: `/**`,
      },
    ],
  },
};

export default nextConfig;
