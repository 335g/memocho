// @ts-check
import { defineConfig } from "astro/config";
// @ts-ignore - vite plugin type mismatch with @tailwindcss/vite
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import ogImageIntegration from "./src/integrations/og-image";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sitemap(),
    ogImageIntegration(),
  ],
  site: "https://335g.dev",
  output: "static",
  outDir: "dist",

  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
});
