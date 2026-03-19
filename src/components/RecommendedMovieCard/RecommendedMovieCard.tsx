import Image from "next/image";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb-image";
import type { RecommendedMovieResult } from "@/types/taste";
import styles from "./RecommendedMovieCard.module.scss";

type RecommendedMovieCardProps = {
  movie: RecommendedMovieResult;
};

function getMatchScore(movie: RecommendedMovieResult) {
  return Math.max(78, Math.min(99, Math.round(movie.vote_average * 10)));
}

export default function RecommendedMovieCard({ movie }: RecommendedMovieCardProps) {
  const posterUrl = movie.poster_path ? getTmdbImageUrl(movie.poster_path, "w500") : null;
  const matchScore = getMatchScore(movie);

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
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 20vw"
            />
          ) : (
            <div className={styles.emptyPoster}>이미지 없음</div>
          )}
        </div>

        <div className={styles.overlay}>
          <div className={styles.topRow}>
            <span className={styles.badge}>{matchScore}% 일치</span>
            <span className={styles.year}>{movie.release_date?.slice(0, 4) || "미정"}</span>
          </div>
          <h3 className={styles.title}>{movie.title}</h3>
          <p className={styles.reason}>{movie.reason}</p>
        </div>
      </article>
    </Link>
  );
}
