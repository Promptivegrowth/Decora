import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  // Accesos al hosting (cPanel) que antes funcionaban con el dominio principal:
  // ahora el dominio apunta a Vercel, así que se redirigen a los subdominios del hosting.
  async redirects() {
    const hosting = [
      { paths: ["/webmail", "/webmail/:path*", "/correo", "/mail", "/roundcube"], to: "https://webmail.dcorahogarperu.com" },
      { paths: ["/cpanel", "/cpanel/:path*"], to: "https://cpanel.dcorahogarperu.com" },
    ];
    return hosting.flatMap(({ paths, to }) =>
      paths.map((source) => ({ source, destination: to, permanent: false })),
    );
  },
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/(brand|images)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        // Las URLs *.vercel.app no deben aparecer en Google (solo el dominio oficial)
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\.vercel\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/og/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
