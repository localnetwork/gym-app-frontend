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
    ],
  },
};

export default nextConfig;
