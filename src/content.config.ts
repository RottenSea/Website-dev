import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),

  schema: z.object({
    draft: z.boolean().default(true),

    slug: z.string().nullable().optional(),
    title: z.string(),
    author: z.string().nullable().default("RottenSea"),
    description: z.string(),

    date: z.date(),
    update: z.date().nullable().optional(),

    image: z
      .object({
        url: z.string().nullable(),
        alt: z.string().nullable(),
      })
      .optional(),

    category: z.string().nullable().default("blog"),
    tags: z.array(z.string()).default(["blog"]),
  }),
});

export const collections = { blog };
