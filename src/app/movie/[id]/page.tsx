import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieDetail } from "@/lib/movie";
import { getTmdbImageUrl } from "@/lib/tmdb-image";
import styles from "./page.module.scss";

type MovieDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  const movie = await getMovieDetail(movieId).catch(() => {
    notFound();
  });

  if (!movie) {
    notFound();
  }

  const posterUrl = movie.poster_path ? getTmdbImageUrl(movie.poster_path, "w500") : null;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.posterColumn}>
          <div className={styles.posterWrap}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className={styles.poster}
                sizes="(max-width: 900px) 100vw, 320px"
              />
            ) : (
              <div className={styles.emptyPoster}>이미지 없음</div>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{movie.title}</h1>

          <p className={styles.meta}>
            평점 {movie.vote_average.toFixed(1)} · 개봉일 {movie.release_date || "미정"}
          </p>

          <p className={styles.meta}>
            러닝타임 {movie.runtime ? `${movie.runtime}분` : "정보 없음"}
          </p>

          <div className={styles.genreList}>
            {movie.genres.map((genre) => (
              <span key={genre.id} className={styles.genre}>
                {genre.name}
              </span>
            ))}
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>줄거리</h2>
            <p className={styles.overview}>
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
