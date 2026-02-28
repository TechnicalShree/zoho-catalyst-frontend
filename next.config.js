/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    experimental: {
        // Set proxy timeout to 2 minutes (120000 ms) or your desired time
        proxyTimeout: 1000 * 60 * 2,
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
            },
            {
                source: "/__catalyst/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/__catalyst/:path*`,
            },
            {
                source: "/_catalyst/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/_catalyst/:path*`,
            },
            {
                source: "/baas/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/baas/:path*`,
            },
            {
                source: "/accounts/:path*",
                destination: `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
