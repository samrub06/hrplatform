import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 // output: 'export',
 env: {
  PORT: process.env.REACT_APP_PORT || '3001',
},
 async rewrites() {
  return [
   {
    source: '/api/:path*',
    destination: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/:path*',
   },
  ];
 },
};

export default nextConfig;
