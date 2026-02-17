import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 与 admin 中的 Vite 代理保持一致：
        // /api/* → http://localhost:3004/api/*
        destination: 'http://localhost:3004/api/:path*',
      },
    ];
  },
};

export default nextConfig;
