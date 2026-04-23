import type { NextConfig } from 'next';
import path from 'path';

const backend = process.env.BACKEND_URL ?? 'http://localhost:5000';

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname, '../..'),
    async rewrites() {
        return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
    },
    eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
