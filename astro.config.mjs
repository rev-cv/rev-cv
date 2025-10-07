// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    // URL сайта для генерации sitemap и канонических ссылок
    site: "https://rev-cv.github.io",
    // Базовый путь для локальной разработки. При деплое он будет переопределен.
    base: "/",
    trailingSlash: "always",
    integrations: [svelte()],
});
