const getSecurityHeaders = () => {
  const headers = {};
  const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || "*";

  headers["Access-Control-Allow-Credentials"] = "true";
  headers["Access-Control-Allow-Methods"] = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
  headers["Access-Control-Allow-Headers"] =
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization";
  headers["Access-Control-Allow-Origin"] = allowedOrigins;
  headers["Content-Security-Policy"] = "frame-ancestors 'self';";
  headers["X-Frame-Options"] = "SAMEORIGIN";
  headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
  headers["X-Content-Type-Options"] = "nosniff";

  return Object.entries(headers).map(([key, value]) => ({ key, value }));
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["knex", "pg"]
  },
  images: {
    remotePatterns: []
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: getSecurityHeaders()
    }
  ]
};

export default nextConfig;
