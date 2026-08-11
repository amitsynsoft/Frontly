/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      ...[
        "analytics",
        "bookings",
        "customers",
        "organizations",
        "services",
        "settings",
        "staff",
      ].map((route) => ({
        source: `/${route}`,
        destination: `/dashboard/${route}`,
        permanent: false,
      })),
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
