/**
 * OGP 画像自動生成 Astro Integration
 *
 * ビルド完了後（astro:build:done）に、全公開記事の OGP 画像を
 * Satori + @resvg/resvg-js で生成し dist/og/ に出力する。
 *
 * Cloudflare Pages の無料プランでの動作を前提とし、
 * 静的生成方式を採用。
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { AstroIntegration } from "astro";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { ogpElement } from "../og-image/template";

// ── 定数 ──
const WIDTH = 1200;
const HEIGHT = 630;
const CONTENT_DIR = "src/content/posts";
const OUTPUT_DIR = "og";

/** フォントデータを読み込む */
function loadFont(
  require: NodeRequire,
  pkgPath: string,
  weight: 400 | 700,
): { name: string; data: Buffer; weight: number; style: string }[] {
  const resolveFont = (subset: string) => {
    const p = require.resolve(
      `${pkgPath}/files/noto-sans-jp-${subset}-${weight}-normal.woff`,
    );
    return readFileSync(p);
  };

  return [
    {
      name: "Noto Sans JP",
      data: resolveFont("japanese"),
      weight,
      style: "normal",
    },
    {
      name: "Noto Sans JP",
      data: resolveFont("latin"),
      weight,
      style: "normal",
    },
  ];
}

/** 日付を日本語表記にフォーマット */
function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 単一の OGP 画像を生成して PNG バッファを返す */
async function generateOgpImage(
  title: string,
  date: string,
  siteName: string,
  tags: string[],
  fonts: { name: string; data: Buffer; weight: number; style: string }[],
): Promise<Buffer> {
  const element = ogpElement({ title, date, siteName, tags });
  const svg = await satori(element as React.ReactNode, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return resvg.render().asPng();
}

// ── Integration ──
export default function ogImageIntegration(): AstroIntegration {
  return {
    name: "og-image",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const rootDir = process.cwd();
        const contentDir = path.join(rootDir, CONTENT_DIR);
        const outDir = path.join(dir.pathname, OUTPUT_DIR);

        // 開発時はスキップ（ビルド時のみ生成）
        // Note: astro:build:done は dev server では呼ばれないが念のため
        if (!existsSync(contentDir)) {
          return;
        }

        // 出力ディレクトリを作成
        mkdirSync(outDir, { recursive: true });

        // フォント読み込み
        let fonts: ReturnType<typeof loadFont>;
        try {
          const require = createRequire(import.meta.url);
          const pkgPath = "@fontsource/noto-sans-jp";
          fonts = [
            ...loadFont(require, pkgPath, 400),
            ...loadFont(require, pkgPath, 700),
          ];
        } catch (err) {
          console.error(
            "[og-image] フォントの読み込みに失敗しました:",
            (err as Error).message,
          );
          return;
        }

        // 記事ファイルを読み取り
        const postFiles = readdirSync(contentDir).filter((f) =>
          f.endsWith(".md"),
        );

        let generatedCount = 0;

        for (const file of postFiles) {
          const filePath = path.join(contentDir, file);
          const raw = readFileSync(filePath, "utf-8");
          const { data } = matter(raw);

          // 下書きはスキップ
          if (data.draft) continue;
          if (!data.title || !data.pubDate) {
            console.warn(`[og-image] スキップ（title/pubDate なし）: ${file}`);
            continue;
          }

          const slug = file.replace(/\.md$/, "");
          const dateStr = formatDate(new Date(data.pubDate));
          const tags: string[] = data.tags ?? [];

          try {
            const pngBuffer = await generateOgpImage(
              data.title,
              dateStr,
              "memocho",
              tags,
              fonts,
            );
            const outPath = path.join(outDir, `${slug}.png`);
            writeFileSync(outPath, pngBuffer);
            console.log(`[og-image] ✓ ${slug}.png`);
            generatedCount++;
          } catch (err) {
            console.error(
              `[og-image] ✗ ${slug}.png 生成失敗:`,
              (err as Error).message,
            );
          }
        }

        // ── デフォルト OGP（トップページ用） ──
        try {
          const defaultPng = await generateOgpImage(
            "memocho",
            "技術メモと日々の学びを綴るブログ",
            "memocho",
            [],
            fonts,
          );
          const defaultPath = path.join(outDir, "default.png");
          writeFileSync(defaultPath, defaultPng);
          console.log("[og-image] ✓ default.png");
          generatedCount++;
        } catch (err) {
          console.error(
            "[og-image] ✗ default.png 生成失敗:",
            (err as Error).message,
          );
        }

        if (generatedCount > 0) {
          console.log(
            `[og-image] ${generatedCount} 枚の OGP 画像を生成しました (${outDir})`,
          );
        }
      },
    },
  };
}
