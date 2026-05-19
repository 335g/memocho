/**
 * Markdown 記事本文から推定読了時間（分）を計算する。
 *
 * @param body - Markdown 生テキスト
 * @param charsPerMinute - 1分あたりの読める文字数（デフォルト 400文字）
 */
export function getReadingTime(body: string, charsPerMinute: number = 400): number {
  // コードブロック・インラインコード・リンク記法・Markdown記号・空白を除去して純粋な文字数をカウント
  const cleanText = body
    .replace(/```[\s\S]*?```/g, "")           // コードブロック
    .replace(/`[^`]+`/g, "")                  // インラインコード
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンクのテキスト部分のみ残す
    .replace(/[#*>=\-|_\[\]!]/g, "")         // Markdown 記号
    .replace(/\s+/g, "")                     // 空白・改行・タブ
    .trim();

  const length = cleanText.length;
  return Math.max(1, Math.ceil(length / charsPerMinute));
}
