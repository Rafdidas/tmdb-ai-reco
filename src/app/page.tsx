import Link from 'next/link';
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
      <header className={styles.topBar}>
        <Link href="/" className={styles.brand}>
          TMDB AI RECO
        </Link>
        <div className={styles.topBarControls}>
          <div className={styles.searchSlot}>
            <SearchForm />
          </div>
          <div className={styles.iconButton} aria-hidden="true">
            <span className={styles.dot} />
          </div>
          <div className={styles.avatar} aria-hidden="true">
            DC
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          {trimmedQuery ? `Search Results for ${trimmedQuery}` : "Personalize Your Feed"}
        </p>
        <h1 className={styles.title}>
          취향에 맞는
          <span className={styles.titleAccent}> 콘텐츠를 찾아보세요</span>
        </h1>
        <p className={styles.description}>
          당신의 취향을 만든 작품들을 선택해 주세요.<br/>
          AI가 이야기의 흐름, 영상의 분위기,
          감정의 리듬을 분석해 마치 당신을 위해 만들어진 것처럼 느껴지는 추천을
          제공합니다.
        </p>
      </section>

      {uniqueMovies.length === 0 ? (
        <section className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No curated titles found</h2>
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

      <footer className={styles.footer}>
        <p className={styles.footerBrand}>TMDB AI RECO</p>
        <div className={styles.footerLinks}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>API Status</span>
          <span>Contact</span>
        </div>
        <p className={styles.footerCopy}>
          © 2026 TMDB AI RECO. Powered by TMDB & OpenAI.
        </p>
      </footer>
    </main>
  );
}
