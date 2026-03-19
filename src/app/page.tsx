import styles from './page.module.scss';
import { getPopularMovies, searchMovies } from '@/lib/movie';
import SearchForm from '@/components/SearchForm/SearchForm';
import MoviePicker from '@/components/MoviePicker/MoviePicker';

type HomeProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { query = '', page = '1' } = await searchParams;
  const trimmedQuery = query.trim();
  const parsedPage = Number(page);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const data = trimmedQuery
    ? await searchMovies(trimmedQuery, currentPage)
    : await getPopularMovies(currentPage);

  const uniqueMovies = Array.from(
    new Map(data.results.map((movie) => [movie.id, movie])).values()
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          {trimmedQuery ? `검색 결과: ${trimmedQuery}` : '취향 피드 맞춤 설정'}
        </p>
        <h1 className={styles.title}>
          취향에 맞는
          <span className={styles.titleAccent}> 콘텐츠를 찾아보세요</span>
        </h1>
        <p className={styles.description}>
          당신의 취향을 만든 작품들을 선택해 주세요.<br />
          AI가 이야기의 흐름, 영상의 분위기, 감정의 리듬을 분석해 마치 당신을 위해
          만들어진 것처럼 느껴지는 추천을 제공합니다.
        </p>
        <div className={styles.searchSlot}>
          <SearchForm />
        </div>
      </section>

      {uniqueMovies.length === 0 ? (
        <section className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>조건에 맞는 작품을 찾지 못했어요</h2>
          <p className={styles.emptyMessage}>
            다른 키워드로 검색하거나 인기 영화 목록에서 다시 골라보세요.
          </p>
        </section>
      ) : (
        <MoviePicker
          movies={uniqueMovies}
          currentPage={data.page}
          totalPages={data.total_pages}
          query={trimmedQuery || undefined}
        />
      )}
    </main>
  );
}
