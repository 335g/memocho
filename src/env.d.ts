/// <reference path="../.astro/types.d.ts" />

declare module "/pagefind/pagefind.js" {
  export function init(): Promise<void>;
  export function search(
    query: string,
    options?: Record<string, unknown>,
  ): Promise<{
    results: Array<{
      id: string;
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta: Record<string, string>;
        raw_url?: string;
      }>;
    }>;
  }>;
}
