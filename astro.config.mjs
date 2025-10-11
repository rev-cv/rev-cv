// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { compression } from "vite-plugin-compression2";
const textAssetFilter = /\.(js|css|json|html|svg|xml|ttf|otf|eot|woff)$/i;

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],
    vite: {
        plugins: [
            compression({
                include: textAssetFilter,
                algorithms: ["brotliCompress", "gzip"],
            }),
        ],
    },
});
