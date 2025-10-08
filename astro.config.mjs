// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    // Указываем полный URL сайта. Это необходимо для корректной генерации
    // абсолютных ссылок, sitemap и для SEO.
    site: "https://rev-cv.github.io",
    // Базовый путь будет устанавливаться через CLI при сборке.
    // Для dev-режима он по умолчанию будет '/'.
    trailingSlash: "always",
    integrations: [svelte()],
});
