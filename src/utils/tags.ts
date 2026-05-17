import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

/**
 * 記事一覧からユニークなタグを抽出し、記事数とともに返す。
 * 記事数降順 → タグ名昇順でソート。
 */
export function getAllTags(
  posts: Post[],
): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      // 記事数降順
      if (b.count !== a.count) return b.count - a.count;
      // 同数の場合はタグ名昇順
      return a.tag.localeCompare(b.tag, "ja");
    });
}

/**
 * 指定タグを持つ記事のみをフィルタリングし、公開日降順で返す。
 */
export function getPostsByTag(
  posts: Post[],
  tag: string,
): Post[] {
  return posts
    .filter((post) => post.data.tags.includes(tag))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
