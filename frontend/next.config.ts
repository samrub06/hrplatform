import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001'],
    },
  },
  
  // Disable Tailwind CSS logs completely
  env: {
    TAILWIND_MODE: 'build',
    TAILWIND_VERBOSE: 'false',
  },
};

export default nextConfig;
