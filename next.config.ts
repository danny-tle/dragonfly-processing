import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary: the hardware page is the landing page while the home page is in progress.
  // The home page lives at /home for now; to restore it, move src/app/home/page.tsx back to
  // src/app/page.tsx and delete this redirect. Not permanent (307), so browsers won't cache it.
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
