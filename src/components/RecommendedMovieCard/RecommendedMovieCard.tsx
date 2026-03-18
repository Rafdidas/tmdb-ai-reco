import Image from "next/image";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb-image";
import type { RecommendedMovieResult } from "@/types/taste";
import styles from "./RecommendedMovieCard.module.scss";

type RecommendedMovieCardProps = {
  movie: RecommendedMovieResult;
};

export default function RecommendedMovieCard({ movie }: RecommendedMovieCardProps) {
  const posterUrl = movie.poster_path ? getTmdbImageUrl(movie.poster_path, "w500") : null;

  return (
    <Link href={`/movie/${movie.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.posterWrap}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className={styles.poster}
              sizes="(max-width: 600px) 100vw, 33vw"
            />
          ) : (
            <div className={styles.emptyPoster}>이미지 없음</div>
          )}
        </div>

        <div className={styles.body}>
          <h5 className={styles.title}>{movie.title}</h5>
          <p className={styles.meta}>
            평점 {movie.vote_average.toFixed(1)} · 개봉일 {movie.release_date || "미정"}
          </p>
          <p className={styles.reason}>{movie.reason}</p>
        </div>
      </article>
    </Link>
  );
}
