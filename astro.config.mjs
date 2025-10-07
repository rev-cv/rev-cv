// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    site: `https://rev-cv.github.io`,
    base: process.env.BASE_URL || "/",
    // ↓ решает проблему с редиректами и относительными путями.
    trailingSlash: "always",
    integrations: [svelte()],
});
