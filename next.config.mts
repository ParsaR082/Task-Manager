import { withAuth } from "next-auth/middleware";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Trust proxy headers for NextAuth behind reverse proxy
  experimental: {
    trustHost: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default config;
