/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
        hostname: "img.youtube.com",
        port: "",
        pathname: `/vi/**`,
      },
    ],
  },
};

export default nextConfig;
