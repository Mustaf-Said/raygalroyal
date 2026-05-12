import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "raygalroyal.com" }],
        destination: "https://www.raygalroyal.com/:path*",
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
