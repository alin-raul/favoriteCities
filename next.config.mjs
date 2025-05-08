// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the images configuration here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Add any other custom configurations here in the future
  // For now, keep it minimal
};

export default nextConfig;
