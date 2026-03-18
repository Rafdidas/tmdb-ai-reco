import Link from "next/link";
import styles from "./Pagination.module.scss";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

function buildPageHref(page: number, query?: string) {
  const safePage = Math.max(page, 1);
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (safePage > 1) {
    params.set("page", String(safePage));
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="페이지네이션">
      <Link
        href={buildPageHref(currentPage - 1, query)}
        className={styles.navButton}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        이전
      </Link>

      <ol className={styles.pageList}>
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldShowGap = previousPage && page - previousPage > 1;

          return (
            <li key={page} className={styles.pageItem}>
              {shouldShowGap ? <span className={styles.ellipsis}>...</span> : null}
              <Link
                href={buildPageHref(page, query)}
                className={page === currentPage ? styles.currentPage : styles.pageLink}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href={buildPageHref(currentPage + 1, query)}
        className={styles.navButton}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        다음
      </Link>
    </nav>
  );
}
