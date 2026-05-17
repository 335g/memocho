/** 1ページあたりの記事数 */
export const POSTS_PER_PAGE = 10;

export interface PaginationResult<T> {
  /** 現在のページ番号 (1-based) */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** このページに表示する記事 */
  items: T[];
  /** 前のページがあるか */
  hasPrev: boolean;
  /** 次のページがあるか */
  hasNext: boolean;
  /** 前のページ番号（ない場合は null） */
  prevPage: number | null;
  /** 次のページ番号（ない場合は null） */
  nextPage: number | null;
  /** 全記事数 */
  totalItems: number;
}

/**
 * 指定された記事一覧をページネーションし、該当ページの情報を返す。
 *
 * @param items - 全記事（ソート済み）
 * @param page  - 取得するページ番号 (1-based)
 * @param postsPerPage - 1ページあたりの件数
 */
export function paginate<T>(
  items: T[],
  page: number,
  postsPerPage: number = POSTS_PER_PAGE,
): PaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / postsPerPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;

  return {
    currentPage,
    totalPages,
    items: items.slice(start, end),
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    totalItems: items.length,
  };
}

/**
 * ページネーションの URL を生成するヘルパー。
 *
 *   getPageUrl("/page", 1)  → "/"
 *   getPageUrl("/page", 2)  → "/page/2"
 *   getPageUrl("/tags/css/page", 1) → "/tags/css"
 *   getPageUrl("/tags/css/page", 3) → "/tags/css/page/3"
 */
export function getPageUrl(basePath: string, page: number): string {
  if (page <= 1) {
    // "/page" → "/", "/tags/css/page" → "/tags/css"
    return basePath.replace(/\/page$/, "") || "/";
  }
  return `${basePath}/${page}`;
}
