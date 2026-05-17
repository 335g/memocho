/**
 * サイト全体の設定定数
 *
 * 各ページ・レイアウトでインポートして使用する。
 */

export const SITE = {
  /** サイト名（タイトル・OGP 共通） */
  name: "memocho",

  /** サイトのデフォルト説明文 */
  description: "技術メモと日々の学びを綴るブログ",

  /** 本番サイトのベース URL */
  url: "https://335g.dev",

  /** HTML の lang 属性値 */
  lang: "ja",

  /** OGP の og:locale */
  locale: "ja_JP",

  /** 著者情報 */
  author: {
    name: "Yoshiki Kudo",
  },

  /** OGP 画像のデフォルト寸法 */
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;
