import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},

  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vycmyarjrpkooiysfkgj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cdn.creativefabrica.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
