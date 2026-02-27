/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://catalyst-hackathon-915650487.development.catalystserverless.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
