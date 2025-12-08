import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle libsql and related packages as external
  serverExternalPackages: [
    "@libsql/client",
    "@prisma/adapter-libsql",
    "libsql",
  ],

  // Empty turbopack config to silence the webpack migration warning
  turbopack: {},
};

export default nextConfig;
