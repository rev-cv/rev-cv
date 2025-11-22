// src/content/config.ts
import { defineCollection, z } from "astro:content";

export const portfolios = defineCollection({
    type: "data",
    schema: z.object({
        jobtitle: z.string(),
        description: z.string(),
        url: z.string(),
        cases: z.array(z.string()),
        cover: z.string(),
        keywords: z.array(z.string()),

        aboutme: z
            .array(
                z.object({
                    id: z.string(),
                    title: z.string(),
                    descr: z.string(),
                }),
            )
            .optional(),

        skills: z
            .array(
                z.object({
                    name: z.string(),
                    level: z.number().min(0).max(100),
                    description: z.string(),
                }),
            )
            .optional(),

        tools: z
            .array(
                z.object({
                    name: z.string(),
                    description: z.string(),
                }),
            )
            .optional(),

        quality: z
            .array(
                z.object({
                    name: z.string(),
                    description: z.string(),
                }),
            )
            .optional(),

        offers: z
            .array(
                z.object({
                    problem: z.string(),
                    solution: z.string(),
                }),
            )
            .optional(),

        roadmap: z.array(z.string()).optional(),
    }),
});

/** Коллекция кейсов */
export const cases = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        tech: z.array(z.string()),
        cover: z.string(),
        media: z.array(z.string()).nullable().optional(),
        code_url: z.string().nullable(),
        demo_url: z.string().nullable(),
        descr: z.string(),
        // Если хотите, можно добавить поле htmlContent, если кейс в MDX
        htmlContent: z.string().optional(),
    }),
});

export const collections = {
    portfolios,
    cases,
};
