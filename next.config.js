/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/event/create",
                destination:
                    "https://catalyst-hackathon-915650487.development.catalystserverless.com/event/create",
            },
        ];
    },
};

module.exports = nextConfig;

