import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary: the hardware page is the landing page until the home page is ready.
  // Not permanent (307), so browsers won't cache it and removing it restores "/".
  redirects() {
    return [{ source: "/", destination: "/hardware", permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
