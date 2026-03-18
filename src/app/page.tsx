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
      <h1 className={styles.title}>TMDB AI RECO</h1>
      <p className={styles.description}>
        {trimmedQuery ? `"${trimmedQuery}" 검색 결과` : "인기 영화 목록"}
      </p>

      <SearchForm />

      {uniqueMovies.length === 0 ? (
        <p className={styles.emptyMessage}>검색 결과가 없습니다.</p>
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
